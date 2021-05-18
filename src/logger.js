const name = '[Livetag]';

export const logger = {
  log: console.log.bind(console, name),
  info: console.info.bind(console, name),
  error: console.error.bind(console, name),
};
