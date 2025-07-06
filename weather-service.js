import { BASE_URL, API_KEY, SETTINGS } from '../config.js';

class WeatherCache {
  constructor(maxAge = SETTINGS.cacheMaxAge) {
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    const expired = Date.now() - entry.timestamp > this.maxAge;
    if (expired) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear() {
    this.cache.clear();
  }
}

export const weatherCache = new WeatherCache();

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
};

export const getCurrentWeather = async (city) => {
  const cached = weatherCache.get(city.toLowerCase());
  if (cached) return cached;

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  const data = await fetchJson(url);
  weatherCache.set(city.toLowerCase(), data);
  return data;
};

export const getWeatherByCoords = async (lat, lon) => {
  const key = `${lat},${lon}`;
  const cached = weatherCache.get(key);
  if (cached) return cached;

  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const data = await fetchJson(url);
  weatherCache.set(key, data);
  return data;
};
