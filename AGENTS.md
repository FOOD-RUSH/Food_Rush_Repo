# Repository Guidelines

## Project Structure & Module Organization

Food Rush is organized into a modular React Native architecture with clear separation of concerns:

- **src/components/** - Reusable UI components organized by feature (auth, customer, common, settings)
- **src/screens/** - Screen components separated by user type (auth, customer, restaurant)
- **src/services/** - API services and business logic with TanStack Query integration
- **src/stores/** - Zustand state management stores with persistence
- **src/navigation/** - Type-safe React Navigation configuration
- **src/types/** - TypeScript type definitions and interfaces
- **src/utils/** - Utility functions for validation, formatting, and helpers
- **src/hooks/** - Custom React hooks for business logic
- **src/locales/** - i18next internationalization files (English/French)
- **assets/** - Images, fonts, and static resources

## Build, Test, and Development Commands

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

# Code quality
npm run lint       # Run ESLint
npm run format     # Format with Prettier

# Testing
npm test           # Run Jest tests in watch mode

# Translation validation
npm run validate:translations  # Validate translation consistency
```

## Coding Style & Naming Conventions

- **Indentation**: 2 spaces (configured in .prettierrc)
- **File naming**: PascalCase for components/screens, camelCase for utilities
- **Function/variable naming**: camelCase with descriptive names
- **Component naming**: PascalCase with feature prefixes (e.g., CustomerHomeScreen)
- **Linting**: ESLint with Expo config and TypeScript rules
- **Formatting**: Prettier with single quotes, trailing commas, 80 char width

## Testing Guidelines

- **Framework**: Jest with jest-expo preset
- **Test files**: Co-located with components using `.test.ts/.test.tsx` suffix
- **Running tests**: `npm test` for watch mode
- **Coverage**: Focus on business logic, hooks, and critical user flows

## Commit & Pull Request Guidelines

- **Commit format**: Descriptive messages with feature context (e.g., "Updated setup", "API integrations for authentication calls")
- **PR process**: Code review required, ensure linting and tests pass
- **Branch naming**: Feature-based branches (e.g., restaurant-screen, authentication-flow)

---

# Repository Tour

## 🎯 What This Repository Does

Food Rush is a comprehensive React Native food delivery mobile application that connects customers with restaurants for seamless food ordering and delivery services.

**Key responsibilities:**

- Customer food ordering and delivery tracking
- Restaurant menu management and order processing
- Real-time order status updates and notifications
- Multi-language support (English/French) with location-based services

---

## 🏗️ Architecture Overview

### System Context

```
[Customer Mobile App] → [Food Rush Backend API] → [Restaurant Dashboard]
                              ↓
                        [Payment Services]
                              ↓
                        [Notification Services]
```

### Key Components

- **Authentication System** - JWT-based auth with OTP verification for both customers and restaurants
- **Navigation System** - Type-safe React Navigation with role-based routing (customer/restaurant flows)
- **State Management** - Zustand stores for client state, TanStack Query for server state with caching
- **UI System** - NativeWind (Tailwind CSS) with React Native Paper components and custom theme system
- **Internationalization** - i18next with English/French support and device language detection
- **Notification System** - Expo notifications with cart reminders and order updates

### Data Flow

1. **User Authentication** - Login/signup with OTP verification, JWT token storage
2. **App Initialization** - Hydrate stores, check auth state, determine user type (customer/restaurant)
3. **Navigation Setup** - Route to appropriate app flow based on authentication and user type
4. **Data Fetching** - TanStack Query handles API calls with automatic caching and background updates
5. **State Updates** - Zustand stores manage local state with AsyncStorage persistence

---

## 📁 Project Structure [Partial Directory Tree]

```
food-rush/
├── src/                           # Main application source code
│   ├── components/                # Reusable UI components
│   │   ├── auth/                  # Authentication-specific components
│   │   ├── common/                # Shared components (LoadingScreen, ErrorBoundary)
│   │   ├── customer/              # Customer-specific components
│   │   └── settings/              # Settings and profile components
│   ├── screens/                   # Screen components organized by user type
│   │   ├── auth/                  # Login, signup, OTP, password reset
│   │   ├── customer/              # Customer app screens (home, cart, profile, orders)
│   │   └── restaurant/            # Restaurant management (orders, menu, analytics)
│   ├── navigation/                # React Navigation configuration
│   │   ├── RootNavigator.tsx      # Main navigation entry point
│   │   ├── AuthNavigator.tsx      # Authentication flow navigation
│   │   ├── CustomerNavigator.tsx  # Customer app navigation with tabs
│   │   └── types.ts               # Navigation type definitions
│   ├── stores/                    # Zustand state management
│   │   └── customerStores/        # Customer-specific stores
│   ├── services/                  # API services and business logic
│   │   ├── queryClient.ts         # TanStack Query configuration
│   │   └── customer/              # Customer-specific API services
│   ├── hooks/                     # Custom React hooks
│   ├── types/                     # TypeScript type definitions
│   ├── utils/                     # Utility functions and helpers
│   ├── locales/                   # Internationalization files
│   │   ├── en/                    # English translations
│   │   └── fr/                    # French translations
│   └── contexts/                  # React context providers
├── assets/                        # Static assets (images, fonts)
│   ├── images/                    # App images and illustrations
│   └── fonts/                     # Custom fonts
├── App.tsx                        # Main app entry point
├── app.json                       # Expo configuration
├── package.json                   # Dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

### Key Files to Know

| File                                    | Purpose                                | When You'd Touch It                       |
| --------------------------------------- | -------------------------------------- | ----------------------------------------- |
| `App.tsx`                               | Application entry point with providers | Adding global providers or initialization |
| `src/navigation/RootNavigator.tsx`      | Main navigation logic and routing      | Adding new screens or navigation flows    |
| `src/contexts/AppContextProvider.tsx`   | Context provider hierarchy             | Adding new global contexts                |
| `package.json`                          | Dependencies and build scripts         | Adding new libraries or scripts           |
| `app.json`                              | Expo configuration and permissions     | Configuring app metadata or permissions   |
| `src/stores/customerStores/AppStore.ts` | Global app state management            | Managing theme, onboarding, user type     |
| `src/services/queryClient.ts`           | API client configuration               | Configuring API behavior and caching      |
| `src/types/index.ts`                    | Core type definitions                  | Adding new data types or interfaces       |
| `src/locales/en/translation.json`       | English translations                   | Adding new translatable text              |
| `tailwind.config.js`                    | Styling configuration                  | Customizing design system                 |

---

## 🔧 Technology Stack

### Core Technologies

- **Language:** TypeScript (5.8.3) - Provides type safety and enhanced developer experience
- **Framework:** React Native (0.79.5) with Expo (53.0.22) - Cross-platform mobile development
- **State Management:** Zustand (5.0.7) - Lightweight state management with persistence
- **Server State:** TanStack Query (5.85.0) - Data fetching, caching, and synchronization

### Key Libraries

- **React Navigation (7.x)** - Type-safe navigation with stack and tab navigators
- **NativeWind (4.1.23)** - Tailwind CSS for React Native styling
- **React Native Paper (5.14.5)** - Material Design components for consistent UI
- **i18next (25.3.6)** - Internationalization with React Native integration
- **React Hook Form (7.61.1)** - Form management with Yup validation
- **Expo Modules** - Location services, notifications, image picker, secure storage

### Development Tools

- **ESLint** - Code linting with Expo and TypeScript configurations
- **Prettier** - Code formatting with consistent style rules
- **Jest** - Testing framework with Expo preset
- **Babel** - JavaScript compilation with React Native and NativeWind presets
- **Metro** - React Native bundler with NativeWind integration

---

## 🌐 External Dependencies

### Required Services

- **Backend API** - RESTful API for user management, orders, restaurants, and payments
- **Push Notification Service** - Expo push notifications for order updates and cart reminders
- **Location Services** - Expo Location for geocoding and restaurant proximity

### Optional Integrations

- **Payment Gateways** - MTN Mobile Money and Orange Money for payment processing
- **Image Storage** - Cloud storage for restaurant and food images
- **Analytics Service** - App usage and performance tracking

### Environment Variables

```bash
# Required
API_BASE_URL=          # Backend API base URL
EXPO_PROJECT_ID=       # Expo project ID for notifications

# Optional
SENTRY_DSN=           # Error tracking (if configured)
ANALYTICS_KEY=        # Analytics service key (if configured)
```

---

## 🔄 Common Workflows

### Customer Food Ordering Flow

1. **Browse Restaurants** - View nearby restaurants with ratings and delivery info
2. **Select Restaurant** - Browse menu items with categories and search functionality
3. **Add to Cart** - Select items with quantities and special instructions
4. **Checkout Process** - Review order, select payment method, confirm delivery address
5. **Order Tracking** - Real-time status updates from preparation to delivery

**Code path:** `HomeScreen` → `RestaurantDetailScreen` → `FoodDetailsScreen` → `CartScreen` → `CheckOutScreen` → `OrderTrackingScreen`

### Restaurant Order Management Flow

1. **Receive Orders** - Real-time order notifications with order details
2. **Order Processing** - Accept/reject orders, update preparation status
3. **Menu Management** - Add/edit menu items, categories, and availability
4. **Analytics Dashboard** - View sales data, popular items, and performance metrics

**Code path:** `OrderScreen` → `OrderDetailsScreen` → `MenuScreen` → `AnalyticsScreen`

---

## 📈 Performance & Scale

### Performance Considerations

- **State Management** - Zustand with optimized selectors to prevent unnecessary re-renders
- **Image Optimization** - Expo Image with caching and lazy loading for restaurant/food images
- **List Virtualization** - FlatList with performance optimizations for large restaurant/menu lists
- **Bundle Optimization** - Metro bundler with tree shaking and code splitting

### Monitoring

- **Error Tracking** - ErrorBoundary components for graceful error handling
- **Performance Context** - App state monitoring for lifecycle events and performance metrics
- **Network State** - Connection monitoring with offline support indicators

---

## 🚨 Things to Be Careful About

### 🔒 Security Considerations

- **Authentication** - JWT tokens stored securely with Expo SecureStore, automatic refresh handling
- **Data Validation** - Yup schemas for form validation, TypeScript for compile-time safety
- **API Security** - Request/response interceptors for authentication headers and error handling

### Development Notes

- **Platform Compatibility** - Code must work across iOS, Android, and Web platforms
- **Translation Requirements** - All user-facing text must be internationalized with i18next
- **State Persistence** - Critical state (auth, cart, preferences) persisted with AsyncStorage
- **Navigation Types** - Maintain type safety across all navigation flows and screen parameters

_Updated at: 2025-01-27 UTC_
