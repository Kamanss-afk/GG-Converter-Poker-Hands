import logger from 'pino';

const date = new Date().toLocaleString();

export const log = logger({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${date}"`,
});