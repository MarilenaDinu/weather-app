const LEVEL = { INFO: 'INFO', ERROR: 'ERROR' };
const timestamp = () => new Date().toISOString();

export const logInfo = (msg, data = null) =>
  console.info(`[${timestamp()}] [${LEVEL.INFO}] ${msg}`, data);

export const logError = (msg, err = null) =>
  console.error(`[${timestamp()}] [${LEVEL.ERROR}] ${msg}`, err);
