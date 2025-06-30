const apiKey = "4dd80611df6976d06b8888c4ca39d603";

function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") return alert("Enter city name");
  fetchWeather(city);
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetchGeoWeather(lat, lon);
    }, () => {
      alert("Location access denied.");
    });
  } else {
    alert("Geolocation not supported");
  }
}

function fetchWeather(city) {
  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(currentURL)
    .then(res => res.json())
    .then(data => displayCurrent(data));

  fetch(forecastURL)
    .then(res => res.json())
    .then(data => displayForecast(data));
}

function fetchGeoWeather(lat, lon) {
  const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(currentURL)
    .then(res => res.json())
    .then(data => displayCurrent(data));

  fetch(forecastURL)
    .then(res => res.json())
    .then(data => displayForecast(data));
}

function displayCurrent(data) {
  const container = document.getElementById("currentWeather");
  container.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
    <p>${data.weather[0].description}</p>
    <p><strong>${data.main.temp}°C</strong> (feels like ${data.main.feels_like}°C)</p>
    <p>Humidity: ${data.main.humidity}%, Wind: ${data.wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  const container = document.getElementById("forecast");
  container.innerHTML = "";

  const days = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date] && Object.keys(days).length < 5) {
      days[date] = item;
    }
  });

  for (const date in days) {
    const item = days[date];
    container.innerHTML += `
      <div class="forecast-card">
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" />
        <p>${item.main.temp}°C</p>
      </div>
    `;
  }
}

