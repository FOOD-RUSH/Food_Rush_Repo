#!/usr/bin/env node

/**
 * Bundle Analysis Script for Food Rush
 * Identifies unused dependencies and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Dependencies that are likely only used in restaurant app
const RESTAURANT_ONLY_DEPS = [
  'react-native-chart-kit',
  'react-native-svg', // If only used for charts
];

// Dependencies that might be unused
const POTENTIALLY_UNUSED_DEPS = [
  'expo-blur',
  'expo-symbols',
  'expo-web-browser',
  'expo-crypto',
  'react-native-element-dropdown',
  'react-native-worklets',
];

// Large dependencies that should be analyzed
const LARGE_DEPS = [
  '@expo/vector-icons',
  'react-native-maps',
  'react-native-reanimated',
  'react-native-paper',
];

class BundleAnalyzer {
  constructor() {
    this.packageJson = this.loadPackageJson();
    this.srcFiles = this.getAllSourceFiles();
    this.results = {
      unused: [],
      restaurantOnly: [],
      large: [],
      recommendations: [],
    };
  }

  loadPackageJson() {
    const packagePath = path.join(process.cwd(), 'package.json');
    return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  }

  getAllSourceFiles() {
    const files = [];
    const srcDir = path.join(process.cwd(), 'src');

    const walkDir = (dir) => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (
          item.endsWith('.ts') ||
          item.endsWith('.tsx') ||
          item.endsWith('.js') ||
          item.endsWith('.jsx')
        ) {
          files.push(fullPath);
        }
      }
    };

    walkDir(srcDir);
    return files;
  }

  checkDependencyUsage(depName) {
    let isUsed = false;

    for (const file of this.srcFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');

        // Check for various import patterns
        const importPatterns = [
          new RegExp(`from ['"]${depName}['"]`, 'g'),
          new RegExp(`import ['"]${depName}['"]`, 'g'),
          new RegExp(`require\\(['"]${depName}['"]\\)`, 'g'),
          new RegExp(`from ['"]${depName}/`, 'g'),
        ];

        for (const pattern of importPatterns) {
          if (pattern.test(content)) {
            isUsed = true;
            break;
          }
        }

        if (isUsed) break;
      } catch (error) {
        console.warn(`Could not read file: ${file}`);
      }
    }

    return isUsed;
  }

  checkRestaurantOnlyUsage(depName) {
    let usedInCustomer = false;
    let usedInRestaurant = false;

    for (const file of this.srcFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const isRestaurantFile =
          file.includes('/restaurant/') || file.includes('/Restaurant');

        const importPatterns = [
          new RegExp(`from ['"]${depName}['"]`, 'g'),
          new RegExp(`import ['"]${depName}['"]`, 'g'),
          new RegExp(`require\\(['"]${depName}['"]\\)`, 'g'),
          new RegExp(`from ['"]${depName}/`, 'g'),
        ];

        for (const pattern of importPatterns) {
          if (pattern.test(content)) {
            if (isRestaurantFile) {
              usedInRestaurant = true;
            } else {
              usedInCustomer = true;
            }
          }
        }
      } catch (error) {
        console.warn(`Could not read file: ${file}`);
      }
    }

    return { usedInCustomer, usedInRestaurant };
  }

  analyzeDependencies() {
    const dependencies = {
      ...this.packageJson.dependencies,
      ...this.packageJson.devDependencies,
    };

    console.log('🔍 Analyzing dependencies...\n');

    // Check for unused dependencies
    console.log('📦 Checking for unused dependencies:');
    for (const [depName] of Object.entries(dependencies)) {
      if (POTENTIALLY_UNUSED_DEPS.includes(depName)) {
        const isUsed = this.checkDependencyUsage(depName);
        if (!isUsed) {
          this.results.unused.push(depName);
          console.log(`   ❌ ${depName} - Not used`);
        } else {
          console.log(`   ✅ ${depName} - Used`);
        }
      }
    }

    // Check for restaurant-only dependencies
    console.log('\n🏪 Checking for restaurant-only dependencies:');
    for (const depName of RESTAURANT_ONLY_DEPS) {
      if (dependencies[depName]) {
        const usage = this.checkRestaurantOnlyUsage(depName);
        if (!usage.usedInCustomer && usage.usedInRestaurant) {
          this.results.restaurantOnly.push(depName);
          console.log(`   🏪 ${depName} - Restaurant only`);
        } else if (usage.usedInCustomer) {
          console.log(`   👥 ${depName} - Used in both apps`);
        } else {
          console.log(`   ❓ ${depName} - Usage unclear`);
        }
      }
    }

    // Check large dependencies
    console.log('\n📊 Large dependencies to review:');
    for (const depName of LARGE_DEPS) {
      if (dependencies[depName]) {
        const isUsed = this.checkDependencyUsage(depName);
        this.results.large.push({
          name: depName,
          used: isUsed,
          version: dependencies[depName],
        });
        console.log(`   📊 ${depName} - ${isUsed ? 'Used' : 'Not used'}`);
      }
    }
  }

  generateRecommendations() {
    console.log('\n💡 Optimization Recommendations:\n');

    // Unused dependencies
    if (this.results.unused.length > 0) {
      console.log('🗑️  Remove unused dependencies:');
      console.log(`   npm uninstall ${this.results.unused.join(' ')}`);
      console.log('   Estimated bundle reduction: 5-15%\n');
    }

    // Restaurant-only dependencies
    if (this.results.restaurantOnly.length > 0) {
      console.log('🏪 Move to restaurant-only bundle:');
      this.results.restaurantOnly.forEach((dep) => {
        console.log(`   - ${dep}`);
      });
      console.log('   Estimated customer app reduction: 10-25%\n');
    }

    // Icon optimization
    console.log('🎨 Icon optimization:');
    console.log('   - Implement tree shaking for @expo/vector-icons');
    console.log('   - Use only required icon sets');
    console.log('   - Consider custom icon component');
    console.log('   Estimated reduction: 5-10%\n');

    // Image optimization
    console.log('🖼️  Image optimization:');
    console.log('   - Implement responsive image loading');
    console.log('   - Use WebP format where possible');
    console.log('   - Add image compression');
    console.log('   Estimated reduction: 10-20%\n');

    // Code splitting
    console.log('✂️  Code splitting:');
    console.log('   - Separate customer and restaurant bundles');
    console.log('   - Implement lazy loading for screens');
    console.log('   - Use dynamic imports for heavy components');
    console.log('   Estimated reduction: 15-30%\n');
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalDependencies: Object.keys({
        ...this.packageJson.dependencies,
        ...this.packageJson.devDependencies,
      }).length,
      analysis: this.results,
      recommendations: [
        'Remove unused dependencies',
        'Implement code splitting by user type',
        'Optimize icon usage with tree shaking',
        'Implement responsive image loading',
        'Use lazy loading for non-critical components',
      ],
    };

    const reportPath = path.join(process.cwd(), 'bundle-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}`);
  }

  run() {
    console.log('🚀 Food Rush Bundle Analyzer\n');
    console.log('='.repeat(50));

    this.analyzeDependencies();
    this.generateRecommendations();
    this.generateReport();

    console.log('='.repeat(50));
    console.log('✅ Analysis complete!');
    console.log('\nNext steps:');
    console.log('1. Review the recommendations above');
    console.log('2. Check bundle-analysis-report.json for details');
    console.log('3. Implement optimizations in phases');
    console.log('4. Measure bundle size before and after changes');
  }
}

// Run the analyzer
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.run();
}

module.exports = BundleAnalyzer;
