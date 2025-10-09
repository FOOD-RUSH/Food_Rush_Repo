#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to remove duplicate translations from translation files
 * 
 * This script:
 * 1. Reads all translation files in src/locales
 * 2. Identifies duplicate key-value pairs within each file
 * 3. Removes duplicates while preserving the first occurrence
 * 4. Creates backup files before making changes
 * 5. Reports on duplicates found and removed
 */

const LOCALES_DIR = path.join(process.cwd(), 'src', 'locales');
const BACKUP_SUFFIX = '.backup';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function findTranslationFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.json') && !item.endsWith(BACKUP_SUFFIX)) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

function findDuplicates(obj, filePath) {
  const duplicates = [];
  const seen = new Map(); // Map of value -> first key that had this value
  const keysSeen = new Set(); // Track keys we've already processed
  
  function traverse(current, currentPath = '') {
    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      for (const [key, value] of Object.entries(current)) {
        const fullKey = currentPath ? `${currentPath}.${key}` : key;
        
        // Check for duplicate keys (same key appearing multiple times)
        if (keysSeen.has(fullKey)) {
          duplicates.push({
            type: 'duplicate_key',
            key: fullKey,
            value: value,
            message: `Duplicate key found: ${fullKey}`
          });
          continue;
        }
        keysSeen.add(fullKey);
        
        if (typeof value === 'string') {
          // Check for duplicate values (same value with different keys)
          if (seen.has(value)) {
            const originalKey = seen.get(value);
            duplicates.push({
              type: 'duplicate_value',
              key: fullKey,
              value: value,
              originalKey: originalKey,
              message: `Duplicate value \"${value}\" found at key \"${fullKey}\" (original at \"${originalKey}\")`
            });
          } else {
            seen.set(value, fullKey);
          }
        } else if (typeof value === 'object') {
          traverse(value, fullKey);
        }
      }
    }
  }
  
  traverse(obj);
  return duplicates;
}

function removeDuplicates(obj) {
  const seen = new Set();
  const seenValues = new Map();
  
  function clean(current) {
    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      const cleaned = {};
      
      for (const [key, value] of Object.entries(current)) {
        // Skip if we've already seen this exact key-value pair
        const keyValuePair = `${key}:${JSON.stringify(value)}`;
        if (seen.has(keyValuePair)) {
          continue;
        }
        seen.add(keyValuePair);
        
        if (typeof value === 'string') {
          // For string values, we can optionally remove duplicate values
          // but this might be too aggressive, so we'll just remove duplicate keys
          cleaned[key] = value;
        } else if (typeof value === 'object') {
          cleaned[key] = clean(value);
        } else {
          cleaned[key] = value;
        }
      }
      
      return cleaned;
    }
    return current;
  }
  
  return clean(obj);
}

function createBackup(filePath) {
  const backupPath = filePath + BACKUP_SUFFIX;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function processTranslationFile(filePath) {
  log(`\\nProcessing: ${path.relative(process.cwd(), filePath)}`, 'cyan');
  
  try {
    // Read and parse the file
    const content = fs.readFileSync(filePath, 'utf8');
    const originalData = JSON.parse(content);
    
    // Find duplicates
    const duplicates = findDuplicates(originalData, filePath);
    
    if (duplicates.length === 0) {
      log('  ✓ No duplicates found', 'green');
      return { processed: true, duplicatesFound: 0, duplicatesRemoved: 0 };
    }
    
    // Report duplicates found
    log(`  Found ${duplicates.length} duplicate(s):`, 'yellow');
    duplicates.forEach(dup => {
      log(`    - ${dup.message}`, 'yellow');
    });
    
    // Create backup
    const backupPath = createBackup(filePath);
    log(`  📁 Backup created: ${path.relative(process.cwd(), backupPath)}`, 'blue');
    
    // Remove duplicates
    const cleanedData = removeDuplicates(originalData);
    
    // Calculate how many duplicates were removed
    const originalKeys = Object.keys(originalData).length;
    const cleanedKeys = Object.keys(cleanedData).length;
    const removed = originalKeys - cleanedKeys;
    
    // Write cleaned data back to file
    const cleanedContent = JSON.stringify(cleanedData, null, 2);
    fs.writeFileSync(filePath, cleanedContent, 'utf8');
    
    log(`  ✓ Removed ${removed} duplicate entries`, 'green');
    log(`  ✓ File updated successfully`, 'green');
    
    return { 
      processed: true, 
      duplicatesFound: duplicates.length, 
      duplicatesRemoved: removed,
      backupPath 
    };
    
  } catch (error) {
    log(`  ✗ Error processing file: ${error.message}`, 'red');
    return { processed: false, error: error.message };
  }
}

function main() {
  log('🔍 Food Rush Translation Duplicate Remover', 'bright');
  log('==========================================', 'bright');
  
  // Check if locales directory exists
  if (!fs.existsSync(LOCALES_DIR)) {
    log(`❌ Locales directory not found: ${LOCALES_DIR}`, 'red');
    process.exit(1);
  }
  
  // Find all translation files
  const translationFiles = findTranslationFiles(LOCALES_DIR);
  
  if (translationFiles.length === 0) {
    log('❌ No translation files found', 'red');
    process.exit(1);
  }
  
  log(`Found ${translationFiles.length} translation file(s):`, 'blue');
  translationFiles.forEach(file => {
    log(`  - ${path.relative(process.cwd(), file)}`, 'blue');
  });
  
  // Process each file
  const results = {
    totalFiles: translationFiles.length,
    processedFiles: 0,
    totalDuplicatesFound: 0,
    totalDuplicatesRemoved: 0,
    errors: [],
    backups: []
  };
  
  for (const filePath of translationFiles) {
    const result = processTranslationFile(filePath);
    
    if (result.processed) {
      results.processedFiles++;
      results.totalDuplicatesFound += result.duplicatesFound;
      results.totalDuplicatesRemoved += result.duplicatesRemoved;
      if (result.backupPath) {
        results.backups.push(result.backupPath);
      }
    } else {
      results.errors.push({ file: filePath, error: result.error });
    }
  }
  
  // Summary
  log('\\n📊 Summary', 'bright');
  log('===========', 'bright');
  log(`Files processed: ${results.processedFiles}/${results.totalFiles}`, 'cyan');
  log(`Total duplicates found: ${results.totalDuplicatesFound}`, 'yellow');
  log(`Total duplicates removed: ${results.totalDuplicatesRemoved}`, 'green');
  
  if (results.backups.length > 0) {
    log(`\\n📁 Backup files created:`, 'blue');
    results.backups.forEach(backup => {
      log(`  - ${path.relative(process.cwd(), backup)}`, 'blue');
    });
  }
  
  if (results.errors.length > 0) {
    log(`\\n❌ Errors encountered:`, 'red');
    results.errors.forEach(error => {
      log(`  - ${path.relative(process.cwd(), error.file)}: ${error.error}`, 'red');
    });
  }
  
  if (results.totalDuplicatesRemoved > 0) {
    log(`\\n✅ Successfully removed ${results.totalDuplicatesRemoved} duplicate translations!`, 'green');
    log('💡 Backup files have been created in case you need to restore.', 'yellow');
  } else {
    log('\\n✅ No duplicates found to remove. Your translation files are clean!', 'green');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  findDuplicates,
  removeDuplicates,
  processTranslationFile
};