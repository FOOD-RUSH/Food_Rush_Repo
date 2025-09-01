# Optimized Context System

This directory contains an optimized context system designed for minimal re-renders and optimal performance in the Food Rush app.

## Architecture Overview

The context system is organized into three layers for optimal performance:

### 1. Core Infrastructure Providers
- **GestureHandlerRootView**: Gesture handling
- **SafeAreaProvider**: Safe area management
- **QueryClientProvider**: React Query for data fetching
- **I18nextProvider**: Internationalization

### 2. App State Providers
- **AppStateProvider**: App lifecycle and state management
- **PerformanceProvider**: Performance monitoring and optimization
- **LanguageProvider**: Language and localization
- **ThemeProvider**: Theme management
- **NetworkProvider**: Network connectivity

### 3. UI Providers
- **BottomSheetModalProvider**: Bottom sheet modals
- **BottomSheetProvider**: Bottom sheet context

## Key Features

### 🚀 Performance Optimizations

1. **Memoized Context Values**: All context values are memoized to prevent unnecessary re-renders
2. **Selective Hooks**: Specific hooks for individual properties to minimize re-renders
3. **Stable References**: useCallback and useMemo used extensively for stable references
4. **Component Memoization**: All providers are wrapped with React.memo
5. **Shallow Comparison**: Custom hooks for shallow prop comparison

### 📊 Performance Monitoring

The `PerformanceProvider` includes:
- Render tracking for components
- Interaction monitoring
- Memory usage tracking
- Performance metrics collection

### 🔧 Optimized Hooks

Each context provides both general and specific hooks:

```tsx
// General hook (may cause more re-renders)
const { isConnected, isInternetReachable, type } = useNetwork();

// Specific hooks (minimal re-renders)
const isConnected = useIsConnected();
const isInternetReachable = useIsInternetReachable();
const networkType = useNetworkType();
```

## Usage Examples

### Basic Context Usage

```tsx
import { AppContextProvider } from '@/src/contexts/AppContextProvider';

function App() {
  return (
    <AppContextProvider>
      <YourAppContent />
    </AppContextProvider>
  );
}
```

### Using Optimized Hooks

```tsx
import { useIsConnected, useCurrentLanguage } from '@/src/contexts';

function MyComponent() {
  // These hooks will only re-render when their specific values change
  const isConnected = useIsConnected();
  const currentLanguage = useCurrentLanguage();
  
  return (
    <View>
      <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
      <Text>Language: {currentLanguage}</Text>
    </View>
  );
}
```

### Performance Tracking

```tsx
import { useOptimizedComponent } from '@/src/hooks/useOptimizedComponent';

function MyComponent(props) {
  const { createOptimizedCallback, compareProps } = useOptimizedComponent({
    componentName: 'MyComponent',
    trackRenders: true,
    logProps: __DEV__,
  });

  // Compare props for debugging
  compareProps(props);

  // Create optimized callbacks
  const handlePress = createOptimizedCallback(() => {
    // Handle press
  }, []);

  return <TouchableOpacity onPress={handlePress}>...</TouchableOpacity>;
}
```

## Context Providers

### AppStateProvider

Manages app lifecycle and state:

```tsx
const { isAppActive, isAppInBackground, lastActiveTime } = useAppState();

// Or use specific hooks
const isActive = useIsAppActive();
const isInBackground = useIsAppInBackground();
```

### PerformanceProvider

Monitors and optimizes performance:

```tsx
const { trackRender, trackInteraction, metrics } = usePerformance();

// Track component render
trackRender('MyComponent');

// Track user interaction
await trackInteraction('button-press');
```

### NetworkProvider (Optimized)

Enhanced network monitoring with minimal re-renders:

```tsx
// Specific hooks prevent unnecessary re-renders
const isConnected = useIsConnected();
const isReachable = useIsInternetReachable();
const networkType = useNetworkType();
const refreshNetwork = useNetworkRefresh();
```

### LanguageProvider (Optimized)

Optimized language management:

```tsx
// Specific hooks for minimal re-renders
const currentLanguage = useCurrentLanguage();
const changeLanguage = useChangeLanguage();
const availableLanguages = useAvailableLanguages();
const isRTL = useIsRTL();
```

## Best Practices

### 1. Use Specific Hooks

```tsx
// ❌ Causes re-renders when any network property changes
const { isConnected } = useNetwork();

// ✅ Only re-renders when isConnected changes
const isConnected = useIsConnected();
```

### 2. Memoize Expensive Computations

```tsx
const { createOptimizedValue } = useOptimizedComponent({
  componentName: 'ExpensiveComponent'
});

const expensiveValue = createOptimizedValue(() => {
  return heavyComputation(data);
}, [data]);
```

### 3. Use Stable Callbacks

```tsx
import { useStableCallback } from '@/src/hooks/useOptimizedComponent';

const handlePress = useStableCallback(() => {
  // Handle press
}, [dependency]);
```

### 4. Track Performance in Development

```tsx
const { trackRender } = usePerformance();

useEffect(() => {
  if (__DEV__) {
    trackRender('MyComponent');
  }
});
```

## Performance Monitoring

### Render Tracking

All components can be tracked for render performance:

```tsx
import { useRenderTracker } from '@/src/contexts/PerformanceContext';

function MyComponent() {
  useRenderTracker('MyComponent');
  // Component will be tracked automatically
}
```

### Interaction Tracking

Track user interactions for performance optimization:

```tsx
const { trackInteraction } = usePerformance();

const handleButtonPress = async () => {
  await trackInteraction('button-press');
  // Perform action
};
```

## Error Handling

The system includes comprehensive error handling:

- **ErrorBoundary**: Catches and handles React errors
- **Fallback UI**: Provides user-friendly error messages
- **Development Logging**: Detailed error information in development
- **Retry Mechanism**: Allows users to retry after errors

## Migration Guide

### From Old Context System

1. **Replace individual providers** with `AppContextProvider`
2. **Update hook imports** to use specific hooks
3. **Add performance tracking** where needed
4. **Test for re-render optimization**

### Example Migration

```tsx
// Before
import { NetworkProvider, LanguageProvider } from './contexts';

function App() {
  return (
    <NetworkProvider>
      <LanguageProvider>
        <MyApp />
      </LanguageProvider>
    </NetworkProvider>
  );
}

// After
import { AppContextProvider } from '@/src/contexts/AppContextProvider';

function App() {
  return (
    <AppContextProvider>
      <MyApp />
    </AppContextProvider>
  );
}
```

## Testing

### Testing with Optimized Contexts

```tsx
import { render } from '@testing-library/react-native';
import { AppContextProvider } from '@/src/contexts/AppContextProvider';

const renderWithContext = (component) => {
  return render(
    <AppContextProvider>
      {component}
    </AppContextProvider>
  );
};
```

### Performance Testing

```tsx
import { usePerformance } from '@/src/contexts/PerformanceContext';

// Mock performance context for testing
jest.mock('@/src/contexts/PerformanceContext', () => ({
  usePerformance: () => ({
    trackRender: jest.fn(),
    trackInteraction: jest.fn(),
    metrics: { renderCount: 0 },
  }),
}));
```

## Debugging

### Performance Debugging

1. **Enable render tracking** in development
2. **Use React DevTools Profiler** to identify re-renders
3. **Check console logs** for performance metrics
4. **Monitor memory usage** with performance provider

### Common Issues

1. **Unnecessary re-renders**: Use specific hooks instead of general ones
2. **Memory leaks**: Ensure proper cleanup in useEffect
3. **Stale closures**: Use stable callbacks and values
4. **Context value changes**: Memoize context values properly

## Future Enhancements

- **Automatic performance optimization suggestions**
- **Real-time performance monitoring dashboard**
- **Advanced error reporting and analytics**
- **Context value persistence and hydration**
- **Automatic re-render detection and warnings**