# Package Usage Guide

Quick reference for using internal Turborepo packages in your applications.

## Quick Start

### 1. Add Package Dependency

In your app's `package.json`:
```json
{
  "dependencies": {
    "@repo/node-compiled": "*",
    "@repo/node-jit": "*",
    "@repo/react-jit": "*"
  }
}
```

### 2. Configure TypeScript

In your app's `tsconfig.json`:
```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022"
  }
}
```

### 3. For Next.js Apps

In `next.config.ts`:
```ts
const nextConfig = {
  transpilePackages: ['@repo/react-jit'],
};
```

## Package APIs

### @repo/node-compiled

Compiled utilities for Node.js applications.

#### Math Operations
```ts
import { add, subtract, multiply, divide, sum, average } from '@repo/node-compiled';
// or
import { add } from '@repo/node-compiled/math';

add(5, 3);        // 8
subtract(10, 4);  // 6
multiply(6, 7);   // 42
divide(20, 4);    // 5
sum([1,2,3,4,5]); // 15
average([1,2,3]); // 2
```

#### String Operations
```ts
import { capitalize, reverse } from '@repo/node-compiled/string';

capitalize('hello'); // 'Hello'
reverse('world');    // 'dlrow'
```

### @repo/node-jit

Just-in-time utilities for Node.js applications.

#### Logger
```ts
import { createLogger, logger } from '@repo/node-jit/logger';

// Use default logger
logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message', error);

// Create custom logger
const customLogger = createLogger({
  level: 'debug',
  prefix: 'MY-APP',
  timestamp: true,
});

customLogger.debug('Debug message');
```

#### Environment Variables
```ts
import {
  getEnvVarOrDefault,
  getEnvNumber,
  getEnvBoolean,
  isProduction,
  isDevelopment
} from '@repo/node-jit/env';

const nodeEnv = getEnvVarOrDefault('NODE_ENV', 'development');
const port = getEnvNumber('PORT', 3000);
const debug = getEnvBoolean('DEBUG', false);

if (isProduction()) {
  // Production logic
}
```

#### HTTP Utilities
```ts
import {
  HTTP_STATUS,
  parseQueryString,
  buildQueryString,
  isSuccessStatus,
  fetchWithTimeout
} from '@repo/node-jit/http';

// Status codes
if (response.status === HTTP_STATUS.OK) {
  // Handle success
}

// Query strings
const params = parseQueryString('name=test&age=25');
const query = buildQueryString({ name: 'test', age: 25 });

// Status checking
if (isSuccessStatus(response.status)) {
  // 2xx status
}

// Timeout fetch
const response = await fetchWithTimeout('https://api.example.com', {}, 5000);
```

### @repo/react-jit

Just-in-time React components.

#### Button Component
```tsx
import { Button } from '@repo/react-jit/button';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

<Button variant="secondary">
  Secondary Action
</Button>

<Button variant="outline">
  Outline Button
</Button>
```

**Props**:
- `variant`: `'primary'` | `'secondary'` | `'outline'`
- All standard HTML button attributes

#### Card Component
```tsx
import { Card } from '@repo/react-jit/card';

<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

**Props**:
- `children`: React.ReactNode
- `className`: string (optional)

## Common Patterns

### Full Stack Example

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@repo/react-jit/button';
import { Card } from '@repo/react-jit/card';
import { add, multiply } from '@repo/node-compiled';

export default function CalculatorPage() {
  const [result, setResult] = useState(0);

  const calculate = () => {
    const sum = add(5, 3);
    const product = multiply(sum, 2);
    setResult(product);
  };

  return (
    <Card>
      <h2>Calculator</h2>
      <p>Result: {result}</p>
      <Button onClick={calculate}>Calculate</Button>
    </Card>
  );
}
```

### Node.js Service Example

```ts
import { createLogger } from '@repo/node-jit/logger';
import { getEnvNumber } from '@repo/node-jit/env';
import { HTTP_STATUS } from '@repo/node-jit/http';
import { sum } from '@repo/node-compiled';

const logger = createLogger({ prefix: 'API' });
const port = getEnvNumber('PORT', 3000);

async function handleRequest(numbers: number[]) {
  logger.info('Processing request');

  const total = sum(numbers);

  return {
    status: HTTP_STATUS.OK,
    data: { total }
  };
}
```

## Build Commands

### Development
```bash
# Run dev server
npm run dev --workspace=your-app

# Watch mode for compiled packages
npm run dev --workspace=@repo/node-compiled
```

### Production
```bash
# Build all packages
npm run build

# Build specific app
npm run build --workspace=your-app
```

### Type Checking
```bash
# Check types across workspace
npm run check-types

# Check specific package
npm run check-types --workspace=your-app
```

## Troubleshooting

### Module Resolution Errors

**Problem**: `Cannot find module '@repo/package-name'`

**Solution**: Ensure `moduleResolution: "bundler"` in tsconfig.json

### Next.js Compilation Errors

**Problem**: React component fails to compile

**Solution**: Add package to `transpilePackages` in next.config.ts

### Type Checking Issues

**Problem**: Types not found for JIT packages

**Solution**: JIT packages point to source `.ts` files, ensure they're in `include` path

## Best Practices

1. **Use JIT packages** for simple utilities and React components
2. **Use compiled packages** for complex logic and shared algorithms
3. **Always configure `moduleResolution: "bundler"`** in consuming apps
4. **Add JIT packages to `transpilePackages`** in Next.js
5. **Test imports** from both main entry and subpaths
6. **Run type checking** before committing changes

## Testing New Packages

```bash
# 1. Create test app
mkdir apps/test-my-feature

# 2. Add package dependency
npm install @repo/my-package --workspace=test-my-feature

# 3. Import and test
import { myFunction } from '@repo/my-package';

# 4. Build to verify
npm run build --workspace=test-my-feature
```
