# 🇰🇷 2026 동양미래 EXPO - Frontend

본 프로젝트는 **2026 동양미래 EXPO** 앱의 프론트엔드입니다.
어플리케이션 및 태블릿 기기에서 동작하며, React Native CLI 기반으로 개발합니다.

---

## 📦 실행 방법

1. 저장소를 클론합니다.

```bash
git clone https://github.com/DongyangOne/2026expo_front.git
cd 2026expo_front
```

2. 의존성을 설치합니다.

```bash
npm install
```

3. 환경 변수를 설정합니다.

```bash
cp .env.example .env
# .env 파일을 열어 필요한 값을 채웁니다.
```

4. 폰트를 네이티브에 링크합니다.

```bash
npx react-native-asset
```

5. Metro 서버를 실행합니다.

```bash
npm start
```

6. Android 에뮬레이터 또는 연결된 기기에서 앱을 빌드/실행합니다.

```bash
npm run android
```

> **주의**: Android 빌드를 위해 **Java 17**이 설치되어 있어야 합니다.
> OpenJDK 17을 설치하거나 `brew install openjdk@17` 등의 방법을 사용하세요.

---

## 🛠 권장 개발 환경

- Node.js >= 18.0.0 (LTS 권장)
- npm >= 9.0.0
- Android Studio (Android SDK)
- Java JDK 17
- React Native CLI 환경 설정 완료 ([공식 문서](https://reactnative.dev/docs/set-up-your-environment))

---

## 🛠 기술 스택

| 분류        | 사용 기술                                                   |
| ----------- | ----------------------------------------------------------- |
| Framework   | React Native CLI                                            |
| Language    | TypeScript (strict mode)                                    |
| Navigation  | React Navigation v6 (@react-navigation/native-stack)        |
| State       | Zustand + immer 미들웨어 (전역), useState/useReducer (지역) |
| HTTP        | Axios                                                       |
| Styling     | NativeWind (Tailwind CSS for RN)                            |
| Font        | Noto Sans KR (weight별 폰트 패밀리)                         |
| Lint/Format | ESLint + Prettier                                           |
| Path Alias  | babel-plugin-module-resolver (`@` → `src/`)                 |

> **버전 변경 시 PM 승인 필수.** `package.json` 의존성을 임의로 업그레이드하지 않습니다.

---

## 🧱 프로젝트 구조

모든 소스 코드는 `src/` 아래에 위치하며, 기능 단위(feature-based)로 폴더를 구성합니다.

```
src/
  App.tsx                   # 앱 진입점 (NavigationContainer)
  components/               # 재사용 컴포넌트
    ui/                     # 기본 UI 원소 (Button, Input, Card 등)
    layout/                 # 공통 레이아웃 (SafeAreaWrapper 등)
  screens/                  # 화면 단위 컴포넌트
  navigation/               # React Navigation 설정
  store/                    # Zustand 스토어
  hooks/                    # 커스텀 훅 (useXxx)
  services/                 # API 호출 함수 (axios)
  types/                    # 전역 TypeScript 타입 정의
  utils/                    # 순수 유틸 함수
  constants/                # 상수값 (colors, sizes, routes 등)
  assets/                   # 이미지, 폰트 등 정적 리소스
    images/
    fonts/
```

그 외 Android 네이티브 코드와 설정 파일은 `android/` 폴더에 위치합니다.

**구조 규칙**

- 한 폴더에 파일이 10개 이상 쌓이면 하위 폴더로 분리합니다.
- `screens/` 안에는 Navigation 라우트와 1:1로 매칭되는 화면만 둡니다. 그 외 로직은 `components/`, `hooks/`로 분리합니다.
- 각 폴더에 `index.ts`를 생성하여 barrel export를 관리합니다.
- 복잡한 화면은 폴더로 분리합니다: `screens/{ScreenName}/{ScreenName}Screen.tsx` + `screens/{ScreenName}/components/`

---

## 🎨 폰트 설정 (Noto Sans KR)

프로젝트는 **Noto Sans KR**을 기본 폰트로 사용합니다.
`src/assets/fonts/`에 다음 폰트 파일들을 배치합니다.

```
src/assets/fonts/
├── NotoSansKR-Bold.ttf         (700)
├── NotoSansKR-Regular.ttf      (400)
└── NotoSansKR-DemiLight.ttf    (350)
```

배치 후 `npx react-native-asset`으로 네이티브에 링크합니다.

#### Tailwind 폰트 클래스 매핑

| className                  | 네이티브 폰트                | 용도              |
| -------------------------- | ---------------------------- | ----------------- |
| `font-notoSansKRBold`      | `NotoSansKR-Bold` (700)      | 제목, 강조        |
| `font-notoSansKRRegular`   | `NotoSansKR-Regular` (400)   | 본문              |
| `font-notoSansKRDemiLight` | `NotoSansKR-DemiLight` (350) | 보조 텍스트, 캡션 |

> ⚠️ **기존 Tailwind 기본 클래스(`font-bold`, `font-semibold`, `font-medium`, `font-light`)는 사용하지 않습니다.**
> 반드시 위의 NotoSansKR 전용 클래스를 사용하세요.

#### 기존 클래스 → 신규 클래스 치환 가이드

| 기존 (사용 금지)                                | 신규 (사용)                |
| ----------------------------------------------- | -------------------------- |
| `font-bold` / `font-semibold`                   | `font-notoSansKRBold`      |
| `font-medium` / `font-regular` / `font-Regular` | `font-notoSansKRRegular`   |
| `font-light` / `font-thin`                      | `font-notoSansKRDemiLight` |

#### 사용 예시

```tsx
<Text className="text-p font-notoSansKRBold text-black">제목</Text>
<Text className="text-p1 font-notoSansKRRegular text-gray">본문</Text>
<Text className="text-sm font-notoSansKRDemiLight text-gray-500">보조 텍스트</Text>
```

---

## 📄 코드 컨벤션

> **"내가 처음 보는 사람이라고 생각하고 짠다"**를 원칙으로 합니다.
> 컨벤션 수정이 필요한 경우 FE PM과 논의 후 PR로 반영합니다.

### 📑 컨벤션 목차

1. [네이밍 규칙](#1-네이밍-규칙)
2. [TypeScript 컨벤션](#2-typescript-컨벤션)
3. [컴포넌트 작성 규칙](#3-컴포넌트-작성-규칙)
4. [Tailwind (NativeWind) 스타일 규칙](#4-tailwind-nativewind-스타일-규칙)
5. [Zustand 상태 관리 규칙](#5-zustand-상태-관리-규칙)
6. [Navigation 규칙](#6-navigation-규칙)
7. [API 통신 규칙](#7-api-통신-규칙)
8. [Import / Export 규칙](#8-import--export-규칙)
9. [주석 작성 규칙](#9-주석-작성-규칙)
10. [Git 컨벤션](#10-git-컨벤션)
11. [환경 변수 관리](#11-환경-변수-관리)
12. [코드 품질 도구](#12-코드-품질-도구)
13. [금지 사항 (Anti-patterns)](#13-금지-사항-anti-patterns)

---

### 1. 네이밍 규칙

#### 파일 및 폴더

| 항목          | 규칙                       | 예시              |
| ------------- | -------------------------- | ----------------- |
| 컴포넌트 파일 | PascalCase + `.tsx`        | `UserProfile.tsx` |
| 스크린 파일   | PascalCase + `Screen.tsx`  | `HomeScreen.tsx`  |
| 훅 파일       | camelCase + `use` 접두사   | `useAuthStore.ts` |
| 스토어 파일   | camelCase + `Store` 접미사 | `authStore.ts`    |
| 서비스 파일   | camelCase + `.service.ts`  | `auth.service.ts` |
| 유틸 파일     | camelCase + `.ts`          | `formatDate.ts`   |
| 타입 파일     | camelCase + `.types.ts`    | `user.types.ts`   |
| 폴더명        | camelCase                  | `userProfile/`    |

#### 변수 및 함수

| 항목                | 규칙                                   | 예시                          |
| ------------------- | -------------------------------------- | ----------------------------- |
| 일반 변수           | camelCase                              | `const userName`              |
| 모듈 레벨 상수      | UPPER_SNAKE_CASE                       | `const BASE_URL`              |
| 함수                | camelCase                              | `function fetchUserData()`    |
| 컴포넌트            | PascalCase                             | `function UserCard()`         |
| 타입/인터페이스     | PascalCase                             | `interface UserProps`         |
| Boolean 변수        | `is` / `has` / `can` / `should` 접두사 | `isLoading`, `hasError`       |
| 이벤트 핸들러       | `handle` 접두사                        | `handlePress`, `handleSubmit` |
| props로 받는 핸들러 | `on` 접두사                            | `onPress`, `onClose`          |

#### 네이밍 금지 사항

- 의미 없는 약어 사용 금지 (`btn`, `usr`, `tmp` 등). `button`, `user`, `temporary`로 풀어쓰기.
- 한글 변수명 금지.
- `data`, `info`, `value`처럼 모호한 이름 단독 사용 금지. `userData`, `boothInfo`처럼 맥락 포함.

---

### 2. TypeScript 컨벤션

#### 기본 원칙

- `any` 타입 사용 금지 → 명시적 타입 사용 (`unknown` 또는 구체적 타입)
- 모든 함수의 파라미터와 반환 타입을 명시
- `type` 보다 `interface` 우선 사용 (확장 가능성)
- Optional chaining (`?.`) 및 nullish coalescing (`??`) 적극 활용

#### Props 타입 정의

```tsx
// ✅ 올바른 예
interface UserCardProps {
  userId: string;
  name: string;
  avatarUrl?: string; // optional은 ? 사용
  onPress: (id: string) => void;
}

const UserCard = ({ userId, name, avatarUrl, onPress }: UserCardProps) => {
  return <View />;
};
```

#### API 응답 타입

```ts
// types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// types/api.types.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

---

### 3. 컴포넌트 작성 규칙

#### 기본 원칙

- **함수형 컴포넌트 + 화살표 함수만 사용합니다.** Class 컴포넌트 금지.
- **한 파일에 한 컴포넌트.** export default는 파일당 하나.
- **100줄을 초과하면 분리를 검토합니다.**
- **props는 5개를 넘기지 않습니다.** 넘으면 객체로 묶거나 설계를 재검토합니다.
- 리스트 아이템은 반드시 별도 컴포넌트로 분리합니다 (FlatList 성능 최적화).

#### 내부 코드 순서 (위에서 아래로)

```tsx
const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
  // 1. Hooks (useState, useEffect, 커스텀 훅)
  const [state, setState] = useState(false);
  const { data } = useMyStore();

  // 2. 파생 값 (useMemo, useCallback)
  const computedValue = useMemo(() => ..., [data]);
  const handlePress = useCallback(() => setState(true), []);

  // 3. 조기 반환 (early return)
  if (!data) return null;

  // 4. 렌더링
  return (
    <View className="flex-1 bg-white">
      <Text className="text-lg font-notoSansKRBold">{prop1}</Text>
    </View>
  );
};

export default MyComponent;
```

#### 컴포넌트 분리 기준

- 100줄을 초과하면 분리 검토
- 재사용 가능성이 있으면 `components/ui/`로 분리
- 스크린 전용 서브컴포넌트는 `screens/{ScreenName}/components/`에 배치
- 리스트 아이템은 반드시 별도 컴포넌트로 분리 (FlatList 성능 최적화)

#### memo / useCallback / useMemo 사용 기준

| API           | 사용 시점                                         |
| ------------- | ------------------------------------------------- |
| `React.memo`  | 부모 리렌더링 시 불필요한 자식 렌더링을 방지할 때 |
| `useCallback` | 자식에게 콜백 prop으로 전달되는 함수              |
| `useMemo`     | 정렬, 필터 등 계산 비용이 높은 파생값             |

#### 조건부 렌더링

- 삼항 연산자는 1단까지만. 중첩 금지.
- 복잡한 분기는 변수로 빼거나 early return 사용.

```tsx
// ❌ 나쁜 예
{
  isLoading ? <Loading /> : error ? <Error /> : data ? <List /> : <Empty />;
}

// ✅ 좋은 예
if (isLoading) return <Loading />;
if (error) return <Error />;
if (!data) return <Empty />;
return <List />;
```

---

### 4. Tailwind (NativeWind) 스타일 규칙

#### 기본 원칙

- 인라인 `StyleSheet` 사용 금지 — `className` prop으로 통일
- 동적 클래스는 조건 변수로 분리하여 가독성 확보
- 자주 쓰이는 클래스 조합은 컴포넌트로 추상화
- tailwindcss 플러그인을 사용해 클래스 순서는 Prettier plugin 결과를 따른다

#### 클래스 작성 순서

| 순서 | 카테고리                 | 예시                                          |
| ---- | ------------------------ | --------------------------------------------- |
| 1    | 레이아웃 (flex, display) | `flex flex-row items-center`                  |
| 2    | 위치 (position, z-index) | `absolute top-0 z-10`                         |
| 3    | 크기 (width, height)     | `w-full h-12`                                 |
| 4    | 간격 (margin, padding)   | `mx-4 px-3 py-2`                              |
| 5    | 배경·테두리              | `bg-white rounded-lg border`                  |
| 6    | 텍스트                   | `text-base font-notoSansKRBold text-gray-800` |
| 7    | 효과·기타                | `shadow-md opacity-75`                        |

#### 동적 스타일 예시

```tsx
// ✅ 올바른 예 — 조건 변수로 분리
const isActive = selected === item.id;

<TouchableOpacity
  className={`flex-row items-center px-4 py-3 rounded-xl
    ${isActive ? 'bg-blue-500' : 'bg-gray-100'}`}
  onPress={() => handleSelect(item.id)}
>
  <Text className={`text-sm font-notoSansKRRegular ${isActive ? 'text-white' : 'text-gray-700'}`}>
    {item.label}
  </Text>
</TouchableOpacity>

// ❌ 잘못된 예 — StyleSheet 혼용
<View style={styles.container} className="flex-1" />
```

#### 커스텀 테마 (tailwind.config.js)

색상·폰트를 하드코딩하지 않습니다. 모든 디자인 토큰은 `tailwind.config.js`에 정의 후 사용합니다.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3B82F6', dark: '#2563EB' },
        secondary: '#6B7280',
        danger: '#EF4444',
      },
      fontFamily: {
        notoSansKRDemiLight: ['NotoSansKR-DemiLight'],
        notoSansKRRegular: ['NotoSansKR-Regular'],
        notoSansKRBold: ['NotoSansKR-Bold'],
      },
    },
  },
};
```

---

### 5. Zustand 상태 관리 규칙

#### 스토어 구조

```ts
// store/authStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AuthState {
  // 상태
  user: User | null;
  isLoading: boolean;
  // 액션
  setUser: (user: User) => void;
  logout: () => void;
  fetchUser: (id: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isLoading: false,

    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),

    fetchUser: async (id) => {
      set({ isLoading: true });
      try {
        const user = await userService.getUser(id);
        set({ user, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    },
  })),
);
```

#### 스토어 분리 원칙

- 도메인 단위로 분리 (`authStore`, `boothStore`, `uiStore` 등)
- UI 상태(모달 오픈 여부 등)는 별도 `uiStore`로 관리
- 서버 데이터 캐싱은 React Query와 병행 사용 권장

#### 컴포넌트에서 사용

```ts
// ✅ selector로 필요한 값만 구독 (리렌더링 최적화)
const user = useAuthStore((state) => state.user);
const logout = useAuthStore((state) => state.logout);

// ❌ 전체 스토어 구독 — 모든 변경마다 리렌더링 발생
const store = useAuthStore();
```

---

### 6. Navigation 규칙

#### 타입 안전한 Navigation

```ts
// navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  BoothDetail: { boothId: string };
  Settings: undefined;
};
```

```ts
// 화면 이동 (타입 안전)
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const navigation = useNavigation<Nav>();

navigation.navigate('BoothDetail', { boothId: '123' });
```

#### Navigator 구성

- `navigation/` 폴더에서 모든 Navigator를 관리합니다.
- 중첩 Navigator는 최대 2단계까지만 허용합니다.
- 스크린 컴포넌트를 Navigator 파일에서 직접 정의하지 않습니다 (import만).

---

### 7. API 통신 규칙

#### Axios 인스턴스

모든 API는 `src/services/instance.ts`의 공통 인스턴스를 통해 호출합니다.

```ts
// services/instance.ts
import axios from 'axios';
import Config from 'react-native-config';

const instance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  // 토큰 주입 등
  return config;
});

export default instance;
```

#### 서비스 함수 분리

컴포넌트에서 직접 `axios.get(...)`을 호출하지 않습니다. 반드시 `services/` 폴더의 함수를 통해 호출합니다.

```ts
// services/booth.service.ts
import instance from './instance';
import type { ApiResponse, Booth } from '@/types';

export const getBoothList = () => instance.get<ApiResponse<Booth[]>>('/booths');

export const getBoothDetail = (id: string) => instance.get<ApiResponse<Booth>>(`/booths/${id}`);
```

#### 에러 처리

- 모든 비동기 호출은 `try-catch`로 감쌉니다.
- 사용자에게 보일 에러 메시지는 상수로 관리하고, 콘솔에는 `[컴포넌트명] 에러내용` 형식으로 출력합니다.

---

### 8. Import / Export 규칙

#### Barrel Export (index.ts)

각 폴더에 `index.ts`를 생성하여 외부 노출 API를 한 곳에서 관리합니다.

```ts
// components/ui/index.ts
export { default as Button } from './Button';
export { default as Input } from './Input';

// 사용할 때
import { Button, Input } from '@/components/ui';
```

#### Import 순서

다음 순서로 정렬하고, 그룹 사이에 빈 줄을 둡니다.

```ts
// 1. React 및 React Native
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. 외부 라이브러리
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// 3. 절대 경로 내부 모듈 (별칭 사용)
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui';
import type { User } from '@/types';

// 4. 상대 경로 내부 모듈
import BoothCard from './components/BoothCard';

// 5. 에셋
import logoImage from '@/assets/images/logo.png';
```

#### 절대 경로 (Path Alias)

`@`를 `src/`로 매핑합니다. 상대 경로(`../../../`)는 같은 폴더 내에서만 사용합니다.

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

```js
// babel.config.js (babel-plugin-module-resolver 설치 필요)
module.exports = {
  plugins: [['module-resolver', { alias: { '@': './src' } }]],
};
```

---

### 9. 주석 작성 규칙

#### 작성 원칙

- **"무엇을" 하는지가 아니라 "왜" 하는지를 적습니다.** 코드만 봐서 알 수 있는 건 주석 달지 않습니다.
- **처음 보는 사람을 생각하고 적습니다.** "이건 ~ 때문에 이렇게 했다"가 핵심.
- 한국어로 작성. 영어 섞지 않기.

#### 좋은 예 / 나쁜 예

```ts
// ❌ 나쁜 예: 코드만 봐도 아는 내용
// name 상태를 빈 문자열로 초기화
const [name, setName] = useState('');

// ✅ 좋은 예: 의도와 이유 설명
// 태블릿에서 가로 모드 진입 시 레이아웃이 깨지므로 세로 고정
Orientation.lockToPortrait();

// ✅ 좋은 예: 임시 코드 명시
// TODO: 디자인 확정 후 실제 색상으로 교체 (홍길동, 2026.06.01)
const TEMP_BG_COLOR = '#CCCCCC';
```

---

### 10. Git 컨벤션

#### 브랜치 전략

```
main       → 배포용 (PM만 머지)
develop    → 개발 통합 브랜치
feature/*  → 기능 개발 (예: feature/booth-list)
fix/*      → 버그 수정
refactor/* → 리팩토링
```

#### 커밋 메시지 (Conventional Commits)

```
<type>: <제목 (한국어, 명령형, 50자 이내)>

<본문 - 필요 시>
```

**type 종류**

| type       | 용도                                   |
| ---------- | -------------------------------------- |
| `feat`     | 새 기능 추가                           |
| `fix`      | 버그 수정                              |
| `style`    | 코드 포맷팅, 세미콜론 등 (기능 변화 X) |
| `refactor` | 리팩토링 (기능 변화 X)                 |
| `design`   | UI 변경                                |
| `docs`     | 문서 수정                              |
| `chore`    | 빌드 설정, 패키지 매니저 등            |

**예시**

```
feat: 부스 목록 화면 구현
fix: 태블릿에서 FlatList 스크롤 안 되는 문제 해결
docs: README에 환경 변수 설명 추가
```

#### PR 규칙

- **base 브랜치는 항상 `develop`.** `main`에 직접 PR 금지.
- 제목: 커밋 컨벤션과 동일한 형식
- 본문에 포함할 것:
  - 작업 내용 요약
  - 스크린샷 또는 화면 녹화 (UI 변경 시)
  - 테스트 방법
  - 관련 이슈 번호
- **리뷰어 1명 이상의 approve 후 머지.**
- 머지 방식: **Squash and merge**

---

### 11. 환경 변수 관리

- 환경 변수는 `.env` 파일에 두고, **절대 커밋하지 않습니다.** (`.gitignore`에 추가)
- `react-native-config`를 통해 접근합니다.
- `.env.example` 파일을 만들어 어떤 변수가 필요한지 알 수 있게 합니다.

```bash
# .env.example
API_BASE_URL=http://localhost:8080
```

**금지**: API 키, 비밀번호, 토큰을 코드에 하드코딩하지 않습니다.

---

### 12. 코드 품질 도구

#### ESLint

```js
// .eslintrc.js 주요 규칙
rules: {
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'prefer-const': 'error',
}
```

#### Prettier

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSameLine": true
}
```

#### 커밋 전 체크리스트

- [ ] `npm run lint` 통과
- [ ] `npm run format` 적용
- [ ] `console.log` 제거 (디버깅 후)
- [ ] 사용하지 않는 import 제거
- [ ] 주석 처리된 옛날 코드 제거

#### VSCode 확장 (권장)

- ESLint
- Prettier - Code formatter
- ES7+ React/Redux/React-Native snippets
- GitLens
- Tailwind CSS IntelliSense

---

### 13. 금지 사항 (Anti-patterns)

| 금지 패턴                                    | 대안                                            |
| -------------------------------------------- | ----------------------------------------------- |
| `any` 타입 사용                              | `unknown` 또는 명시적 타입                      |
| `StyleSheet.create` 사용                     | Tailwind `className` prop                       |
| 전체 스토어 구독                             | selector로 필요한 값만 구독                     |
| `useEffect` 의존성 배열 무시                 | eslint 경고 반드시 해결                         |
| 색상·문자열 하드코딩                         | `constants/` 또는 Tailwind 테마 활용            |
| `index.ts` 없는 폴더                         | 항상 barrel export 작성                         |
| 익명 default export                          | named + default export 병행                     |
| `font-bold` / `font-semibold` 등 기본 클래스 | `font-notoSansKRBold` 등 NotoSansKR 전용 클래스 |

---

## 💡 추가 팁

- 환경 설정은 [React Native 공식 문서](https://reactnative.dev/docs/set-up-your-environment)를 참고하세요.
- `npm run lint`로 코드 스타일을 점검하고, `npm run format`으로 자동 포맷팅하세요.
- 자주 사용하는 명령어는 `package.json`의 `scripts`에 정리되어 있습니다.
- NativeWind가 적용 안 될 때는 Metro 캐시를 초기화하세요: `npm start -- --reset-cache`

---

## ⚠️ 자주 발생하는 문제

- **Java 버전 충돌**: `JAVA_HOME`이 올바른지 확인하고, `java -version`으로 17인지 체크하세요.
- **종속성 설치 실패**: `node_modules`를 삭제 후 재설치(`rm -rf node_modules && npm install`)를 시도합니다.
- **NativeWind 스타일 미적용**: Metro 캐시 초기화 후 재시작하세요 (`npm start -- --reset-cache`).
- **폰트 미적용**: `npx react-native-asset` 실행 후 앱을 완전히 재빌드하세요 (`npm run android`).
- **Path Alias 인식 안 됨**: `babel.config.js`의 `module-resolver`와 `tsconfig.json`의 `paths`가 모두 설정되었는지 확인하세요.
- **Android 빌드 실패 (SDK 관련)**: Android Studio > SDK Manager에서 요구되는 SDK 버전이 설치되어 있는지 확인하세요.

---

**문의**: FE PM 김보성 BE PM 최예은

_Last Updated: 2026.06.01_
