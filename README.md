# 🍔 Food Rush - Food Delivery App

<div align="center">
  <img src="./assets/images/Foodrushlogo.png" alt="Food Rush Logo" width="120" height="120">
  
  **A comprehensive React Native food delivery application connecting customers with restaurants for seamless food ordering and delivery services.**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.8-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

</div>

## 📱 Overview

Food Rush is a modern, feature-rich food delivery platform built with React Native and Expo. The app serves both customers looking for delicious meals and restaurants wanting to expand their reach through digital ordering and delivery services.

### 🎯 Key Features

- **Dual User Experience**: Separate interfaces for customers and restaurant partners
- **Real-time Order Tracking**: Live updates from order placement to delivery
- **Multi-language Support**: English and French localization
- **Location-based Services**: GPS integration for accurate delivery estimates
- **Secure Payments**: Multiple payment methods including mobile money
- **Push Notifications**: Real-time order updates and promotional alerts
- **Offline Support**: Graceful handling of network connectivity issues
- **Dark/Light Theme**: Adaptive UI based on user preferences

## 🏗️ Architecture

### Tech Stack

- **Framework**: React Native 0.81.4 with Expo 54.0.8
- **Language**: TypeScript 5.9.2
- **State Management**: Zustand 5.0.7 with AsyncStorage persistence
- **Server State**: TanStack Query 5.85.0 for data fetching and caching
- **Navigation**: React Navigation 7.x with type-safe routing
- **Styling**: NativeWind 4.1.23 (Tailwind CSS for React Native)
- **UI Components**: React Native Paper 5.14.5 with custom design system
- **Internationalization**: i18next 25.3.6 with React Native integration
- **Form Management**: React Hook Form 7.61.1 with Yup validation
- **Maps**: Mapbox for location services and restaurant mapping
- **Animations**: React Native Reanimated 4.1.0

### Project Structure

```
food-rush/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Shared components
│   │   ├── customer/       # Customer-specific components
│   │   └── restaurant/     # Restaurant-specific components
│   ├── screens/            # Screen components
│   │   ├── auth/           # Login, signup, OTP screens
│   │   ├── customer/       # Customer app screens
│   │   └── restaurant/     # Restaurant management screens
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API services and business logic
│   ├── stores/             # Zustand state management
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions and helpers
│   ├── types/              # TypeScript type definitions
│   ├── locales/            # Internationalization files
│   └── contexts/           # React context providers
├── assets/                 # Static assets (images, fonts)
├── docs/                   # Documentation
└── scripts/                # Build and utility scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Expo CLI**: Latest version
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/food-rush.git
   cd food-rush
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Development Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run android          # Android emulator/device
npm run ios             # iOS simulator/device
npm run web             # Web browser

# Code quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm test               # Run Jest tests

# Translation validation
npm run validate:translations
```

## 📱 Platform Support

| Platform    | Status       | Notes                  |
| ----------- | ------------ | ---------------------- |
| **Android** | ✅ Supported | API 21+ (Android 5.0+) |
| **iOS**     | ✅ Supported | iOS 13.0+              |
| **Web**     | ✅ Supported | Modern browsers        |

## 🔔 Notifications (Expo Go note)

When running in Expo Go, Android remote push notifications are not fully supported starting with SDK 53+. For reliable testing of push notifications (especially background/remote delivery), use a development build instead of Expo Go. Local notifications and most iOS behaviors still work in Expo Go, but native behavior can differ from a dev build.

## 🌍 Internationalization

The app supports multiple languages with automatic detection based on device settings:

- **English** (en) - Default
- **French** (fr) - Français

### Adding New Languages

1. Create translation files in `src/locales/[language]/`
2. Update `src/locales/i18n.ts` configuration
3. Add language metadata to `LANGUAGES` constant

## 🎨 Design System

### Styling Approach

- **NativeWind**: Tailwind CSS utilities for React Native
- **Design Tokens**: Consistent colors, typography, and spacing
- **Theme Support**: Light and dark mode with system preference detection
- **Responsive Design**: Adaptive layouts for different screen sizes

### Color Palette

```typescript
// Primary Colors
primary: '#007aff'; // Blue
secondary: '#06102b'; // Dark Blue
accent: '#ff6b35'; // Orange

// Status Colors
success: '#34c759'; // Green
warning: '#ff9500'; // Orange
error: '#ff3b30'; // Red
info: '#5ac8fa'; // Light Blue
```

## 🔐 Security Features

### Production-Safe Error Handling

The app includes a comprehensive error handling system that:

- **Sanitizes error messages** in production builds
- **Prevents information disclosure** of sensitive server details
- **Provides user-friendly messages** in multiple languages
- **Maintains detailed logging** for development debugging

```typescript
// Example usage
import { getUserFriendlyErrorMessage } from '@/src/utils/errorHandler';

try {
  await apiCall();
} catch (error) {
  const userMessage = getUserFriendlyErrorMessage(error);
  showToast(userMessage); // Safe for production
}
```

### Data Protection

- **Secure Storage**: Sensitive data encrypted with Expo SecureStore
- **JWT Authentication**: Token-based authentication with automatic refresh
- **Input Validation**: Client and server-side validation with Yup schemas
- **Network Security**: HTTPS-only API communication

## 📊 State Management

### Architecture Overview

```typescript
// Zustand stores with persistence
const useAppStore = create(
  persist(
    (set, get) => ({
      // App state
      theme: 'system',
      language: 'en',
      onboardingCompleted: false,
      // Actions
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

### Store Organization

- **App Store**: Global app settings and preferences
- **Auth Store**: User authentication and session management
- **Cart Store**: Shopping cart state for customers
- **Restaurant Store**: Restaurant-specific data and settings
- **Location Store**: GPS and address management

## 🔄 API Integration

### TanStack Query Setup

```typescript
// Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### API Services

- **Authentication**: Login, signup, OTP verification
- **Restaurants**: Search, details, menu management
- **Orders**: Placement, tracking, history
- **Payments**: Processing, methods, history
- **Location**: Geocoding, address management
- **Notifications**: Push notification handling

## 📱 Features by User Type

### 👥 Customer Features

- **Restaurant Discovery**: Browse nearby restaurants with filters
- **Menu Browsing**: View detailed menus with photos and descriptions
- **Cart Management**: Add items, customize orders, apply discounts
- **Order Placement**: Secure checkout with multiple payment options
- **Real-time Tracking**: Live order status and delivery tracking
- **Order History**: View past orders and reorder favorites
- **Profile Management**: Update personal information and preferences
- **Address Management**: Save multiple delivery addresses
- **Favorites**: Save favorite restaurants and dishes
- **Reviews & Ratings**: Rate restaurants and leave feedback

### 🏪 Restaurant Features

- **Dashboard Analytics**: Revenue, orders, and performance metrics
- **Menu Management**: Add, edit, and organize menu items
- **Order Management**: Accept, prepare, and track orders
- **Restaurant Profile**: Update business information and hours
- **Notification Settings**: Configure order and business alerts
- **Financial Reports**: Track earnings and transaction history
- **Customer Reviews**: View and respond to customer feedback
- **Availability Control**: Set restaurant hours and availability

## 🔔 Push Notifications

### Notification Types

- **Order Updates**: Status changes, delivery notifications
- **Promotional**: Special offers, discounts, new restaurants
- **System**: App updates, maintenance notifications
- **Location**: Nearby restaurant recommendations

### Configuration

```typescript
// Expo Notifications setup
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#007aff",
          "defaultChannel": "default"
        }
      ]
    ]
  }
}
```

## 🗺️ Location Services

### Features

- **GPS Integration**: Automatic location detection
- **Address Geocoding**: Convert addresses to coordinates
- **Restaurant Proximity**: Find nearby restaurants
- **Delivery Zones**: Check restaurant delivery areas
- **Route Optimization**: Efficient delivery routing

### Permissions

```typescript
// Location permissions configuration
{
  "locationAlwaysAndWhenInUsePermission": "This app needs access to your location to show nearby restaurants and provide accurate delivery services.",
  "locationWhenInUsePermission": "This app needs access to your location to show nearby restaurants and calculate delivery times."
}
```

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Jest for utility functions and business logic
- **Component Tests**: React Native Testing Library
- **Integration Tests**: API service testing
- **E2E Tests**: Detox for critical user flows

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Build & Deployment

### Development Builds

```bash
# Create development build
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Production Builds

```bash
# Create production build
eas build --profile production --platform android
eas build --profile production --platform ios
```

### Environment Configuration

```typescript
// app.json configuration
{
  \"extra\": {
    \"API_BASE_URL\": \"https://your-backend.example.com\",
    \"eas\": {
      \"projectId\": \"08bd6b92-2717-47f7-b11c-ed37f5126c0e\"
    }
  }
}
```

## 🔧 Configuration

### Environment Variables

```bash
# .env file
API_BASE_URL=https://your-backend.example.com
EXPO_PROJECT_ID=08bd6b92-2717-47f7-b11c-ed37f5126c0e
MAPBOX_ACCESS_TOKEN=your_mapbox_token
SENTRY_DSN=your_sentry_dsn
```

### App Configuration

```typescript
// Key configuration files
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── eslint.config.js      # ESLint configuration
```

## 📚 Documentation

- **[Error Handling Guide](./src/docs/error-handling-guide.md)**: Comprehensive error handling documentation
- **[API Documentation](./docs/api.md)**: Backend API integration guide
- **[Component Library](./docs/components.md)**: Reusable component documentation
- **[State Management](./docs/state-management.md)**: Zustand store patterns
- **[Styling Guide](./docs/styling.md)**: NativeWind and design system guide

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the coding standards
4. **Run tests**: `npm test`
5. **Lint your code**: `npm run lint`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Coding Standards

- **TypeScript**: Strict mode enabled with comprehensive type definitions
- **ESLint**: Expo configuration with custom rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages
- **Code Reviews**: All changes require review before merging

### Code Style

```typescript
// Example component structure
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  title: string;
  onPress?: () => void;
}

export const ExampleComponent: React.FC<Props> = ({ title, onPress }) => {
  const { t } = useTranslation();

  return (
    <View className=\"p-4 bg-white rounded-lg\">
      <Text className=\"text-lg font-semibold\">{title}</Text>
    </View>
  );
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**

   ```bash
   npx expo start --clear
   ```

2. **iOS build issues**

   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build issues**

   ```bash
   cd android && ./gradlew clean && cd ..
   ```

4. **TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```

### Performance Optimization

- **Bundle Analysis**: Use Expo bundle analyzer
- **Image Optimization**: Compress and optimize images
- **Code Splitting**: Lazy load screens and components
- **Memory Management**: Proper cleanup of subscriptions and timers

## 📄 License

This project is private and proprietary. All rights reserved.

## 👥 Team

- **Development Team**: Food Rush Development Team
- **Design Team**: UI/UX Design Team
- **Product Team**: Product Management Team

## 📞 Support

For support and questions:

- **Email**: support@foodrush.com
- **Documentation**: [Internal Wiki](https://wiki.foodrush.com)
- **Issue Tracker**: [GitHub Issues](https://github.com/your-org/food-rush/issues)

## 🚀 Roadmap

### Upcoming Features

- [ ] **Voice Ordering**: Voice-activated food ordering
- [ ] **AR Menu**: Augmented reality menu visualization
- [ ] **Social Features**: Share meals and reviews with friends
- [ ] **Loyalty Program**: Points and rewards system
- [ ] **Advanced Analytics**: Machine learning-powered insights
- [ ] **Multi-restaurant Orders**: Order from multiple restaurants
- [ ] **Subscription Service**: Meal plan subscriptions
- [ ] **Corporate Accounts**: Business ordering solutions

### Technical Improvements

- [ ] **Performance**: Bundle size optimization and lazy loading
- [ ] **Accessibility**: Enhanced screen reader support
- [ ] **Testing**: Increased test coverage and E2E tests
- [ ] **Documentation**: Interactive component documentation
- [ ] **CI/CD**: Automated testing and deployment pipelines

---

<div align=\"center\">
  <p>Built with ❤️ by the Food Rush Team</p>
  <p>© 2025 Food Rush. All rights reserved.</p>
</div>"
