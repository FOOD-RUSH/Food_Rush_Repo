# Production Deployment Checklist

## Pre-Build Checklist

### 1. Environment Variables
Ensure all required environment variables are set in `.env.production`:

- [ ] `EXPO_PUBLIC_API_URL` - Production API URL
- [ ] `EXPO_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking (optional)
- [ ] `EXPO_PUBLIC_ENVIRONMENT` - Set to "production"

### 2. App Configuration (app.json)
- [x] Version number is set (`version: "1.0.0"`)
- [x] Android package name: `com.mrcalculus.foodrush`
- [x] iOS bundle identifier: `com.mrcalculus.foodrush`
- [x] Android versionCode: `1`
- [x] iOS buildNumber: `1`
- [ ] App icon is present at `./assets/FoodRush.png`
- [ ] Splash screen is present at `./assets/images/SplashScreen.png`
- [ ] Adaptive icon is present at `./assets/FoodRush-adaptive.png`
- [ ] Notification icon is present at `./assets/images/notification-icon.png`

### 3. EAS Configuration (eas.json)
- [x] Production build profile configured for Android (app-bundle)
- [x] Production build profile configured for iOS (Release)
- [ ] Update submit configuration with actual credentials:
  - Android: Add Google Service Account JSON path
  - iOS: Add Apple ID, App Store Connect App ID, and Team ID

### 4. Code Quality
- [ ] Run `npm run lint` and fix all errors
- [ ] Run `npm run format` to format code
- [ ] Run `npm test` and ensure all tests pass
- [ ] Remove all console.log statements (or use proper logging)
- [ ] Remove all TODO/FIXME comments or address them

### 5. Security
- [ ] Ensure no API keys or secrets are hardcoded
- [ ] Verify all sensitive data uses SecureStore
- [ ] Check that .env files are in .gitignore
- [ ] Review permissions in app.json (remove unnecessary ones)

### 6. Performance
- [ ] Test app on low-end devices
- [ ] Check bundle size (should be reasonable)
- [ ] Verify images are optimized
- [ ] Test offline functionality

## Build Process

### Clean Build
```bash
# Clean all caches and dependencies
npm run clean:all

# Reinstall dependencies
npm install

# Clear Metro bundler cache
npm run clean:metro
```

### Android Build
```bash
# Preview build (APK for testing)
npm run build:android:preview

# Production build (AAB for Play Store)
npm run build:android:production
```

### iOS Build
```bash
# Preview build (for TestFlight)
npm run build:ios:preview

# Production build (for App Store)
npm run build:ios:production
```

## Post-Build Checklist

### Testing
- [ ] Test the preview build on physical devices
- [ ] Test all critical user flows (login, logout, ordering, etc.)
- [ ] Test push notifications
- [ ] Test deep linking
- [ ] Test payment flow (if applicable)
- [ ] Test on different screen sizes
- [ ] Test on different OS versions

### Store Submission

#### Android (Google Play)
- [ ] Create app listing in Google Play Console
- [ ] Upload screenshots (phone and tablet)
- [ ] Write app description
- [ ] Set content rating
- [ ] Set pricing and distribution
- [ ] Upload AAB file
- [ ] Submit for review

#### iOS (App Store)
- [ ] Create app listing in App Store Connect
- [ ] Upload screenshots (all required sizes)
- [ ] Write app description
- [ ] Set age rating
- [ ] Set pricing and availability
- [ ] Upload build via EAS or Xcode
- [ ] Submit for review

## Monitoring

### After Release
- [ ] Monitor Sentry for errors (if configured)
- [ ] Monitor app store reviews
- [ ] Monitor crash reports
- [ ] Monitor API performance
- [ ] Set up analytics (if not already done)

## Rollback Plan
- [ ] Keep previous version available
- [ ] Document rollback procedure
- [ ] Have emergency contact list ready

## Notes

### Known Issues Fixed
1. **Logout/Login Bug**: Fixed issue where users couldn't login after logout
   - Root cause: `sessionExpired` flag in apiClient was blocking auth requests
   - Fix: Allow auth endpoints even when session is expired
   - Fix: Reset API client state on logout

### Environment-Specific Configurations
- Development: Uses local/staging API
- Preview: Uses staging API with production-like settings
- Production: Uses production API with all optimizations

### Version Numbering
- Format: MAJOR.MINOR.PATCH (e.g., 1.0.0)
- Increment MAJOR for breaking changes
- Increment MINOR for new features
- Increment PATCH for bug fixes
- Update both `app.json` version and platform-specific version codes

### Support Contacts
- Backend API: [Add contact]
- DevOps: [Add contact]
- Product Owner: [Add contact]
