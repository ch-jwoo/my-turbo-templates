/**
 * Logger utility for Node.js applications
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Creates a logger instance with configurable options
 */
export const createLogger = (options: LoggerOptions = {}): {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, error?: Error, ...args: unknown[]) => void;
} => {
  const { level = 'info', prefix = '', timestamp = true } = options;

  const minLevel = LOG_LEVELS[level];

  const formatMessage = (msg: string): string => {
    const parts: string[] = [];

    if (timestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    if (prefix.length > 0) {
      parts.push(`[${prefix}]`);
    }

    parts.push(msg);

    return parts.join(' ');
  };

  const shouldLog = (logLevel: LogLevel): boolean => {
    return LOG_LEVELS[logLevel] >= minLevel;
  };

  return {
    debug: (message: string, ...args: unknown[]): void => {
      if (shouldLog('debug')) {
        console.debug(formatMessage(message), ...args);
      }
    },

    info: (message: string, ...args: unknown[]): void => {
      if (shouldLog('info')) {
        console.info(formatMessage(message), ...args);
      }
    },

    warn: (message: string, ...args: unknown[]): void => {
      if (shouldLog('warn')) {
        console.warn(formatMessage(message), ...args);
      }
    },

    error: (message: string, error?: Error, ...args: unknown[]): void => {
      if (shouldLog('error')) {
        if (error !== undefined) {
          console.error(formatMessage(message), error, ...args);
        } else {
          console.error(formatMessage(message), ...args);
        }
      }
    },
  };
};

/**
 * Default logger instance
 */
export const logger = createLogger();
