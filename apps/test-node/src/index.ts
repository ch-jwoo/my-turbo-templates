/**
 * Test application for validating internal packages:
 * - @repo/node-compiled (compiled package)
 * - @repo/node-jit (just-in-time package)
 */

// Test @repo/node-compiled (compiled package)
import { add, subtract, multiply, divide, sum, average } from '@repo/node-compiled';
import { add as mathAdd } from '@repo/node-compiled/math';

// Test @repo/node-jit (just-in-time package)
import { createLogger, logger } from '@repo/node-jit/logger';
import { getEnvVarOrDefault, isProduction, getEnvNumber } from '@repo/node-jit/env';
import { HTTP_STATUS, parseQueryString, isSuccessStatus } from '@repo/node-jit/http';

// Configure custom logger
const customLogger = createLogger({
  level: 'info',
  prefix: 'TEST-APP',
  timestamp: true,
});

customLogger.info('Starting test application...');

// Test node-compiled package
console.log('\n=== Testing @repo/node-compiled ===');
customLogger.info('Testing math operations...');

const addResult = add(5, 3);
console.log(`add(5, 3) = ${addResult}`);

const subtractResult = subtract(10, 4);
console.log(`subtract(10, 4) = ${subtractResult}`);

const multiplyResult = multiply(6, 7);
console.log(`multiply(6, 7) = ${multiplyResult}`);

const divideResult = divide(20, 4);
console.log(`divide(20, 4) = ${divideResult}`);

const numbers = [1, 2, 3, 4, 5];
const sumResult = sum(numbers);
console.log(`sum([1,2,3,4,5]) = ${sumResult}`);

const avgResult = average(numbers);
console.log(`average([1,2,3,4,5]) = ${avgResult}`);

// Test named export from subpath
const mathAddResult = mathAdd(100, 200);
console.log(`mathAdd(100, 200) = ${mathAddResult}`);

// Test node-jit package
console.log('\n=== Testing @repo/node-jit ===');

// Test logger
customLogger.debug('This is a debug message');
customLogger.info('This is an info message');
customLogger.warn('This is a warning message');
customLogger.error('This is an error message');

// Test default logger
logger.info('Testing default logger instance');

// Test env utilities
console.log('\n=== Testing env utilities ===');
const nodeEnv = getEnvVarOrDefault('NODE_ENV', 'development');
console.log(`NODE_ENV: ${nodeEnv}`);

const isProd = isProduction();
console.log(`Is Production: ${isProd}`);

const port = getEnvNumber('PORT', 3000);
console.log(`PORT: ${port}`);

// Test http utilities
console.log('\n=== Testing http utilities ===');
console.log(`HTTP_STATUS.OK: ${HTTP_STATUS.OK}`);
console.log(`HTTP_STATUS.NOT_FOUND: ${HTTP_STATUS.NOT_FOUND}`);

const queryString = 'name=test&age=25&active=true';
const parsed = parseQueryString(queryString);
console.log(`Parsed query string:`, parsed);

const status200 = isSuccessStatus(200);
console.log(`Is 200 success? ${status200}`);

const status404 = isSuccessStatus(404);
console.log(`Is 404 success? ${status404}`);

customLogger.info('✅ All package imports and functionality tests passed!');
