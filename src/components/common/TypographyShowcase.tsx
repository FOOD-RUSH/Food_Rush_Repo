import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { 
  Typography,
  Display1,
  Display2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  BodyLarge,
  Body,
  BodySmall,
  LabelLarge,
  Label,
  LabelSmall,
  Caption,
  Overline
} from './Typography';
import { ResponsiveContainer, ResponsiveColumn } from './ResponsiveContainer';
import { useResponsive } from '@/src/hooks/useResponsive';

export const TypographyShowcase: React.FC = () => {
  const { colors } = useTheme();
  const { screen, isSmallScreen, isTablet } = useResponsive();

  const sectionStyle = {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <ResponsiveContainer padding="lg">
        <ResponsiveColumn>
          {/* Screen Info */}
          <View style={sectionStyle}>
            <Heading3 color={colors.primary}>Screen Information</Heading3>
            <Body>Width: {screen.width}px</Body>
            <Body>Height: {screen.height}px</Body>
            <Body>Scale: {screen.scale}</Body>
            <Body>Font Scale: {screen.fontScale}</Body>
            <Body>Device Type: {isSmallScreen ? 'Small Phone' : isTablet ? 'Tablet' : 'Large Phone'}</Body>
          </View>

          {/* Display Typography */}
          <View style={sectionStyle}>
            <Heading3 color={colors.primary}>Display Typography</Heading3>
            <Display1>Display 1 - Urbanist Bold</Display1>
            <Display2>Display 2 - Urbanist Bold</Display2>
          </View>

          {/* Headings */}
          <View style={sectionStyle}>
            <Heading3 color={colors.primary}>Headings</Heading3>
            <Heading1>Heading 1 - Bold</Heading1>
            <Heading2>Heading 2 - SemiBold</Heading2>
            <Heading3>Heading 3 - SemiBold</Heading3>
            <Heading4>Heading 4 - Medium</Heading4>
            <Heading5>Heading 5 - Medium</Heading5>
            <Heading6>Heading 6 - Medium</Heading6>
          </View>

          {/* Body Text */}
          <View style={sectionStyle}>
            <Heading3 color={colors.primary}>Body Text</Heading3>
            <BodyLarge>
              Body Large - This is a larger body text that's perfect for important content 
              that needs more emphasis while remaining readable.
            </BodyLarge>
            <Body>
              Body Regular - This is the standard body text used throughout the app. 
              It's optimized for readability and comfortable reading experience.
            </Body>
            <BodySmall>
              Body Small - This is smaller body text used for secondary information 
              or when space is limited but readability is still important.
            </BodySmall>
          </View>

          {/* Labels */}
          <View style={sectionStyle}>
            <Heading3 color={colors.primary}>Labels</Heading3>
            <LabelLarge>Label Large - Form labels and important UI text</LabelLarge>
            <Label>Label Regular - Standard UI labels and buttons</Label>
            <LabelSmall>Label Small - Compact UI elements</LabelSmall>
          </View>

          {/* Small Text */}
          <View style={sectionStyle}>
            <Heading3 color={colors.primary}>Small Text</Heading3>
            <Caption>Caption - Additional information and metadata</Caption>
            <Overline>OVERLINE - SECTION HEADERS AND CATEGORIES</Overline>
          </View>

          {/* Font Weights Demo */}
          <View style={sectionStyle}>
            <Heading3 color={colors.primary}>Font Weights</Heading3>
            <Typography variant="body" weight="thin">Urbanist Thin (100)</Typography>
            <Typography variant="body" weight="extraLight">Urbanist Extra Light (200)</Typography>
            <Typography variant="body" weight="light">Urbanist Light (300)</Typography>
            <Typography variant="body" weight="regular">Urbanist Regular (400)</Typography>
            <Typography variant="body" weight="medium">Urbanist Medium (500)</Typography>
            <Typography variant="body" weight="semibold">Urbanist SemiBold (600)</Typography>
            <Typography variant="body" weight="bold">Urbanist Bold (700)</Typography>
            <Typography variant="body" weight="extraBold">Urbanist Extra Bold (800)</Typography>
            <Typography variant="body" weight="black">Urbanist Black (900)</Typography>
          </View>

          {/* Color Variations */}
          <View style={sectionStyle}>
            <Heading3 color={colors.primary}>Color Variations</Heading3>
            <Body color={colors.primary}>Primary Color Text</Body>
            <Body color={colors.onSurface}>Default Text Color</Body>
            <Body color={colors.onSurfaceVariant}>Secondary Text Color</Body>
            <Body color={colors.error}>Error Text Color</Body>
          </View>

          {/* Alignment Demo */}
          <View style={sectionStyle}>
            <Heading3 color={colors.primary}>Text Alignment</Heading3>
            <Body align="left">Left aligned text (default)</Body>
            <Body align="center">Center aligned text</Body>
            <Body align="right">Right aligned text</Body>
            <Body align="justify">
              Justified text that spreads across the full width of the container 
              for a clean, professional appearance in longer paragraphs.
            </Body>
          </View>

          {/* Responsive Demo */}
          <View style={sectionStyle}>
            <Heading3 color={colors.primary}>Responsive Behavior</Heading3>
            <Typography variant="h2" responsive={true}>
              This heading scales with screen size
            </Typography>
            <Typography variant="h2" responsive={false}>
              This heading has fixed size
            </Typography>
            <Body>
              The responsive typography automatically adjusts font sizes based on 
              screen dimensions and user accessibility settings for optimal readability.
            </Body>
          </View>
        </ResponsiveColumn>
      </ResponsiveContainer>
    </ScrollView>
  );
};

export default TypographyShowcase;