# Repository Guidelines

## Project Structure & Module Organization

Food Rush is organized as a React Native Expo app with TypeScript. Source code is located in `src/` with clear separation between customer and restaurant features. Components are organized by user type (`src/components/customer/`, `src/components/restaurant/`) and shared components in `src/components/common/`. Screens follow the same pattern in `src/screens/`. State management uses Zustand stores in `src/stores/` with separate stores for customer and restaurant features. Assets including images, fonts, and sounds are in the `assets/` directory.

## Build, Test, and Development Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run android          # Android emulator/device
npm run ios             # iOS simulator/device
npm run web             # Web browser

# Code quality and testing
npm run lint            # ESLint with Expo config
npm run format          # Prettier formatting
npm test               # Jest tests with watch mode

# Bundle analysis and optimization
npm run bundle:size     # Analyze and monitor bundle size
npm run deps:analyze    # Check for unused dependencies

# Production builds
npm run production:build:android  # Android production build
npm run production:build:ios      # iOS production build
```

## Coding Style & Naming Conventions

- **Indentation**: 2 spaces, no tabs
- **File naming**: PascalCase for components (`UserTypeSelectionScreen.tsx`), camelCase for utilities (`errorHandler.ts`)
- **Function/variable naming**: camelCase with descriptive names (`handleOnboardingComplete`, `isAuthenticated`)
- **Linting**: ESLint with Expo configuration and Prettier integration
- **Styling**: NativeWind (Tailwind CSS for React Native) with utility classes

## Testing Guidelines

- **Framework**: Jest with React Native Testing Library
- **Test files**: `*.test.ts`, `*.test.tsx` or `__tests__/` directories
- **Running tests**: `npm test` for watch mode
- **Coverage**: Tests focus on utility functions and business logic

## Commit & Pull Request Guidelines

- **Commit format**: Conventional commits with type prefixes (`feat:`, `fix:`, `refactor:`)
- **Examples from repo**: `feat: Complete notification system consolidation and cleanup`, `fix: Resolve type errors and remove duplicate notification setup`
- **PR process**: Code review required, ESLint and Prettier checks must pass
- **Branch naming**: Feature branches with descriptive names

---

## Repository Tour

## 🎯 What This Repository Does

Food Rush is a comprehensive React Native food delivery application that connects customers with restaurants for seamless food ordering and delivery services, featuring dual user interfaces, real-time order tracking, and multi-language support.

**Key responsibilities:**

- Customer food ordering and delivery tracking
- Restaurant order management and menu administration
- Real-time notifications and location services

---

## 🏗️ Architecture Overview

### System Context

```text
[Customers] → [Food Rush App] → [Backend API]
                    ↓
[Restaurants] → [Restaurant Interface] → [Order Management]
                    ↓
              [Push Notifications] ← [External Services]
```

### Key Components

- **Dual Navigation System** - Separate customer and restaurant app flows with React Navigation
- **State Management** - Zustand stores with AsyncStorage persistence for offline support
- **Real-time Features** - TanStack Query for server state with push notifications via Expo
- **Location Services** - GPS integration with Expo Location for delivery tracking
- **Internationalization** - i18next with English and French support

### Data Flow

1. User selects customer or restaurant mode during onboarding
2. Authentication flow determines user type and permissions
3. Type-specific navigation and state management activated
4. API calls managed through TanStack Query with error handling
5. Real-time updates via push notifications and query invalidation

---

## 📁 Project Structure [Partial Directory Tree]

```text
food-rush/
├── src/                           # Main application source code
│   ├── components/                # Reusable UI components
│   │   ├── auth/                 # Authentication components
│   │   ├── common/               # Shared components (buttons, forms, etc.)
│   │   ├── customer/             # Customer-specific components
│   │   └── restaurant/           # Restaurant-specific components
│   ├── screens/                  # Screen components organized by user type
│   │   ├── auth/                 # Login, signup, OTP verification
│   │   ├── customer/             # Customer app screens
│   │   └── restaurant/           # Restaurant management screens
│   ├── navigation/               # Navigation configuration and types
│   ├── stores/                   # Zustand state management
│   │   ├── customerStores/       # Customer-specific stores
│   │   ├── restaurantStores/     # Restaurant-specific stores
│   │   └── shared/               # Shared stores
│   ├── services/                 # API services and business logic
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions and helpers
│   ├── types/                    # TypeScript type definitions
│   ├── locales/                  # Internationalization files
│   └── contexts/                 # React context providers
├── assets/                       # Static assets
│   ├── fonts/                    # Custom fonts (Urbanist family)
│   ├── images/                   # App images and illustrations
│   └── sounds/                   # Notification sounds
├── scripts/                      # Build and utility scripts
└── docs/                         # Documentation
```

### Key Files to Know

| File                               | Purpose                                | When You'd Touch It                        |
| ---------------------------------- | -------------------------------------- | ------------------------------------------ |
| `App.tsx`                          | Application entry point with providers | Adding global providers or app-level logic |
| `src/navigation/RootNavigator.tsx` | Main navigation configuration          | Adding new screens or navigation flows     |
| `src/stores/index.ts`              | Store exports and organization         | Adding new stores or state management      |
| `package.json`                     | Dependencies and scripts               | Adding libraries or build commands         |
| `app.json`                         | Expo configuration                     | Changing app metadata or permissions       |
| `src/config/theme.ts`              | Theme and styling configuration        | Updating colors or design tokens           |
| `src/locales/i18n.ts`              | Internationalization setup             | Adding new languages or translation logic  |
| `src/services/shared/apiClient.ts` | API client configuration               | Modifying API endpoints or authentication  |
| `babel.config.js`                  | Babel and NativeWind configuration     | Changing build optimizations               |
| `metro.config.js`                  | Metro bundler configuration            | Bundle optimization and asset handling     |

---

## 🔧 Technology Stack

### Core Technologies

- **Language:** TypeScript 5.9.2 - Strict type safety with comprehensive type definitions
- **Framework:** React Native 0.81.4 with Expo 54.0.8 - Cross-platform mobile development
- **State Management:** Zustand 5.0.7 - Lightweight state management with persistence
- **Server State:** TanStack Query 5.85.0 - Data fetching, caching, and synchronization

### Key Libraries

- **Navigation:** React Navigation 7.x - Type-safe navigation with stack, tab, and modal support
- **Styling:** NativeWind 4.1.23 - Tailwind CSS utilities for React Native
- **UI Components:** React Native Paper 5.14.5 - Material Design components
- **Forms:** React Hook Form 7.61.1 with Yup validation - Type-safe form management
- **Internationalization:** i18next 25.3.6 with React Native integration
- **Animations:** React Native Reanimated 4.1.0 - High-performance animations

### Development Tools

- **Testing:** Jest with React Native Testing Library - Unit and integration testing
- **Linting:** ESLint with Expo configuration and Prettier - Code quality and formatting
- **Build:** EAS Build - Cloud-based builds for iOS and Android
- **Bundle Analysis:** Custom scripts for monitoring bundle size and dependencies

---

## 🌐 External Dependencies

### Required Services

- **Backend API** - RESTful API for user management, orders, and restaurant data
- **Push Notifications** - Expo Push Notifications for real-time order updates
- **Location Services** - Expo Location for GPS tracking and delivery routing

### Optional Integrations

- **Image Storage** - AsyncStorage with optimization for menu item photos
- **Analytics** - Custom analytics utilities for restaurant performance tracking
- **Error Tracking** - Production-safe error handling with user-friendly messages

### Environment Variables

```bash
# Required
API_BASE_URL=              # Backend API endpoint
EXPO_PROJECT_ID=           # Expo project identifier

# Optional
MAPBOX_ACCESS_TOKEN=       # For enhanced mapping features
SENTRY_DSN=               # Error tracking (if implemented)
```

---

## 🔄 Common Workflows

### Customer Order Flow

1. Browse restaurants and menu items on home screen
2. Add items to cart with special instructions and quantity
3. Proceed to checkout with address and payment selection
4. Place order and receive real-time tracking updates
5. Rate and review restaurant after delivery completion

**Code path:** `HomeScreen` → `CartStore` → `CheckOutScreen` → `OrdersAPI` → `OrderTrackingScreen`

### Restaurant Order Management

1. Receive new order notifications via push notifications
2. View order details and customer information
3. Accept or reject orders with optional reason
4. Update order status through preparation and delivery
5. Track analytics and customer reviews

**Code path:** `OrdersList` → `OrderDetailsScreen` → `RestaurantOrderAPI` → `AnalyticsOverview`

---

## 📈 Performance & Scale

### Performance Considerations

- **Bundle Optimization:** Metro configuration with production minification and tree shaking
- **Image Optimization:** Automatic image compression and caching with AsyncStorage
- **State Management:** Selective store subscriptions to minimize re-renders
- **Navigation:** Lazy loading of screens and components where appropriate

### Monitoring

- **Bundle Size:** Automated scripts track bundle size and warn on increases
- **Dependencies:** Regular analysis of unused dependencies with depcheck
- **Error Handling:** Production-safe error messages with development logging

---

## 🚨 Things to Be Careful About

### 🔒 Security Considerations

- **Error Handling:** Production builds sanitize error messages to prevent information disclosure
- **Authentication:** JWT tokens with automatic refresh and secure storage via Expo SecureStore
- **Data Validation:** Client and server-side validation with Yup schemas
- **API Security:** HTTPS-only communication with proper error handling

### Development Considerations

- **State Persistence:** Zustand stores automatically persist to AsyncStorage - be mindful of sensitive data
- **Navigation Types:** Strict TypeScript navigation types prevent runtime navigation errors
- **Bundle Size:** Monitor bundle size with provided scripts - large increases affect app performance
- **Platform Differences:** Test on both iOS and Android as some features have platform-specific behavior

_Updated at: 2025-01-27 15:30:00 UTC_
