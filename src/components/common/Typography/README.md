# Typography System

## Overview

The Typography system provides a consistent, responsive, and accessible text rendering solution for the Food Rush app. All text components use the **Urbanist font family** and follow a semantic hierarchy for optimal user experience.

## Quick Start

```tsx
import { Heading1, Body, Label } from '@/src/components/common/Typography';

function MyComponent() {
  return (
    <View>
      <Heading1>Page Title</Heading1>
      <Body>This is body text content.</Body>
      <Label>Button Label</Label>
    </View>
  );
}
```

## Components

### Display Typography

- `<Display1>` - 48px, Bold - Hero sections
- `<Display2>` - 40px, Bold - Major headers

### Headings

- `<Heading1>` - 32px, Bold - Page titles
- `<Heading2>` - 28px, SemiBold - Section headers
- `<Heading3>` - 24px, SemiBold - Subsection headers
- `<Heading4>` - 20px, Medium - Card titles
- `<Heading5>` - 18px, Medium - List titles
- `<Heading6>` - 16px, Medium - Small headers

### Body Text

- `<BodyLarge>` - 18px, Regular - Important content
- `<Body>` - 16px, Regular - Standard content
- `<BodySmall>` - 14px, Regular - Secondary content

### Labels

- `<LabelLarge>` - 16px, Medium - Form labels
- `<Label>` - 14px, Medium - Button text
- `<LabelSmall>` - 12px, Medium - Compact UI

### Small Text

- `<Caption>` - 12px, Regular - Captions
- `<Overline>` - 10px, Medium - Categories

## Props

All Typography components accept these props:

```tsx
interface TypographyProps {
  variant?: TypographyVariant; // Override default variant
  weight?: UrbanistWeight; // Font weight
  color?: string; // Text color
  align?: 'left' | 'center' | 'right' | 'justify';
  responsive?: boolean; // Enable responsive sizing
  style?: TextStyle | TextStyle[]; // Additional styles
  children: React.ReactNode; // Text content
  // ...all React Native Text props
}
```

## Examples

### Basic Usage

```tsx
<Heading1>Welcome to Food Rush</Heading1>
<Body>Find your favorite restaurants and order delicious food.</Body>
```

### With Props

```tsx
<Heading2
  color={colors.primary}
  align="center"
  style={{ marginBottom: 16 }}
>
  Featured Restaurants
</Heading2>

<Body color={colors.onSurfaceVariant}>
  Discover amazing local cuisine
</Body>
```

### Custom Weight

```tsx
<Typography variant="body" weight="semibold">
  Important announcement
</Typography>
```

### Responsive Sizing

```tsx
// Automatically scales with screen size (default)
<Heading1 responsive={true}>Responsive Title</Heading1>

// Fixed size across all screens
<Heading1 responsive={false}>Fixed Title</Heading1>
```

## Font Weights

Urbanist font family includes these weights:

- `thin` (100) - Urbanist-Thin
- `extraLight` (200) - Urbanist-ExtraLight
- `light` (300) - Urbanist-Light
- `regular` (400) - Urbanist-Regular _(default)_
- `medium` (500) - Urbanist-Medium
- `semibold` (600) - Urbanist-SemiBold
- `bold` (700) - Urbanist-Bold
- `extraBold` (800) - Urbanist-ExtraBold
- `black` (900) - Urbanist-Black

## Responsive Behavior

Typography components automatically adjust font sizes based on:

- Screen width and height
- Device pixel density
- User accessibility settings
- Device type (phone, tablet)

### Breakpoints

- **xs**: < 640px (Small phones)
- **sm**: 640px - 768px (Large phones)
- **md**: 768px - 1024px (Tablets)
- **lg**: 1024px - 1280px (Large tablets)
- **xl**: > 1280px (Desktop)

## Accessibility

### Font Scaling

- Respects user font size preferences
- Maintains readability at all scale levels
- Preserves layout integrity

### Color Contrast

- Use theme colors for proper contrast
- Test with high contrast mode
- Ensure WCAG AA compliance

### Screen Readers

- Semantic heading structure
- Meaningful text content
- Proper reading order

## Best Practices

### ✅ Do

```tsx
// Use semantic components
<Heading1>Page Title</Heading1>
<Body>Content text</Body>

// Use theme colors
<Body color={colors.onSurface}>Text</Body>

// Follow heading hierarchy
<Heading1>Main Title</Heading1>
<Heading2>Section</Heading2>
<Heading3>Subsection</Heading3>
```

### ❌ Don't

```tsx
// Don't use raw Text components
<Text style={{ fontSize: 24 }}>Title</Text>

// Don't hardcode colors
<Body color="#000000">Text</Body>

// Don't skip heading levels
<Heading1>Main Title</Heading1>
<Heading4>Subsection</Heading4> // Skip H2, H3
```

## Migration Guide

### From Raw Text

```tsx
// Before
<Text style={{ fontSize: 16, fontWeight: 'bold' }}>
  Button Text
</Text>

// After
<Label weight="bold">Button Text</Label>
```

### From Styled Components

```tsx
// Before
const StyledText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000;
`;

// After
<Heading3 color={colors.onSurface}>Title</Heading3>;
```

### From className

```tsx
// Before
<Text className="text-lg font-semibold">Label</Text>

// After
<LabelLarge weight="semibold">Label</LabelLarge>
```

## Testing

### Visual Testing

```tsx
// Test different screen sizes
import { TypographyShowcase } from '@/src/components/common/TypographyShowcase';

// Use in development
<TypographyShowcase />;
```

### Accessibility Testing

- Enable large fonts in device settings
- Test with screen readers
- Verify color contrast ratios

## Troubleshooting

### Fonts Not Loading

1. Check font files in `assets/fonts/`
2. Verify font loading in `useFonts` hook
3. Ensure proper font names in config

### Inconsistent Sizing

1. Check responsive settings
2. Verify screen width calculations
3. Test on different devices

### Style Conflicts

1. Remove hardcoded fontSize/fontFamily
2. Use Typography components consistently
3. Check for conflicting styles

## Related Files

- **Components**: `src/components/common/Typography.tsx`
- **Configuration**: `src/config/fonts.ts`
- **Hooks**: `src/hooks/useResponsive.ts`
- **Migration**: `src/utils/typographyMigration.ts`
- **Audit**: `src/utils/typographyAudit.ts`
- **Guide**: `src/docs/TYPOGRAPHY_GUIDE.md`
