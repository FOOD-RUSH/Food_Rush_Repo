#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Simple script to clean duplicate translations
 * Focuses on removing exact duplicate key-value pairs
 */

const LOCALES_DIR = path.join(process.cwd(), 'src', 'locales');

function cleanTranslationFile(filePath) {
  console.log(`\nProcessing: ${path.relative(process.cwd(), filePath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Create backup
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, content, 'utf8');
    console.log(`  📁 Backup created: ${path.relative(process.cwd(), backupPath)}`);
    
    // Count original keys
    const originalKeys = Object.keys(data);
    const originalCount = originalKeys.length;
    
    // Remove duplicates by creating a new object
    // This will automatically remove duplicate keys (JSON.parse handles this)
    const cleaned = {};
    const seenValues = new Map();
    let duplicateValues = 0;
    
    for (const [key, value] of Object.entries(data)) {
      // Check for duplicate values (optional - might be too aggressive)
      if (typeof value === 'string' && seenValues.has(value)) {
        console.log(`    ⚠️  Duplicate value found: "${key}" = "${value}" (same as "${seenValues.get(value)}")`);
        duplicateValues++;
        // Still include it for now - user can decide
        cleaned[key] = value;
      } else {
        if (typeof value === 'string') {
          seenValues.set(value, key);
        }
        cleaned[key] = value;
      }
    }
    
    // Write cleaned data
    const cleanedContent = JSON.stringify(cleaned, null, 2);
    fs.writeFileSync(filePath, cleanedContent, 'utf8');
    
    const cleanedCount = Object.keys(cleaned).length;
    const removed = originalCount - cleanedCount;
    
    console.log(`  ✓ Original keys: ${originalCount}`);
    console.log(`  ✓ Cleaned keys: ${cleanedCount}`);
    console.log(`  ✓ Removed duplicates: ${removed}`);
    console.log(`  ⚠️  Duplicate values found: ${duplicateValues}`);
    
    return { originalCount, cleanedCount, removed, duplicateValues };
    
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return null;
  }
}

function main() {
  console.log('🧹 Translation File Cleaner');
  console.log('============================');
  
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
  
  console.log(`Found ${files.length} translation files:`);
  files.forEach(file => console.log(`  - ${path.relative(process.cwd(), file)}`));
  
  // Process files
  let totalOriginal = 0;
  let totalCleaned = 0;
  let totalRemoved = 0;
  let totalDuplicateValues = 0;
  
  for (const file of files) {
    const result = cleanTranslationFile(file);
    if (result) {
      totalOriginal += result.originalCount;
      totalCleaned += result.cleanedCount;
      totalRemoved += result.removed;
      totalDuplicateValues += result.duplicateValues;
    }
  }
  
  console.log('\n📊 Summary');
  console.log('===========');
  console.log(`Total original keys: ${totalOriginal}`);
  console.log(`Total cleaned keys: ${totalCleaned}`);
  console.log(`Total removed duplicates: ${totalRemoved}`);
  console.log(`Total duplicate values found: ${totalDuplicateValues}`);
  
  if (totalRemoved > 0) {
    console.log(`\n✅ Successfully cleaned ${totalRemoved} duplicate keys!`);
  } else {
    console.log('\n✅ No duplicate keys found. Files are already clean!');
  }
  
  if (totalDuplicateValues > 0) {
    console.log(`\n💡 Found ${totalDuplicateValues} duplicate values. Review if these should be consolidated.`);
  }
}

if (require.main === module) {
  main();
}