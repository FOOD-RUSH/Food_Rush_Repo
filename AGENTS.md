# Repository Guidelines

## Project Structure & Module Organization

- src/ — Application source code
  - components/ — Reusable UI (auth/, common/, customer/, restaurant/)
  - screens/ — Screen components (auth/, customer/, restaurant/)
  - navigation/ — Navigation stacks, tab configs
  - services/ — API services and business logic
  - stores/ — Zustand stores and persistence
  - hooks/ — Custom React hooks
  - utils/ — Helpers and utilities
  - types/ — TypeScript types and declarations
  - locales/ — i18n setup and translations
  - contexts/ — React context providers
- assets/ — images, fonts, sounds
- docs/ — additional documentation
- scripts/ — build and utility scripts
- Configuration at root: app.json, babel.config.js, metro.config.js, tailwind.config.js, tsconfig.json, eslint.config.js

## Build, Test, and Development Commands

```bash
# Start Expo dev server
npm start

# Platform targets
npm run android
npm run ios
npm run web

# Tests (Jest / jest-expo)
npm test

# Linting and formatting
npm run lint
npm run format

# Clean caches and rebuild aids
npm run clean
npm run clean:metro
npm run clean:all

# EAS builds
npm run build:android:preview
npm run build:android:production
npm run build:ios:preview
npm run build:ios:production
```

## Coding Style & Naming Conventions

- Indentation: 2 spaces
- File naming: kebab-case for configs (babel.config.js), PascalCase for components (e.g., src/components/common/Avatar.tsx), camelCase for utilities (e.g., src/utils/errorHandler.ts)
- Function/variable naming: camelCase; React components use PascalCase
- Linting/formatting: ESLint (eslint.config.js with eslint-config-expo), Prettier (.prettierrc); run via npm run lint and npm run format
- TypeScript: Strict typing; prefer explicit interfaces in src/types/

## Testing Guidelines

- Framework: Jest with jest-expo preset
- Test files: co-locate or under a __tests__ folder; use *.test.ts(x) naming (verify locally when adding tests)
- Running tests: npm test
- Coverage: Not enforced in repo; use --coverage locally if needed

## Commit & Pull Request Guidelines

- Commit format: Prefer Conventional Commits (e.g., feat: add cart persistence; fix(auth): handle token refresh). Follow examples in README’s contributing section
- PR process: Ensure lint passes, tests run locally, and code reviewed before merge
- Branch naming: feature/<short-name>, fix/<short-name>, chore/<short-name>

---

# Repository Tour

## 🎯 What This Repository Does

Food Rush is a React Native and Expo-based mobile application for food delivery, enabling customers to order from restaurants and restaurants to manage orders and menus.

Key responsibilities:
- Customer ordering, tracking, and notifications
- Restaurant management (menus, orders, analytics)
- Localization, theming, and secure client-side state

---

## 🏗️ Architecture Overview

React Native app built with Expo SDK 54 and TypeScript. UI organized as components and screens, navigation via React Navigation. Client state via Zustand; server state via TanStack Query. Native capabilities through Expo modules (location, notifications, secure store). Bundled by Metro.

### System Context
```
[User (Mobile/Web)] → [Food Rush App (Expo RN)] → [Backend API]
                               ↓
                      [Push/Location Services]
```

### Key Components
- Navigation (src/navigation/) — Stacks/tabs and deep links
- UI Components (src/components/) — Reusable building blocks for screens
- Services (src/services/) — API clients (auth, orders, menu, payments, etc.)
- Stores (src/stores/) — Zustand stores with AsyncStorage persistence
- Localization (src/locales/) — i18next config and translations
- Theming/Design (src/config/) — theme, fonts, colors; NativeWind setup
- Location module (src/location/) — Expo Location service + hooks and store

### Data Flow
1. User interacts with a screen (src/screens/...)
2. Screen calls a service (src/services/...) or TanStack Query hook
3. Data cached in Query/stores; sensitive tokens in SecureStore
4. UI renders components and triggers notifications as needed

---

## 📁 Project Structure [Partial Directory Tree]

```
Food_Rush_Repo/
├── assets/
│   ├── fonts/
│   ├── images/
│   └── sounds/
├── src/
│   ├── components/
│   ├── config/
│   ├── locales/
│   ├── location/
│   ├── services/
│   ├── stores/
│   ├── screens/
│   ├── types/
│   ├── utils/
│   └── hooks/
├── app.json
├── package.json
├── README.md
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
└── eslint.config.js
```

### Key Files to Know

- package.json — scripts, dependencies, jest preset
- app.json — Expo app configuration (plugins, extra, project ID)
- src/locales/i18n.ts — i18next configuration
- src/location/LocationService.ts — Location permissions, geocoding, helpers
- src/config/theme.ts and src/config/restaurantTheme.ts — Theming and palettes
- src/components/common/icons/index.ts — Vector icon exports via @expo/vector-icons
- README.md — End-to-end setup, commands, and architecture notes

---

## 🔧 Technology Stack

- Language: TypeScript ~5.9
- Framework: React Native 0.81 with Expo 54
- State: Zustand 5 (client) + TanStack Query 5 (server cache)
- UI: React Native Paper; NativeWind (Tailwind) for utilities
- Navigation: React Navigation 7
- Native Capabilities: Expo modules (location, notifications, secure-store, etc.)
- Testing: Jest ~29 with jest-expo preset
- Tooling: ESLint 9 + eslint-config-expo; Prettier 3; Babel 7; Metro bundler; EAS for builds

---

## 🌐 External Dependencies

- Backend API — All domain data (auth, restaurants, orders, payments)
- Expo Services — Notifications, build (EAS), device APIs

### Environment Variables

- API_BASE_URL — Backend base URL (see README examples)
- EXPO_PROJECT_ID — EAS project identifier
- MAPBOX_ACCESS_TOKEN — Maps provider token (referenced in README)
- SENTRY_DSN — Error reporting DSN

---

## 🔄 Common Workflows

- Start development: npm install && npm start
- Run on device/simulator: npm run android | npm run ios
- Add a screen: create in src/screens/... and register in navigation
- Add a service: add in src/services/... and expose hooks via TanStack Query
- Add translations: update files in src/locales/ and LANGUAGES in i18n.ts
- Use location: import LocationService/useLocation from src/location/

Code path example: Screen → service (axios/Query) → render components → store updates

---

## 📈 Performance & Scale

- Use TanStack Query staleTime/cacheTime to avoid redundant requests
- Prefer FlatList/SectionList for large lists; memoize heavy components
- Image optimization via expo-image and compressed assets

### Monitoring
- Optional Sentry via @sentry/react-native (DSN via env)

---

## 🚨 Things to Be Careful About

### Security Considerations
- Store tokens securely (expo-secure-store)
- Sanitize error messages in production (see utils/errorHandler in README example)
- Manage notification permissions carefully; follow Expo notifications guidance
- Location permissions: request/handle foreground vs. background appropriately


Updated at: 2025-11-14
