# Typography Guide - Food Rush App

## Overview

This guide ensures consistent typography usage across all screens, components, and navigation elements in the Food Rush app. All text should use the **Urbanist font family** and the Typography component system for consistency and responsiveness.

## Typography System

### Core Components

Import typography components from the common components:

```typescript
import { 
  Typography,
  Display1, Display2,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  BodyLarge, Body, BodySmall,
  LabelLarge, Label, LabelSmall,
  Caption, Overline
} from '@/src/components/common/Typography';
```

### Typography Hierarchy

#### Display Text (Large Impact)
- **Display1**: 48px - Hero sections, splash screens
- **Display2**: 40px - Major section headers

#### Headings (Structure)
- **Heading1**: 32px Bold - Page titles, main headers
- **Heading2**: 28px SemiBold - Section headers
- **Heading3**: 24px SemiBold - Subsection headers
- **Heading4**: 20px Medium - Card titles
- **Heading5**: 18px Medium - List item titles
- **Heading6**: 16px Medium - Small headers

#### Body Text (Content)
- **BodyLarge**: 18px Regular - Important content, descriptions
- **Body**: 16px Regular - Standard content, paragraphs
- **BodySmall**: 14px Regular - Secondary content, metadata

#### Labels (UI Elements)
- **LabelLarge**: 16px Medium - Form labels, important UI text
- **Label**: 14px Medium - Button text, standard labels
- **LabelSmall**: 12px Medium - Compact UI elements

#### Small Text (Supporting)
- **Caption**: 12px Regular - Image captions, footnotes
- **Overline**: 10px Medium - Section categories, tags

## Font Weights

All typography uses Urbanist font family with these weights:

- **thin**: Urbanist-Thin (100)
- **extraLight**: Urbanist-ExtraLight (200)
- **light**: Urbanist-Light (300)
- **regular**: Urbanist-Regular (400) - Default
- **medium**: Urbanist-Medium (500)
- **semibold**: Urbanist-SemiBold (600)
- **bold**: Urbanist-Bold (700)
- **extraBold**: Urbanist-ExtraBold (800)
- **black**: Urbanist-Black (900)

## Usage Examples

### Basic Usage

```tsx
// ❌ Don't use raw Text components
<Text style={{ fontSize: 24, fontWeight: 'bold' }}>Title</Text>

// ✅ Use Typography components
<Heading3>Title</Heading3>
```

### With Props

```tsx
// Color and alignment
<Body color={colors.primary} align="center">
  Centered primary text
</Body>

// Custom weight
<Typography variant="body" weight="semibold">
  Semi-bold body text
</Typography>

// Multiple props
<Heading2 
  color={colors.onSurface} 
  weight="bold" 
  align="center"
  style={{ marginBottom: 16 }}
>
  Custom styled heading
</Heading2>
```

### Responsive Typography

```tsx
// Responsive sizing (default)
<Heading1 responsive={true}>Scales with screen size</Heading1>

// Fixed sizing
<Heading1 responsive={false}>Fixed size</Heading1>
```

## Migration Guide

### From Raw Text Components

```tsx
// Before
<Text style={{ 
  fontSize: 16, 
  fontWeight: 'bold', 
  color: colors.onSurface,
  textAlign: 'center'
}}>
  Button Text
</Text>

// After
<Label 
  weight="bold" 
  color={colors.onSurface} 
  align="center"
>
  Button Text
</Label>
```

### From Hardcoded Styles

```tsx
// Before
<Text style={styles.title}>Page Title</Text>

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  }
});

// After
<Heading3 color={colors.onSurface}>Page Title</Heading3>
```

### From className Styles

```tsx
// Before
<Text className="text-lg font-semibold text-center">Label</Text>

// After
<LabelLarge weight="semibold" align="center">Label</LabelLarge>
```

## Navigation Headers

Navigation headers automatically use Urbanist fonts through the RootNavigator configuration:

```typescript
headerTitleStyle: {
  fontFamily: 'Urbanist-SemiBold',
  fontSize: 18,
  fontWeight: '600',
  color: colors.text,
}
```

## Best Practices

### 1. Always Use Typography Components
- Never use raw `<Text>` components
- Import from `@/src/components/common/Typography`
- Use semantic component names (Heading1, Body, etc.)

### 2. Consistent Hierarchy
- Use heading levels logically (H1 → H2 → H3)
- Don't skip heading levels
- Use Body for paragraph content

### 3. Responsive Design
- Enable responsive sizing by default
- Test on different screen sizes
- Consider accessibility font scaling

### 4. Color Usage
- Use theme colors: `colors.onSurface`, `colors.primary`, etc.
- Ensure sufficient contrast
- Test in both light and dark modes

### 5. Spacing and Layout
- Use consistent margins/padding
- Align text appropriately
- Consider line height for readability

## Common Patterns

### Screen Headers
```tsx
<Heading1 color={colors.onSurface} style={{ marginBottom: 8 }}>
  Screen Title
</Heading1>
<Body color={colors.onSurfaceVariant} style={{ marginBottom: 24 }}>
  Screen description or subtitle
</Body>
```

### Card Content
```tsx
<Heading4 color={colors.onSurface}>Card Title</Heading4>
<Body color={colors.onSurfaceVariant}>Card description</Body>
<Caption color={colors.onSurfaceVariant}>Additional info</Caption>
```

### Form Labels
```tsx
<Label color={colors.onSurface} style={{ marginBottom: 8 }}>
  Field Label
</Label>
```

### Button Text
```tsx
<LabelLarge color={colors.onPrimary} weight="semibold">
  Button Text
</LabelLarge>
```

### Empty States
```tsx
<Heading5 color={colors.onSurfaceVariant} align="center">
  No items found
</Heading5>
<Body color={colors.onSurfaceVariant} align="center">
  Try adjusting your search criteria
</Body>
```

## Accessibility

### Font Scaling
- Typography components respect user font size preferences
- Test with large font sizes enabled
- Ensure layouts don't break with scaled fonts

### Color Contrast
- Maintain WCAG AA contrast ratios
- Test with high contrast mode
- Provide alternative text for important information

### Screen Readers
- Use semantic heading structure
- Provide meaningful text content
- Test with screen readers enabled

## Testing

### Visual Testing
- Test on different screen sizes (phone, tablet)
- Verify font loading and fallbacks
- Check both light and dark themes

### Accessibility Testing
- Enable large fonts in device settings
- Test with screen readers
- Verify color contrast ratios

### Performance Testing
- Monitor font loading times
- Check for layout shifts
- Verify responsive behavior

## Troubleshooting

### Fonts Not Loading
1. Check font files in `assets/fonts/`
2. Verify font loading in `src/hooks/useFonts.ts`
3. Ensure proper font family names in `src/config/fonts.ts`

### Inconsistent Sizing
1. Check responsive settings
2. Verify screen width calculations
3. Test on different devices

### Style Conflicts
1. Remove hardcoded fontSize/fontFamily
2. Use Typography components consistently
3. Check for conflicting className styles

## Resources

- **Typography Showcase**: `src/components/common/TypographyShowcase.tsx`
- **Font Configuration**: `src/config/fonts.ts`
- **Migration Utility**: `src/utils/typographyMigration.ts`
- **Responsive Hooks**: `src/hooks/useResponsive.ts`

## Checklist

Before submitting code, ensure:

- [ ] All text uses Typography components
- [ ] No raw `<Text>` components remain
- [ ] Proper semantic hierarchy (H1 → H2 → H3)
- [ ] Responsive sizing enabled where appropriate
- [ ] Theme colors used consistently
- [ ] Tested on multiple screen sizes
- [ ] Accessibility considerations addressed
- [ ] Navigation headers use Urbanist fonts
- [ ] Font weights are semantically appropriate