# Urbanist Font Installation

## Download Instructions

To use the Urbanist font in your Food Rush app, you need to download the font files and place them in this directory.

### Step 1: Download Urbanist Font

1. Go to [Google Fonts - Urbanist](https://fonts.google.com/specimen/Urbanist)
2. Click "Download family" to get the complete font family
3. Extract the ZIP file

### Step 2: Copy Font Files

Copy the following TTF files from the downloaded folder to this `assets/fonts/` directory:

- `Urbanist-Thin.ttf` (100)
- `Urbanist-ExtraLight.ttf` (200)
- `Urbanist-Light.ttf` (300)
- `Urbanist-Regular.ttf` (400)
- `Urbanist-Medium.ttf` (500)
- `Urbanist-SemiBold.ttf` (600)
- `Urbanist-Bold.ttf` (700)
- `Urbanist-ExtraBold.ttf` (800)
- `Urbanist-Black.ttf` (900)

### Step 3: Verify Installation

After copying the files, your `assets/fonts/` directory should contain:

```
assets/fonts/
├── README.md
├── Urbanist-Thin.ttf
├── Urbanist-ExtraLight.ttf
├── Urbanist-Light.ttf
├── Urbanist-Regular.ttf
├── Urbanist-Medium.ttf
├── Urbanist-SemiBold.ttf
├── Urbanist-Bold.ttf
├── Urbanist-ExtraBold.ttf
└── Urbanist-Black.ttf
```

### Alternative: Using Expo Google Fonts

If you prefer to use Expo Google Fonts instead of local files, you can:

1. Install the package:
   ```bash
   npx expo install @expo-google-fonts/urbanist expo-font
   ```

2. Update the font configuration in `src/config/fonts.ts` to use the Expo Google Fonts approach.

## Font Features

Urbanist is a modern, geometric sans-serif font that offers:

- 9 font weights (Thin to Black)
- Excellent readability across all screen sizes
- Modern, clean aesthetic perfect for food delivery apps
- Great support for both display and body text
- Optimized for digital screens

## Usage

Once installed, the fonts will be automatically loaded by the app and available through:

- Typography components (`<Typography>`, `<Heading1>`, etc.)
- NativeWind classes (`font-urbanist`, `font-urbanist-bold`, etc.)
- Direct style objects using the font configuration

## Troubleshooting

If fonts don't load properly:

1. Ensure all TTF files are in the correct directory
2. Check that file names match exactly (case-sensitive)
3. Clear Metro cache: `npx expo start --clear`
4. Restart the development server

## License

Urbanist is available under the Open Font License (OFL), making it free for both personal and commercial use.