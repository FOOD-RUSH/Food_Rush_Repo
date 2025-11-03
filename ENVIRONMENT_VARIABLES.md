# Environment Variables Documentation

This document describes all environment variables used in the Food Rush application.

## Required Variables

### API Configuration

#### `EXPO_PUBLIC_API_URL`
- **Description**: Base URL for the backend API
- **Required**: Yes
- **Example**: 
  - Development: `http://localhost:3000/api/v1`
  - Production: `https://foodrush-be.onrender.com/api/v1`
- **Used in**: `src/services/shared/apiClient.ts`

#### `EXPO_PUBLIC_ENVIRONMENT`
- **Description**: Current environment (development, staging, production)
- **Required**: No (defaults to development)
- **Example**: `production`
- **Used in**: `App.tsx`, Sentry configuration

### Monitoring & Analytics

#### `EXPO_PUBLIC_SENTRY_DSN`
- **Description**: Sentry Data Source Name for error tracking
- **Required**: No (optional, for error monitoring)
- **Example**: `https://[key]@[organization].ingest.sentry.io/[project]`
- **Used in**: `App.tsx`, `app.json`
- **Note**: Leave empty to disable Sentry

## Environment Files

### `.env` (Development)
Used for local development. Not committed to git.

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_SENTRY_DSN=
```

### `.env.production` (Production)
Used for production builds. Not committed to git.

```env
EXPO_PUBLIC_API_URL=https://foodrush-be.onrender.com/api/v1
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
```

## Setup Instructions

### 1. Create Environment Files

```bash
# Copy example files
cp .env.example .env
cp .env.production.example .env.production

# Edit with your values
nano .env
nano .env.production
```

### 2. Verify Variables

```bash
# Check if variables are loaded (in development)
npx expo start
# Look for "Environment: development" in console
```

### 3. Build with Production Variables

```bash
# EAS automatically uses .env.production for production builds
eas build --platform android --profile production
```

## Security Best Practices

1. **Never commit `.env` files to git**
   - Already in `.gitignore`
   - Use `.env.example` as template

2. **Use different values for each environment**
   - Development: Local/test servers
   - Staging: Staging servers
   - Production: Production servers

3. **Rotate sensitive values regularly**
   - API keys
   - Sentry DSN
   - Any authentication tokens

4. **Use Expo Secrets for CI/CD**
   ```bash
   # Set secrets for EAS builds
   eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "your-value"
   ```

## Troubleshooting

### Variables Not Loading

1. **Check file name**: Must be exactly `.env` or `.env.production`
2. **Check prefix**: All Expo variables must start with `EXPO_PUBLIC_`
3. **Restart Metro**: After changing .env, restart the dev server
4. **Clear cache**: `npx expo start --clear`

### Build Issues

1. **EAS builds**: Ensure `.env.production` exists
2. **Local builds**: Ensure `.env` exists
3. **Check logs**: Look for environment variable errors in build logs

### API Connection Issues

1. **Verify URL**: Check `EXPO_PUBLIC_API_URL` is correct
2. **Check network**: Ensure device can reach the API
3. **Check CORS**: Ensure API allows requests from app
4. **Check SSL**: Production APIs should use HTTPS

## Adding New Variables

1. **Add to `.env.example`**
   ```env
   EXPO_PUBLIC_NEW_VARIABLE=example-value
   ```

2. **Add to this documentation**
   - Description
   - Required/Optional
   - Example values
   - Where it's used

3. **Update TypeScript types** (if needed)
   ```typescript
   // In a .d.ts file
   declare module '@env' {
     export const EXPO_PUBLIC_NEW_VARIABLE: string;
   }
   ```

4. **Update production checklist**
   - Add to PRODUCTION_CHECKLIST.md

## References

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [EAS Build Secrets](https://docs.expo.dev/build-reference/variables/)
- [Sentry Configuration](https://docs.sentry.io/platforms/react-native/)
