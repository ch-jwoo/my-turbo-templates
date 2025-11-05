/**
 * HTTP utilities for Node.js applications
 */

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Parses query string into an object
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  for (const [key, value] of params) {
    result[key] = value;
  }

  return result;
};

/**
 * Builds a query string from an object
 */
export const buildQueryString = (params: Record<string, string | number | boolean>): string => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, String(value));
  }

  return searchParams.toString();
};

/**
 * Checks if a status code indicates success (2xx)
 */
export const isSuccessStatus = (status: number): boolean => {
  return status >= 200 && status < 300;
};

/**
 * Checks if a status code indicates a client error (4xx)
 */
export const isClientError = (status: number): boolean => {
  return status >= 400 && status < 500;
};

/**
 * Checks if a status code indicates a server error (5xx)
 */
export const isServerError = (status: number): boolean => {
  return status >= 500 && status < 600;
};

/**
 * Extracts the base URL from a full URL
 */
export const getBaseUrl = (url: string): string => {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}`;
};

/**
 * Joins URL paths safely
 */
export const joinUrlPaths = (...paths: string[]): string => {
  return paths
    .map((path, index) => {
      // Remove leading slash from all but first path
      if (index > 0 && path.startsWith('/')) {
        path = path.slice(1);
      }
      // Remove trailing slash from all but last path
      if (index < paths.length - 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      return path;
    })
    .join('/');
};

/**
 * Creates a timeout promise that rejects after specified milliseconds
 */
export const createTimeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout after ${ms}ms`));
    }, ms);
  });
};

/**
 * Wraps a fetch request with a timeout
 */
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs = 5000
): Promise<Response> => {
  return Promise.race([fetch(url, options), createTimeout(timeoutMs)]);
};
