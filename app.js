import {
  getCurrentWeather,
  getWeatherByCoords
} from './modules/weather-service.js';

import {
  elements,
  getCityInput,
  clearInput,
  showLoading,
  hideLoading,
  showError,
  renderHistory,
  clearHistoryUI,
  displayWeather,
  createDebouncer
} from './modules/ui-controller.js';

import {
  getHistory,
  addToHistory,
  clearHistory,
  getMaxHistory,
  setMaxHistory
} from './modules/history-service.js';

import { logInfo, logError } from './modules/logger.js';

console.time('app-init');

// UI Update după istoric
const updateHistoryUI = (history) => {
  renderHistory(history);
};

// 🧠 Căutare după nume
const handleSearchByName = async (city) => {
  if (city.length < 2) {
    showError('Oraș invalid.');
    return;
  }

  clearInput();
  showLoading();
  logInfo('Cautare după nume', city);

  try {
    const data = await getCurrentWeather(city);
    displayWeather(data);
    const hist = addToHistory(data.name);
    updateHistoryUI(hist);
  } catch (e) {
    showError('Nu am găsit acest oraș.');
    logError('Eroare căutare oraș', e);
  } finally {
    hideLoading();
  }
};

// Submit formular
const handleSubmit = (e) => {
  e.preventDefault();
  const city = getCityInput();
  handleSearchByName(city);
};

// Istoric click
const handleHistoryClick = (e) => {
  if (!e.target.classList.contains('history-item')) return;
  const city = e.target.textContent;
  handleSearchByName(city);
};

// Locația curentă
const handleLocation = () => {
  if (!navigator.geolocation) {
    showError('Geolocația nu este suportată.');
    return;
  }

  showLoading();
  logInfo('Cautare după locație');

  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    try {
      const data = await getWeatherByCoords(coords.latitude, coords.longitude);
      displayWeather(data);
      const hist = addToHistory(data.name);
      updateHistoryUI(hist);
    } catch (e) {
      showError('Eroare la determinarea locației.');
      logError('Eroare geolocație', e);
    } finally {
      hideLoading();
    }
  });
};

// Initializare
const init = () => {
  // ✅ Restaurează istoric + setare max
  renderHistory(getHistory());
  elements.maxHistoryInput.value = getMaxHistory();

  // ▶️ Ascultători
  document.querySelector('#search-form').addEventListener('submit', handleSubmit);
  elements.locationBtn.addEventListener('click', handleLocation);
  elements.historyList.addEventListener('click', handleHistoryClick);

  elements.clearHistoryBtn.addEventListener('click', () => {
    clearHistory();
    clearHistoryUI();
    logInfo('Istoric șters');
  });

  elements.maxHistoryInput.addEventListener('change', (e) => {
    const max = parseInt(e.target.value, 10);
    const trimmed = setMaxHistory(max);
    renderHistory(trimmed);
    logInfo('Maxim istoric actualizat', max);
  });

  // ✨ Debounce live input (opțional)
  const debouncer = createDebouncer(400);
  elements.cityInput.addEventListener('input', () => {
    debouncer(() => {
      const city = getCityInput();
      if (city.length >= 3) {
        handleSearchByName(city);
      }
    });
  });
};

init();
console.timeEnd('app-init');
