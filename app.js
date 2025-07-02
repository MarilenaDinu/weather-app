import { getCurrentWeather, getWeatherByCoords } from './modules/weather-service.js';
import {
  elements,
  getCityInput,
  clearInput,
  showLoading,
  hideLoading,
  showError,
  renderHistory,
  clearHistoryUI,
  displayWeather
} from './modules/ui-controller.js';
import {
  getHistory,
  addToHistory,
  clearHistory,
  getMaxHistory,
  setMaxHistory
} from './modules/history-service.js';
import { logInfo, logError } from './modules/logger.js';

const updateHistoryUI = (h) => renderHistory(h);

const handleSearchByName = async (city) => {
  if (city.length < 2) {
    showError('Oraș invalid.');
    return;
  }
  clearInput();
  showLoading();
  logInfo('Search by name', city);
  try {
    const data = await getCurrentWeather(city);
    displayWeather(data);
    const hist = addToHistory(data.name);
    updateHistoryUI(hist);
  } catch (e) {
    showError('Nu am găsit acest oraș.');
    logError('Eroare API name', e);
  } finally {
    hideLoading();
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  handleSearchByName(getCityInput());
};

const handleHistoryClick = (e) => {
  if (!e.target.classList.contains('history-item')) return;
  handleSearchByName(e.target.textContent);
};

const handleLocation = () => {
  if (!navigator.geolocation) {
    showError('Geolocația nu este suportată.');
    return;
  }
  showLoading();
  logInfo('Search by geolocation');
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    try {
      const data = await getWeatherByCoords(coords.latitude, coords.longitude);
      displayWeather(data);
      const hist = addToHistory(data.name);
      updateHistoryUI(hist);
    } catch (e) {
      showError('Eroare la determinarea locației.');
      logError('Eroare API coords', e);
    } finally {
      hideLoading();
    }
  });
};

const init = () => {
  // populare istoric și setări
  renderHistory(getHistory());
  elements.maxHistoryInput.value = getMaxHistory();

  // event listeners
  document.querySelector('#search-form').addEventListener('submit', handleSubmit);
  elements.locationBtn.addEventListener('click', handleLocation);
  elements.historyList.addEventListener('click', handleHistoryClick);

  elements.clearHistoryBtn.addEventListener('click', () => {
    clearHistory();
    clearHistoryUI();
    logInfo('Istoric șters');
  });

  elements.maxHistoryInput.addEventListener('change', (e) => {
    const newMax = parseInt(e.target.value, 10);
    const trimmed = setMaxHistory(newMax);
    renderHistory(trimmed);
    logInfo('Max istoric actualizat', newMax);
  });
};

init();
