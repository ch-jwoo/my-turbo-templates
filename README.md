# Turborepo Templates

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.6.0+-blue.svg)](https://turbo.build/repo)
[![Node](https://img.shields.io/badge/Node-18+-green.svg)](https://nodejs.org)

Reusable workspace templates for Turborepo monorepos, including shared configurations and just-in-time (JIT) packages.

## Table of Contents

- [Turborepo Templates](#turborepo-templates)
  - [Table of Contents](#table-of-contents)
  - [What's Inside?](#whats-inside)
    - [Just-in-Time (JIT) Packages ⚡ (Recommended)](#just-in-time-jit-packages--recommended)
    - [Compiled Packages](#compiled-packages)
    - [Shared Configurations](#shared-configurations)
  - [Choosing Between JIT and Compiled Packages](#choosing-between-jit-and-compiled-packages)
    - [Use JIT Packages (Recommended) When:](#use-jit-packages-recommended-when)
    - [Use Compiled Packages When:](#use-compiled-packages-when)
  - [Usage](#usage)
    - [Prerequisites](#prerequisites)
    - [Adding Packages to Your Project](#adding-packages-to-your-project)
      - [Copy from GitHub (Recommended)](#copy-from-github-recommended)
      - [Copy from Local Repository](#copy-from-local-repository)
    - [Using Packages in Your Applications](#using-packages-in-your-applications)
      - [Using JIT Packages](#using-jit-packages)
      - [Using Compiled Packages](#using-compiled-packages)
      - [Using Configuration Packages](#using-configuration-packages)
  - [Command Reference](#command-reference)
    - [Basic Syntax](#basic-syntax)
    - [Options](#options)
    - [Examples with Different Branches](#examples-with-different-branches)
  - [Development](#development)
    - [Building All Packages](#building-all-packages)
    - [Linting](#linting)
    - [Fix Linting Issues](#fix-linting-issues)
    - [Type Checking](#type-checking)
    - [Formatting](#formatting)
    - [Development Mode](#development-mode)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
      - [Package Not Found After Copying](#package-not-found-after-copying)
      - [TypeScript Errors in JIT Packages](#typescript-errors-in-jit-packages)
      - [Build Fails for Compiled Packages](#build-fails-for-compiled-packages)
      - [Import Errors in Next.js](#import-errors-in-nextjs)
      - [ESLint Configuration Not Found](#eslint-configuration-not-found)

## What's Inside?

This repository contains the following reusable packages:

### Just-in-Time (JIT) Packages ⚡ (Recommended)

JIT packages allow direct TypeScript imports without build steps, making them ideal for rapid development.

- **`@repo/node-jit`**: Just-in-time utilities for Node.js applications
  - `logger`: Logging utilities
  - `env`: Environment variable management
  - `http`: HTTP utilities
- **`@repo/react-jit`**: Just-in-time React components
  - `button`: Button component
  - `card`: Card component

### Compiled Packages

Compiled packages require a build step but offer optimized JavaScript output.

- **`@repo/node-compiled`**: Pre-compiled utilities for Node.js applications
  - Main export: All math and string utilities
  - `math`: Mathematical operations (add, subtract, multiply, divide, sum, average)
  - `string`: String manipulation (capitalize, toKebabCase, toCamelCase, truncate, isValidEmail)

### Shared Configurations

- **`@repo/typescript-config`**: TypeScript configuration presets
  - `base.json`: Base TypeScript configuration
  - `nextjs.json`: Next.js specific configuration
  - `node.json`: Node.js specific configuration
  - `react-library.json`: React library configuration
- **`@repo/eslint-config`**: ESLint configuration presets
  - `base`: Base ESLint configuration
  - `nextjs`: Next.js specific configuration
  - `node`: Node.js specific configuration
  - `react-internal`: React library configuration

## Choosing Between JIT and Compiled Packages

### Use JIT Packages (Recommended) When:

- You want faster development with no build steps
- Direct TypeScript imports are preferred
- Build complexity should be minimized
- Rapid iteration is a priority

### Use Compiled Packages When:

- You need optimized production builds
- JavaScript output is required
- Build-time optimizations are important
- Package size needs to be minimized

**In most cases, we recommend using JIT packages** for their simplicity and faster development experience.

## Usage

### Prerequisites

Before using these templates, ensure you have:

- **Node.js** >= 18.0.0
- **npm** >= 11.6.1
- **Turborepo** >= 2.6.0
- An existing Turborepo monorepo (or create one with `npx create-turbo@latest`)

### Adding Packages to Your Project

You can copy these packages into your own Turborepo monorepo using the `turbo gen workspace` command:

#### Copy from GitHub (Recommended)

```bash
# Copy JIT packages (recommended for most cases)
turbo gen workspace --copy https://github.com/ch-jwoo/my-turbo-templates/tree/main/packages/node-jit --name @repo/node-jit --destination packages/node-jit

turbo gen workspace --copy https://github.com/ch-jwoo/my-turbo-templates/tree/main/packages/react-jit --name @repo/react-jit --destination packages/react-jit

# Copy compiled package (when build optimization is needed)
turbo gen workspace --copy https://github.com/ch-jwoo/my-turbo-templates/tree/main/packages/node-compiled --name @repo/node-compiled --destination packages/node-compiled

# Copy shared configurations
turbo gen workspace --copy https://github.com/ch-jwoo/my-turbo-templates/tree/main/packages/typescript-config --name @repo/typescript-config --destination packages/typescript-config

turbo gen workspace --copy https://github.com/ch-jwoo/my-turbo-templates/tree/main/packages/eslint-config --name @repo/eslint-config --destination packages/eslint-config
```

#### Copy from Local Repository

If you've cloned this repository locally:

```bash
# From your target monorepo root
turbo gen workspace --copy /path/to/my-turbo-templates/packages/node-jit --name @repo/node-jit --destination packages/node-jit

turbo gen workspace --copy /path/to/my-turbo-templates/packages/react-jit --name @repo/react-jit --destination packages/react-jit

turbo gen workspace --copy /path/to/my-turbo-templates/packages/node-compiled --name @repo/node-compiled --destination packages/node-compiled
```

### Using Packages in Your Applications

After copying the packages, you can use them in your applications:

#### Using JIT Packages

**Node.js Application (node-jit):**

```typescript
// package.json
{
  "dependencies": {
    "@repo/node-jit": "*"
  }
}

// In your code
import { logger } from "@repo/node-jit/logger";
import { getEnv } from "@repo/node-jit/env";
import { httpClient } from "@repo/node-jit/http";

logger.info("Hello from node-jit!");
const apiUrl = getEnv("API_URL");
```

**React Application (react-jit):**

```typescript
// package.json
{
  "dependencies": {
    "@repo/react-jit": "*"
  }
}

// In your components
import { Button } from "@repo/react-jit/button";
import { Card } from "@repo/react-jit/card";

export default function App() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

#### Using Compiled Packages

**Node.js Application (node-compiled):**

```typescript
// package.json
{
  "dependencies": {
    "@repo/node-compiled": "*"
  }
}

// Import all utilities from main export
import { add, subtract, capitalize, isValidEmail } from "@repo/node-compiled";

// Or import from specific modules
import { add, average } from "@repo/node-compiled/math";
import { capitalize, toKebabCase } from "@repo/node-compiled/string";

// Usage examples
const result = add(5, 3); // 8
const title = capitalize("hello world"); // "Hello world"
const slug = toKebabCase("My Article Title"); // "my-article-title"
const valid = isValidEmail("user@example.com"); // true
```

**Important:** Compiled packages require a build step. Run `turbo build` before using them.

#### Using Configuration Packages

**TypeScript Configuration:**

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    // Your custom overrides
  }
}
```

**Available TypeScript Configurations:**

| Configuration                                | Use Case             | Extends   |
| -------------------------------------------- | -------------------- | --------- |
| `@repo/typescript-config/base.json`          | Base configuration   | -         |
| `@repo/typescript-config/nextjs.json`        | Next.js applications | base.json |
| `@repo/typescript-config/node.json`          | Node.js applications | base.json |
| `@repo/typescript-config/react-library.json` | React libraries      | base.json |

**ESLint Configuration:**

```javascript
// eslint.config.js
import baseConfig from '@repo/eslint-config/base';

export default [
  ...baseConfig,
  // Your custom rules
];
```

**Available ESLint Configurations:**

| Configuration                        | Use Case             | Best For             |
| ------------------------------------ | -------------------- | -------------------- |
| `@repo/eslint-config/base`           | Base configuration   | All projects         |
| `@repo/eslint-config/nextjs`         | Next.js applications | Frontend apps        |
| `@repo/eslint-config/node`           | Node.js applications | Backend services     |
| `@repo/eslint-config/react-internal` | React libraries      | Shared UI components |

## Command Reference

### Basic Syntax

```bash
turbo gen workspace --copy <source> --name <name> --destination <path>
```

### Options

- `--copy <source>`: Source to copy from
  - GitHub URL: `https://github.com/owner/repo/tree/branch/path`
  - Local path: `/path/to/workspace`
- `--name <name>`: Package name in `package.json`
- `--destination <path>`: Where to create the workspace
- `--type <app|package>`: Workspace type (default: inferred from destination)
- `--example-path <path>` or `-p <path>`: Subdirectory path when using GitHub URLs

### Examples with Different Branches

```bash
# Copy from specific branch
turbo gen workspace --copy https://github.com/ch-jwoo/my-turbo-templates/tree/develop/packages/node-jit --name @repo/node-jit --destination packages/node-jit

# Copy with custom destination structure
turbo gen workspace --copy https://github.com/ch-jwoo/my-turbo-templates/tree/main/packages/react-jit --name @my-org/ui --destination libs/ui

# Copy with custom package name
turbo gen workspace --copy https://github.com/ch-jwoo/my-turbo-templates/tree/main/packages/node-compiled --name @my-company/utils --destination packages/utils
```

## Development

This section covers commands for developing and maintaining the packages in this repository.

### Building All Packages

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Fix Linting Issues

```bash
npm run fix-lint
```

### Type Checking

```bash
npm run check-types
```

### Formatting

```bash
npm run format
```

### Development Mode

```bash
npm run dev
```

## Troubleshooting

### Common Issues

#### Package Not Found After Copying

**Problem**: After copying a package, you get "Cannot find module" errors.

**Solution**:

```bash
# Install dependencies in your monorepo root
npm install

# Or use turbo to install in all workspaces
turbo run build --force
```

#### TypeScript Errors in JIT Packages

**Problem**: TypeScript shows errors when importing from JIT packages.

**Solution**: Ensure your consuming application's `tsconfig.json` includes the JIT package in its paths or references:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/node-jit/*": ["../packages/node-jit/src/*"]
    }
  }
}
```

#### Build Fails for Compiled Packages

**Problem**: `npm run build` fails for compiled packages.

**Solution**: Make sure you have TypeScript installed and the package has a valid `tsconfig.json`:

```bash
npm install -D typescript
```

#### Import Errors in Next.js

**Problem**: Next.js shows "Module not found" for internal packages.

**Solution**: Add `transpilePackages` to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/react-jit', '@repo/node-jit'],
};

module.exports = nextConfig;
```

#### ESLint Configuration Not Found

**Problem**: ESLint shows errors about missing configuration.

**Solution**: Ensure your `eslint.config.js` properly imports the config:

```javascript
import baseConfig from '@repo/eslint-config/base';

export default [...baseConfig];
```
