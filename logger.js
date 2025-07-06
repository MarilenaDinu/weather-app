const timestamp = () => new Date().toISOString();
const STORE_KEY = '__app_logs__';

export const log = (level, msg, data = null) => {
  const entry = `[${timestamp()}] [${level}] ${msg}`;
  console[level === 'error' ? 'error' : 'log'](entry, data || '');

  // salvare în localStorage
  const logs = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
  logs.unshift({ level, msg, time: timestamp(), data });
  localStorage.setItem(STORE_KEY, JSON.stringify(logs.slice(0, 50)));
};

export const logInfo = (msg, data = null) => log('info', msg, data);
export const logError = (msg, data = null) => log('error', msg, data);
