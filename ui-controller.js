export const elements = {
  cityInput:       document.querySelector('#city-input'),
  searchBtn:       document.querySelector('#search-btn'),
  locationBtn:     document.querySelector('#location-btn'),
  loading:         document.querySelector('#loading'),
  error:           document.querySelector('#error'),
  weatherDisplay:  document.querySelector('#weather-display'),
  cityName:        document.querySelector('#city-name'),
  temp:            document.querySelector('#temp'),
  description:     document.querySelector('#description'),
  humidity:        document.querySelector('#humidity'),
  wind:            document.querySelector('#wind'),
  sunrise:         document.querySelector('#sunrise'),
  sunset:          document.querySelector('#sunset'),
  historyList:     document.querySelector('#history-list'),
  clearHistoryBtn: document.querySelector('#clear-history-btn'),
  maxHistoryInput: document.querySelector('#max-history-input')
};

export const getCityInput = () => elements.cityInput.value.trim();
export const clearInput   = () => { elements.cityInput.value = ''; };

export const showLoading  = () => elements.loading.classList.remove('hidden');
export const hideLoading  = () => elements.loading.classList.add('hidden');

export const showError = (msg) => {
  elements.error.textContent = `Eroare: ${msg}`;
  elements.error.classList.remove('hidden');
  setTimeout(() => elements.error.classList.add('hidden'), 3000);
};

export const renderHistory = (arr) => {
  elements.historyList.innerHTML = arr
    .map(city => `<li class="history-item">${city}</li>`)
    .join('');
};

export const clearHistoryUI = () => {
  elements.historyList.innerHTML = '';
};

export const displayWeather = (data) => {
  elements.weatherDisplay.classList.remove('hidden');

  const { name, sys, weather, main, wind, timezone } = data;
  const country = sys.country.toLowerCase();

  elements.cityName.innerHTML = `${name}, ${sys.country}
    <img class="flag" src="https://flagcdn.com/w80/${country}.png" alt="flag" />`;

  elements.temp.textContent = Math.round(main.temp);
  elements.description.textContent = weather[0].description;
  elements.humidity.textContent = main.humidity;
  elements.wind.textContent = (wind.speed * 3.6).toFixed(1);

  const toLocalTime = (ts, tz) =>
    new Date((ts + tz) * 1000)
      .toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });

  elements.sunrise.textContent = toLocalTime(sys.sunrise, timezone);
  elements.sunset.textContent  = toLocalTime(sys.sunset, timezone);

  showWeatherIcon(weather[0].icon, weather[0].description);
  setBackgroundBasedOnTime(weather[0].main, sys.sunrise, sys.sunset, timezone);
};

// Icon vreme
const showWeatherIcon = (iconCode, description) => {
  const existing = document.getElementById('weather-icon');
  if (existing) existing.remove();

  const icon = document.createElement('img');
  icon.id = 'weather-icon';
  icon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  icon.alt = description;
  icon.style.width = '120px';
  icon.style.display = 'block';
  icon.style.margin = '1rem auto';

  elements.weatherDisplay.prepend(icon);
};

// Fundal dinamic
const setBackgroundBasedOnTime = (main, sunrise, sunset, tz) => {
  const now      = Date.now();
  const offset   = now + tz * 1000;
  const isNight  = offset < sunrise * 1000 || offset > sunset * 1000;
  const time     = isNight ? 'night' : 'day';
  const type     = main.toLowerCase();
  const file     = `${time}-${type}.jpg`;
  const path     = `./assets/backgrounds/${file}`;

  const fallback = {
    day: {
      clear: '#87cefa', clouds: '#b0c4de', rain: '#7393B3',
      thunderstorm: '#3b3b3b', snow: '#eef2f3', mist: '#cccccc', drizzle: '#aec6cf'
    },
    night: {
      clear: '#0f1c3f', clouds: '#2c3e50', rain: '#2f4f4f',
      thunderstorm: '#111111', snow: '#2c3e50', mist: '#3f3f3f', drizzle: '#223344'
    }
  };

  const img = new Image();
  img.src = path;
  img.onload = () => {
    document.body.style.backgroundImage = `url('${path}')`;
  };
  img.onerror = () => {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor =
      fallback[time][type] || '#334';
  };
};

// Debounce helper
export const createDebouncer = (delay = 300) => {
  let timeout;
  return (fn) => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
};
