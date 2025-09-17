# Food Rush - Bundle Size Optimization Plan

## 🎯 Objective
Reduce the bundle size of the Food Rush customer app while maintaining functionality and implementing responsive design across all screen sizes.

## 📊 Current Analysis

### Dependencies Audit
Based on the current `package.json`, here are the optimization opportunities:

#### 🔴 High Impact Removals (Customer App)
1. **Restaurant-specific dependencies**:
   - `react-native-chart-kit` (6.12.0) - Only used in restaurant analytics
   - `react-native-maps` (1.20.1) - If not used in customer app
   - `expo-auth-session` - If only used for restaurant OAuth

2. **Unused Expo modules**:
   - `expo-blur` - Check if actually used
   - `expo-symbols` - Check if actually used
   - `expo-web-browser` - If not opening external links
   - `expo-crypto` - If not doing client-side encryption

#### 🟡 Medium Impact Optimizations
1. **Icon libraries**:
   - `@expo/vector-icons` - Use tree shaking or replace with smaller alternatives
   - Consider using only specific icon sets instead of the entire library

2. **UI Libraries**:
   - `react-native-element-dropdown` - Replace with native picker if possible
   - `react-native-tab-view` - Use React Navigation tabs instead

#### 🟢 Low Impact but Worth Considering
1. **Development dependencies in production**:
   - Ensure dev dependencies aren't bundled
   - Remove unused TypeScript types

## 🏗️ Implementation Strategy

### Phase 1: Immediate Removals (Week 1)

#### 1.1 Remove Restaurant-Only Dependencies
```bash
# Remove chart library (restaurant analytics only)
npm uninstall react-native-chart-kit

# Remove maps if not used in customer app
npm uninstall react-native-maps

# Remove unused Expo modules
npm uninstall expo-blur expo-symbols expo-web-browser expo-crypto
```

#### 1.2 Code Splitting by User Type
Create separate entry points for customer and restaurant apps:

```typescript
// src/apps/customer/index.tsx
export { default as CustomerApp } from './CustomerApp';

// src/apps/restaurant/index.tsx  
export { default as RestaurantApp } from './RestaurantApp';
```

### Phase 2: Responsive Design Implementation (Week 2)

#### 2.1 Screen Size Breakpoints
```typescript
// src/utils/responsive.ts
export const BREAKPOINTS = {
  xs: 0,     // Small phones
  sm: 576,   // Large phones
  md: 768,   // Tablets
  lg: 992,   // Small laptops
  xl: 1200,  // Large screens
} as const;

export const useBreakpoint = () => {
  const { width } = useWindowDimensions();
  
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};
```

#### 2.2 Responsive Components
```typescript
// src/components/responsive/ResponsiveContainer.tsx
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: keyof typeof BREAKPOINTS;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg',
}) => {
  const breakpoint = useBreakpoint();
  const { width } = useWindowDimensions();
  
  const containerWidth = Math.min(width, BREAKPOINTS[maxWidth]);
  
  return (
    <View 
      style={{ width: containerWidth, alignSelf: 'center' }}
      className={className}
    >
      {children}
    </View>
  );
};
```

### Phase 3: Icon Optimization (Week 3)

#### 3.1 Custom Icon Component
```typescript
// src/components/common/Icon.tsx
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const ICON_SETS = {
  material: MaterialIcons,
  ionicons: Ionicons,
} as const;

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  set?: keyof typeof ICON_SETS;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  set = 'material',
}) => {
  const IconComponent = ICON_SETS[set];
  return <IconComponent name={name} size={size} color={color} />;
};
```

#### 3.2 Icon Tree Shaking
```typescript
// babel.config.js
module.exports = {
  plugins: [
    [
      'react-native-vector-icons/lib/babel',
      {
        platforms: {
          ios: {
            iconSets: ['MaterialIcons', 'Ionicons'], // Only include used sets
          },
          android: {
            iconSets: ['MaterialIcons', 'Ionicons'],
          },
        },
      },
    ],
  ],
};
```

### Phase 4: Image Optimization (Week 4)

#### 4.1 Image Compression
```typescript
// src/utils/imageOptimization.ts
export const getOptimizedImageUri = (
  uri: string,
  width: number,
  quality: number = 80
) => {
  // Use Expo Image with optimization
  return {
    uri,
    width,
    height: width,
    format: 'webp',
    quality,
  };
};
```

#### 4.2 Lazy Loading Images
```typescript
// src/components/common/LazyImage.tsx
import { Image } from 'expo-image';

interface LazyImageProps {
  source: string;
  width: number;
  height: number;
  placeholder?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  source,
  width,
  height,
  placeholder,
}) => {
  return (
    <Image
      source={{ uri: source }}
      style={{ width, height }}
      placeholder={placeholder}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
    />
  );
};
```

## 📱 Responsive Design Implementation

### 1. Layout Components

#### 1.1 Responsive Grid System
```typescript
// src/components/responsive/Grid.tsx
interface GridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  spacing?: number;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  spacing = 16,
}) => {
  const breakpoint = useBreakpoint();
  const columnCount = columns[breakpoint] || columns.xs || 1;
  
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -spacing / 2 }}>
      {React.Children.map(children, (child, index) => (
        <View
          style={{
            width: `${100 / columnCount}%`,
            padding: spacing / 2,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
};
```

#### 1.2 Responsive Typography
```typescript
// src/components/responsive/Typography.tsx
interface ResponsiveTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  children: React.ReactNode;
  className?: string;
}

const FONT_SIZES = {
  h1: { xs: 24, sm: 28, md: 32, lg: 36 },
  h2: { xs: 20, sm: 24, md: 28, lg: 32 },
  h3: { xs: 18, sm: 20, md: 24, lg: 28 },
  body: { xs: 14, sm: 16, md: 16, lg: 18 },
  caption: { xs: 12, sm: 14, md: 14, lg: 16 },
};

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  variant = 'body',
  children,
  className = '',
}) => {
  const breakpoint = useBreakpoint();
  const fontSize = FONT_SIZES[variant][breakpoint];
  
  return (
    <Text style={{ fontSize }} className={className}>
      {children}
    </Text>
  );
};
```

### 2. Screen-Specific Responsive Layouts

#### 2.1 Home Screen Responsive Grid
```typescript
// Update HomeScreen.tsx
const HomeScreen = () => {
  const breakpoint = useBreakpoint();
  
  const getColumnsForCategories = () => {
    switch (breakpoint) {
      case 'xs': return 2;
      case 'sm': return 3;
      case 'md': return 4;
      case 'lg': return 5;
      case 'xl': return 6;
      default: return 2;
    }
  };
  
  const getColumnsForRestaurants = () => {
    switch (breakpoint) {
      case 'xs': return 1;
      case 'sm': return 1;
      case 'md': return 2;
      case 'lg': return 2;
      case 'xl': return 3;
      default: return 1;
    }
  };
  
  // Use in FlatList numColumns prop
  return (
    <ResponsiveContainer>
      <FlatList
        data={categories}
        numColumns={getColumnsForCategories()}
        key={breakpoint} // Force re-render on breakpoint change
        renderItem={renderCategoryItem}
      />
    </ResponsiveContainer>
  );
};
```

#### 2.2 Restaurant Detail Responsive Layout
```typescript
// Update RestaurantDetailScreen.tsx
const RestaurantDetailScreen = () => {
  const breakpoint = useBreakpoint();
  const isTablet = ['md', 'lg', 'xl'].includes(breakpoint);
  
  if (isTablet) {
    return (
      <ResponsiveContainer maxWidth="lg">
        <View className="flex-row">
          {/* Left column - Restaurant info */}
          <View className="flex-1 pr-4">
            <RestaurantInfo />
          </View>
          
          {/* Right column - Menu */}
          <View className="flex-1 pl-4">
            <MenuSection />
          </View>
        </View>
      </ResponsiveContainer>
    );
  }
  
  // Mobile layout (existing)
  return <MobileLayout />;
};
```

## 🧹 Unused Code Removal

### 1. Automated Detection
```bash
# Install dependency analysis tools
npm install --save-dev depcheck unimported

# Run analysis
npx depcheck
npx unimported
```

### 2. Manual Audit Checklist

#### 2.1 Components to Review
- [ ] `src/components/restaurant/` - Remove if customer-only build
- [ ] `src/screens/restaurant/` - Remove if customer-only build
- [ ] `src/hooks/restaurant/` - Remove if customer-only build
- [ ] `src/services/restaurant/` - Remove if customer-only build

#### 2.2 Utilities to Review
- [ ] Chart utilities in `src/utils/`
- [ ] Restaurant-specific validation schemas
- [ ] Unused translation keys
- [ ] Unused image assets

#### 2.3 Dependencies to Remove
```typescript
// Remove from package.json if not used in customer app
const CUSTOMER_UNUSED_DEPS = [
  'react-native-chart-kit',
  'react-native-maps', // If not used
  'expo-blur', // If not used
  'expo-symbols', // If not used
  'expo-web-browser', // If not used
  'expo-crypto', // If not used
  'react-native-element-dropdown', // Replace with native
];
```

## 📊 Bundle Analysis Tools

### 1. Metro Bundle Analyzer
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable bundle analysis
config.serializer.createModuleIdFactory = () => (path) => {
  return require('crypto').createHash('sha1').update(path).digest('hex');
};

module.exports = config;
```

### 2. Bundle Size Monitoring
```bash
# Add to package.json scripts
"analyze:bundle": "npx expo export --platform ios --dev false --clear && npx expo-bundle-analyzer dist/bundles/ios-*.js",
"size:check": "bundlesize"
```

### 3. Performance Monitoring
```typescript
// src/utils/performance.ts
export const measureBundleSize = () => {
  if (__DEV__) {
    const bundleSize = require('react-native').DevSettings.getBundleSize?.();
    console.log('Bundle size:', bundleSize);
  }
};
```

## 🎯 Expected Results

### Bundle Size Reduction Targets
- **Phase 1**: 15-20% reduction (removing unused deps)
- **Phase 2**: 5-10% reduction (responsive optimizations)
- **Phase 3**: 10-15% reduction (icon optimization)
- **Phase 4**: 5-10% reduction (image optimization)

**Total Expected Reduction: 35-55%**

### Performance Improvements
- Faster app startup time
- Reduced memory usage
- Better performance on low-end devices
- Improved user experience across all screen sizes

### Responsive Design Benefits
- Consistent UI across all device sizes
- Better tablet experience
- Future-proof for new device form factors
- Improved accessibility

## 📋 Implementation Timeline

### Week 1: Dependency Cleanup
- [ ] Remove restaurant-only dependencies
- [ ] Set up bundle analysis tools
- [ ] Create customer-only build configuration

### Week 2: Responsive Foundation
- [ ] Implement breakpoint system
- [ ] Create responsive container components
- [ ] Update core layout components

### Week 3: Icon & Asset Optimization
- [ ] Implement icon tree shaking
- [ ] Optimize image loading
- [ ] Remove unused assets

### Week 4: Testing & Refinement
- [ ] Test on multiple device sizes
- [ ] Performance testing
- [ ] Bundle size verification
- [ ] Documentation updates

## 🔧 Maintenance

### Ongoing Monitoring
1. **Bundle Size Alerts**: Set up CI/CD to alert on bundle size increases
2. **Dependency Audits**: Monthly review of dependencies
3. **Performance Monitoring**: Track app performance metrics
4. **Responsive Testing**: Regular testing on various screen sizes

### Best Practices
1. **Lazy Loading**: Implement for non-critical components
2. **Code Splitting**: Split by user type and features
3. **Tree Shaking**: Ensure all imports are tree-shakeable
4. **Asset Optimization**: Compress and optimize all assets

---

**Implementation Priority**: High
**Estimated Effort**: 4 weeks
**Expected Bundle Reduction**: 35-55%
**Responsive Design Coverage**: 100% of customer app screens