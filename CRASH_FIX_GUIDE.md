# App Crash on Startup - Diagnosis & Fix Guide

## 🔴 CRASH SYMPTOMS
- App shows icon briefly
- App closes/crashes immediately
- No error message shown to user

## 🔍 ROOT CAUSES IDENTIFIED

### 1. **NEW ARCHITECTURE ENABLED** ⚠️
**Location:** `app.json` line 10
```json
"newArchEnabled": true
```

**Why it crashes:**
- The New Architecture (Fabric/TurboModules) in React Native 0.81.4 can cause compatibility issues
- Some packages may not be compatible with the new architecture yet
- Sentry's integration might have issues with new architecture in production builds

**FIX:**
```json
"newArchEnabled": false
```

### 2. **SENTRY DSN MISSING AT RUNTIME** ⚠️
**Location:** `App.tsx` line 16

**Why it crashes:**
- Sentry.init() is called but `process.env.EXPO_PUBLIC_SENTRY_DSN` might be undefined
- If DSN is missing/invalid, Sentry initialization can fail and crash the app
- In production builds, env variables might not be loaded properly

**FIX:** Add fallback and error handling

### 3. **FONT LOADING ISSUES** ⚠️
**Potential Issue:**
- Fonts must be bundled in the APK/IPA
- If fonts aren't found, the app can crash silently
- Font paths in `src/config/fonts.ts` use require() which needs proper bundling

### 4. **I18N ASYNC INITIALIZATION** ⚠️
**Location:** `App.tsx` line 1 imports i18n synchronously
- i18n uses AsyncStorage which is async
- Language detector is async but might not complete before render
- Can cause race conditions on startup

### 5. **MISSING HERMES ENGINE** (Less likely)
- If Hermes is disabled but your code expects it
- Can cause performance issues or crashes

---

## 🛠️ IMMEDIATE FIXES

### Fix 1: Disable New Architecture (CRITICAL)

**File:** `app.json`
```json
{
  "expo": {
    "newArchEnabled": false,  // Changed from true
    // ... rest of config
  }
}
```

### Fix 2: Add Sentry Error Handling

**File:** `App.tsx`
```typescript
// Wrap Sentry.init in try-catch
try {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || undefined,
    
    // Only send PII in production if explicitly required
    sendDefaultPii: !__DEV__,
    
    // Disable debug logging in production
    debug: __DEV__,
    enableLogs: __DEV__,
    
    // Configure Session Replay - lower sample rate in production
    replaysSessionSampleRate: __DEV__ ? 0.1 : 0.01,
    replaysOnErrorSampleRate: 1.0,
    
    integrations: [
      Sentry.mobileReplayIntegration(),
      Sentry.feedbackIntegration(),
    ],
    
    // Set environment from env variable
    environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'production',
    
    // Enable Spotlight only in development
    spotlight: __DEV__,
    
    // Add error handling
    beforeSend(event, hint) {
      if (__DEV__) {
        console.log('Sentry Event:', event);
      }
      return event;
    },
  });
} catch (error) {
  console.error('Failed to initialize Sentry:', error);
  // App continues without Sentry rather than crashing
}
```

### Fix 3: Ensure Fonts Are Bundled

**Check `app.json`:**
```json
{
  "expo": {
    "assetBundlePatterns": [
      "assets/fonts/**",  // ✓ Already there
      "assets/images/**",
      "assets/sounds/**"
    ]
  }
}
```

**Verify fonts exist:**
- ✓ `assets/fonts/Urbanist-Regular.ttf`
- ✓ `assets/fonts/Urbanist-Medium.ttf`
- ✓ `assets/fonts/Urbanist-SemiBold.ttf`
- ✓ `assets/fonts/Urbanist-Bold.ttf`

### Fix 4: Add SplashScreen Error Handling

**File:** `App.tsx` - Improve error handling in SplashScreen.preventAutoHideAsync()
```typescript
// At the top level, wrap in try-catch
try {
  SplashScreen.preventAutoHideAsync();
} catch (error) {
  console.warn('SplashScreen.preventAutoHideAsync failed:', error);
  // Continue - this is not critical
}
```

---

## 📱 TESTING STEPS

After applying fixes:

### 1. Clean Build
```bash
# Clear all caches
rm -rf node_modules/.cache
rm -rf .expo
rm -rf android/build (if exists)
rm -rf ios/build (if exists)

# Reinstall dependencies
npm install

# Clear EAS build cache (if using EAS)
eas build:configure
```

### 2. Test Locally First
```bash
# Start dev server
npx expo start --clear

# Test on device
# - Scan QR code
# - Ensure app loads without errors
```

### 3. Create New Preview Build
```bash
# For Android
eas build --platform android --profile preview

# For iOS  
eas build --platform ios --profile preview
```

### 4. Check Logs
```bash
# View build logs
eas build:list

# If app still crashes, check device logs:
# Android: adb logcat | grep -i "error\|crash\|exception"
# iOS: Use Xcode Console
```

---

## 🔍 ADVANCED DEBUGGING

### Get Crash Logs from Device

**Android:**
```bash
# Connect device via USB
adb logcat -d > crash_log.txt

# Filter for your app
adb logcat -d | grep "com.mrcalculus.foodrush"
```

**iOS:**
1. Open Xcode
2. Window → Devices and Simulators
3. Select your device
4. View Device Logs
5. Look for crash reports

### Check Sentry Dashboard
If Sentry is working, crashes should appear at:
`https://sentry.io/organizations/student-i3b/issues/`

### Add More Logging

**File:** `App.tsx`
```typescript
console.log('=== App Starting ===');
console.log('Env:', process.env.EXPO_PUBLIC_ENVIRONMENT);
console.log('Sentry DSN:', process.env.EXPO_PUBLIC_SENTRY_DSN ? 'Set' : 'Missing');

try {
  Sentry.init({ /* ... */ });
  console.log('✓ Sentry initialized');
} catch (error) {
  console.error('✗ Sentry init failed:', error);
}

console.log('=== Starting App Component ===');
```

---

## 🎯 MOST LIKELY FIX

Based on the symptoms, **disabling `newArchEnabled`** will likely solve the crash:

1. Open `app.json`
2. Change line 10: `"newArchEnabled": false`
3. Rebuild the preview

The New Architecture is experimental and can cause compatibility issues, especially with:
- Sentry SDK
- React Native Reanimated
- React Navigation
- Custom native modules

---

## ✅ VERIFICATION CHECKLIST

- [ ] `newArchEnabled` set to `false` in app.json
- [ ] Sentry.init() wrapped in try-catch
- [ ] SplashScreen.preventAutoHideAsync() wrapped in try-catch
- [ ] All fonts exist in `assets/fonts/` folder
- [ ] Environment variables set in `.env` and `.env.production`
- [ ] Clean build created (cleared all caches)
- [ ] Tested in dev mode first
- [ ] New preview build generated
- [ ] App opens successfully
- [ ] No crashes in Sentry dashboard

---

## 📞 IF STILL CRASHING

If the app still crashes after applying these fixes:

1. **Share the crash logs** from:
   - `adb logcat` (Android)
   - Xcode Console (iOS)
   - Sentry dashboard

2. **Check these specific issues:**
   - Missing permissions in AndroidManifest.xml
   - Code signing issues (iOS)
   - API connectivity (if app needs backend on startup)
   - AsyncStorage initialization failures

3. **Try minimal App.tsx:**
   Temporarily simplify App.tsx to isolate the issue:
   ```typescript
   export default function App() {
     return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text>Hello World</Text>
       </View>
     );
   }
   ```
   If this works, gradually add back features to find the crash cause.

---

## 🚀 PRODUCTION RECOMMENDATIONS

Once crash is fixed:

1. **Enable Hermes** (if not already) for better performance
2. **Test on multiple devices** (different OS versions)
3. **Monitor Sentry** for first 48 hours after launch
4. **Add analytics** to track app opens vs crashes
5. **Set up crash alerts** in Sentry
6. **Consider phased rollout** (10% → 50% → 100% of users)

---

**Last Updated:** 2025-10-11
**Priority:** CRITICAL - Fix before production launch
