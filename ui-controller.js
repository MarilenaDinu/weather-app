export const elements = {
  cityInput: document.querySelector('#city-input'),
  searchBtn: document.querySelector ('#search-btn'),
  locationBtn: document.querySelector('#location-btn'),
  loading: document.querySelector('#loading'),
  error: document.querySelector('#error'),
  weatherDisplay: document.querySelector('#weather-display'),
  cityName: document.querySelector('#city-name'),
  temp: document.querySelector('#temp'),
  description: document.querySelector('#description'),
  humidity: document.querySelector('#humidity'),
  wind: document.querySelector('#wind'),
  sunrise: document.querySelector('#sunrise'),
  sunset: document.querySelector('#sunset')
};

export const getCityInput = () => elements.cityInput.value.trim();
export const clearInput = () => { elements.cityInput.value = ''; };
export const showLoading = () => elements.loading.classList.remove('hidden');
export const hideLoading = () => elements.loading.classList.add('hidden');

export const showError = (message) => {
  elements.error.textContent = message;
  elements.error.classList.remove('hidden');
  setTimeout(() => elements.error.classList.add('hidden'), 3000);
};

// ✅ Afișează icon OpenWeather
const showWeatherIcon = (iconCode, description) => {
  const existing = document.getElementById("weather-icon");
  if (existing) existing.remove();

  const icon = document.createElement("img");
  icon.id = "weather-icon";
  icon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  icon.alt = description;
  icon.style.width = "120px";
  icon.style.margin = "1rem auto";
  icon.style.display = "block";

  elements.weatherDisplay.prepend(icon);
};

// ✅ Fundal zi/noapte + fallback
const setBackgroundBasedOnTime = (weatherMain, sunrise, sunset, timezone) => {
  const now = Date.now();
  const offsetNow = now + timezone * 1000;
  const isNight = offsetNow < sunrise * 1000 || offsetNow > sunset * 1000;

  const type = weatherMain.toLowerCase();
  const time = isNight ? 'night' : 'day';
  const file = `${time}-${type}.jpg`;
  const imageUrl = `./assets/backgrounds/${file}`;

  const fallbackColors = {
    day: {
      clear: "#87cefa",
      clouds: "#b0c4de",
      rain: "#7393B3",
      thunderstorm: "#3b3b3b",
      snow: "#eef2f3",
      mist: "#cccccc",
      drizzle: "#aec6cf"
    },
    night: {
      clear: "#0f1c3f",
      clouds: "#2c3e50",
      rain: "#2f4f4f",
      thunderstorm: "#111111",
      snow: "#2c3e50",
      mist: "#3f3f3f",
      drizzle: "#223344"
    }
  };

  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
  };

  img.onerror = () => {
    const fallback = fallbackColors[time][type] || "#334";
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = fallback;
    console.warn(`⚠️ Fundalul '${file}' lipsește. Se folosește culoare de rezervă.`);
  };
};

export const displayWeather = (data) => {
  elements.weatherDisplay.classList.remove('hidden');

  const name = data.name;
  const country = data.sys.country.toLowerCase();
  const weather = data.weather[0];
  const main = weather.main;

  elements.cityName.innerHTML = `${name}, ${data.sys.country}
    <img class="flag" src="https://flagcdn.com/w80/${country}.png" alt="flag" />`;

  elements.temp.textContent = Math.round(data.main.temp);
  elements.description.textContent = weather.description;
  elements.humidity.textContent = data.main.humidity;
  elements.wind.textContent = (data.wind.speed * 3.6).toFixed(1);

  const toLocal = (ts, tz) => new Date((ts + tz) * 1000)
    .toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });

  elements.sunrise.textContent = toLocal(data.sys.sunrise, data.timezone);
  elements.sunset.textContent = toLocal(data.sys.sunset, data.timezone);

  showWeatherIcon(weather.icon, weather.description);
  setBackgroundBasedOnTime(main, data.sys.sunrise, data.sys.sunset, data.timezone);
};
