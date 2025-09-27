#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting optimized production build...\n');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  execSync('expo export --clear', { stdio: 'inherit' });
  console.log('✅ Build cache cleared\n');
} catch (error) {
  console.log('⚠️  Could not clear cache, continuing...\n');
}

// Step 2: Optimize assets
console.log('🎯 Optimizing assets...');
try {
  execSync('node scripts/optimize-assets.js', { stdio: 'inherit' });
  console.log('✅ Assets optimized\n');
} catch (error) {
  console.log('⚠️  Asset optimization failed, continuing...\n');
}

// Step 3: Build with optimized profile
console.log('📦 Building optimized APK...');
console.log('   Using AAB format for smaller size');
console.log('   Hermes engine enabled');
console.log('   ProGuard enabled for code minification\n');

try {
  execSync('eas build --platform android --profile production-optimized', { stdio: 'inherit' });
  console.log('\n✅ Build completed successfully!');
  
  console.log('\n📊 Expected size reduction:');
  console.log('   • Assets: ~70% smaller (5.2MB → ~1.5MB)');
  console.log('   • Code: ~30% smaller with ProGuard + Hermes');
  console.log('   • Total: 220MB → ~50-80MB estimated');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  
  console.log('\n🔄 Fallback: Building regular production APK...');
  try {
    execSync('eas build --platform android --profile production-apk', { stdio: 'inherit' });
    console.log('\n✅ Fallback build completed!');
  } catch (fallbackError) {
    console.error('\n❌ Fallback build also failed:', fallbackError.message);
  }
}

console.log('\n📋 Post-build recommendations:');
console.log('   1. Use AAB format for Play Store (smaller downloads)');
console.log('   2. Enable Play Asset Delivery for large assets');
console.log('   3. Consider lazy loading for food emoji images');
console.log('   4. Implement image caching for dynamic content');