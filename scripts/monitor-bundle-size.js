#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
// const { execSync } = require('child_process'); // Unused for now

console.log('📈 Food Rush Bundle Size Monitor');
console.log('===============================\n');

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
  try {
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
  } catch (_error) {
    // Ignore permission errors
  }
  
  return totalSize;
}

// Bundle size tracking file
const BUNDLE_HISTORY_FILE = '.bundle-history.json';

// Load previous bundle history
function loadBundleHistory() {
  if (fs.existsSync(BUNDLE_HISTORY_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(BUNDLE_HISTORY_FILE, 'utf8'));
    } catch (_error) {
      console.warn('⚠️  Could not load bundle history, starting fresh');
      return { entries: [] };
    }
  }
  return { entries: [] };
}

// Save bundle history
function saveBundleHistory(history) {
  fs.writeFileSync(BUNDLE_HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Get current bundle metrics
function getCurrentMetrics() {
  const metrics = {
    timestamp: new Date().toISOString(),
    src: getDirectorySize('src'),
    assets: getDirectorySize('assets'),
    nodeModules: getDirectorySize('node_modules'),
    dist: getDirectorySize('dist'),
    expo: getDirectorySize('.expo'),
  };
  
  // Calculate totals
  metrics.totalSource = metrics.src + metrics.assets;
  metrics.totalBuild = metrics.dist + metrics.expo;
  metrics.total = metrics.src + metrics.assets + metrics.nodeModules + metrics.dist + metrics.expo;
  
  // Get package.json info
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    metrics.dependencies = Object.keys(packageJson.dependencies || {}).length;
    metrics.devDependencies = Object.keys(packageJson.devDependencies || {}).length;
  } catch (_error) {
    metrics.dependencies = 0;
    metrics.devDependencies = 0;
  }
  
  return metrics;
}

// Compare metrics with previous
function compareMetrics(current, previous) {
  if (!previous) return null;
  
  const comparison = {};
  const keys = ['src', 'assets', 'nodeModules', 'dist', 'expo', 'totalSource', 'totalBuild', 'total'];
  
  keys.forEach(key => {
    const currentVal = current[key] || 0;
    const previousVal = previous[key] || 0;
    const diff = currentVal - previousVal;
    const percentChange = previousVal > 0 ? ((diff / previousVal) * 100) : 0;
    
    comparison[key] = {
      current: currentVal,
      previous: previousVal,
      diff: diff,
      percentChange: percentChange,
      increased: diff > 0,
      decreased: diff < 0
    };
  });
  
  return comparison;
}

// Display metrics
function displayMetrics(metrics, comparison = null) {
  console.log('📊 Current Bundle Metrics');
  console.log('-------------------------');
  console.log(`Source Code: ${formatBytes(metrics.src)}`);
  console.log(`Assets: ${formatBytes(metrics.assets)}`);
  console.log(`Node Modules: ${formatBytes(metrics.nodeModules)}`);
  console.log(`Build Output: ${formatBytes(metrics.totalBuild)}`);
  console.log(`Total Size: ${formatBytes(metrics.total)}`);
  console.log(`Dependencies: ${metrics.dependencies} prod + ${metrics.devDependencies} dev`);
  
  if (comparison) {
    console.log('\n📈 Changes Since Last Check');
    console.log('---------------------------');
    
    const significantChanges = [];
    
    Object.entries(comparison).forEach(([key, data]) => {
      if (Math.abs(data.diff) > 1024) { // Only show changes > 1KB
        const arrow = data.increased ? '📈' : data.decreased ? '📉' : '➡️';
        const sign = data.diff > 0 ? '+' : '';
        const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        
        console.log(`${arrow} ${label}: ${sign}${formatBytes(data.diff)} (${data.percentChange.toFixed(1)}%)`);
        
        if (Math.abs(data.percentChange) > 10) {
          significantChanges.push({ key, ...data });
        }
      }
    });
    
    if (significantChanges.length > 0) {
      console.log('\n⚠️  Significant Changes (>10%):');
      significantChanges.forEach(change => {
        const label = change.key.replace(/([A-Z])/g, ' $1').toLowerCase();
        console.log(`  • ${label}: ${change.percentChange.toFixed(1)}% change`);
      });
    }
  }
}

// Check for bundle size warnings
function checkWarnings(metrics, comparison = null) {
  const warnings = [];
  
  // Size warnings
  if (metrics.assets > 20 * 1024 * 1024) { // 20MB
    warnings.push('Assets are very large (>20MB) - consider optimization');
  }
  
  if (metrics.src > 5 * 1024 * 1024) { // 5MB
    warnings.push('Source code is large (>5MB) - consider code splitting');
  }
  
  if (metrics.dependencies > 100) {
    warnings.push(`High dependency count (${metrics.dependencies}) - audit for unused packages`);
  }
  
  // Change warnings
  if (comparison) {
    if (comparison.assets.percentChange > 50) {
      warnings.push('Assets size increased significantly - check for new large files');
    }
    
    if (comparison.src.percentChange > 30) {
      warnings.push('Source code size increased significantly - review recent changes');
    }
    
    if (comparison.nodeModules.percentChange > 20) {
      warnings.push('Node modules size increased - new dependencies added?');
    }
  }
  
  return warnings;
}

// Main execution
const history = loadBundleHistory();
const currentMetrics = getCurrentMetrics();
const lastEntry = history.entries[history.entries.length - 1];
const comparison = compareMetrics(currentMetrics, lastEntry);

// Display current state
displayMetrics(currentMetrics, comparison);

// Check for warnings
const warnings = checkWarnings(currentMetrics, comparison);
if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach((warning, index) => {
    console.log(`${index + 1}. ${warning}`);
  });
}

// Bundle size thresholds
console.log('\n🎯 Bundle Size Guidelines');
console.log('-------------------------');
const guidelines = [
  { name: 'Source Code', current: currentMetrics.src, target: 2 * 1024 * 1024, label: '2MB' },
  { name: 'Assets', current: currentMetrics.assets, target: 10 * 1024 * 1024, label: '10MB' },
  { name: 'Total Bundle', current: currentMetrics.totalSource, target: 15 * 1024 * 1024, label: '15MB' }
];

guidelines.forEach(guideline => {
  const status = guideline.current <= guideline.target ? '✅' : '❌';
  const percentage = (guideline.current / guideline.target * 100).toFixed(1);
  console.log(`${status} ${guideline.name}: ${formatBytes(guideline.current)} / ${guideline.label} (${percentage}%)`);
});

// Historical trend
if (history.entries.length > 1) {
  console.log('\n📊 Historical Trend (Last 5 Entries)');
  console.log('------------------------------------');
  
  const recentEntries = history.entries.slice(-5);
  recentEntries.forEach((entry, index) => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    const time = new Date(entry.timestamp).toLocaleTimeString();
    console.log(`${index + 1}. ${date} ${time}: ${formatBytes(entry.totalSource)} (src+assets)`);
  });
}

// Save current metrics to history
history.entries.push(currentMetrics);

// Keep only last 50 entries
if (history.entries.length > 50) {
  history.entries = history.entries.slice(-50);
}

saveBundleHistory(history);

// Recommendations
console.log('\n💡 Optimization Tips');
console.log('--------------------');
console.log('1. Use `npm run deps:analyze` to find unused dependencies');
console.log('2. Optimize images with tools like ImageOptim or TinyPNG');
console.log('3. Consider lazy loading for large components');
console.log('4. Use dynamic imports for code splitting');
console.log('5. Enable Hermes engine for smaller JS bundles');
console.log('6. Use Metro bundle splitting for better caching');

console.log('\n✅ Bundle monitoring complete!');
console.log(`📝 History saved to ${BUNDLE_HISTORY_FILE}`);