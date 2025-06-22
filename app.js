import { getCurrentWeather, getWeatherByCoords } from './modules/weather-service.js';
import {
  getCityInput,
  showLoading,
  hideLoading,
  showError,
  clearInput,
  displayWeather
} from './modules/ui-controller.js';

const handleSearch = async (e) => {
  e.preventDefault();
  const city = getCityInput();
  if (city.length < 2) return showError("Oraș invalid.");
  clearInput();
  showLoading();
  try {
    const data = await getCurrentWeather(city);
    displayWeather(data);
  } catch {
    showError("Nu am găsit acest oraș.");
  } finally {
    hideLoading();
  }
};

const handleLocation = async () => {
  if (!navigator.geolocation) return showError("Geolocația nu e suportată.");
  showLoading();
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    try {
      const data = await getWeatherByCoords(coords.latitude, coords.longitude);
      displayWeather(data);
    } catch {
      showError("Eroare la determinarea locației.");
    } finally {
      hideLoading();
    }
  });
};

document.querySelector('#search-form').addEventListener('submit', handleSearch);
document.querySelector('#location-btn').addEventListener('click', handleLocation);
