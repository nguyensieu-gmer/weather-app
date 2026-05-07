let weatherAPIKey = 'LNVCDZJPD9GVSBRL4W4DENXNH';
let airQualityAPIKey = '0bcba15c13c8d2ef4a5cf53d5af7669cdcb5a366';

async function takeWeatherConditionOfCity(city, APIKey) {
    const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${APIKey}&unitGroup=metric`,
    );
    if (!response.ok) {
        throw Error(`HTTP ERROR! Status: ${response.status}`);
    }
    const json = await response.json();
    return json;
}

async function takeAirQualityOfCity(city, APIKey) {
    const response = await fetch(
        `https://api.waqi.info/feed/${city}/?token=${APIKey}`,
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

async function setContent(city, weatherAPIKey, airQualityAPIKey) {
    try {
        const [weather, airQuality] = await Promise.all([
            takeWeatherConditionOfCity(city, weatherAPIKey),
            takeAirQualityOfCity(city, airQualityAPIKey),
        ]);
        document.getElementById('city').textContent = weather.address;
        document.getElementById('temp').textContent =
            Math.round(weather.currentConditions.temp) + '°C';
        document.getElementById('AQI').textContent =
            airQuality.data.aqi + 'AQI';
    } catch (error) {
        console.error(error);
        alert(error);
    }
}

const searchBtn = document.getElementById('search_btn');
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const city = document.getElementById('input_city').value;
    setContent(city, weatherAPIKey, airQualityAPIKey);
});

document.getElementById('input_city').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const city = document.getElementById('input_city').value;
        setContent(city, weatherAPIKey, airQualityAPIKey);
    }
});
