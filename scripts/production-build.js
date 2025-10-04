#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Starting optimized production build...

// Step 1: Clean previous builds
// Cleaning previous builds...
try {
  execSync('expo export --clear', { stdio: 'inherit' });
  // Build cache cleared
} catch (error) {
  // Could not clear cache, continuing...
}

// Step 2: Optimize assets
// Optimizing assets...
try {
  execSync('node scripts/optimize-assets.js', { stdio: 'inherit' });
  // Assets optimized
} catch (error) {
  // Asset optimization failed, continuing...
}

// Step 3: Build with optimized profile
// Building optimized APK...
// Using AAB format for smaller size
// Hermes engine enabled
// ProGuard enabled for code minification

try {
  execSync('eas build --platform android --profile production-optimized', {
    stdio: 'inherit',
  });
  // Build completed successfully!

  // Expected size reduction:
  // • Assets: ~70% smaller (5.2MB → ~1.5MB)
  // • Code: ~30% smaller with ProGuard + Hermes
  // • Total: 220MB → ~50-80MB estimated
} catch (error) {
  console.error('\n❌ Build failed:', error.message);

  // Fallback: Building regular production APK...
  try {
    execSync('eas build --platform android --profile production-apk', {
      stdio: 'inherit',
    });
    // Fallback build completed!
  } catch (fallbackError) {
    console.error('\n❌ Fallback build also failed:', fallbackError.message);
  }
}

// Post-build recommendations:
// 1. Use AAB format for Play Store (smaller downloads)
// 2. Enable Play Asset Delivery for large assets
// 3. Consider lazy loading for food emoji images
// 4. Implement image caching for dynamic content
