#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📊 Bundle Size Monitor\n');

// Get current bundle size
function getCurrentBundleSize() {
  try {
    const result = execSync('du -sh . --exclude=node_modules --exclude=.git --exclude=.expo', { encoding: 'utf8' });
    return result.trim().split('\t')[0];
  } catch (error) {
    return 'Unknown';
  }
}

// Get asset breakdown
function getAssetBreakdown() {
  const breakdown = {};
  
  try {
    // Images
    const imagesResult = execSync('du -sh assets/images', { encoding: 'utf8' });
    breakdown.images = imagesResult.trim().split('\t')[0];
    
    // Fonts
    const fontsResult = execSync('du -sh assets/fonts', { encoding: 'utf8' });
    breakdown.fonts = fontsResult.trim().split('\t')[0];
    
    // Sounds
    const soundsResult = execSync('du -sh assets/sounds', { encoding: 'utf8' });
    breakdown.sounds = soundsResult.trim().split('\t')[0];
    
    // Source code
    const srcResult = execSync('du -sh src', { encoding: 'utf8' });
    breakdown.source = srcResult.trim().split('\t')[0];
    
  } catch (error) {
    console.log('Error getting breakdown:', error.message);
  }
  
  return breakdown;
}

// Main monitoring
console.log('Current Bundle Size:', getCurrentBundleSize());
console.log('\nBreakdown:');

const breakdown = getAssetBreakdown();
Object.entries(breakdown).forEach(([key, value]) => {
  console.log(`├── ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);
});

// Check for optimization opportunities
console.log('\n🎯 Optimization Opportunities:');

// Check for large images
try {
  const largeImages = execSync('find assets/images -type f -size +500k', { encoding: 'utf8' }).trim();
  if (largeImages) {
    console.log('├── Large images found (>500KB):');
    largeImages.split('\n').forEach(file => {
      const size = execSync(`du -h "${file}"`, { encoding: 'utf8' }).trim().split('\t')[0];
      console.log(`│   └── ${file}: ${size}`);
    });
  }
} catch (error) {
  console.log('├── No large images found');
}

// Check for unused font weights
const fontFiles = fs.readdirSync('assets/fonts').filter(f => f.endsWith('.ttf'));
console.log(`├── Font files: ${fontFiles.length} (consider reducing unused weights)`);

console.log('\n📈 Recommendations:');
console.log('├── Compress large images (especially vendor_background.jpg)');
console.log('├── Remove unused font weights');
console.log('├── Use SVG instead of PNG where possible');
console.log('└── Remove unused dependencies');

console.log('\n✅ Monitoring complete!');