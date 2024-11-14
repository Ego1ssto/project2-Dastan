const apiKey = '0793c96e2c690cf9f09db64fba9e598d';
let unit = 'metric'; 
let city = '';

function getWeather() {
    city = document.getElementById('city').value.trim();
    
    if (!city) {
        alert('Please enter a city');
        return;
    }

    fetchWeatherData(city);
    fetchForecastData(city);
}

function toggleUnit() {
    unit = document.getElementById('unit-toggle').checked ? 'imperial' : 'metric';
    if (city) {
        fetchWeatherData(city);
        fetchForecastData(city);
    }
}

function fetchWeatherData(city) {
    const weatherUrl = buildWeatherUrl(city);

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                console.error('Failed to fetch weather data:', response.statusText);
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .then(data => updateWeatherUI(data))
        .catch(handleFetchError);
}

function fetchForecastData(city) {
    const forecastUrl = buildForecastUrl(city);

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                console.error('Failed to fetch forecast data:', response.statusText);
                throw new Error('Forecast data not found');
            }
            return response.json();
        })
        .then(data => updateForecastUI(data.list))
        .catch(handleFetchError);
}
function buildWeatherUrl(city) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
}

function buildForecastUrl(city) {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;
}

function updateWeatherUI(data) {
    const { name, main, weather, wind } = data;
    const temperature = Math.round(main.temp);
    const description = weather[0].description;
    const iconCode = weather[0].icon;

    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    document.getElementById('temp-div').innerHTML = `<p>${temperature}°${unit === 'metric' ? 'C' : 'F'}</p>`;
    document.getElementById('weather-info').innerHTML = `<p>${name} - ${description}</p>`;
    document.getElementById('humidity-wind').innerHTML = `<p>Humidity: ${main.humidity}% | Wind: ${wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</p>`;
}

function updateForecastUI(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    const dailyData = data.filter(item => item.dt_txt.includes('12:00:00'));

    dailyData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'short' });
        const maxTemp = Math.round(item.main.temp_max);
        const minTemp = Math.round(item.main.temp_min);
        const iconCode = item.weather[0].icon;
        const description = item.weather[0].description;

        forecastDiv.innerHTML += `
            <div class="forecast-item">
                <p>${day}</p>
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">
                <p>${maxTemp}° / ${minTemp}°</p>
                <p>${description}</p>
            </div>
        `;
    });
}

function handleFetchError(error) {
    console.error('Error:', error);
    alert('Completed');
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchLocationWeather(latitude, longitude);
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

function fetchLocationWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .then(data => updateWeatherUI(data));

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast data not found');
            }
            return response.json();
        })
        .then(data => updateForecastUI(data.list));
}

function selectCity(cityName) {
    document.getElementById('city').value = cityName;
    document.getElementById('suggestions').innerHTML = '';
    getWeather();
}
