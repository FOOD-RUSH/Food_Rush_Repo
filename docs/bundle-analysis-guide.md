# 📊 Food Rush Bundle Analysis Guide

## Overview

This guide provides comprehensive tools and methods to analyze, monitor, and optimize the bundle size of your Food Rush React Native app. Bundle size optimization is crucial for app performance, download times, and user experience.

## 🚀 Quick Start

### Run Complete Bundle Analysis
```bash
# Analyze dependencies and measure bundle size
npm run bundle:size

# Or run individually
npm run analyze:bundle    # Analyze dependencies
npm run monitor:bundle    # Measure actual bundle size
```

### Check for Unused Dependencies
```bash
# Using depcheck (install if needed: npm install -g depcheck)
npm run deps:analyze

# Get JSON output of unused dependencies
npm run deps:unused
```

## 📋 Available Analysis Tools

### 1. **Dependency Analyzer** (`scripts/analyze-bundle.js`)

Analyzes your dependencies to identify:
- **Unused dependencies** that can be removed
- **Restaurant-only dependencies** that could be code-split
- **Large dependencies** that need optimization
- **Optimization recommendations**

```bash
npm run analyze:bundle
```

**Output includes:**
- List of potentially unused dependencies
- Dependencies only used in restaurant features
- Large dependencies analysis
- Actionable optimization recommendations

### 2. **Bundle Size Monitor** (`scripts/monitor-bundle-size.js`)

Measures actual bundle size by:
- Exporting production bundle
- Analyzing file sizes and composition
- Tracking size changes over time
- Identifying largest files

```bash
npm run monitor:bundle
```

**Output includes:**
- Total bundle size breakdown
- JavaScript vs Assets size
- Largest files in bundle
- Size change tracking
- Optimization suggestions

### 3. **Web Bundle Analyzer** (Visual Analysis)

For detailed visual analysis of web bundles:

```bash
npm run bundle:web-analyze
```

This will:
1. Export web bundle
2. Open interactive bundle analyzer
3. Show visual treemap of bundle composition

## 📊 Current Bundle Composition

Based on your dependencies, here's the estimated bundle composition:

### **Core Dependencies (~60% of bundle)**
- **React Native Core**: ~15MB
- **Expo SDK**: ~8MB
- **React Navigation**: ~3MB
- **React Native Paper**: ~4MB

### **Feature Dependencies (~25% of bundle)**
- **TanStack Query**: ~2MB
- **React Hook Form + Yup**: ~1.5MB
- **i18next**: ~1MB
- **Zustand**: ~0.5MB

### **UI/Animation Dependencies (~10% of bundle)**
- **React Native Reanimated**: ~3MB
- **@expo/vector-icons**: ~2MB
- **React Native SVG**: ~1MB

### **Platform-Specific (~5% of bundle)**
- **@rnmapbox/maps**: ~2MB (maps functionality)
- **Expo modules**: ~1MB

## 🎯 Optimization Strategies

### 1. **Remove Unused Dependencies**

First, identify unused dependencies:

```bash
npm run deps:analyze
```

Common candidates for removal:
```bash
# Example unused dependencies (verify before removing)
npm uninstall expo-blur expo-symbols expo-crypto
```

**Estimated savings: 5-15% bundle reduction**

### 2. **Implement Code Splitting**

Split your app into customer and restaurant bundles:

```typescript
// Example: Lazy load restaurant screens
const RestaurantDashboard = lazy(() => import('../screens/restaurant/Dashboard'));
const RestaurantMenu = lazy(() => import('../screens/restaurant/Menu'));

// Use Suspense for loading states
<Suspense fallback={<LoadingScreen />}>
  <RestaurantDashboard />
</Suspense>
```

**Estimated savings: 15-30% for customer app**

### 3. **Optimize Icon Usage**

Instead of importing entire icon sets:

```typescript
// ❌ Imports entire icon set
import { Ionicons } from '@expo/vector-icons';

// ✅ Tree-shakeable approach
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
// Or use only specific icons
```

**Estimated savings: 5-10% bundle reduction**

### 4. **Image Optimization**

Optimize your assets:

```bash
# Install image optimization tools
npm install -g imagemin-cli imagemin-webp

# Optimize images
imagemin assets/images/*.png --out-dir=assets/images/optimized --plugin=webp
```

**Estimated savings: 10-20% asset reduction**

### 5. **Dynamic Imports for Heavy Components**

```typescript
// ❌ Static import
import MapView from '@rnmapbox/maps';

// ✅ Dynamic import
const MapView = lazy(() => import('@rnmapbox/maps'));
```

## 📈 Bundle Size Monitoring

### Set Up Continuous Monitoring

1. **Add to CI/CD Pipeline**:
```yaml
# .github/workflows/bundle-analysis.yml
name: Bundle Analysis
on: [push, pull_request]
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Analyze bundle
        run: npm run bundle:size
```

2. **Track Size Over Time**:
```bash
# Run before making changes
npm run monitor:bundle

# Make your optimizations
# ...

# Run after changes to see improvement
npm run monitor:bundle
```

### Bundle Size Targets

**Recommended bundle sizes:**

| Platform | Target Size | Maximum Size |
|----------|-------------|--------------|
| **iOS** | < 20MB | < 30MB |
| **Android** | < 25MB | < 35MB |
| **Web** | < 5MB (initial) | < 10MB |

## 🔧 Advanced Optimization Techniques

### 1. **Metro Bundle Optimization**

Your `metro.config.js` already includes optimizations:

```javascript
// Current optimizations in metro.config.js
config.transformer = {
  minifierConfig: {
    keep_fnames: true,
    mangle: { keep_fnames: true },
  },
};

// Additional optimizations you can add:
config.serializer = {
  ...config.serializer,
  // Enable module concatenation
  experimentalSerializerHook: (graph, delta) => {
    // Custom serialization logic
  },
};
```

### 2. **Tree Shaking Configuration**

Ensure proper tree shaking:

```javascript
// babel.config.js additions
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // Enable tree shaking for lodash
    ['lodash', { id: ['lodash', 'recompose'] }],
    // Remove unused imports
    ['transform-remove-console', { exclude: ['error', 'warn'] }],
  ],
};
```

### 3. **Platform-Specific Bundles**

Create platform-specific entry points:

```typescript
// App.ios.tsx
export { default } from './App.native';

// App.android.tsx  
export { default } from './App.native';

// App.web.tsx
export { default } from './App.web';
```

## 📊 Bundle Analysis Reports

### Reading the Analysis Report

The bundle analyzer generates detailed reports:

```json
{
  \"timestamp\": \"2025-01-27T...\",
  \"totalDependencies\": 45,
  \"analysis\": {
    \"unused\": [\"expo-blur\", \"expo-symbols\"],
    \"restaurantOnly\": [\"react-native-chart-kit\"],
    \"large\": [
      {\"name\": \"@expo/vector-icons\", \"used\": true, \"version\": \"^15.0.2\"}
    ]
  },
  \"recommendations\": [...]
}
```

### Key Metrics to Track

1. **Total Bundle Size**: Overall app size
2. **JavaScript Size**: Code bundle size
3. **Asset Size**: Images, fonts, etc.
4. **Dependency Count**: Number of packages
5. **Unused Dependencies**: Removable packages

## 🚨 Common Issues and Solutions

### Issue 1: Large Bundle Size (>30MB)

**Solutions:**
1. Remove unused dependencies
2. Implement code splitting
3. Optimize images and assets
4. Use dynamic imports

### Issue 2: Slow App Startup

**Solutions:**
1. Reduce initial bundle size
2. Lazy load non-critical screens
3. Optimize font loading
4. Minimize synchronous operations

### Issue 3: Memory Issues

**Solutions:**
1. Implement proper image caching
2. Use FlatList for large lists
3. Optimize state management
4. Remove memory leaks

## 📝 Best Practices

### 1. **Regular Monitoring**
- Run bundle analysis weekly
- Track size changes in PRs
- Set up automated alerts for size increases

### 2. **Dependency Management**
- Audit new dependencies before adding
- Prefer smaller, focused libraries
- Regularly update and clean dependencies

### 3. **Code Organization**
- Use barrel exports sparingly
- Implement proper code splitting
- Avoid circular dependencies

### 4. **Asset Management**
- Optimize images before adding
- Use appropriate image formats
- Implement lazy loading for images

## 🔄 Optimization Workflow

1. **Baseline Measurement**
   ```bash
   npm run bundle:size
   ```

2. **Identify Opportunities**
   - Review unused dependencies
   - Analyze large files
   - Check for code splitting opportunities

3. **Implement Changes**
   - Remove unused code
   - Optimize imports
   - Add lazy loading

4. **Measure Impact**
   ```bash
   npm run monitor:bundle
   ```

5. **Validate Performance**
   - Test app startup time
   - Check memory usage
   - Verify functionality

## 📞 Support and Resources

- **Bundle Analysis Reports**: `bundle-analysis-report.json`
- **Size History**: `bundle-size-history.json`
- **Metro Documentation**: [Metro Bundler](https://metrobundler.dev/)
- **Expo Bundle Analysis**: [Expo Docs](https://docs.expo.dev/guides/analyzing-bundles/)

---

**Next Steps:**
1. Run `npm run bundle:size` to get your current baseline
2. Review the generated reports
3. Implement the recommended optimizations
4. Set up continuous monitoring in your CI/CD pipeline

Remember: Bundle optimization is an iterative process. Start with the biggest wins (unused dependencies, code splitting) and gradually work on smaller optimizations."