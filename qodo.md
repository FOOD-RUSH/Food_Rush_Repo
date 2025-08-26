# Repository Tour

## 🎯 What This Repository Does

Food Rush is a cross-platform mobile food delivery application built with React Native and Expo. It connects customers with restaurants, enabling food ordering, delivery tracking, and payment processing in a seamless mobile experience.

**Key responsibilities:**
- Enable customers to browse restaurants, order food, and track deliveries
- Provide restaurants with order management and analytics tools
- Handle secure authentication, payments, and real-time location services

---

## 🏗️ Architecture Overview

### System Context
```
[Customer Mobile App] → [Food Rush API] → [Restaurant Database]
        ↓                      ↓
[Payment Gateway]      [Location Services]
        ↓                      ↓
[MTN/Orange Money]     [Maps & Geolocation]
```

### Key Components
- **Authentication System** - Secure user login/signup with JWT tokens and OTP verification
- **Dual Navigation** - Separate app flows for customers and restaurants with role-based access
- **State Management** - Zustand stores for client state, TanStack Query for server state
- **Location Services** - Real-time geolocation for delivery tracking and restaurant discovery
- **Payment Integration** - Mobile money payments (MTN, Orange) with transaction management

### Data Flow
1. User authenticates via email/phone with OTP verification
2. Customer browses restaurants and menu items fetched from API
3. Items are added to cart (local state) and orders are placed via API
4. Restaurant receives order notifications and updates order status
5. Real-time location tracking updates delivery progress
6. Payment is processed through mobile money providers

---

## 📁 Project Structure [Partial Directory Tree]

```
food-rush/
├── src/                       # Main application source code
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication-specific components
│   │   ├── common/           # Shared components (buttons, modals, etc.)
│   │   ├── customer/         # Customer-specific components
│   │   └── settings/         # Settings and profile components
│   ├── screens/              # Screen components organized by feature
│   │   ├── auth/             # Login, signup, password reset screens
│   │   ├── customer/         # Customer app screens (home, cart, profile)
│   │   └── restaurant/       # Restaurant app screens (orders, menu, analytics)
│   ├── navigation/           # Navigation configuration and types
│   ├── services/             # API clients and external service integrations
│   │   └── customer/         # Customer-specific API services
│   ├── stores/               # Zustand state management stores
│   │   └── customerStores/   # Customer app state stores
│   ├── contexts/             # React context providers for app-wide state
│   ├── hooks/                # Custom React hooks for business logic
│   ├── locales/              # Internationalization files (EN/FR)
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions and helpers
│   └── config/               # App configuration (theme, constants)
├── assets/                   # Static assets (images, fonts)
│   ├── images/               # App images and illustrations
│   └── fonts/                # Custom fonts
├── docs/                     # Documentation files
└── .expo/                    # Expo configuration and cache
```

### Key Files to Know

| File | Purpose | When You'd Touch It |
|------|---------|---------------------|
| `App.tsx` | Application entry point with providers | Adding global providers or splash screen logic |
| `src/navigation/RootNavigator.tsx` | Main navigation configuration | Adding new screens or navigation flows |
| `src/contexts/AppContextProvider.tsx` | Global context provider setup | Adding new app-wide providers |
| `package.json` | Dependencies and scripts | Adding new libraries or updating versions |
| `app.json` | Expo configuration | Changing app metadata, icons, or build settings |
| `src/services/customer/apiClient.ts` | HTTP client with auth interceptors | Modifying API base URL or request/response handling |
| `src/stores/customerStores/AppStore.ts` | Main app state management | Adding global app state or user preferences |
| `src/types/index.ts` | Core TypeScript definitions | Adding new data types or interfaces |

---

## 🔧 Technology Stack

### Core Technologies
- **Language:** TypeScript (5.8.3) - Type safety and better developer experience
- **Framework:** React Native (0.79.5) with Expo (53.0.20) - Cross-platform mobile development
- **Navigation:** React Navigation (7.x) - Type-safe navigation with stack and tab navigators
- **State Management:** Zustand (5.0.7) - Lightweight state management with persistence

### Key Libraries
- **@tanstack/react-query** - Server state management with caching and synchronization
- **react-native-paper** - Material Design 3 UI components with theming
- **nativewind** - Tailwind CSS for React Native styling
- **react-hook-form + yup** - Form validation and management
- **i18next + react-i18next** - Internationalization with English and French support
- **@rnmapbox/maps** - Advanced mapping and location services
- **axios** - HTTP client with interceptors for API communication

### Development Tools
- **ESLint + Prettier** - Code linting and formatting
- **Jest + jest-expo** - Testing framework for React Native
- **TypeScript** - Static type checking and IntelliSense

---

## 🌐 External Dependencies

### Required Services
- **Food Rush Backend API** - Core business logic, user management, and order processing
- **Mapbox** - Maps, geocoding, and location services for delivery tracking
- **MTN Mobile Money** - Payment processing for MTN subscribers
- **Orange Money** - Payment processing for Orange subscribers

### Optional Integrations
- **Expo Push Notifications** - Real-time order updates and promotional messages
- **Expo Location** - Device location services with fallback to manual address entry

---

## 🔄 Common Workflows

### Customer Order Flow
1. Customer opens app and browses restaurants by location/cuisine
2. Selects restaurant and adds menu items to cart with customizations
3. Proceeds to checkout, selects delivery address and payment method
4. Places order which is sent to restaurant and payment is processed
5. Receives real-time updates on order status and delivery tracking

**Code path:** `HomeScreen` → `RestaurantDetailScreen` → `FoodDetailsScreen` → `CartScreen` → `CheckOutScreen`

### Restaurant Order Management
1. Restaurant receives new order notification
2. Reviews order details and confirms/rejects the order
3. Updates order status as it progresses (preparing → ready → picked up)
4. Views analytics and order history for business insights

**Code path:** `OrderScreen` → `OrderDetailsScreen` → `OrderHistoryScreen` → `AnalyticsScreen`

### Authentication Flow
1. User selects user type (customer/restaurant) during onboarding
2. Enters email/phone and password for login or registration
3. Verifies account via OTP sent to email/SMS
4. JWT tokens are stored securely and used for API authentication

**Code path:** `OnboardingScreen` → `LoginScreen` → `OTPScreen` → `RootNavigator`

---

## 📈 Performance & Scale

### Performance Considerations
- **Image Optimization:** Uses expo-image for optimized image loading and caching
- **List Virtualization:** FlatList for efficient rendering of large restaurant/menu lists
- **State Persistence:** Zustand with AsyncStorage for offline-first user experience
- **Query Caching:** TanStack Query for intelligent server state caching and background updates

### Monitoring
- **Error Boundaries:** React error boundaries for graceful error handling
- **Performance Context:** Custom performance monitoring for app lifecycle events
- **Network Status:** Real-time network connectivity monitoring with offline support

---

## 🚨 Things to Be Careful About

### 🔒 Security Considerations
- **Token Management:** JWT tokens stored in secure storage with automatic refresh
- **API Security:** Request/response interceptors handle authentication and error states
- **Input Validation:** Form validation with Yup schemas prevents malicious input
- **Payment Security:** Mobile money integration follows provider security guidelines

### 🌍 Internationalization
- **Language Support:** English and French with device language detection
- **RTL Support:** Text direction handling for future Arabic/Hebrew support
- **Currency Formatting:** Locale-aware number and currency formatting

### 📱 Platform Considerations
- **iOS/Android Differences:** Platform-specific styling and behavior handling
- **Expo Limitations:** Some native features require custom development builds
- **Performance:** Large image assets and complex animations may impact performance

---

*Updated at: 2025-01-27 UTC*