# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Build & Development

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run android    # Start Android development
npm run ios        # Start iOS development
npm run web        # Start web development
```

### Code Quality & Testing

```bash
# Linting
npm run lint                              # Run ESLint on codebase
eslint . --ext .js,.jsx,.ts,.tsx         # Manual ESLint with extensions

# Formatting
npm run format                           # Format code with Prettier
prettier --write .                       # Manual Prettier formatting

# Testing
npm test                                 # Run Jest tests in watch mode
npm run test                            # Same as above
jest --watchAll                         # Manual Jest execution

# Translation validation
npm run validate:translations           # Validate translation consistency
node src/locales/validate-translations.js validate
node src/locales/validate-translations.js generate  # Generate missing translation keys
```

### Single Test Execution

```bash
# Run specific test file
jest path/to/test.test.ts

# Run tests matching pattern
jest --testNamePattern="specific test name"
```

## Architecture Overview

### Technology Stack

- **React Native (0.79.5)** with **Expo (53.0.22)** for cross-platform mobile development
- **TypeScript** for type safety and developer experience
- **Zustand** for client-side state management with persistence
- **TanStack Query (@tanstack/react-query)** for server state management and caching
- **React Navigation** for type-safe navigation
- **NativeWind** for Tailwind CSS styling in React Native
- **i18next** for internationalization (English/French)

### State Management Architecture

**Zustand Stores** (located in `src/stores/customerStores/`):

- `AppStore.ts` - Global app state (theme, onboarding, user type)
- `AuthStore.ts` - Authentication state and tokens
- `cartStore.ts` - Shopping cart management
- `addressStore.ts`, `paymentStore.ts`, `notificationStore.ts` - Feature-specific state

**TanStack Query** - Handles all server state with automatic caching, background refetching, and optimistic updates

### Navigation Architecture

**Hierarchical Navigation Structure**:

- `RootNavigator.tsx` - Main entry point, handles authentication flow
- `AuthNavigator.tsx` - Authentication screens (login, signup, OTP)
- `CustomerNavigator.tsx` - Customer app with bottom tabs
- `RestaurantNavigator.tsx` - Restaurant management interface

**Screen Organization**:

- Full-screen modals for checkout, search, and food details
- Nested stack navigators within tab screens
- Type-safe navigation with `RootStackParamList`

### Context Provider Architecture

**Optimized Provider Hierarchy** (`src/contexts/AppContextProvider.tsx`):

1. **CoreInfrastructureProviders** - Fundamental app infrastructure (SafeArea, GestureHandler, QueryClient, i18n)
2. **AppStateProviders** - Runtime state management (AppState, Performance, Language, Theme, Network)
3. **UIProviders** - UI-specific functionality (BottomSheet modals)

### Component Organization

**Component Structure**:

- `src/components/common/` - Reusable components across app
- `src/components/customer/` - Customer-specific components
- `src/components/auth/` - Authentication-related components
- `src/components/settings/` - Settings and profile components

**Screen Structure**:

- `src/screens/auth/` - Authentication flow screens
- `src/screens/customer/` - Customer app screens (home, cart, profile, orders)
- `src/screens/restaurant/` - Restaurant management screens (orders, menu, analytics)

### Internationalization (i18n)

**Translation System**:

- Supports English (`en`) and French (`fr`)
- Organized by namespaces: `translation`, `auth`, `generated`
- Translation files located in `src/locales/[language]/[namespace].json`
- Custom validation script ensures translation consistency
- Device language detection with fallback to English

### Service Layer Architecture

**API Services** (`src/services/`):

- `queryClient.ts` - Configured TanStack Query client
- `customer/` - Customer-specific API services and hooks
- HTTP client with automatic authentication interceptors
- Centralized error handling and retry logic

### Type System

**TypeScript Organization**:

- `src/types/` - Shared type definitions
- Navigation types in `src/navigation/types.ts`
- Store interfaces co-located with store implementations
- Strict typing for API responses and component props

## Key Development Guidelines

### State Management Best Practices

- Use Zustand for client-side state that persists (user preferences, cart, auth)
- Use TanStack Query for server state (API data, caching)
- Create performance-optimized selectors for store subscriptions
- Persist critical state using AsyncStorage middleware

### Styling Approach

- Use NativeWind (Tailwind) for consistent styling across platforms
- Theme system supports light/dark modes with system detection
- Platform-specific adjustments handled through conditional styling
- Component-based design system for reusability

### Performance Optimization

- Lazy loading for screens and heavy components
- Image optimization with expo-image
- List virtualization for large datasets (restaurants, menu items)
- Memoization of expensive computations and selectors

### Error Handling Strategy

- Global ErrorBoundary for React error catching
- Network error handling through TanStack Query
- Custom error display components with user-friendly messages
- Performance monitoring context for app lifecycle events

### Authentication Flow

- JWT-based authentication with secure token storage
- OTP verification for account confirmation
- Automatic token refresh handling
- Role-based access (customer/restaurant) with separate navigation flows

### Translation Management

- All user-facing text must be internationalized
- Use `useTranslation` hook for component translations
- Run `npm run validate:translations` before commits
- Translation keys should be descriptive and nested logically

## Important Development Notes

### Expo Configuration

- Uses Expo SDK 53 with new architecture enabled
- Custom development builds may be required for native features
- Location services configured for both iOS and Android
- Push notifications configured with custom sounds and icons

### Platform Considerations

- Cross-platform compatibility is required (iOS, Android, Web)
- Platform-specific code should be minimal and well-documented
- Use Expo modules when possible to maintain compatibility

### External Dependencies

- Expo Location integration for geocoding and location services
- Mobile money payment integration (MTN/Orange)
- Push notification services through Expo
- Backend API integration for business logic

### Code Quality Requirements

- Follow TypeScript strict mode guidelines
- Use ESLint and Prettier configurations provided
- Write meaningful commit messages and PR descriptions
- Maintain test coverage for critical business logic paths
