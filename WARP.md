# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Development
  - Start Expo dev server: `npm start`
  - Run on Android: `npm run android`
  - Run on iOS: `npm run ios`
  - Run on Web: `npm run web`
- Quality
  - Lint: `npm run lint`
  - Lint (auto-fix): `npm run lint -- --fix`
  - Format: `npm run format`
  - Typecheck: `npx tsc --noEmit`
- Tests (Jest via jest-expo)
  - Run all (watch mode): `npm test`
  - Run a single file: `npx jest path/to/test.test.tsx`
  - Run tests matching a name: `npx jest -t "regex or test name"`
- Builds
  - Development builds (native): `npm run android` / `npm run ios`
  - Production (EAS, if configured): `eas build --profile production --platform android|ios`

Notes

- Environment variables used at runtime:
  - `EXPO_PUBLIC_API_URL` (API base URL)
  - `EXPO_PUBLIC_SENTRY_DSN` (Sentry DSN)
- Push notifications: for Android on SDK 53+, use a development build instead of Expo Go to reliably test remote/background notifications.

## High-level architecture

- Entry point: `App.tsx`
  - Initializes i18n (`src/locales/i18n.ts`), Sentry (reads `EXPO_PUBLIC_SENTRY_DSN`), and a custom splash flow
  - Wraps the app with `AppContextProvider` and renders `RootNavigator`

- Navigation: `src/navigation/RootNavigator.tsx`
  - React Navigation with a root Stack that chooses between Onboarding, Auth, and the two main apps based on Zustand stores
  - Main flows:
    - `CustomerApp`: `src/navigation/CustomerNavigator.tsx` (bottom tabs + stacks)
    - `RestaurantApp`: `src/navigation/RestaurantNavigator.tsx` (bottom tabs + stacks)
  - Navigation helpers: `src/navigation/navigationRef.ts`, platform-specific options in `src/navigation/platformNavigation.tsx`

- State management: Zustand with persistence (AsyncStorage)
  - App state: `src/stores/AppStore.ts` (onboarding, theme, user type, hydration flags)
  - Auth: `src/stores/AuthStore.ts` (user profile, tokens via `TokenManager`, logout emits `DeviceEventEmitter` event `user-logout` consumed by `RootNavigator`)
  - Aggregated exports: `src/stores/index.ts`

- API layer and server state
  - HTTP client: `src/services/shared/apiClient.ts` (Axios instance)
    - Injects `Authorization` from `TokenManager` (`expo-secure-store`)
    - Handles 401 with refresh-token flow and centralizes error shaping via `getUserFriendlyErrorMessage`
    - Triggers app-wide logout on refresh failures
  - Token storage: `src/services/shared/tokenManager.ts`
  - TanStack Query client defaults: `src/services/shared/queryClient.ts` (retries, session-expired handling)
  - Domain services under `src/services/{customer|restaurant|shared}/`

- Internationalization
  - `src/locales/i18n.ts` sets up i18next namespaces (`translation`, `auth`, `generated`)
  - Language detection via `expo-localization` with persistence in AsyncStorage; resources in `src/locales/{en,fr}`

- UI/Theming/Styling
  - NativeWind (Tailwind) enabled via `babel.config.js` and `metro.config.js`
  - Theme helpers in `src/config/theme.ts`; shared UI in `src/components/common/`
  - Floating tab bar and platform-aware screen options handled in navigation layer

- Notifications
  - REST endpoints encapsulated in `src/services/shared/notificationApi.ts`
  - Expo Notifications configured in `app.json` plugin

- Build/bundler
  - `metro.config.js` integrates Sentry’s Expo config, NativeWind, alias `@` → `src`, and production minification (drops console)
  - `babel.config.js` uses `babel-preset-expo` + `nativewind/babel` and the worklets plugin

- Conventions and tooling
  - Imports can use `@/src/...` via Metro alias; prefer `@/src/...` over relative deep paths
  - Tests: Jest preset `jest-expo`; place tests as `*.test.ts(x)` (no tests present yet)
  - Copilot note (`.github/copilot-instructions.md`): Expo RN + TS; use ESLint/Prettier; keep cross-platform compatibility in mind

## When modifying code

- For navigation changes, update route types in `src/navigation/types.ts` and ensure `RootNavigator` initial-route logic still matches Auth/Zustand state
- For auth/logout flows, use `useAuthStore().logout()` which clears tokens and emits `user-logout` for navigation reset
- When adding services, wire through `apiClient` and use TanStack Query in screens/hooks for caching and retries
