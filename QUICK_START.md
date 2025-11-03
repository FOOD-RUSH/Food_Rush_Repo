# Quick Start Guide

## Clean & Build Commands

### Clean the App

```bash
# Clean everything (recommended before production builds)
npm run clean:all

# Clean only node_modules and caches
npm run clean

# Clean only Metro bundler cache
npm run clean:metro
```

### Development

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Building for Production

```bash
# 1. Clean everything first
npm run clean:all

# 2. Build preview (for testing)
npm run build:android:preview
npm run build:ios:preview

# 3. Build production (for stores)
npm run build:android:production
npm run build:ios:production
```

## Common Issues & Solutions

### Issue: Login fails after logout
**Solution**: This has been fixed! If you still see it:
1. Clear app data on device
2. Rebuild the app: `npm run clean:all && npm install`

### Issue: Metro bundler errors
**Solution**: 
```bash
npm run clean:metro
npm start -- --reset-cache
```

### Issue: Build fails
**Solution**:
```bash
npm run clean:all
npm install
# Try build again
```

### Issue: Environment variables not loading
**Solution**:
1. Check `.env` file exists
2. Restart Metro: `npm start -- --reset-cache`
3. For production: Check `.env.production` exists

## Pre-Production Checklist

- [ ] Run `npm run lint` (fix all errors)
- [ ] Run `npm run format`
- [ ] Run `npm test`
- [ ] Test logout/login flow
- [ ] Update version in `app.json`
- [ ] Update `.env.production` with production API URL
- [ ] Run `npm run clean:all`
- [ ] Build preview and test on device
- [ ] Build production

## Useful Commands

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Check bundle size
npx expo-doctor

# Clear all caches (nuclear option)
npm run clean:all
watchman watch-del-all  # If you have watchman
rm -rf ~/Library/Caches/CocoaPods  # macOS only
```

## Need More Help?

- See `PRODUCTION_CHECKLIST.md` for complete deployment guide
- See `ENVIRONMENT_VARIABLES.md` for environment setup
- See `LOGOUT_LOGIN_FIX_SUMMARY.md` for bug fix details
