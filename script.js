// OpenWeatherMap API key for fetching current weather data
const apiKey = 'API-KEY';

// DOM elements
const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');

// Mapping OpenWeatherMap icon codes to Boxicons for weather icons
const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

async function fetchWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const todayWeather = data.list[0].weather[0].description;
        const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
        const todayWeatherIconCode = data.list[0].weather[0].icon;
        const todayPressure = `${data.list[0].main.pressure}mb`;
        const todayHumidity = `${data.list[0].main.humidity}%`;
        const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

        const currentDate = new Date();
        const currentDay = currentDate.toLocaleDateString('en', { weekday: 'long' });
        const currentDateString = currentDate.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });

        
        todayInfo.querySelector('h2').textContent = currentDay;
        todayInfo.querySelector('span').textContent = currentDateString;
        todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
        todayTemp.textContent = todayTemperature;
       
        const locationElement = document.querySelector('.today-info > div > span');
        locationElement.textContent = `${data.city.name}, ${data.city.country}`;

       
        console.log(data);
        console.log(data.city);

        console.log(data.city.name);
        console.log(data.city.country);

        const weatherDescriptionElement = document.querySelector('.today-weather > h3');
        weatherDescriptionElement.textContent = todayWeather;

        const dayInfoContainer = document.querySelector('.day-info');
        dayInfoContainer.innerHTML = `
            <div>
                <span class="title">Pressure</span>
                <span class="value">${todayPressure}</span>
            </div>
            <div>
                <span class="title">Humidity</span>
                <span class="value">${todayHumidity}</span>
            </div>
            <div>
                <span class="title">Wind Speed</span>
                <span class="value">${todayWindSpeed}</span>
            </div>
        `;
        saveWeatherData(location, {
            city: data.city.name,
            country: data.city.country,
            date: currentDateString,
            day: currentDay,
            todayWeather: todayWeather,
            todayTemperature: todayTemperature,
            todayWeatherIconCode: todayWeatherIconCode,
            todayPressure: todayPressure,
            todayHumidity: todayHumidity,
            todayWindSpeed: todayWindSpeed
        });

        if (location === 'haldwani') {
            await displayPastWeatherData(location);
        }

    } catch (error) {
        console.error(error);

        alert(`Error: Location '${location}' not found.`);

    }
}

function saveWeatherData(location, data) {
    const jsonData = JSON.stringify(data);

    const storageKey = location;
    localStorage.setItem(storageKey, jsonData);
}

async function displayPastWeatherData(location) {
    try {
        const response = await fetch(`pastWeather.php?location=${location}`);
        const data = await response.json();
        const daysToShow = 7; //showing last 7 days of past weather

        document.querySelector(".days-list").innerText = `${location} Past Weather`;

        let weekBoxHTML = "";

        for (let i = 0; i < Math.min(daysToShow, data.length); i++) {
            const iconClass = `bx bx-${weatherIconMap[data[i].Weather_Icon]}`;
            const dayAbbreviation = data[i].Day_of_Week;
            const dayTemp = `${Math.round(data[i].Temperature)}°C`;

            weekBoxHTML += `
                <li>
                    <i class='${iconClass}'></i>
                    <span>${dayAbbreviation}</span>
                    <span class="day-temp">${dayTemp}</span>
                </li>
            `;
        }

        daysList.innerHTML = weekBoxHTML;

        if (location === 'haldwani') {
            savePastData(location, data);
        }
    } catch (error) {
        console.error(error);
    }
}

function savePastData(location, data) {
    const storageKey = `${location}_past`;
    localStorage.setItem(storageKey, JSON.stringify(data));
}

function showPastData(location) {
    const pastData = localStorage.getItem(`${location}_past`);
    const parsedData = JSON.parse(pastData);

    if (parsedData) {
        displayPastWeatherData(location); // Display past weather data
    } else {
        console.log("No past weather data found in localStorage.");
    }
}

function checkCachedWeatherData(location) {
    const cachedData = localStorage.getItem(location);
    return cachedData ? JSON.parse(cachedData) : null;
}

document.addEventListener('DOMContentLoaded', async () => {
    const defaultLocation = 'haldwani';
    const cachedData = checkCachedWeatherData(defaultLocation);

    if (cachedData) {
        displayWeatherData(cachedData);
    } else {
        await fetchWeatherData(defaultLocation);
    }

    showPastData(defaultLocation); // Show past data for the default location
});

searchBtn.addEventListener("click", async () => {
    const enteredLocation = searchBox.value;
    const cachedData = checkCachedWeatherData(enteredLocation);

    if (cachedData) {
        displayWeatherData(cachedData);
    } else {
        await fetchWeatherData(enteredLocation);
    }

    showPastData(enteredLocation); // Show past data for the entered location
});

function displayWeatherData(data) {
    const todayWeather = data.todayWeather;
    const todayTemperature = data.todayTemperature;
    const todayWeatherIconCode = data.todayWeatherIconCode;

    todayInfo.querySelector('h2').textContent = data.day;
    todayInfo.querySelector('span').textContent = data.date;
    todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
    todayTemp.textContent = todayTemperature;

    const locationElement = document.querySelector('.today-info > div > span');
    locationElement.textContent = `${data.city}, ${data.country}`;

    const weatherDescriptionElement = document.querySelector('.today-weather > h3');
    weatherDescriptionElement.textContent = todayWeather;

    const dayInfoContainer = document.querySelector('.day-info');
    dayInfoContainer.innerHTML = `
        <div>
            <span class="title">Pressure</span>
            <span class="value">${data.todayPressure}</span>
        </div>
        <div>
            <span class="title">Humidity</span>
            <span class="value">${data.todayHumidity}</span>
        </div>
        <div>
            <span class="title">Wind Speed</span>
            <span class="value">${data.todayWindSpeed}</span>
        </div>
    `;
}