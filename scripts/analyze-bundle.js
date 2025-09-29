#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Food Rush Bundle Analysis');
console.log('============================\n');

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Helper function to get directory size
function getDirectorySize(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

// Helper function to analyze file types in directory
function analyzeFileTypes(dirPath, extensions = []) {
  if (!fs.existsSync(dirPath)) return {};
  
  const analysis = {};
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      const subAnalysis = analyzeFileTypes(filePath, extensions);
      for (const [ext, data] of Object.entries(subAnalysis)) {
        if (!analysis[ext]) analysis[ext] = { count: 0, size: 0 };
        analysis[ext].count += data.count;
        analysis[ext].size += data.size;
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (extensions.length === 0 || extensions.includes(ext)) {
        if (!analysis[ext]) analysis[ext] = { count: 0, size: 0 };
        analysis[ext].count++;
        analysis[ext].size += stats.size;
      }
    }
  }
  
  return analysis;
}

// 1. Package.json Analysis
console.log('📦 Package Dependencies Analysis');
console.log('--------------------------------');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = Object.keys(packageJson.dependencies || {});
const devDependencies = Object.keys(packageJson.devDependencies || {});

console.log(`Production Dependencies: ${dependencies.length}`);
console.log(`Development Dependencies: ${devDependencies.length}`);
console.log(`Total Dependencies: ${dependencies.length + devDependencies.length}\n`);

// Top dependencies by name length (potential bundle impact indicators)
const largeDeps = dependencies
  .filter(dep => dep.length > 15 || dep.includes('react-native'))
  .sort((a, b) => b.length - a.length);

if (largeDeps.length > 0) {
  console.log('🔍 Notable Dependencies:');
  largeDeps.slice(0, 10).forEach(dep => {
    console.log(`  • ${dep}`);
  });
  console.log();
}

// 2. Source Code Analysis
console.log('📁 Source Code Analysis');
console.log('----------------------');

const srcSize = getDirectorySize('src');
console.log(`Source Code Size: ${formatBytes(srcSize)}`);

// Analyze TypeScript/JavaScript files
const codeAnalysis = analyzeFileTypes('src', ['.ts', '.tsx', '.js', '.jsx']);
console.log('\nCode Files Breakdown:');
for (const [ext, data] of Object.entries(codeAnalysis)) {
  console.log(`  ${ext}: ${data.count} files (${formatBytes(data.size)})`);
}

// Count components, screens, stores
const componentDirs = ['src/components', 'src/screens', 'src/stores'];
console.log('\nCode Organization:');
componentDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const analysis = analyzeFileTypes(dir, ['.ts', '.tsx', '.js', '.jsx']);
    const totalFiles = Object.values(analysis).reduce((sum, data) => sum + data.count, 0);
    const totalSize = Object.values(analysis).reduce((sum, data) => sum + data.size, 0);
    console.log(`  ${path.basename(dir)}: ${totalFiles} files (${formatBytes(totalSize)})`);
  }
});

// 3. Assets Analysis
console.log('\n🖼️  Assets Analysis');
console.log('------------------');

const assetsSize = getDirectorySize('assets');
console.log(`Total Assets Size: ${formatBytes(assetsSize)}`);

// Analyze different asset types
const assetTypes = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ttf', '.otf', '.mp3', '.wav'];
const assetAnalysis = analyzeFileTypes('assets', assetTypes);

console.log('\nAssets Breakdown:');
for (const [ext, data] of Object.entries(assetAnalysis)) {
  console.log(`  ${ext}: ${data.count} files (${formatBytes(data.size)})`);
}

// Find large asset files
console.log('\n🔍 Large Asset Files (>100KB):');
function findLargeFiles(dirPath, threshold = 100 * 1024) {
  if (!fs.existsSync(dirPath)) return [];
  
  const largeFiles = [];
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      largeFiles.push(...findLargeFiles(filePath, threshold));
    } else if (stats.size > threshold) {
      largeFiles.push({
        path: filePath,
        size: stats.size,
        name: file
      });
    }
  }
  
  return largeFiles;
}

const largeAssets = findLargeFiles('assets');
largeAssets
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .forEach(file => {
    console.log(`  ${file.path}: ${formatBytes(file.size)}`);
  });

if (largeAssets.length === 0) {
  console.log('  ✅ No large asset files found');
}

// 4. Node Modules Analysis
console.log('\n📚 Node Modules Analysis');
console.log('------------------------');

const nodeModulesSize = getDirectorySize('node_modules');
console.log(`Node Modules Size: ${formatBytes(nodeModulesSize)}`);

// Try to get top-level package sizes
try {
  const nodeModulesContents = fs.readdirSync('node_modules');
  const packageSizes = [];
  
  for (const item of nodeModulesContents.slice(0, 20)) { // Limit to avoid long execution
    if (item.startsWith('.') || item === '.bin') continue;
    
    const packagePath = path.join('node_modules', item);
    if (fs.statSync(packagePath).isDirectory()) {
      const size = getDirectorySize(packagePath);
      packageSizes.push({ name: item, size });
    }
  }
  
  console.log('\nLargest Packages (top 10):');
  packageSizes
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach(pkg => {
      console.log(`  ${pkg.name}: ${formatBytes(pkg.size)}`);
    });
} catch (error) {
  console.log('  Could not analyze individual package sizes');
}

// 5. Build Output Analysis (if exists)
console.log('\n🏗️  Build Output Analysis');
console.log('-------------------------');

const buildDirs = ['dist', '.expo', 'build'];
let totalBuildSize = 0;

buildDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const size = getDirectorySize(dir);
    totalBuildSize += size;
    console.log(`${dir}: ${formatBytes(size)}`);
  }
});

if (totalBuildSize === 0) {
  console.log('No build output found. Run a build first to analyze output size.');
} else {
  console.log(`Total Build Output: ${formatBytes(totalBuildSize)}`);
}

// 6. Bundle Size Estimation
console.log('\n📊 Bundle Size Estimation');
console.log('-------------------------');

const estimatedJSBundle = srcSize + (nodeModulesSize * 0.1); // Rough estimate
const estimatedAssetBundle = assetsSize;
const estimatedTotal = estimatedJSBundle + estimatedAssetBundle;

console.log(`Estimated JS Bundle: ${formatBytes(estimatedJSBundle)}`);
console.log(`Estimated Asset Bundle: ${formatBytes(estimatedAssetBundle)}`);
console.log(`Estimated Total Bundle: ${formatBytes(estimatedTotal)}`);

// 7. Recommendations
console.log('\n💡 Optimization Recommendations');
console.log('-------------------------------');

const recommendations = [];

if (assetsSize > 10 * 1024 * 1024) { // 10MB
  recommendations.push('Consider optimizing large assets (current: ' + formatBytes(assetsSize) + ')');
}

if (largeAssets.length > 5) {
  recommendations.push(`Found ${largeAssets.length} large asset files - consider compression`);
}

if (dependencies.length > 50) {
  recommendations.push(`High dependency count (${dependencies.length}) - audit for unused packages`);
}

const reactNativeDeps = dependencies.filter(dep => dep.includes('react-native')).length;
if (reactNativeDeps > 15) {
  recommendations.push(`Many React Native packages (${reactNativeDeps}) - ensure all are necessary`);
}

if (recommendations.length === 0) {
  console.log('✅ Bundle appears well-optimized!');
} else {
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
}

console.log('\n🎯 Next Steps:');
console.log('1. Run `npm run deps:analyze` to check for unused dependencies');
console.log('2. Run `npm run bundle:export` to create actual bundle for analysis');
console.log('3. Use `npm run bundle:web-analyze` for detailed web bundle analysis');
console.log('4. Consider lazy loading for large components');

console.log('\n✅ Bundle analysis complete!');