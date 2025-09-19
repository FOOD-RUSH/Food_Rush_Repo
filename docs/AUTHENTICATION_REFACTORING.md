# Authentication System Refactoring

## Overview

The Food Rush authentication system has been refactored to properly separate concerns between React Query (async operations) and Zustand stores (data storage). This document outlines the changes made and the new architecture.

## Key Principles

1. **React Query handles all async operations and loading states**
2. **Stores only store data and provide actions for data manipulation**
3. **No API requests are made directly from stores**
4. **Consistent error handling patterns across all auth hooks**

## Architecture Changes

### Before Refactoring
- Stores handled both API requests and data storage
- Manual loading state management in stores
- Inconsistent error handling
- Mixed responsibilities between React Query and Zustand

### After Refactoring
- React Query handles all API calls and loading states
- Stores focus purely on data storage and state management
- Consistent error handling with `clearError()` in `onMutate`
- Clear separation of concerns

## File Structure

```
src/
├── hooks/
│   ├── customer/
│   │   └── useAuthhooks.ts          # Customer authentication hooks
│   ├── restaurant/
│   │   └── useAuthhooks.ts          # Restaurant authentication hooks
│   └── shared/
│       └── useAuth.ts               # Shared authentication utilities
├── stores/
│   └── AuthStore.ts                 # Centralized auth state management
└── services/
    ├── customer/
    │   └── authApi.ts               # Customer API endpoints
    ├── restaurant/
    │   └── authApi.ts               # Restaurant API endpoints
    └── shared/
        └── tokenManager.ts          # Token management utilities
```

## Updated Hooks

### Customer Authentication Hooks

#### `useLogin()`
- **Purpose**: Authenticate customer users
- **React Query**: Handles API call and loading states
- **Store Actions**: `setUser()`, `setIsAuthenticated()`, `clearError()`
- **Token Management**: Stores tokens via TokenManager
- **Cache Management**: Updates React Query cache and invalidates related queries

#### `useRegister()`
- **Purpose**: Register new customer accounts
- **React Query**: Handles registration API call
- **Store Actions**: `setRegistrationData()`, `clearError()`
- **Flow**: Stores registration data for OTP verification

#### `useVerifyOTP()`
- **Purpose**: Verify OTP for customer registration/login
- **React Query**: Handles OTP verification API call
- **Store Actions**: `setUser()`, `setIsAuthenticated()`, `setRegistrationData(null)`
- **Token Management**: Stores tokens and clears registration data

#### `useUpdateProfile()`
- **Purpose**: Update customer profile information
- **React Query**: Handles profile update API call
- **Store Actions**: `setUser()`, `clearError()`
- **Cache Management**: Updates cached user data

#### `useLogout()`
- **Purpose**: Log out customer users
- **React Query**: Handles logout process
- **Store Actions**: `resetAuth()` (clears all auth state)
- **Cleanup**: Clears tokens, cart data, and React Query cache

#### `useResendOTP()`, `useResetPassword()`, `useRequestPasswordReset()`
- **Purpose**: Handle password reset and OTP resend flows
- **React Query**: Handles respective API calls
- **Store Actions**: `clearError()` only

### Restaurant Authentication Hooks

#### `useLoginRestaurant()`
- **Purpose**: Authenticate restaurant users
- **React Query**: Handles API call and loading states
- **Store Actions**: `setUser()`, `setIsAuthenticated()`, `setRestaurants()`, `setDefaultRestaurantId()`
- **Restaurant-specific**: Handles multiple restaurants per user

#### `useRegisterRestaurant()`
- **Purpose**: Register new restaurant accounts
- **React Query**: Handles registration API call
- **Store Actions**: `setRegistrationData()`, `clearError()`

#### `useVerifyRestaurantOTP()`
- **Purpose**: Verify OTP for restaurant registration
- **React Query**: Handles OTP verification
- **Store Actions**: `setUser()`, `setIsAuthenticated()`, `setRegistrationData(null)`

#### `useLogoutRestaurant()`
- **Purpose**: Log out restaurant users
- **React Query**: Handles logout process
- **Store Actions**: `resetAuth()`
- **Cleanup**: Clears tokens and React Query cache

#### `useUpdateRestaurantProfile()`, `useResetRestaurantPassword()`, `useRequestRestaurantPasswordReset()`
- **Purpose**: Handle restaurant-specific profile and password operations
- **React Query**: Handles respective API calls
- **Store Actions**: Appropriate data updates and `clearError()`

## Store Responsibilities

### AuthStore (`src/stores/AuthStore.ts`)

The AuthStore now focuses purely on data storage and state management:

#### State Properties
- `user`: Current authenticated user data
- `isAuthenticated`: Authentication status
- `isLoading`: Manual loading state (deprecated in favor of React Query states)
- `error`: Error messages
- `registrationData`: Temporary data during registration flow
- `restaurants`: Restaurant data (for restaurant users)
- `defaultRestaurantId`: Default restaurant selection

#### Actions
- `setUser(user)`: Store user data
- `setIsAuthenticated(boolean)`: Update authentication status
- `setError(message)`: Set error message
- `clearError()`: Clear error state
- `setRegistrationData(data)`: Store registration data
- `setRestaurants(restaurants)`: Store restaurant data
- `setDefaultRestaurantId(id)`: Set default restaurant
- `resetAuth()`: Clear all authentication state

## Usage Patterns

### In Components

```typescript
// Using customer login
const loginMutation = useLogin();

const handleLogin = async (credentials) => {
  try {
    await loginMutation.mutateAsync(credentials);
    // React Query handles loading states
    // Store automatically updated with user data
    navigation.navigate('CustomerHome');
  } catch (error) {
    // Error handling via React Query
    console.error('Login failed:', error);
  }
};

// Access loading state from React Query
const isLoading = loginMutation.isPending;

// Access user data from store
const { user, isAuthenticated } = useAuthStore();
```

### Error Handling

```typescript
// In hooks - clear errors before API calls
onMutate: () => {
  clearError();
}

// In components - handle errors from React Query
if (loginMutation.error) {
  // Display error message
  console.error(loginMutation.error);
}
```

## Benefits of Refactoring

### 1. **Clear Separation of Concerns**
- React Query: Async operations, caching, loading states
- Zustand Stores: Data persistence, state management
- Components: UI logic and user interactions

### 2. **Improved Performance**
- React Query's built-in optimizations
- Automatic background refetching
- Intelligent caching strategies
- Optimistic updates

### 3. **Better Developer Experience**
- Consistent patterns across all auth operations
- Type-safe operations with TypeScript
- Easier debugging with clear data flow
- Reduced boilerplate code

### 4. **Enhanced Error Handling**
- Centralized error management via React Query
- Consistent error clearing patterns
- Better error recovery mechanisms

### 5. **Maintainability**
- Single responsibility principle
- Easier to test individual components
- Clear data flow and dependencies
- Reduced coupling between components

## Migration Guide

### For Existing Components

1. **Replace manual loading states**:
   ```typescript
   // Before
   const { isLoading } = useAuthStore();
   
   // After
   const loginMutation = useLogin();
   const isLoading = loginMutation.isPending;
   ```

2. **Update error handling**:
   ```typescript
   // Before
   const { error } = useAuthStore();
   
   // After
   const loginMutation = useLogin();
   const error = loginMutation.error;
   ```

3. **Use mutation methods**:
   ```typescript
   // Before
   await authStore.login(credentials);
   
   // After
   await loginMutation.mutateAsync(credentials);
   ```

## Testing Considerations

### Unit Testing
- Test React Query hooks with `@testing-library/react-hooks`
- Mock API responses for different scenarios
- Test store state changes independently

### Integration Testing
- Test complete authentication flows
- Verify token storage and retrieval
- Test error scenarios and recovery

### E2E Testing
- Test user authentication journeys
- Verify navigation after successful auth
- Test offline/online scenarios

## Future Enhancements

1. **Optimistic Updates**: Implement optimistic UI updates for better UX
2. **Background Sync**: Add background token refresh mechanisms
3. **Offline Support**: Enhance offline authentication capabilities
4. **Analytics**: Add authentication event tracking
5. **Security**: Implement additional security measures (biometric auth, etc.)

## Conclusion

This refactoring establishes a robust, scalable authentication system that follows modern React patterns and best practices. The clear separation between async operations (React Query) and state management (Zustand) provides a solid foundation for future development and maintenance.