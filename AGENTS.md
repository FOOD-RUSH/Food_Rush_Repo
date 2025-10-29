# Repository Guidelines

## Project Structure & Module Organization

- App entry: App.tsx initializes Sentry, splash control, providers, and RootNavigator.
- Source code: src/
  - components/ common UI, auth/, customer/, restaurant/, and shared subpackages
  - navigation/ RootNavigator and types
  - services/ API clients (services/shared/), restaurant-specific APIs, socket, query client
  - stores/ Zustand stores (customerStores/, restaurantStores/, shared/)
  - hooks/ custom hooks (e.g., useAppLoading, useResponsive)
  - config/ theme, fonts, restaurantTheme
  - locales/ i18n resources and setup (src/locales/i18n)
  - types/ TypeScript types and ambient declarations
  - contexts/ React context providers
- Assets: assets/fonts, assets/images, assets/sounds
- Configs: app.json, tsconfig.json, eslint.config.js, babel.config.js, metro.config.js, tailwind.config.js

## Build, Test, and Development Commands

```bash
# Start Expo dev server (QR code, web tools)
npm start

# Run on platforms (requires dev build or platform tooling)
npm run android
npm run ios
npm run web

# Quality
npm run lint         # ESLint (Expo config)
npm run format       # Prettier
npm test             # Jest (watchAll)
```

## Coding Style & Naming Conventions

- Indentation: 2 spaces
- File naming: PascalCase for React components (e.g., src/components/customer/ClassicFoodCard.tsx), camelCase for utilities (src/utils/errorHandler.ts)
- Functions/variables: camelCase, descriptive (e.g., useAppLoading, generateTimestampId)
- Imports: baseUrl with path alias @/* from tsconfig.json
- Linting/formatting: ESLint (eslint.config.js with eslint-config-expo) and Prettier (.prettierrc)
- Styling: NativeWind utility classes in JSX; design tokens in src/config/theme.ts

## Testing Guidelines

- Framework: Jest with jest-expo preset (package.json → "jest": { "preset": "jest-expo" })
- Test files: Prefer *.test.ts(x) colocated or under __tests__/ when present
- Run tests: npm test
- Coverage: No explicit threshold configured in repo

## Commit & Pull Request Guidelines

- Commit style: Conventional commits recommended by existing history and docs (e.g., feat:, fix:, refactor:)
- PR process: Ensure ESLint and Prettier pass; include platform test notes when changing native modules or app.json
- Branch naming: feature/<short-desc>, fix/<short-desc> suggested; keep consistent and scoped

---

# Repository Tour

## 🎯 What This Repository Does

Food Rush is a React Native (Expo) mobile application that enables customers to order food and restaurants to manage menus and orders with real-time updates and localization.

**Key responsibilities:**
- Customer ordering, cart, checkout, and order tracking
- Restaurant menu and order management with analytics
- Notifications, location services, and internationalization

---

## 🏗️ Architecture Overview

### System Context
```
[Customer/Restaurant User] → [Food Rush App (React Native + Expo)] → [Backend API]
                                         ↓
                                    [Push Notifications]
                                         ↓
                                     [Socket.io]
```

### Key Components
- App bootstrap (App.tsx): initializes Sentry, splash handling, global providers
- Navigation (src/navigation/RootNavigator): routes for customer and restaurant flows
- State Management: Zustand stores under src/stores with AsyncStorage persistence
- Data layer: TanStack Query client (src/services/shared/queryClient.ts) and API modules under src/services/
- Realtime: Socket.io client (src/services/shared/socket.ts)
- Theming/i18n: src/config/theme.ts, src/locales/i18n

### Data Flow
1. App.tsx loads fonts, sets up Sentry, and renders providers and RootNavigator
2. Screens dispatch actions to Zustand stores and trigger service calls
3. API calls via services/shared/apiClient and React Query for caching
4. Realtime updates via socket service; queries invalidated as needed
5. UI updated by subscribed components using store selectors

---

## 📁 Project Structure [Partial Directory Tree]

```
./
├── App.tsx
├── app.json
├── babel.config.js
├── eslint.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
├── assets/
│   ├── fonts/
│   ├── images/
│   └── sounds/
└── src/
    ├── components/
    │   ├── common/              # Shared UI (Typography, Buttons, Modals, BottomSheet, etc.)
    │   ├── auth/
    │   ├── customer/
    │   └── restaurant/
    ├── config/                  # theme.ts, restaurantTheme.ts, fonts.ts
    ├── contexts/                # AppContextProvider and related providers
    ├── hooks/                   # useAppLoading, useResponsive, etc.
    ├── locales/                 # i18n setup and translations
    ├── navigation/              # RootNavigator and types
    ├── services/
    │   ├── restaurant/          # authApi.ts, orderApi.ts, menuApi.ts
    │   └── shared/              # apiClient.ts, queryClient.ts, socket.ts, tokenManager
    ├── stores/                  # Zustand stores (customerStores/, restaurantStores/, shared/)
    ├── types/                   # Global TS types and ambient decls
    └── location/                # LocationService, hooks, store, types
```

### Key Files to Know

| File | Purpose | When You'd Touch It |
|------|---------|---------------------|
| App.tsx | App entry; Sentry, splash, providers, navigator | Add providers, global error handling, boot flow |
| src/navigation/RootNavigator.tsx | Main navigation graph | Add/modify screens or flows |
| src/services/shared/apiClient.ts | Axios instance, API error types | Update base URL, headers, interceptors |
| src/services/shared/queryClient.ts | React Query client config | Tune caching/retry defaults |
| src/services/shared/socket.ts | Socket.io client singleton | Auth headers, event channels |
| src/config/theme.ts | Theming and Paper integration | Colors, typography, dark/light rules |
| src/locales/i18n.ts | i18next setup | Add languages/namespaces |
| app.json | Expo app config, permissions, plugins | Change app name, icons, permissions |
| eslint.config.js | Lint rules | Adjust rules or ignores |
| tsconfig.json | Path aliases, TS compiler options | Add paths or strictness |

---

## 🔧 Technology Stack

### Core Technologies
- Language: TypeScript (~5.9.2)
- Framework: React Native 0.81.4 with Expo 54.x
- State: Zustand (^5.0.7) with AsyncStorage persistence
- Server State: TanStack React Query (^5.85.0)
- Navigation: React Navigation 7.x
- Styling: NativeWind (^4.1.23) and React Native Paper (^5.14.5)

### Key Libraries
- Networking: axios (^1.11.0)
- Telemetry: @sentry/react-native (~7.2.0)
- Realtime: socket.io-client (^4.8.1)
- Notifications/Location: expo-notifications, expo-location
- Media/Assets: expo-asset, expo-font, expo-image

### Development Tools
- Testing: Jest with jest-expo preset
- Linting/Formatting: ESLint (eslint-config-expo) and Prettier
- Bundler: Metro (metro.config.js), Babel (babel.config.js)

---

## 🌐 External Dependencies

- Backend REST API: Consumed via services/shared/apiClient.ts (base URL provided via environment)
- Expo Push Notifications: Configured in app.json → plugins["expo-notifications"]
- Sentry: DSN via EXPO_PUBLIC_SENTRY_DSN; initialized in App.tsx
- Socket.io server: URL and auth handled in services/shared/socket.ts

### Environment Variables (from app.json and code)

```bash
EXPO_PUBLIC_SENTRY_DSN=   # Sentry DSN used by App.tsx and plugin
EXPO_PUBLIC_ENVIRONMENT=  # Sentry environment (default: production)
API_BASE_URL=             # Used by API client (see README/env examples)
```

---

## 🔄 Common Workflows

- Add a new screen: create component under src/screens/... and register it in src/navigation/RootNavigator.tsx; wire data via services and stores.
- Add a new API module: create under src/services/{domain}/..., export from index.ts, consume in screens; update types under src/types/ if needed.
- Add localization: extend src/locales/<lang>/ JSONs and update src/locales/i18n.ts.

---

## 📈 Performance & Scale

- React Query caching tuned in queryClient for retry/stale times
- UI performance with react-native-reanimated and memoized components
- Asset bundling patterns in app.json to reduce app size

---

## 🚨 Things to Be Careful About

### Security Considerations
- Sentry initialization is wrapped in try/catch to avoid startup crashes (App.tsx)
- Production-safe error handling patterns in components and services
- Persisted stores: avoid storing secrets in AsyncStorage

### Platform Permissions
- app.json configures location and notification permissions; test both Android and iOS


*Updated at: 2025-10-25*
