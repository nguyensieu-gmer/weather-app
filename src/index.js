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
        this.UIweather = document.querySelector('.weather');
        this.error = document.querySelector('.error');
        this.UVProgress = document.getElementById('UV_progress');
        this.AOIProgress = document.getElementById('AOI_progress');

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
                this.renderWeather(city);
                this.renderAQI(city);
            }
        });
    }

    async renderWeather(city) {
        try {
            const weather =
                await this.fetchData.takeWeatherConditionOfCity(city);

            this.getIcon(weather.currentConditions.icon);
            this.precipProb.textContent =
                weather.currentConditions.precipprob + '%';
            this.humidity.textContent =
                weather.currentConditions.humidity + '%';
            this.currentCity.textContent = weather.address;
            this.temperature.textContent =
                Math.round(weather.currentConditions.temp) + '°C';
            this.UVIndex.textContent = weather.currentConditions.uvindex;

            this.renderUVProgress(weather.currentConditions.uvindex, 11);

            this.UIweather.style.display = 'block';
            this.error.style.display = 'none';
        } catch (error) {
            this.UIweather.style.display = 'none';
            this.error.style.display = 'block';
            console.error(error);
        }
    }

    async renderAQI(city) {
        try {
            const airQuality = await this.fetchData.takeAirQualityOfCity(city);
            if (airQuality.data.aqi === '-') {
                throw Error('Not found station');
            }
            this.air.textContent = airQuality.data.aqi;
            this.renderAQIProgress(airQuality.data.aqi, 310);
        } catch (error) {
            console.error(error);
            this.air.textContent = 'Not found';
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

    renderUVProgress(UVIndex, maxvalue) {
        // maxvalue = 11+
        let color;
        if (UVIndex < 2) {
            color = 'rgba(121, 254, 121, 0.508)';
        } else if (UVIndex < 6) {
            color = 'rgba(255, 247, 105, 0.825)';
        } else if (UVIndex < 8) {
            color = 'rgba(255, 119, 119, 1)';
        } else if (UVIndex < 11) {
            color = 'rgba(170, 124, 255, 0.724)';
        } else {
            color = 'rgb(148, 255, 250)';
        }

        this.UVProgress.style.width = `${Math.round((UVIndex / maxvalue) * 100)}%`;
        this.UVProgress.style.backgroundColor = color;
    }

    renderAQIProgress(AQI, maxvalue) {
        // maxvalue is 310+
        let color;
        if (AQI < 51) {
            color = '#44f6ba9a';
        } else if (AQI < 101) {
            color = 'rgba(255, 221, 51, 0.55)';
        } else if (AQI < 151) {
            color = '#ff9933';
        } else if (AQI < 201) {
            color = 'rgba(204, 0, 51, 0.64)';
        } else if (AQI < 301) {
            color = '#66009998';
        } else {
            color = '#7e0024aa';
        }

        this.AOIProgress.style.width = `${Math.round((AQI / maxvalue) * 100)}%`;
        this.AOIProgress.style.backgroundColor = color;
    }
}

new RenderData();
