#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Analyze translation files for duplicates without making changes
 */

const LOCALES_DIR = path.join(process.cwd(), 'src', 'locales');

function analyzeFile(filePath) {
  console.log(`\n📄 Analyzing: ${path.relative(process.cwd(), filePath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    // Check for duplicate values
    const valueMap = new Map();
    const duplicateValues = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        if (valueMap.has(value)) {
          duplicateValues.push({
            value,
            keys: [valueMap.get(value), key]
          });
        } else {
          valueMap.set(value, key);
        }
      }
    }
    
    // Check for potential issues
    const emptyValues = keys.filter(key => data[key] === '' || data[key] === null || data[key] === undefined);
    const longKeys = keys.filter(key => key.length > 50);
    const suspiciousKeys = keys.filter(key => key.includes('  ') || key.startsWith(' ') || key.endsWith(' '));
    
    console.log(`  📊 Total keys: ${keys.length}`);
    console.log(`  📊 Unique values: ${new Set(values.filter(v => typeof v === 'string')).size}`);
    console.log(`  🔄 Duplicate values: ${duplicateValues.length}`);
    console.log(`  ⚠️  Empty values: ${emptyValues.length}`);
    console.log(`  📏 Long keys (>50 chars): ${longKeys.length}`);
    console.log(`  🔍 Suspicious keys (extra spaces): ${suspiciousKeys.length}`);
    
    if (duplicateValues.length > 0) {
      console.log(`\n  🔄 Duplicate values found:`);
      duplicateValues.slice(0, 5).forEach(dup => {
        console.log(`    "${dup.value}" → [${dup.keys.join(', ')}]`);
      });
      if (duplicateValues.length > 5) {
        console.log(`    ... and ${duplicateValues.length - 5} more`);
      }
    }
    
    if (emptyValues.length > 0) {
      console.log(`\n  ⚠️  Empty values:`);
      emptyValues.slice(0, 5).forEach(key => {
        console.log(`    "${key}"`);
      });
      if (emptyValues.length > 5) {
        console.log(`    ... and ${emptyValues.length - 5} more`);
      }
    }
    
    if (suspiciousKeys.length > 0) {
      console.log(`\n  🔍 Suspicious keys:`);
      suspiciousKeys.slice(0, 5).forEach(key => {
        console.log(`    "${key}"`);
      });
      if (suspiciousKeys.length > 5) {
        console.log(`    ... and ${suspiciousKeys.length - 5} more`);
      }
    }
    
    return {
      totalKeys: keys.length,
      uniqueValues: new Set(values.filter(v => typeof v === 'string')).size,
      duplicateValues: duplicateValues.length,
      emptyValues: emptyValues.length,
      longKeys: longKeys.length,
      suspiciousKeys: suspiciousKeys.length
    };
    
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return null;
  }
}

function main() {
  console.log('🔍 Translation File Analyzer');
  console.log('=============================');
  console.log('This script analyzes translation files for potential issues without making changes.\n');
  
  if (!fs.existsSync(LOCALES_DIR)) {
    console.error(`❌ Locales directory not found: ${LOCALES_DIR}`);
    process.exit(1);
  }
  
  // Find translation files
  const files = [];
  function findFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        findFiles(fullPath);
      } else if (item.endsWith('.json') && !item.endsWith('.backup')) {
        files.push(fullPath);
      }
    }
  }
  
  findFiles(LOCALES_DIR);
  
  if (files.length === 0) {
    console.log('❌ No translation files found');
    process.exit(1);
  }
  
  console.log(`Found ${files.length} translation files to analyze:`);
  files.forEach(file => console.log(`  - ${path.relative(process.cwd(), file)}`));
  
  // Analyze files
  const results = [];
  for (const file of files) {
    const result = analyzeFile(file);
    if (result) {
      results.push({ file, ...result });
    }
  }
  
  // Summary
  console.log('\n📊 Overall Summary');
  console.log('==================');
  
  const totals = results.reduce((acc, result) => ({
    totalKeys: acc.totalKeys + result.totalKeys,
    uniqueValues: acc.uniqueValues + result.uniqueValues,
    duplicateValues: acc.duplicateValues + result.duplicateValues,
    emptyValues: acc.emptyValues + result.emptyValues,
    longKeys: acc.longKeys + result.longKeys,
    suspiciousKeys: acc.suspiciousKeys + result.suspiciousKeys
  }), {
    totalKeys: 0,
    uniqueValues: 0,
    duplicateValues: 0,
    emptyValues: 0,
    longKeys: 0,
    suspiciousKeys: 0
  });
  
  console.log(`📊 Total translation keys: ${totals.totalKeys}`);
  console.log(`📊 Total unique values: ${totals.uniqueValues}`);
  console.log(`🔄 Total duplicate values: ${totals.duplicateValues}`);
  console.log(`⚠️  Total empty values: ${totals.emptyValues}`);
  console.log(`📏 Total long keys: ${totals.longKeys}`);
  console.log(`🔍 Total suspicious keys: ${totals.suspiciousKeys}`);
  
  console.log('\n💡 Recommendations:');
  if (totals.duplicateValues > 0) {
    console.log(`  - Consider consolidating ${totals.duplicateValues} duplicate values`);
  }
  if (totals.emptyValues > 0) {
    console.log(`  - Review ${totals.emptyValues} empty values`);
  }
  if (totals.suspiciousKeys > 0) {
    console.log(`  - Clean up ${totals.suspiciousKeys} keys with spacing issues`);
  }
  if (totals.duplicateValues === 0 && totals.emptyValues === 0 && totals.suspiciousKeys === 0) {
    console.log('  ✅ Translation files look clean!');
  }
  
  console.log('\n🛠️  Next steps:');
  console.log('  - Run `npm run clean:translations` to clean up issues');
  console.log('  - Run `npm run remove:duplicates` for advanced cleanup');
}

if (require.main === module) {
  main();
}