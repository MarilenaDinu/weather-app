import { BASE_URL, API_KEY } from '../config.js';

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Fetch error');
  return res.json();
};

export const getCurrentWeather = (city) => {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  return fetchJson(url);
};

export const getWeatherByCoords = (lat, lon) => {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  return fetchJson(url);
};
