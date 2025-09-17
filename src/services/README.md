# Simplified Token Manager & API Client System

## Overview

This system provides a simplified, performant solution for token management and API communication with automatic token refresh and logout functionality.

## Key Features

✅ **Performance Optimized**: In-memory caching reduces SecureStore calls  
✅ **Automatic Token Refresh**: Handles expired access tokens seamlessly  
✅ **Automatic Logout**: Clears tokens and redirects when refresh fails  
✅ **Concurrent Request Handling**: Queues requests during token refresh  
✅ **User Type Support**: Separate token storage for customer/restaurant  
✅ **Simplified API**: Clean, minimal interface for MVP needs  

## Usage

### 1. App Initialization

Call this once during app startup:

```typescript
import { setupApiClients } from '@/src/services/common/apiClientSetup';

// In your App.tsx or main initialization
setupApiClients();
```

### 2. Token Management

```typescript
// Customer tokens
import TokenManager from '@/src/services/customer/tokenManager';

// Store tokens after login
await TokenManager.setTokens(accessToken, refreshToken);

// Get tokens
const accessToken = await TokenManager.getToken();
const refreshToken = await TokenManager.getRefreshToken();

// Check authentication
const isAuth = await TokenManager.isAuthenticated();

// Logout (clears all tokens)
await TokenManager.clearAllTokens();
```

```typescript
// Restaurant tokens
import RestaurantTokenManager from '@/src/services/restaurant/tokenManager';

// Same API as customer token manager
await RestaurantTokenManager.setTokens(accessToken, refreshToken);
```

### 3. API Calls

```typescript
// Customer API
import { apiClient } from '@/src/services/customer/apiClient';

try {
  const response = await apiClient.get('/restaurants');
  // Token refresh happens automatically if needed
} catch (error) {
  // Handle API errors
  console.error(error.message);
}
```

```typescript
// Restaurant API
import { restaurantApiClient } from '@/src/services/restaurant/apiClient';

const response = await restaurantApiClient.post('/orders', orderData);
```

### 4. Dynamic API Client Selection

```typescript
import { getApiClient } from '@/src/services/common/apiClientSetup';

const userType = 'customer'; // or 'restaurant'
const client = getApiClient(userType);
const response = await client.get('/profile');
```

## How Token Refresh Works

1. **Request Made**: API call with access token
2. **401 Response**: Server returns unauthorized
3. **Check Refresh Token**: If available, attempt refresh
4. **Refresh Success**: Store new tokens, retry original request
5. **Refresh Failure**: Clear all tokens, trigger automatic logout
6. **Concurrent Requests**: Queued and resolved with new token

## Error Handling

The system handles these scenarios automatically:

- **Expired Access Token**: Refreshes and retries
- **Expired Refresh Token**: Logs out user
- **Network Errors**: Returns appropriate error messages
- **Invalid Tokens**: Clears tokens and logs out

## Performance Benefits

- **In-Memory Caching**: Tokens cached after first load
- **Batch Operations**: Multiple token operations batched
- **Reduced SecureStore Calls**: Only when necessary
- **Request Deduplication**: Prevents multiple refresh attempts

## Security Features

- **Secure Storage**: Tokens stored in Expo SecureStore
- **Automatic Cleanup**: Tokens cleared on logout/error
- **Request Headers**: Security headers added automatically
- **Token Validation**: Checks for token presence before requests

## Migration from Old System

The new token managers maintain backward compatibility with existing method names:

```typescript
// Old way (still works)
await TokenManager.setToken(accessToken);
await TokenManager.setRefreshToken(refreshToken);

// New way (recommended)
await TokenManager.setTokens(accessToken, refreshToken);
```

## Troubleshooting

### Common Issues

1. **Tokens not persisting**: Ensure SecureStore permissions
2. **Infinite refresh loops**: Check refresh token endpoint
3. **Logout not working**: Verify setupApiClients() is called

### Debug Information

```typescript
// Check token status
const isAuth = await TokenManager.isAuthenticated();
console.log('Is authenticated:', isAuth);

// Check individual tokens
const accessToken = await TokenManager.getToken();
const refreshToken = await TokenManager.getRefreshToken();
console.log('Has tokens:', !!accessToken, !!refreshToken);
```