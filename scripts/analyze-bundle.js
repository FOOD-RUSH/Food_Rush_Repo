#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Analyzing bundle size...\n');

// Function to get directory size
function getDirSize(dirPath) {
  try {
    const result = execSync(`du -sh "${dirPath}" 2>/dev/null || echo "0K"`, { encoding: 'utf8' });
    return result.trim().split('\t')[0];
  } catch (error) {
    return '0K';
  }
}

// Function to get file size
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const size = stats.size;
    if (size > 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)}MB`;
    } else if (size > 1024) {
      return `${(size / 1024).toFixed(2)}KB`;
    }
    return `${size}B`;
  } catch (error) {
    return '0B';
  }
}

// Analyze assets
console.log('📁 Asset Analysis:');
console.log(`├── Total assets: ${getDirSize('assets')}`);
console.log(`├── Images: ${getDirSize('assets/images')}`);
console.log(`├── Fonts: ${getDirSize('assets/fonts')}`);
console.log(`└── Sounds: ${getDirSize('assets/sounds')}\n`);

// Analyze large files
console.log('📊 Large Files (>100KB):');
try {
  const largeFiles = execSync(`find assets -type f -size +100k -exec du -h {} + | sort -hr`, { encoding: 'utf8' });
  console.log(largeFiles);
} catch (error) {
  console.log('No large files found or error occurred');
}

// Analyze node_modules
console.log('📦 Dependencies:');
console.log(`└── node_modules: ${getDirSize('node_modules')}\n`);

// Check for duplicate files
console.log('🔍 Checking for potential optimizations...');

// Check for both SVG and PNG versions of same files
const imageDir = 'assets/images';
const duplicates = [];

function findDuplicates(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    if (file.isDirectory()) {
      findDuplicates(path.join(dir, file.name));
    } else {
      const baseName = file.name.replace(/\.(png|svg|jpg|jpeg)$/i, '');
      const fullPath = path.join(dir, file.name);
      
      // Check if both PNG and SVG exist
      const pngPath = path.join(dir, baseName + '.png');
      const svgPath = path.join(dir, baseName + '.svg');
      
      if (fs.existsSync(pngPath) && fs.existsSync(svgPath)) {
        const pngSize = getFileSize(pngPath);
        const svgSize = getFileSize(svgPath);
        duplicates.push({
          base: baseName,
          png: { path: pngPath, size: pngSize },
          svg: { path: svgPath, size: svgSize }
        });
      }
    }
  });
}

findDuplicates(imageDir);

if (duplicates.length > 0) {
  console.log('\n⚠️  Found duplicate PNG/SVG files:');
  duplicates.forEach(dup => {
    console.log(`├── ${dup.base}`);
    console.log(`│   ├── PNG: ${dup.png.size}`);
    console.log(`│   └── SVG: ${dup.svg.size}`);
  });
  console.log('\n💡 Consider keeping only SVG versions for smaller bundle size');
}

console.log('\n✅ Bundle analysis complete!');