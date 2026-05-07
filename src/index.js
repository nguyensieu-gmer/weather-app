class FetchData {
    constructor() {
        this.weatherAPIKey = 'LNVCDZJPD9GVSBRL4W4DENXNH';
        this.airQualityAPIKey = '0bcba15c13c8d2ef4a5cf53d5af7669cdcb5a366';
    }

    async takeWeatherConditionOfCity(city) {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${this.weatherAPIKey}&unitGroup=metric`,
        );
        if (!response.ok) {
            throw Error(`HTTP ERROR! Status: ${response.status}`);
        }
        const json = await response.json();
        return json;
    }

    async takeAirQualityOfCity(city) {
        const response = await fetch(
            `https://api.waqi.info/feed/${city}/?token=${this.airQualityAPIKey}`,
        );
        if (!response.ok) {
            throw Error(`HTTP ERROR! status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        if (json.status === 'error') {
            throw Error(`Not valid city`);
        }
        return json;
    }
}

class RenderData {
    constructor() {
        this.fetchData = new FetchData();

        this.searchBtn = document.getElementById('search_btn');
        this.inputCity = document.getElementById('input_city');

        this.bindEvent();
    }
    bindEvent() {
        this.searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const city = this.inputCity.value;
            this.setContent(city);
        });
        this.inputCity.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const city = this.inputCity.value;
                this.setContent(city);
            }
        });
    }

    async setContent(city) {
        try {
            const [weather, airQuality] = await Promise.all([
                this.fetchData.takeWeatherConditionOfCity(city),
                this.fetchData.takeAirQualityOfCity(city),
            ]);
            document.getElementById('city').textContent = weather.address;
            document.getElementById('temp').textContent =
                Math.round(weather.currentConditions.temp) + '°C';
            document.getElementById('AQI').textContent =
                airQuality.data.aqi + 'AQI';
        } catch (error) {
            console.error(error);
            alert(error);

            // handle error here
        }
    }
}

new RenderData();
