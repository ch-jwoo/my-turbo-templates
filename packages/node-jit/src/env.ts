/**
 * Environment variable utilities for Node.js applications
 */

/**
 * Gets an environment variable or throws if not found
 */
export const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

/**
 * Gets an environment variable or returns a default value
 */
export const getEnvVarOrDefault = (key: string, defaultValue: string): string => {
  const value = process.env[key];
  return value !== undefined && value !== '' ? value : defaultValue;
};

/**
 * Checks if the application is running in production
 */
export const isProduction = (): boolean => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  return process.env.NODE_ENV === 'production';
};

/**
 * Checks if the application is running in development
 */
export const isDevelopment = (): boolean => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  return process.env.NODE_ENV === 'development';
};

/**
 * Checks if the application is running in test mode
 */
export const isTest = (): boolean => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  return process.env.NODE_ENV === 'test';
};

/**
 * Gets a number from environment variable
 */
export const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];

  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }

  const parsed = Number(value);

  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} is not a valid number: ${value}`);
  }

  return parsed;
};

/**
 * Gets a boolean from environment variable
 */
export const getEnvBoolean = (key: string, defaultValue?: boolean): boolean => {
  const value = process.env[key];

  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }

  const lowercased = value.toLowerCase();

  if (lowercased === 'true' || lowercased === '1') {
    return true;
  }

  if (lowercased === 'false' || lowercased === '0') {
    return false;
  }

  throw new Error(`Environment variable ${key} is not a valid boolean: ${value}`);
};
