# noExternal 설정 상세 설명

## 개념 이해

### 번들러의 기본 동작
번들러는 기본적으로 `node_modules`의 패키지를 "external"로 취급합니다.

```
당신의 코드 → 번들링 ✅
node_modules → 번들링 ❌ (external로 남김)
```

### 왜 이렇게 하나?
- **성능**: 큰 라이브러리(react, express 등)를 매번 번들링하면 느림
- **중복 방지**: 여러 앱이 같은 node_modules 공유 가능
- **업데이트 용이**: 패키지만 업데이트하면 됨

## 우리의 문제

### test-node 앱의 상황

```
test-node/src/index.ts
  ↓ imports
@repo/node-jit/logger → src/logger.ts (TypeScript 파일)
  ↓ imports
@repo/node-compiled → dist/index.js (JavaScript 파일)
```

### 기본 설정 (noExternal 없이)

```ts
// tsup.config.ts - 기본 설정
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  // noExternal 설정 없음 = 모두 external
});
```

**결과 (dist/index.js)**:
```js
// 우리 코드만 번들링됨
import { createLogger } from '@repo/node-jit/logger';  // ❌ .ts 파일!
import { add } from '@repo/node-compiled';             // ✅ .js 파일

// ... 우리 코드
```

**실행 시**:
```bash
$ node dist/index.js
Error: Unknown file extension ".ts" for logger.ts
```

Node.js가 TypeScript를 모르기 때문에 실패!

## noExternal 설정

### Pattern Matching

```ts
noExternal: [/.*/]  // 정규표현식: 모든 문자열 매칭
```

이것의 의미:
- `/.*/` = "모든 것과 매칭되는 정규표현식"
- "어떤 패키지도 external로 두지 마라"
- "모든 dependencies를 번들에 포함시켜라"

### 다양한 noExternal 설정 예시

```ts
// 1. 모든 것 번들링
noExternal: [/.*/]

// 2. 특정 패키지만 번들링
noExternal: ['@repo/node-jit', '@repo/react-jit']

// 3. @repo로 시작하는 모든 패키지 번들링
noExternal: [/^@repo\//]

// 4. 아무것도 번들링 안 함 (기본값)
// noExternal: [] 또는 설정 안 함
```

## 실제 차이 비교

### Before: noExternal 없이

**번들 크기**:
```bash
$ ls -lh dist/index.js
2.3 KB  # 우리 코드만
```

**내용**:
```js
// dist/index.js (약 60줄)
import { add } from "@repo/node-compiled";
import { createLogger } from "@repo/node-jit/logger";
// ... 우리 앱 로직만
```

**실행**:
```bash
❌ Error: Cannot find module '.../logger.ts'
```

### After: noExternal: [/.*/]

**번들 크기**:
```bash
$ ls -lh dist/index.js
5.0 KB  # 모든 dependencies 포함
```

**내용**:
```js
// dist/index.js (171줄)

// ======== @repo/node-compiled 코드 ========
var add = (a, b) => a + b;
var subtract = (a, b) => a - b;
// ... 전체 구현

// ======== @repo/node-jit/logger 코드 ========
var LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
var createLogger = (options = {}) => {
  // ... 전체 구현
};

// ======== @repo/node-jit/env 코드 ========
var getEnvVarOrDefault = (key, defaultValue) => {
  // ... 전체 구현
};

// ======== @repo/node-jit/http 코드 ========
var HTTP_STATUS = { OK: 200, NOT_FOUND: 404, /* ... */ };

// ======== 우리 앱 코드 ========
var customLogger = createLogger({
  level: "info",
  prefix: "TEST-APP",
  timestamp: true
});
// ... 앱 로직
```

**실행**:
```bash
✅ 성공! 모든 코드가 포함되어 있음
```

## 왜 이게 필요한가?

### 문제: JIT 패키지 + Production

```json
// @repo/node-jit/package.json
{
  "exports": {
    "./logger": "./src/logger.ts"  // ← TypeScript 파일!
  }
}
```

**개발 환경**:
```bash
$ npm run dev  # tsx가 .ts 파일 직접 실행 ✅
```

**Production 환경**:
```bash
$ npm run build  # tsc로 컴파일
$ node dist/index.js  # Node.js는 .ts 못 읽음 ❌
```

### 해결책: 번들링

```
[TypeScript 소스]
    ↓ tsup (noExternal: [/.*/])
[JavaScript 번들]  ← 모든 코드 포함, .ts 없음
    ↓
[Node.js 실행] ✅
```

## 구체적인 시나리오

### 시나리오 1: 라이브러리 앱 (일반적인 경우)

```ts
// express 앱
import express from 'express';  // 100MB 라이브러리

// noExternal 없음 (권장)
export default defineConfig({
  // express는 external로 남김
  // node_modules/express를 런타임에 사용
});
```

**이유**:
- express는 이미 컴파일된 JavaScript
- 번들링하면 파일이 거대해짐
- node_modules에서 읽는 게 더 효율적

### 시나리오 2: Monorepo 내부 패키지 (우리 경우)

```ts
// @repo/node-jit 같은 내부 패키지
import { logger } from '@repo/node-jit/logger';  // .ts 파일

// noExternal: [/.*/] 필요!
export default defineConfig({
  noExternal: [/.*/],
  // 모든 @repo/* 패키지를 번들에 포함
});
```

**이유**:
- 내부 패키지는 TypeScript 소스
- Production에서 .ts 읽을 수 없음
- 번들링해서 .js로 변환 필요

### 시나리오 3: 선택적 번들링 (최적화)

```ts
export default defineConfig({
  // @repo 패키지만 번들링, 나머지는 external
  noExternal: [/^@repo\//],

  // 또는 정확히 지정
  noExternal: [
    '@repo/node-jit',
    '@repo/react-jit'
  ],
});
```

**장점**:
- 필요한 것만 번들링
- 번들 크기 최소화
- 빌드 속도 향상

## 정규표현식 패턴 설명

```ts
noExternal: [/.*/]
```

**분해**:
- `/`  : 정규표현식 시작
- `.`  : 아무 문자 하나
- `*`  : 0개 이상 반복
- `/`  : 정규표현식 끝

**매칭 예시**:
```
'@repo/node-jit'     → ✅ 매칭
'express'            → ✅ 매칭
'react'              → ✅ 매칭
'any-package-name'   → ✅ 매칭
''                   → ✅ 매칭 (빈 문자열도)
```

모든 문자열과 매칭되므로 = "모든 패키지를 번들링"

## 다른 번들러에서는?

### esbuild
```js
{
  external: []  // 빈 배열 = 아무것도 external 안 함
}
```

### rollup
```js
{
  external: []  // 같은 개념
}
```

### webpack
```js
{
  externals: []  // 같은 개념
}
```

tsup은 esbuild 기반이라 비슷하지만, `noExternal`이라는 반대 개념 사용

## 트레이드오프

### noExternal: [/.*/] 사용 시

**장점**:
- ✅ 단일 파일로 배포 가능
- ✅ TypeScript 패키지 문제 해결
- ✅ 의존성 걱정 없음
- ✅ Docker 이미지 더 작아질 수 있음

**단점**:
- ❌ 번들 크기 증가
- ❌ 빌드 시간 증가
- ❌ 큰 라이브러리는 비효율적

### 권장 사항

```ts
// 좋음: 내부 패키지만 번들링
export default defineConfig({
  noExternal: [/^@repo\//],  // @repo/* 만
});

// 괜찮음: 모든 것 번들링 (작은 앱)
export default defineConfig({
  noExternal: [/.*/],  // 모든 것
});

// 나쁨: 큰 라이브러리도 번들링
export default defineConfig({
  noExternal: [/.*/],  // react, express 등도 포함 💥
});
```

## 실전 팁

### 1. 조건부 번들링

```ts
export default defineConfig({
  // 내부 monorepo 패키지만
  noExternal: [/^@repo\//],

  // TypeScript 소스를 가진 패키지만
  noExternal: [
    '@repo/node-jit',
    '@repo/react-jit',
  ],
});
```

### 2. 번들 크기 확인

```bash
# 빌드 후
$ ls -lh dist/

# Before noExternal
2.3K  index.js

# After noExternal: [/.*/]
5.0K  index.js

# After noExternal: [/^@repo\//]
4.2K  index.js
```

### 3. 디버깅

```ts
export default defineConfig({
  noExternal: [/.*/],

  // 번들링된 내용 보기
  sourcemap: true,  // .map 파일 생성
  minify: false,    // 읽기 쉽게
});
```

## 결론

**`noExternal: [/.*/]` = "모든 dependencies를 번들에 포함"**

- Monorepo의 TypeScript 패키지 문제 해결
- Production 환경에서 .ts 파일 의존성 제거
- 단일 실행 파일 생성으로 배포 간소화

**사용 시기**:
- ✅ TypeScript 소스를 가진 내부 패키지
- ✅ 작은 유틸리티 패키지들
- ❌ 큰 외부 라이브러리 (react, express 등)
