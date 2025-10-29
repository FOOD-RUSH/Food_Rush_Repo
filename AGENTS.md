# Repository Guidelines

## Project Structure & Module Organization

- Source code: src/
  - Navigation: src/navigation/ (RootNavigator.tsx, AuthNavigator.tsx, CustomerNavigator.tsx, RestaurantNavigator.tsx)
  - State (Zustand): src/stores/ (AppStore.ts, AuthStore.ts, customerStores/, restaurantStores/, shared/)
  - UI Components: src/components/ (common/, customer/, restaurant/, ErrorBoundary.tsx, ThemeProvider.tsx)
  - Screens: src/screens/ (auth/, common/, customer/, restaurant/)
  - Services: src/services/ (queryClient.ts, customer/, restaurant/, shared/)
  - Hooks & Utils: src/hooks/, src/utils/ (errorHandler.ts, i18n.ts, onboardingData.ts)
  - Internationalization: src/locales/ (en/, fr/, i18n.ts)
  - Contexts: src/contexts/ (AppContextProvider.tsx, NetworkContext.tsx, etc.)
- Assets: assets/ (fonts/, images/, sounds/)
- Entry point: App.tsx
- Configuration: app.json, babel.config.js, metro.config.js, tsconfig.json, eslint.config.js

## Build, Test, and Development Commands

```bash
# Install deps
npm install

# Start development (Expo)
npm start

# Run on devices
npm run android
npm run ios
npm run web

# Lint and format
npm run lint
npm run format

# Tests (Jest + jest-expo)
npm test
```

## Coding Style & Naming Conventions

- Indentation: 2 spaces
- File naming: PascalCase for React components/screens (e.g., UserTypeSelectionScreen.tsx), camelCase for utilities (e.g., errorHandler.ts)
- Functions/variables: camelCase, descriptive (e.g., handleOnboardingComplete, isAuthenticated)
- Imports: use path alias @/ pointing to project root (configured via tsconfig.json and metro.config.js)
- Linting/Formatting: ESLint (eslint.config.js with expo config), Prettier (.prettierrc)

## Testing Guidelines

- Framework: Jest with jest-expo preset (package.json: "jest": { "preset": "jest-expo" })
- Test files: colocated in __tests__/ or *.test.ts(x) (see src/utils/__tests__/)
- Running tests: npm test
- Coverage: No explicit threshold configured; focus on utils, stores, and critical flows

## Commit & Pull Request Guidelines

- Commit style: Prefer descriptive messages; conventional commits encouraged
  - Example from history: "Refactor environment variables, enhance error handling, and improve user feedback in LoginScreen"
- PR process: Ensure lint and tests pass; seek review from peers
- Branching: Use feature/<short-description>, fix/<issue>, chore/<task>

---

# Repository Tour

## 🎯 What This Repository Does

Food Rush is a React Native + Expo application that provides a dual-interface food delivery experience for customers and restaurants, featuring real-time orders, localization, and robust app state.

Key responsibilities:
- Customer ordering, checkout, and live order tracking
- Restaurant order management, menu, and analytics
- Notifications, localization (en/fr), and device/location integrations

---

## 🏗️ Architecture Overview

### System Context
```
[Customers/Restaurants] → [Food Rush (React Native + Expo)] → [Backend API]
                                          ↓
                               [Expo Services: Notifications, Location]
                                          ↓
                                   [Sentry Error Monitoring]
```

### Key Components
- Navigation layer: src/navigation/ (RootNavigator orchestrates Customer/Restaurant apps and Auth)
- State management: Zustand stores in src/stores/ (AppStore.ts, AuthStore.ts, customerStores/, restaurantStores/)
- Server state: TanStack Query client (src/services/queryClient.ts)
- UI & Screens: src/components/* and src/screens/* grouped by user type
- Internationalization: src/locales/ with i18next initialization (src/locales/i18n.ts)
- App shell: App.tsx (providers, Sentry init, splash handling, RootNavigator)

### Data Flow
1. App.tsx initializes Sentry, fonts, and splash handling; renders RootNavigator within providers.
2. RootNavigator computes initial route (Onboarding → UserTypeSelection → Auth → CustomerApp/RestaurantApp) using AppStore/AuthStore.
3. Screens interact with Zustand stores for client state and TanStack Query for server data via queryClient.
4. External services (notifications, location) configured in app.json; Sentry tags navigation state for observability.
5. Actions (e.g., login/logout) update stores; DeviceEventEmitter drives global transitions (e.g., logout reset).

---

## 📁 Project Structure [Partial Directory Tree]

```
./
├── App.tsx                      # App entry; providers, Sentry, splash, RootNavigator
├── app.json                     # Expo app configuration and plugins
├── src/
│   ├── navigation/              # Root/Auth/Customer/Restaurant navigators, linking, helpers
│   ├── stores/                  # Zustand stores (AppStore, AuthStore, customerStores, ...)
│   ├── components/              # Reusable UI (common/, customer/, restaurant/)
│   ├── screens/                 # Feature screens organized by domain and user type
│   ├── services/                # queryClient, api utilities, securityLogger, domains
│   ├── hooks/                   # Custom hooks (useAppLoading, useNotifications, ...)
│   ├── utils/                   # Helpers (errorHandler, onboardingData, responsive, ...)
│   ├── locales/                 # i18n setup and translations (en, fr)
│   └── contexts/                # React contexts (AppContextProvider, NetworkContext, ...)
├── assets/                      # Fonts, images, sounds
├── babel.config.js              # Expo + NativeWind + worklets
├── metro.config.js              # Metro + NativeWind + Sentry + alias
├── tsconfig.json                # Typescript config (paths alias "@/*")
├── eslint.config.js             # ESLint config (expo flat)
└── package.json                 # Scripts, dependencies, jest preset
```

### Key Files to Know

| File | Purpose | When You'd Touch It |
|------|---------|---------------------|
| App.tsx | App bootstrap, Sentry, splash, providers | Add global providers, tweak Sentry or splash logic |
| src/navigation/RootNavigator.tsx | Entry router deciding flows | Add new stacks/screens, adjust initial route logic |
| src/navigation/CustomerNavigator.tsx | Customer tabs and stacks | Add/modify customer tabs or order/profile flows |
| src/navigation/RestaurantNavigator.tsx | Restaurant tabs and stacks | Add/modify restaurant tabs or screens |
| src/stores/AppStore.ts | Onboarding, theme, user-type selection | Change onboarding/theme behavior or persistence |
| src/stores/AuthStore.ts | Auth state, tokens, logout events | Adjust auth model, token handling, logout flow |
| src/services/queryClient.ts | TanStack Query config | Tune caching/retry/offline policies |
| src/utils/errorHandler.ts | Production-safe error messages | Standardize API errors and messages |
| app.json | Expo config, permissions, plugins | Change icons, permissions, notifications, Sentry |
| metro.config.js | Bundler and alias setup | Add extensions, optimize production build |

---

## 🔧 Technology Stack

- Language: TypeScript (~5.9.2)
- Framework: React Native 0.81.4 with Expo 54.x (app.json, package.json)
- State: Zustand (^5.0.7) with AsyncStorage persistence
- Server State: @tanstack/react-query (^5.85.0)
- Navigation: React Navigation 7.x (native, stack, bottom tabs, material top tabs)
- Styling: NativeWind (^4.1.23); globals.css pipeline via metro/babel
- UI: React Native Paper (^5.14.5)
- Internationalization: i18next (^25.3.6) + react-i18next
- Monitoring: @sentry/react-native (~7.2.0) with Expo metro integration
- Notifications/Location: Expo modules (expo-notifications, expo-location)
- Testing: Jest (~29.7.0) with jest-expo (~54.0.12)

---

## 🌐 External Dependencies

- Backend API: Consumed via axios in services (endpoints not included here)
- Expo Services: Notifications, Location, Assets, Fonts (configured in app.json)
- Sentry: Error reporting and session replay (App.tsx init and metro integration)

### Environment Variables (from code/config)
- EXPO_PUBLIC_SENTRY_DSN (app.json plugin, App.tsx)
- EXPO_PUBLIC_ENVIRONMENT (App.tsx)

Note: .env, .env.local, .env.production exist in repo root. Do not commit secrets.

---

## 🔄 Common Workflows

- Onboarding → Select user type → Authenticate → Navigate to Customer/Restaurant tabs.
  Code path: App.tsx → src/stores/AppStore.ts + src/stores/AuthStore.ts → src/navigation/RootNavigator.tsx
- Logout flow emits a DeviceEventEmitter event that RootNavigator listens to and resets navigation.
- Error handling: use utils/errorHandler.ts to map API errors to user-friendly messages.
- Data fetching: use src/services/queryClient.ts and TanStack Query for caching/retries.

---

## 📈 Performance & Scale

- Metro optimizations in metro.config.js (production minifier, module ID hashing, exclude dev-only modules)
- React Query caching tuned for mobile; offline-first queries, limited retries
- NativeWind and lazy-loaded navigators/tabs to reduce initial work

---

## 🚨 Things to Be Careful About

- Security: Sentry DSN and environment via EXPO_PUBLIC_ variables; avoid leaking secrets in client
- Permissions: Location and notifications require runtime prompts; configured in app.json
- Persistence: Zustand stores persist to AsyncStorage; avoid storing sensitive PII unnecessarily
- Navigation resets on logout via DeviceEventEmitter; ensure listeners are cleaned up


Update to last commit: 014c317e194d7b7d83011a697f69ddff4e599fe6
