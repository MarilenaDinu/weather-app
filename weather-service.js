import { API_KEY, BASE_URL } from './config.js';

const buildURL = (params) => {
  const query = new URLSearchParams({ ...params, appid: API_KEY, units: 'metric', lang: 'ro' });
  return `${BASE_URL}?${query.toString()}`;
};

export const getCurrentWeather = async (city) => {
  const response = await fetch(buildURL({ q: city }));
  if (!response.ok) throw new Error('Oraș invalid sau eroare rețea');
  return await response.json();
};

export const getWeatherByCoords = async (lat, lon) => {
  const response = await fetch(buildURL({ lat, lon }));
  if (!response.ok) throw new Error('Coordonate invalide sau eroare rețea');
  return await response.json();
};



