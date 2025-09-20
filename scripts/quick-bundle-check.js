#!/usr/bin/env node

/**
 * Quick Bundle Analysis for Food Rush
 * Provides immediate insights without full bundle export
 */

const fs = require('fs');
const path = require('path');

class QuickBundleCheck {
  constructor() {
    this.packageJson = this.loadPackageJson();
    this.srcPath = path.join(process.cwd(), 'src');
  }

  loadPackageJson() {
    const packagePath = path.join(process.cwd(), 'package.json');
    return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  }

  analyzePackageSize() {
    const dependencies = this.packageJson.dependencies || {};
    const devDependencies = this.packageJson.devDependencies || {};
    
    // Estimated sizes for common packages (in MB)
    const packageSizes = {
      'react-native': 15,
      'expo': 8,
      '@react-navigation/native': 2,
      '@react-navigation/native-stack': 1,
      '@react-navigation/bottom-tabs': 1,
      '@react-navigation/stack': 1,
      'react-native-paper': 4,
      '@expo/vector-icons': 2,
      'react-native-reanimated': 3,
      '@tanstack/react-query': 2,
      'react-hook-form': 1,
      'yup': 0.5,
      'i18next': 1,
      'react-i18next': 0.5,
      'zustand': 0.5,
      '@rnmapbox/maps': 2,
      'react-native-svg': 1,
      'axios': 0.5,
      'react-native-toast-message': 0.3,
      'nativewind': 0.5,
      '@gorhom/bottom-sheet': 1,
      'react-native-gesture-handler': 1.5,
      'react-native-safe-area-context': 0.3,
      'react-native-screens': 0.5,
    };

    let totalEstimatedSize = 0;
    const largePackages = [];
    const unknownPackages = [];

    Object.keys(dependencies).forEach(pkg => {
      if (packageSizes[pkg]) {
        totalEstimatedSize += packageSizes[pkg];
        if (packageSizes[pkg] >= 1) {
          largePackages.push({ name: pkg, size: packageSizes[pkg] });
        }
      } else {
        unknownPackages.push(pkg);
      }
    });

    return {
      totalEstimatedSize,
      largePackages: largePackages.sort((a, b) => b.size - a.size),
      unknownPackages,
      totalDependencies: Object.keys(dependencies).length,
    };
  }

  analyzeSourceCode() {
    const stats = {
      totalFiles: 0,
      totalLines: 0,
      componentFiles: 0,
      screenFiles: 0,
      serviceFiles: 0,
      largestFiles: [],
    };

    const analyzeDirectory = (dirPath) => {
      try {
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
          const fullPath = path.join(dirPath, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            analyzeDirectory(fullPath);
          } else if (item.match(/\\.(ts|tsx|js|jsx)$/)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\\n').length;
            const relativePath = path.relative(this.srcPath, fullPath);
            
            stats.totalFiles++;
            stats.totalLines += lines;
            
            if (relativePath.includes('components/')) stats.componentFiles++;
            if (relativePath.includes('screens/')) stats.screenFiles++;
            if (relativePath.includes('services/')) stats.serviceFiles++;
            
            stats.largestFiles.push({
              path: relativePath,
              lines,
              size: stat.size,
            });
          }
        });
      } catch (error) {
        // Skip directories that can't be read
      }
    };

    analyzeDirectory(this.srcPath);
    
    // Sort by file size and keep top 10
    stats.largestFiles = stats.largestFiles
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    return stats;
  }

  checkAssets() {
    const assetsPath = path.join(process.cwd(), 'assets');
    let totalAssetSize = 0;
    const largeAssets = [];

    const analyzeAssets = (dirPath) => {
      try {
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
          const fullPath = path.join(dirPath, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            analyzeAssets(fullPath);
          } else {
            const size = stat.size;
            totalAssetSize += size;
            
            if (size > 100 * 1024) { // Files larger than 100KB
              largeAssets.push({
                path: path.relative(assetsPath, fullPath),
                size,
                sizeFormatted: this.formatBytes(size),
              });
            }
          }
        });
      } catch (error) {
        // Assets directory might not exist
      }
    };

    if (fs.existsSync(assetsPath)) {
      analyzeAssets(assetsPath);
    }

    return {
      totalAssetSize,
      totalAssetSizeFormatted: this.formatBytes(totalAssetSize),
      largeAssets: largeAssets.sort((a, b) => b.size - a.size),
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateRecommendations(packageAnalysis, sourceAnalysis, assetAnalysis) {
    const recommendations = [];

    // Package recommendations
    if (packageAnalysis.totalEstimatedSize > 25) {
      recommendations.push({
        type: 'warning',
        category: 'Dependencies',
        message: `Estimated bundle size is ${packageAnalysis.totalEstimatedSize.toFixed(1)}MB (target: <25MB)`,
        action: 'Consider removing unused dependencies or implementing code splitting',
      });
    }

    if (packageAnalysis.unknownPackages.length > 5) {
      recommendations.push({
        type: 'info',
        category: 'Dependencies',
        message: `${packageAnalysis.unknownPackages.length} packages need size analysis`,
        action: 'Run full bundle analysis to get accurate sizes',
      });
    }

    // Source code recommendations
    if (sourceAnalysis.totalLines > 50000) {
      recommendations.push({
        type: 'warning',
        category: 'Source Code',
        message: `Large codebase (${sourceAnalysis.totalLines.toLocaleString()} lines)`,
        action: 'Consider implementing lazy loading for screens',
      });
    }

    // Asset recommendations
    if (assetAnalysis.totalAssetSize > 10 * 1024 * 1024) { // 10MB
      recommendations.push({
        type: 'warning',
        category: 'Assets',
        message: `Large asset bundle (${assetAnalysis.totalAssetSizeFormatted})`,
        action: 'Optimize images and consider using WebP format',
      });
    }

    if (assetAnalysis.largeAssets.length > 0) {
      recommendations.push({
        type: 'info',
        category: 'Assets',
        message: `${assetAnalysis.largeAssets.length} large assets found`,
        action: 'Review and optimize large image files',
      });
    }

    return recommendations;
  }

  run() {
    console.log('🚀 Food Rush Quick Bundle Check\n');
    console.log('='.repeat(60));

    // Analyze packages
    console.log('📦 Package Analysis:');
    const packageAnalysis = this.analyzePackageSize();
    console.log(`   Total Dependencies: ${packageAnalysis.totalDependencies}`);
    console.log(`   Estimated Size: ~${packageAnalysis.totalEstimatedSize.toFixed(1)}MB`);
    console.log(`   Large Packages (>1MB): ${packageAnalysis.largePackages.length}`);

    if (packageAnalysis.largePackages.length > 0) {
      console.log('\n   📊 Largest Dependencies:');
      packageAnalysis.largePackages.slice(0, 5).forEach(pkg => {
        console.log(`      ${pkg.name}: ~${pkg.size}MB`);
      });
    }

    // Analyze source code
    console.log('\n🔧 Source Code Analysis:');
    const sourceAnalysis = this.analyzeSourceCode();
    console.log(`   Total Files: ${sourceAnalysis.totalFiles}`);
    console.log(`   Total Lines: ${sourceAnalysis.totalLines.toLocaleString()}`);
    console.log(`   Components: ${sourceAnalysis.componentFiles}`);
    console.log(`   Screens: ${sourceAnalysis.screenFiles}`);
    console.log(`   Services: ${sourceAnalysis.serviceFiles}`);

    if (sourceAnalysis.largestFiles.length > 0) {
      console.log('\n   📄 Largest Source Files:');
      sourceAnalysis.largestFiles.slice(0, 3).forEach(file => {
        console.log(`      ${file.path}: ${file.lines} lines (${this.formatBytes(file.size)})`);
      });
    }

    // Analyze assets
    console.log('\n🖼️  Asset Analysis:');
    const assetAnalysis = this.checkAssets();
    console.log(`   Total Asset Size: ${assetAnalysis.totalAssetSizeFormatted}`);
    console.log(`   Large Assets (>100KB): ${assetAnalysis.largeAssets.length}`);

    if (assetAnalysis.largeAssets.length > 0) {
      console.log('\n   📊 Largest Assets:');
      assetAnalysis.largeAssets.slice(0, 3).forEach(asset => {
        console.log(`      ${asset.path}: ${asset.sizeFormatted}`);
      });
    }

    // Generate recommendations
    console.log('\n💡 Recommendations:');
    const recommendations = this.generateRecommendations(
      packageAnalysis,
      sourceAnalysis,
      assetAnalysis
    );

    if (recommendations.length === 0) {
      console.log('   ✅ No immediate issues found!');
    } else {
      recommendations.forEach(rec => {
        const icon = rec.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`   ${icon} ${rec.category}: ${rec.message}`);
        console.log(`      💡 ${rec.action}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎯 Next Steps:');
    console.log('   1. Run full analysis: npm run bundle:size');
    console.log('   2. Check for unused deps: npm run deps:analyze');
    console.log('   3. Review optimization guide: docs/bundle-analysis-guide.md');
    console.log('\n✅ Quick check complete!');
  }
}

// Run the quick check
if (require.main === module) {
  const checker = new QuickBundleCheck();
  checker.run();
}

module.exports = QuickBundleCheck;"