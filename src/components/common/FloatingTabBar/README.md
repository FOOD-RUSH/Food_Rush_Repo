# Floating Tab Bar Component

A custom floating tab bar component that replaces the default React Navigation bottom tab bar with a modern, detached design.

## Features

- **Floating Design**: Detached from the bottom edge with proper spacing
- **Cross-Platform**: Optimized for both iOS and Android with platform-specific styling
- **Responsive**: Adapts to different screen sizes (90% of screen width)
- **Accessible**: Maintains proper touch targets and accessibility features
- **Themed**: Integrates with your app's theme system
- **User Type Support**: Different icons for customer and restaurant modes

## Usage

The component is automatically used in both `CustomerNavigator` and `RestaurantNavigator`:

```tsx
<CustomerTab.Navigator
  tabBar={(props) => (
    <FloatingTabBar {...props} userType="customer" />
  )}
  // ... other props
>
```

## Styling

The floating tab bar includes:

- **Position**: 30-35px from bottom (more on iOS for safe area)
- **Width**: 90% of screen width
- **Height**: 70px for better touch targets
- **Border Radius**: 30px for modern rounded appearance
- **Shadow**: Enhanced elevation/shadow for floating effect
- **Background**: Uses theme card color with subtle border

## Platform Differences

### iOS

- Larger bottom margin to account for home indicator
- Uses shadow with higher opacity and radius
- Slightly different padding adjustments

### Android

- Uses elevation instead of shadow
- Optimized touch targets for Android guidelines
- Material Design compliant spacing

## Customization

The component automatically adapts to:

- Light/dark themes
- Different user types (customer/restaurant)
- Safe area insets
- Screen orientations

## Icons

### Customer Mode

- Home: `home` / `home-outline`
- Orders: `bookmark` / `bookmark-outline`
- Profile: `person` / `person-outline`

### Restaurant Mode

- Orders: `receipt` / `receipt-outline`
- Menu: `restaurant` / `restaurant-outline`
- Analytics: `bar-chart` / `bar-chart-outline`
- Account: `person` / `person-outline`
