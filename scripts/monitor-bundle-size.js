#!/usr/bin/env node

/**
 * Bundle Size Monitoring Script
 * Tracks bundle size changes and optimization progress
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BundleSizeMonitor {
  constructor() {
    this.reportPath = path.join(process.cwd(), 'bundle-size-history.json');
    this.history = this.loadHistory();
  }

  loadHistory() {
    try {
      if (fs.existsSync(this.reportPath)) {
        return JSON.parse(fs.readFileSync(this.reportPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load bundle size history:', error.message);
    }
    return [];
  }

  saveHistory() {
    try {
      fs.writeFileSync(this.reportPath, JSON.stringify(this.history, null, 2));
    } catch (error) {
      console.error('Could not save bundle size history:', error.message);
    }
  }

  async measureBundleSize() {
    console.log('📊 Measuring bundle size...\n');

    try {
      // Export the bundle
      console.log('Building bundle...');
      execSync('npx expo export --platform ios --dev false --clear --output-dir dist/temp', {
        stdio: 'pipe',
      });

      // Measure bundle files
      const distPath = path.join(process.cwd(), 'dist/temp');
      const bundleStats = this.analyzeBundleDirectory(distPath);

      // Clean up temp directory
      execSync('rm -rf dist/temp', { stdio: 'pipe' });

      return bundleStats;
    } catch (error) {
      console.error('Error measuring bundle size:', error.message);
      return null;
    }
  }

  analyzeBundleDirectory(dirPath) {
    const stats = {
      totalSize: 0,
      jsSize: 0,
      assetSize: 0,
      fileCount: 0,
      files: [],
    };

    const analyzeDir = (currentPath) => {
      const items = fs.readdirSync(currentPath);

      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          analyzeDir(fullPath);
        } else {
          const size = stat.size;
          const relativePath = path.relative(dirPath, fullPath);
          
          stats.totalSize += size;
          stats.fileCount++;
          
          if (item.endsWith('.js') || item.endsWith('.bundle')) {
            stats.jsSize += size;
          } else {
            stats.assetSize += size;
          }

          stats.files.push({
            path: relativePath,
            size,
            sizeFormatted: this.formatBytes(size),
          });
        }
      }
    };

    analyzeDir(dirPath);
    
    // Sort files by size (largest first)
    stats.files.sort((a, b) => b.size - a.size);

    return stats;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  calculateReduction(current, previous) {
    if (!previous) return null;
    
    const reduction = previous - current;
    const percentage = ((reduction / previous) * 100).toFixed(1);
    
    return {
      absolute: reduction,
      percentage: parseFloat(percentage),
      formatted: this.formatBytes(Math.abs(reduction)),
    };
  }

  generateReport(bundleStats) {
    const timestamp = new Date().toISOString();
    const previousEntry = this.history[this.history.length - 1];
    
    const report = {
      timestamp,
      totalSize: bundleStats.totalSize,
      totalSizeFormatted: this.formatBytes(bundleStats.totalSize),
      jsSize: bundleStats.jsSize,
      jsSizeFormatted: this.formatBytes(bundleStats.jsSize),
      assetSize: bundleStats.assetSize,
      assetSizeFormatted: this.formatBytes(bundleStats.assetSize),
      fileCount: bundleStats.fileCount,
      largestFiles: bundleStats.files.slice(0, 10),
    };

    // Calculate changes from previous measurement
    if (previousEntry) {
      report.changes = {
        total: this.calculateReduction(bundleStats.totalSize, previousEntry.totalSize),
        js: this.calculateReduction(bundleStats.jsSize, previousEntry.jsSize),
        assets: this.calculateReduction(bundleStats.assetSize, previousEntry.assetSize),
      };
    }

    return report;
  }

  displayReport(report) {
    console.log('📊 Bundle Size Report');
    console.log('=' .repeat(50));
    console.log(`📅 Timestamp: ${report.timestamp}`);
    console.log(`📦 Total Size: ${report.totalSizeFormatted}`);
    console.log(`🔧 JavaScript: ${report.jsSizeFormatted}`);
    console.log(`🖼️  Assets: ${report.assetSizeFormatted}`);
    console.log(`📄 File Count: ${report.fileCount}`);

    if (report.changes) {
      console.log('\n📈 Changes from Previous Build:');
      
      if (report.changes.total) {
        const { percentage, formatted } = report.changes.total;
        const direction = percentage > 0 ? '📈 Increased' : '📉 Reduced';
        console.log(`   Total: ${direction} by ${formatted} (${Math.abs(percentage)}%)`);
      }
      
      if (report.changes.js) {
        const { percentage, formatted } = report.changes.js;
        const direction = percentage > 0 ? '📈 Increased' : '📉 Reduced';
        console.log(`   JavaScript: ${direction} by ${formatted} (${Math.abs(percentage)}%)`);
      }
    }

    console.log('\n🔍 Largest Files:');
    report.largestFiles.slice(0, 5).forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.path} - ${file.sizeFormatted}`);
    });

    console.log('\n💡 Optimization Suggestions:');
    
    if (report.jsSize > 5 * 1024 * 1024) { // > 5MB
      console.log('   ⚠️  JavaScript bundle is large (>5MB)');
      console.log('   💡 Consider implementing code splitting');
    }
    
    if (report.assetSize > 10 * 1024 * 1024) { // > 10MB
      console.log('   ⚠️  Asset bundle is large (>10MB)');
      console.log('   💡 Consider image optimization and compression');
    }
    
    if (report.fileCount > 1000) {
      console.log('   ⚠️  High file count (>1000 files)');
      console.log('   💡 Consider bundling smaller assets');
    }

    console.log('=' .repeat(50));
  }

  async run() {
    console.log('🚀 Food Rush Bundle Size Monitor\n');

    const bundleStats = await this.measureBundleSize();
    
    if (!bundleStats) {
      console.error('❌ Failed to measure bundle size');
      process.exit(1);
    }

    const report = this.generateReport(bundleStats);
    this.displayReport(report);

    // Save to history
    this.history.push(report);
    
    // Keep only last 20 entries
    if (this.history.length > 20) {
      this.history = this.history.slice(-20);
    }
    
    this.saveHistory();

    console.log(`\n📄 Full report saved to: ${this.reportPath}`);
    console.log('✅ Bundle size monitoring complete!');
  }
}

// Run the monitor
if (require.main === module) {
  const monitor = new BundleSizeMonitor();
  monitor.run().catch(console.error);
}

module.exports = BundleSizeMonitor;