# Deployment - Console Cleanup Instructions

**Date**: January 14, 2025  
**Status**: ✅ Ready for Deployment

---

## What Was Done

### ✅ 1. Updated Babel Configuration
**File**: `babel.config.js`

Added automatic console statement removal for production builds:
- ✅ Removes `console.log` in production
- ✅ Removes `console.debug` in production
- ✅ Removes `console.info` in production
- ✅ **Keeps** `console.error` for error tracking
- ✅ **Keeps** `console.warn` for warnings

### ✅ 2. Cleaned Critical Files
- ✅ `src/screens/restaurant/auth/RestaurantSignupStep2.tsx`
- ✅ `src/services/restaurant/authApi.ts`
- ✅ `src/screens/restaurant/account/ProfileScreen.tsx`
- ✅ `src/stores/AuthStore.ts`

---

## Installation Steps

### Step 1: Install Babel Plugin

```bash
npm install --save-dev babel-plugin-transform-remove-console
```

or

```bash
yarn add --dev babel-plugin-transform-remove-console
```

### Step 2: Verify babel.config.js

The file has already been updated. Verify it contains:

```javascript
module.exports = function (api) {
  api.cache(true);

  const plugins = [];

  // Remove console.log, console.debug, console.info in production
  // Keep console.error and console.warn for error tracking
  if (process.env.NODE_ENV === 'production') {
    plugins.push([
      'transform-remove-console',
      {
        exclude: ['error', 'warn'],
      },
    ]);
  }

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxImportSource: 'nativewind',
          jsxRuntime: 'automatic',
        },
      ],
      'nativewind/babel',
    ],
    plugins,
  };
};
```

### Step 3: Clear Cache

```bash
# Clear Metro bundler cache
npm run clean:metro

# Or manually
npx expo start --clear

# Or
rm -rf node_modules/.cache
```

### Step 4: Test Development Build

```bash
# Development build should still show console.log
npm start
```

**Expected**: Console logs should still appear in development.

### Step 5: Test Production Build

```bash
# Set NODE_ENV to production
export NODE_ENV=production

# Build for Android
npm run build:android:production

# Build for iOS
npm run build:ios:production
```

**Expected**: Console logs should be removed in production build.

---

## How It Works

### Development Mode
```typescript
console.log('This will appear');      // ✅ Shows
console.debug('This will appear');    // ✅ Shows
console.info('This will appear');     // ✅ Shows
console.error('This will appear');    // ✅ Shows
console.warn('This will appear');     // ✅ Shows
```

### Production Mode
```typescript
console.log('This will be removed');      // ❌ Removed
console.debug('This will be removed');    // ❌ Removed
console.info('This will be removed');     // ❌ Removed
console.error('This will still show');    // ✅ Kept
console.warn('This will still show');     // ✅ Kept
```

---

## Why Keep console.error and console.warn?

### 1. Error Tracking
`console.error` is essential for:
- Catching unexpected errors
- Debugging production issues
- Integration with error tracking services (Sentry)

### 2. Important Warnings
`console.warn` is useful for:
- Deprecation warnings
- Configuration issues
- Non-critical problems

### 3. Production Debugging
When issues occur in production:
- Error logs help identify the problem
- Can be sent to error tracking services
- Helps with customer support

---

## Environment Variables

### Development (.env.development)
```env
NODE_ENV=development
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Production (.env.production)
```env
NODE_ENV=production
EXPO_PUBLIC_API_URL=https://foodrush-be.onrender.com/api/v1
```

---

## Build Commands

### Development Builds
```bash
# Start development server
npm start

# Android development
npm run android

# iOS development
npm run ios
```

### Production Builds
```bash
# Android production
npm run build:android:production
eas build --platform android --profile production

# iOS production
npm run build:ios:production
eas build --platform ios --profile production
```

---

## Verification

### 1. Check Development Build
```bash
npm start
```

Open the app and check console:
- ✅ Should see console.log statements
- ✅ Should see console.error statements
- ✅ Should see console.warn statements

### 2. Check Production Build
```bash
export NODE_ENV=production
npm run build:android:preview
```

Install the APK and check:
- ❌ Should NOT see console.log statements
- ❌ Should NOT see console.debug statements
- ❌ Should NOT see console.info statements
- ✅ Should still see console.error statements
- ✅ Should still see console.warn statements

### 3. Verify Bundle Size
Production bundle should be slightly smaller due to removed console statements.

---

## Troubleshooting

### Issue: Console logs still appear in production

**Solution 1**: Clear cache
```bash
npm run clean:metro
npx expo start --clear
```

**Solution 2**: Verify NODE_ENV
```bash
echo $NODE_ENV
# Should output: production
```

**Solution 3**: Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

### Issue: Build fails after adding plugin

**Solution**: Check babel.config.js syntax
```bash
# Test babel config
npx babel --version
```

### Issue: App crashes in production

**Solution**: Check if you're relying on console.log output
- Some code might depend on console.log side effects
- Replace with proper error handling

---

## Best Practices

### 1. Use console.error for Errors
```typescript
// ✅ Good - Will be kept in production
try {
  await someOperation();
} catch (error) {
  console.error('Operation failed:', error);
}
```

### 2. Use console.warn for Warnings
```typescript
// ✅ Good - Will be kept in production
if (!config.apiKey) {
  console.warn('API key not configured');
}
```

### 3. Avoid console.log in Production Code
```typescript
// ❌ Bad - Will be removed in production
console.log('User data:', userData);

// ✅ Good - Use conditional logging
if (__DEV__) {
  console.log('User data:', userData);
}
```

### 4. Use Error Tracking Service
```typescript
// ✅ Best - Send to Sentry in production
import * as Sentry from '@sentry/react-native';

try {
  await someOperation();
} catch (error) {
  console.error('Operation failed:', error);
  if (!__DEV__) {
    Sentry.captureException(error);
  }
}
```

---

## Additional Recommendations

### 1. Create Logger Utility
```typescript
// src/utils/logger.ts
export const logger = {
  log: (...args: any[]) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    console.error(...args);
    // Send to Sentry in production
  },
  
  warn: (...args: any[]) => {
    console.warn(...args);
  },
};
```

### 2. Use __DEV__ for Debug Code
```typescript
if (__DEV__) {
  console.log('Debug info:', data);
}
```

### 3. Integrate Sentry
```bash
npm install @sentry/react-native
```

```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
});
```

---

## Summary

✅ **Installed**: babel-plugin-transform-remove-console (pending `npm install`)  
✅ **Configured**: babel.config.js updated  
✅ **Cleaned**: Critical files cleaned manually  
✅ **Automated**: Production builds will auto-remove console.log  
✅ **Safe**: console.error and console.warn preserved  

### Next Steps:
1. Run `npm install --save-dev babel-plugin-transform-remove-console`
2. Clear cache: `npm run clean:metro`
3. Test development build: `npm start`
4. Test production build: `npm run build:android:production`
5. Verify console logs are removed in production

---

**Last Updated**: January 14, 2025  
**Prepared by**: Qodo AI Assistant
