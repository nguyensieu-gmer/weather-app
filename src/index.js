import './style.css';

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
        console.log(json);
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
        this.weatherIcon = document.getElementById('weather_icon');
        this.precipProb = document.getElementById('precipprob');
        this.humidity = document.getElementById('humidity');
        this.currentCity = document.getElementById('city');
        this.temperature = document.getElementById('temp');
        this.air = document.getElementById('airquality');
        this.UVIndex = document.getElementById('uvindex');

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

            this.getIcon(weather.currentConditions.icon);
            this.precipProb.textContent =
                weather.currentConditions.precipprob + '%';
            this.humidity.textContent =
                weather.currentConditions.humidity + '%';
            this.currentCity.textContent = weather.address;
            this.temperature.textContent =
                Math.round(weather.currentConditions.temp) + '°C';
            this.air.textContent = airQuality.data.aqi;
            this.UVIndex.textContent = weather.currentConditions.uvindex;
        } catch (error) {
            console.error(error);
            alert(error);

            // handle error here
        }
    }

    async getIcon(weatherIcon) {
        let icon;
        try {
            icon = await import(`./weather_icon_library/${weatherIcon}.png`);
        } catch {
            icon = await import(`./weather_icon_library/clear-day.png`);
        }
        this.weatherIcon.src = icon.default;
    }
}

new RenderData();
