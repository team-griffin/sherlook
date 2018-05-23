// @flow
import type { Config } from './types';

type Console = typeof console;
type Log = (arg: any) => void;

export type Logger = {
  log: Log,
  debug: Log,
  info: Log,
  warn: Log,
  error: Log,
};

const logLevelMap = {
  log: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

const logger = (
  config: Config,
  console: Console,
) => {
  const logWhen = (required: string) => (message: any) => {
    if (logLevelMap[config.loglevel] >= logLevelMap[required]) {
      const level = required.toUpperCase();
      if (level === 'LOG') {
        console.log(message);
      } else {
        const outer = `${level}: %s`;
        console.log(outer, message);
      }
    }
  };

  return {
    log: logWhen('log'),
    error: logWhen('error'),
    warn: logWhen('warn'),
    info: logWhen('info'),
    debug: logWhen('debug'),
  };
};

export default logger;
