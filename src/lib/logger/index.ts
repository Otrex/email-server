import { createLogger, format, transports } from 'winston';
import { consoleFormat } from 'winston-console-format';
import { AppEnvironmentEnum } from '../../config';

const { TEST, LOCAL } = AppEnvironmentEnum;

const consoleTransportOptions = [TEST, LOCAL].includes(LOCAL)
  ? {
    handleExceptions: true,
    format: format.combine(
      format.colorize({ all: true }),
      format.padLevels(),
      consoleFormat({
        showMeta: true,
        metaStrip: ['timestamp'],
        inspectOptions: {
          depth: Infinity,
          colors: true,
          maxArrayLength: Infinity,
          breakLength: 120,
          compact: Infinity,
        },
      }),
    ),
  }
  : { handleExceptions: true };

const createComponentLogger = (component: string) => createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { component },
  transports: [new transports.Console(consoleTransportOptions)],
});

export const generalLogger = createComponentLogger('EMAIL_SERVER');
export const routesLogger = createComponentLogger('ROUTES');
export const errorLogger = createComponentLogger('ERROR');
export const scriptLogger = createComponentLogger('SCRIPT');
