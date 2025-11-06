# 선택적 번들링 비교

## 세 가지 번들링 전략 비교

### 1️⃣ noExternal 없음 (기본 설정)
```typescript
export default defineConfig({
  // noExternal 설정 없음
});
```

**결과**:
- 파일 크기: `2.3 KB`
- 줄 수: `53줄`
- 실행 결과: ❌ **에러 발생**

**번들된 내용**:
```javascript
import { add } from "@repo/node-compiled";     // ❌ external
import { createLogger } from "@repo/node-jit/logger";  // ❌ .ts 파일!

var customLogger = createLogger({ ... });
// ... 우리 코드만
```

**에러**:
```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"
```

---

### 2️⃣ 모든 것 번들링
```typescript
export default defineConfig({
  noExternal: [/.*/],  // 모든 dependencies
});
```

**결과**:
- 파일 크기: `5.0 KB`
- 줄 수: `171줄`
- 실행 결과: ✅ **정상 작동**

**번들된 내용**:
```javascript
// @repo/node-compiled 코드 (번들링됨)
var add = (a, b) => a + b;
var subtract = (a, b) => a - b;
// ... 전체 math 코드

// @repo/node-jit/logger 코드 (번들링됨)
var LOG_LEVELS = { debug: 0, info: 1, ... };
var createLogger = (options = {}) => { ... };

// @repo/node-jit/env 코드 (번들링됨)
var getEnvVarOrDefault = (key, defaultValue) => { ... };

// @repo/node-jit/http 코드 (번들링됨)
var HTTP_STATUS = { OK: 200, ... };

// 우리 앱 코드
var customLogger = createLogger({ ... });
```

**장점**:
- ✅ 모든 TypeScript 문제 해결
- ✅ 단일 파일 배포
- ✅ 의존성 걱정 없음

**단점**:
- ❌ 파일 크기 가장 큼
- ❌ 이미 컴파일된 패키지도 재번들링
- ❌ 빌드 시간 증가

---

### 3️⃣ 선택적 번들링 (최적화) ⭐
```typescript
export default defineConfig({
  noExternal: ['@repo/node-jit'],  // TypeScript 패키지만
});
```

**결과**:
- 파일 크기: `4.7 KB`
- 줄 수: `155줄`
- 실행 결과: ✅ **정상 작동**

**번들된 내용**:
```javascript
// @repo/node-compiled는 import로 남음 (external)
import { add, subtract, multiply, divide, sum, average } from "@repo/node-compiled";
import { add as mathAdd } from "@repo/node-compiled/math";

// @repo/node-jit는 번들링됨
var LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
var createLogger = (options = {}) => {
  const { level = "info", prefix = "", timestamp = true } = options;
  // ... 전체 구현
};

var getEnvVarOrDefault = (key, defaultValue) => {
  const value = process.env[key];
  return value !== void 0 && value !== "" ? value : defaultValue;
};

var HTTP_STATUS = { OK: 200, NOT_FOUND: 404, /* ... */ };

// 우리 앱 코드
var customLogger = createLogger({ ... });
```

**장점**:
- ✅ TypeScript 패키지 문제 해결
- ✅ 파일 크기 최적화 (5.0 KB → 4.7 KB)
- ✅ 이미 컴파일된 패키지는 재사용
- ✅ 빌드 시간 절약

**단점**:
- 없음! 이 방법이 최선입니다! 🎯

---

## 비교표

| 설정 | 파일 크기 | 줄 수 | 실행 | 번들 내용 |
|------|-----------|-------|------|-----------|
| **noExternal 없음** | 2.3 KB | 53줄 | ❌ | 우리 코드만 |
| **모든 것 번들링** | 5.0 KB | 171줄 | ✅ | 모든 dependencies |
| **선택적 번들링 ⭐** | 4.7 KB | 155줄 | ✅ | TypeScript 패키지만 |

---

## 왜 선택적 번들링이 최적인가?

### @repo/node-compiled (컴파일된 패키지)
```json
{
  "main": "./dist/index.js",  // 이미 JavaScript
  "exports": {
    ".": "./dist/index.js",   // ✅ .js 파일
    "./math": "./dist/math.js" // ✅ .js 파일
  }
}
```

**결론**: 이미 JavaScript이므로 번들링 불필요 → external로 남김

### @repo/node-jit (JIT 패키지)
```json
{
  "exports": {
    "./logger": "./src/logger.ts",  // ❌ TypeScript 파일
    "./env": "./src/env.ts",        // ❌ TypeScript 파일
    "./http": "./src/http.ts"       // ❌ TypeScript 파일
  }
}
```

**결론**: TypeScript 소스이므로 번들링 필요 → noExternal에 추가

---

## 다양한 선택적 번들링 패턴

### 패턴 1: 특정 패키지 나열
```typescript
export default defineConfig({
  noExternal: ['@repo/node-jit', '@repo/react-jit'],
});
```

**사용 시기**: 번들링할 패키지가 명확할 때

### 패턴 2: 정규표현식으로 그룹 지정
```typescript
export default defineConfig({
  noExternal: [/^@repo\/.*-jit$/],  // *-jit로 끝나는 모든 @repo 패키지
});
```

**사용 시기**: 패키지 명명 규칙이 있을 때

### 패턴 3: @repo 전체
```typescript
export default defineConfig({
  noExternal: [/^@repo\//],  // @repo로 시작하는 모든 패키지
});
```

**사용 시기**: 모든 내부 패키지가 TypeScript일 때

### 패턴 4: 조건부 번들링
```typescript
export default defineConfig({
  noExternal: process.env.NODE_ENV === 'production'
    ? ['@repo/node-jit']  // Production: 필요한 것만
    : [/.*/],              // Development: 모든 것
});
```

**사용 시기**: 환경별로 전략을 다르게 할 때

---

## 실제 적용 가이드

### Step 1: 패키지 분석
```bash
# package.json 확인
cat packages/*/package.json | grep -A 3 "exports"
```

**체크리스트**:
- ✅ `.ts` 파일을 가리키나? → 번들링 필요
- ✅ `.js` 파일을 가리키나? → 번들링 불필요

### Step 2: tsup.config.ts 설정
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,

  // TypeScript 소스를 가진 패키지만 지정
  noExternal: ['@repo/node-jit'],

  target: 'node18',
});
```

### Step 3: 빌드 & 테스트
```bash
# 빌드
npm run build --workspace=test-node

# 번들 내용 확인
head -50 apps/test-node/dist/index.js

# 실행 테스트
npm run start --workspace=test-node
```

### Step 4: 파일 크기 확인
```bash
ls -lh apps/test-node/dist/index.js
wc -l apps/test-node/dist/index.js
```

---

## 문제 해결

### 문제 1: 여전히 .ts 에러 발생
```
Error: Unknown file extension ".ts" for some-package.ts
```

**해결**:
```typescript
// some-package도 noExternal에 추가
noExternal: ['@repo/node-jit', 'some-package'],
```

### 문제 2: 파일 크기가 너무 큼
```
dist/index.js: 50 MB
```

**원인**: 큰 라이브러리가 번들링됨

**해결**:
```typescript
// 특정 패키지만 번들링
noExternal: ['@repo/node-jit'],  // express, react 등은 external
```

### 문제 3: 특정 패키지가 번들링 안 됨
```
import { something } from '@repo/my-package';  // external로 남음
```

**확인**:
```typescript
// 패키지 이름이 정확한지 확인
noExternal: ['@repo/my-package'],  // 철자 확인!

// 또는 정규표현식 사용
noExternal: [/^@repo\//],
```

---

## 성능 비교

### 빌드 시간
```
noExternal 없음:       ~2초
모든 것 번들링:        ~10초
선택적 번들링:         ~5초  ⭐
```

### 런타임 성능
```
모두 동일 (Node.js가 실행하는 코드는 같음)
```

### 배포 크기
```
Docker 이미지 크기:
- noExternal 없음:     작음 (but 실행 안 됨 ❌)
- 모든 것 번들링:      중간
- 선택적 번들링:       작음 ⭐
```

---

## 권장 설정 (Best Practice)

```typescript
// apps/test-node/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,

  // TypeScript 소스를 가진 내부 패키지만 번들링
  noExternal: ['@repo/node-jit'],

  // 또는 패턴으로
  // noExternal: [/^@repo\/.*-jit$/],

  target: 'node18',
  splitting: false,
  sourcemap: false,
  minify: false,
});
```

**이유**:
1. ✅ TypeScript 문제 해결
2. ✅ 파일 크기 최소화
3. ✅ 빌드 시간 최적화
4. ✅ 컴파일된 패키지 재사용
5. ✅ 명확하고 유지보수 쉬움

---

## 결론

**선택적 번들링 = 최적의 전략** 🎯

```
TypeScript 패키지 → 번들링 (noExternal에 추가)
JavaScript 패키지 → External (node_modules 사용)
```

이 방식으로:
- ✅ 실행 가능한 단일 파일 생성
- ✅ 최소한의 번들 크기
- ✅ 빠른 빌드 시간
- ✅ 효율적인 리소스 사용
