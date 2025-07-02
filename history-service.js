import { DEFAULT_MAX_HISTORY } from '../config.js';

const STORAGE_KEY = 'weatherHistory';
const MAX_KEY     = 'maxHistory';

export const getMaxHistory = () => {
  const stored = localStorage.getItem(MAX_KEY);
  return stored ? parseInt(stored, 10) : DEFAULT_MAX_HISTORY;
};

export const setMaxHistory = (max) => {
  localStorage.setItem(MAX_KEY, max);
  let hist = getHistory();
  if (hist.length > max) {
    hist = hist.slice(0, max);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
  }
  return hist;
};

export const getHistory = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const addToHistory = (city) => {
  const max = getMaxHistory();
  let hist = getHistory().filter(c => c.toLowerCase() !== city.toLowerCase());
  hist.unshift(city);
  if (hist.length > max) hist = hist.slice(0, max);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
  return hist;
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
  return [];
};
