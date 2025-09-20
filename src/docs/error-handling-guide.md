# Enhanced Error Handling Guide

## Overview

The Food Rush app now includes a comprehensive error handling system with production-safe generic error messages and dual-language support (English/French). This system ensures that sensitive error information is not exposed to users in production while providing detailed debugging information during development.

## Key Features

- **Production-Safe Messages**: Generic error messages in production, detailed messages in development
- **Dual-Language Support**: Error messages automatically translated based on user's language preference
- **Consistent Error Structure**: Standardized error objects across the application
- **Development vs Production**: Different behavior based on `__DEV__` flag
- **i18n Integration**: Seamless integration with the existing i18next setup

## Core Functions

### `sanitizeError(error: any): string`

The main function that sanitizes error messages for production builds.

```typescript
import { sanitizeError } from '@/src/utils/errorHandler';

// In development: Returns detailed error message
// In production: Returns generic message based on status code
const safeMessage = sanitizeError(error);
```

### `getGenericErrorMessage(status?: number): string`

Returns generic error messages with i18n support based on HTTP status codes.

```typescript
import { getGenericErrorMessage } from '@/src/utils/errorHandler';

// Returns translated generic message
const message = getGenericErrorMessage(404); // "The requested resource was not found."
```

### `handleApiError(error: any): ApiError`

Enhanced version of the original function that sanitizes error messages.

```typescript
import { handleApiError } from '@/src/utils/errorHandler';

try {
  await apiCall();
} catch (error) {
  const apiError = handleApiError(error);
  // apiError.message is now production-safe
  console.log(apiError.message);
}
```

### `getUserFriendlyErrorMessage(error: any): string`

Returns user-friendly error messages that are safe for production.

```typescript
import { getUserFriendlyErrorMessage } from '@/src/utils/errorHandler';

const userMessage = getUserFriendlyErrorMessage(error);
showToast(userMessage); // Safe to show to users
```

## Error Message Categories

### HTTP Status Code Mapping

| Status Code | English Message | French Message |
|-------------|----------------|----------------|
| 400 | Please check your input and try again. | Veuillez vérifier votre saisie et réessayer. |
| 401 | Authentication failed. Please log in again. | Échec de l'authentification. Veuillez vous reconnecter. |
| 403 | Access denied. You do not have permission. | Accès refusé. Vous n'avez pas l'autorisation. |
| 404 | The requested resource was not found. | La ressource demandée n'a pas été trouvée. |
| 408 | Request timed out. Please try again. | Délai d'attente dépassé. Veuillez réessayer. |
| 429 | Too many requests. Please wait and try again. | Trop de requêtes. Veuillez attendre et réessayer. |
| 500 | Server error occurred. Please try again later. | Erreur serveur. Veuillez réessayer plus tard. |
| 502/503/504 | Service temporarily unavailable. | Service temporairement indisponible. |
| Default | An unexpected error occurred. Please try again. | Une erreur inattendue s'est produite. |

### Additional Error Types

The system also includes translations for common application errors:

- Network errors
- Connection failures
- Data loading failures
- Save/update/delete operations
- File upload/download errors
- Permission errors
- Payment errors
- Location errors
- Camera/storage errors

## Usage Examples

### Basic API Error Handling

```typescript
import { getUserFriendlyErrorMessage } from '@/src/utils/errorHandler';

const fetchRestaurants = async () => {
  try {
    const response = await api.get('/restaurants');
    return response.data;
  } catch (error) {
    const userMessage = getUserFriendlyErrorMessage(error);
    showErrorToast(userMessage);
    throw error;
  }
};
```

### React Component Error Handling

```typescript
import { getUserFriendlyErrorMessage } from '@/src/utils/errorHandler';

const RestaurantList = () => {
  const [error, setError] = useState<string | null>(null);

  const loadRestaurants = async () => {
    try {
      setError(null);
      await fetchRestaurants();
    } catch (err) {
      const errorMessage = getUserFriendlyErrorMessage(err);
      setError(errorMessage);
    }
  };

  return (
    <View>
      {error && (
        <Text style={{ color: 'red' }}>{error}</Text>
      )}
      {/* Component content */}
    </View>
  );
};
```

### TanStack Query Integration

```typescript
import { handleApiError, getUserFriendlyErrorMessage } from '@/src/utils/errorHandler';

const useRestaurantsQuery = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      try {
        const response = await api.get('/restaurants');
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    onError: (error: any) => {
      const message = getUserFriendlyErrorMessage(error);
      showToast(message);
    }
  });
};
```

### Error Boundary

```typescript
import { sanitizeError, getGenericErrorMessage } from '@/src/utils/errorHandler';

class ErrorBoundary extends React.Component {
  componentDidCatch(error: any, errorInfo: any) {
    // Log sanitized error
    console.error('Error:', sanitizeError(error));
  }

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>{getGenericErrorMessage()}</Text>
          <Button title="Try Again" onPress={this.retry} />
        </View>
      );
    }
    return this.props.children;
  }
}
```

## Development vs Production Behavior

### Development Mode (`__DEV__ = true`)

- Shows detailed error messages from the server
- Includes error details and stack traces
- Logs comprehensive error information
- Helps with debugging and development

### Production Mode (`__DEV__ = false`)

- Shows only generic, user-friendly messages
- Hides sensitive server error details
- Prevents information leakage
- Provides consistent user experience

## Translation Keys

All error messages are stored in the translation files under the `errors` namespace:

```json
{
  "errors": {
    "validation_failed": "Please check your input and try again.",
    "authentication_failed": "Authentication failed. Please log in again.",
    "access_denied": "Access denied. You do not have permission.",
    // ... more error messages
  }
}
```

## Best Practices

### 1. Always Use Production-Safe Functions

```typescript
// ✅ Good - Production safe
const message = getUserFriendlyErrorMessage(error);

// ❌ Avoid - May expose sensitive info
const message = error.message;
```

### 2. Log Errors Appropriately

```typescript
// ✅ Good - Uses sanitized logging
errorUtils.logError(error, 'ComponentName');

// ❌ Avoid - May log sensitive data in production
console.error('Raw error:', error);
```

### 3. Handle Different Error Types

```typescript
if (errorUtils.isAuthError(error)) {
  // Redirect to login
  navigateToLogin();
} else if (errorUtils.isNetworkError(error)) {
  // Show offline message
  showOfflineMessage();
} else {
  // Show generic error
  const message = getUserFriendlyErrorMessage(error);
  showErrorToast(message);
}
```

### 4. Provide Fallback Messages

```typescript
// Always provide fallback for i18n
const message = i18n.t('errors.server_error', { 
  defaultValue: 'Server error occurred. Please try again later.' 
});
```

## Migration Guide

### Updating Existing Error Handling

1. Replace direct error message usage:
   ```typescript
   // Before
   setError(error.message);
   
   // After
   setError(getUserFriendlyErrorMessage(error));
   ```

2. Update API error handling:
   ```typescript
   // Before
   catch (error) {
     console.error(error);
     showToast(error.message);
   }
   
   // After
   catch (error) {
     errorUtils.logError(error, 'APICall');
     const message = getUserFriendlyErrorMessage(error);
     showToast(message);
   }
   ```

3. Update error boundaries:
   ```typescript
   // Before
   componentDidCatch(error, errorInfo) {
     console.error('Error:', error.message);
   }
   
   // After
   componentDidCatch(error, errorInfo) {
     const sanitized = sanitizeError(error);
     console.error('Error:', sanitized);
   }
   ```

## Testing

### Testing Error Messages

```typescript
import { getGenericErrorMessage, sanitizeError } from '@/src/utils/errorHandler';

describe('Error Handler', () => {
  it('should return generic message in production', () => {
    // Mock production environment
    const originalDev = __DEV__;
    (global as any).__DEV__ = false;
    
    const error = { response: { status: 500 } };
    const message = sanitizeError(error);
    
    expect(message).toBe('Server error occurred. Please try again later.');
    
    // Restore
    (global as any).__DEV__ = originalDev;
  });
});
```

## Security Considerations

1. **Information Disclosure**: Production mode prevents sensitive server error details from being exposed to users
2. **Error Logging**: Sensitive information is sanitized before logging
3. **Consistent Messaging**: Generic messages prevent attackers from gaining insights about system internals
4. **Language Support**: Error messages respect user's language preference without exposing system details

## Troubleshooting

### Common Issues

1. **Missing Translations**: If a translation key is missing, the system falls back to the default English message
2. **i18n Not Initialized**: The system includes fallback messages if i18n is not available
3. **Development vs Production**: Ensure `__DEV__` flag is properly set for your build environment

### Debugging

```typescript
// Check if error handling is working correctly
console.log('DEV mode:', __DEV__);
console.log('Error message:', getUserFriendlyErrorMessage(error));
console.log('Generic message:', getGenericErrorMessage(500));
```

This enhanced error handling system provides a robust, secure, and user-friendly way to handle errors across the Food Rush application while maintaining the dual-language support that users expect.