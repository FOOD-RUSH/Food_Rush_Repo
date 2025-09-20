const fs = require('fs');
const path = require('path');

// Function to find duplicate keys in a JSON object
function findDuplicateKeys(obj, parentKey = '', duplicates = {}) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const keys = Object.keys(obj);
    const seenKeys = new Set();
    
    keys.forEach(key => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      
      // Check for duplicate key
      if (seenKeys.has(key)) {
        if (!duplicates[fullKey]) {
          duplicates[fullKey] = [];
        }
        duplicates[fullKey].push(fullKey);
      } else {
        seenKeys.add(key);
      }
      
      // Recursively check nested objects
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        findDuplicateKeys(obj[key], fullKey, duplicates);
      }
    });
  }
  return duplicates;
}

// Function to remove duplicate keys from an object
function removeDuplicateKeys(obj) {
  const result = {};
  const seenKeys = new Set();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively process nested objects
      result[key] = removeDuplicateKeys(value);
    } else if (!seenKeys.has(key)) {
      // Only add the first occurrence of the key
      result[key] = value;
      seenKeys.add(key);
    }
  });
  
  return result;
}

// Function to process a single translation file
function processTranslationFile(filePath) {
  try {
    console.log(`\nProcessing file: ${filePath}`);
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(fileContent);
    
    // Find duplicates
    const duplicates = findDuplicateKeys(translations);
    
    if (Object.keys(duplicates).length > 0) {
      console.log('Found duplicate keys:');
      console.log(JSON.stringify(duplicates, null, 2));
      
      // Remove duplicates
      const cleanedTranslations = removeDuplicateKeys(translations);
      
      // Write the cleaned content back to the file
      fs.writeFileSync(
        filePath,
        JSON.stringify(cleanedTranslations, null, 2) + '\n',
        'utf8'
      );
      
      console.log(`✅ Successfully removed duplicates from ${path.basename(filePath)}`);
    } else {
      console.log('✅ No duplicate keys found.');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function to process all translation files
function main() {
  const localesDir = path.join(__dirname, '..', 'src', 'locales');
  
  // Process all JSON files in the locales directory
  const files = [];
  
  // Find all JSON files in the locales directory
  function findJsonFiles(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findJsonFiles(fullPath);
      } else if (item.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }
  
  findJsonFiles(localesDir);
  
  if (files.length === 0) {
    console.log('No JSON files found in the locales directory.');
    return;
  }
  
  console.log(`Found ${files.length} translation files to process.`);
  
  // Process each file
  files.forEach(filePath => {
    processTranslationFile(filePath);
  });
  
  console.log('\n🎉 All translation files have been processed.');
}

// Run the script
main();
const fs = require('fs');
const path = require('path');

// Function to find duplicate keys in a JSON object
function findDuplicateKeys(obj, parentKey = '', duplicates = {}) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const keys = Object.keys(obj);
    const seenKeys = new Set();
    
    keys.forEach(key => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      
      // Check for duplicate key
      if (seenKeys.has(key)) {
        if (!duplicates[fullKey]) {
          duplicates[fullKey] = [];
        }
        duplicates[fullKey].push(fullKey);
      } else {
        seenKeys.add(key);
      }
      
      // Recursively check nested objects
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        findDuplicateKeys(obj[key], fullKey, duplicates);
      }
    });
  }
  return duplicates;
}

// Function to remove duplicate keys from an object
function removeDuplicateKeys(obj) {
  const result = {};
  const seenKeys = new Set();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively process nested objects
      result[key] = removeDuplicateKeys(value);
    } else if (!seenKeys.has(key)) {
      // Only add the first occurrence of the key
      result[key] = value;
      seenKeys.add(key);
    }
  });
  
  return result;
}

// Function to process a single translation file
function processTranslationFile(filePath) {
  try {
    console.log(`\nProcessing file: ${filePath}`);
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(fileContent);
    
    // Find duplicates
    const duplicates = findDuplicateKeys(translations);
    
    if (Object.keys(duplicates).length > 0) {
      console.log('Found duplicate keys:');
      console.log(JSON.stringify(duplicates, null, 2));
      
      // Remove duplicates
      const cleanedTranslations = removeDuplicateKeys(translations);
      
      // Write the cleaned content back to the file
      fs.writeFileSync(
        filePath,
        JSON.stringify(cleanedTranslations, null, 2) + '\n',
        'utf8'
      );
      
      console.log(`✅ Successfully removed duplicates from ${path.basename(filePath)}`);
    } else {
      console.log('✅ No duplicate keys found.');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function to process all translation files
function main() {
  const localesDir = path.join(__dirname, '..', 'src', 'locales');
  
  // Process all JSON files in the locales directory
  const files = [];
  
  // Find all JSON files in the locales directory
  function findJsonFiles(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findJsonFiles(fullPath);
      } else if (item.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }
  
  findJsonFiles(localesDir);
  
  if (files.length === 0) {
    console.log('No JSON files found in the locales directory.');
    return;
  }
  
  console.log(`Found ${files.length} translation files to process.`);
  
  // Process each file
  files.forEach(filePath => {
    processTranslationFile(filePath);
  });
  
  console.log('\n🎉 All translation files have been processed.');
}

// Run the script
main();
const fs = require('fs');
const path = require('path');

// Function to find duplicate keys in a JSON object
function findDuplicateKeys(obj, parentKey = '', duplicates = {}) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const keys = Object.keys(obj);
    const seenKeys = new Set();
    
    keys.forEach(key => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      
      // Check for duplicate key
      if (seenKeys.has(key)) {
        if (!duplicates[fullKey]) {
          duplicates[fullKey] = [];
        }
        duplicates[fullKey].push(fullKey);
      } else {
        seenKeys.add(key);
      }
      
      // Recursively check nested objects
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        findDuplicateKeys(obj[key], fullKey, duplicates);
      }
    });
  }
  return duplicates;
}

// Function to remove duplicate keys from an object
function removeDuplicateKeys(obj) {
  const result = {};
  const seenKeys = new Set();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively process nested objects
      result[key] = removeDuplicateKeys(value);
    } else if (!seenKeys.has(key)) {
      // Only add the first occurrence of the key
      result[key] = value;
      seenKeys.add(key);
    }
  });
  
  return result;
}

// Function to process a single translation file
function processTranslationFile(filePath) {
  try {
    console.log(`\nProcessing file: ${filePath}`);
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(fileContent);
    
    // Find duplicates
    const duplicates = findDuplicateKeys(translations);
    
    if (Object.keys(duplicates).length > 0) {
      console.log('Found duplicate keys:');
      console.log(JSON.stringify(duplicates, null, 2));
      
      // Remove duplicates
      const cleanedTranslations = removeDuplicateKeys(translations);
      
      // Write the cleaned content back to the file
      fs.writeFileSync(
        filePath,
        JSON.stringify(cleanedTranslations, null, 2) + '\n',
        'utf8'
      );
      
      console.log(`✅ Successfully removed duplicates from ${path.basename(filePath)}`);
    } else {
      console.log('✅ No duplicate keys found.');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function to process all translation files
function main() {
  const localesDir = path.join(__dirname, '..', 'src', 'locales');
  
  // Process all JSON files in the locales directory
  const files = [];
  
  // Find all JSON files in the locales directory
  function findJsonFiles(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findJsonFiles(fullPath);
      } else if (item.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }
  
  findJsonFiles(localesDir);
  
  if (files.length === 0) {
    console.log('No JSON files found in the locales directory.');
    return;
  }
  
  console.log(`Found ${files.length} translation files to process.`);
  
  // Process each file
  files.forEach(filePath => {
    processTranslationFile(filePath);
  });
  
  console.log('\n🎉 All translation files have been processed.');
}

// Run the script
main();
const fs = require('fs');
const path = require('path');

// Function to find duplicate keys in a JSON object
function findDuplicateKeys(obj, parentKey = '', duplicates = {}) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const keys = Object.keys(obj);
    const seenKeys = new Set();
    
    keys.forEach(key => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      
      // Check for duplicate key
      if (seenKeys.has(key)) {
        if (!duplicates[fullKey]) {
          duplicates[fullKey] = [];
        }
        duplicates[fullKey].push(fullKey);
      } else {
        seenKeys.add(key);
      }
      
      // Recursively check nested objects
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        findDuplicateKeys(obj[key], fullKey, duplicates);
      }
    });
  }
  return duplicates;
}

// Function to remove duplicate keys from an object
function removeDuplicateKeys(obj) {
  const result = {};
  const seenKeys = new Set();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively process nested objects
      result[key] = removeDuplicateKeys(value);
    } else if (!seenKeys.has(key)) {
      // Only add the first occurrence of the key
      result[key] = value;
      seenKeys.add(key);
    }
  });
  
  return result;
}

// Function to process a single translation file
function processTranslationFile(filePath) {
  try {
    console.log(`\nProcessing file: ${filePath}`);
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(fileContent);
    
    // Find duplicates
    const duplicates = findDuplicateKeys(translations);
    
    if (Object.keys(duplicates).length > 0) {
      console.log('Found duplicate keys:');
      console.log(JSON.stringify(duplicates, null, 2));
      
      // Remove duplicates
      const cleanedTranslations = removeDuplicateKeys(translations);
      
      // Write the cleaned content back to the file
      fs.writeFileSync(
        filePath,
        JSON.stringify(cleanedTranslations, null, 2) + '\n',
        'utf8'
      );
      
      console.log(`✅ Successfully removed duplicates from ${path.basename(filePath)}`);
    } else {
      console.log('✅ No duplicate keys found.');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function to process all translation files
function main() {
  const localesDir = path.join(__dirname, '..', 'src', 'locales');
  
  // Process all JSON files in the locales directory
  const files = [];
  
  // Find all JSON files in the locales directory
  function findJsonFiles(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findJsonFiles(fullPath);
      } else if (item.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }
  
  findJsonFiles(localesDir);
  
  if (files.length === 0) {
    console.log('No JSON files found in the locales directory.');
    return;
  }
  
  console.log(`Found ${files.length} translation files to process.`);
  
  // Process each file
  files.forEach(filePath => {
    processTranslationFile(filePath);
  });
  
  console.log('\n🎉 All translation files have been processed.');
}

// Run the script
main();
const fs = require('fs');
const path = require('path');

// Function to find duplicate keys in a JSON object
function findDuplicateKeys(obj, parentKey = '', duplicates = {}) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const keys = Object.keys(obj);
    const seenKeys = new Set();
    
    keys.forEach(key => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      
      // Check for duplicate key
      if (seenKeys.has(key)) {
        if (!duplicates[fullKey]) {
          duplicates[fullKey] = [];
        }
        duplicates[fullKey].push(fullKey);
      } else {
        seenKeys.add(key);
      }
      
      // Recursively check nested objects
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        findDuplicateKeys(obj[key], fullKey, duplicates);
      }
    });
  }
  return duplicates;
}

// Function to remove duplicate keys from an object
function removeDuplicateKeys(obj) {
  const result = {};
  const seenKeys = new Set();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively process nested objects
      result[key] = removeDuplicateKeys(value);
    } else if (!seenKeys.has(key)) {
      // Only add the first occurrence of the key
      result[key] = value;
      seenKeys.add(key);
    }
  });
  
  return result;
}

// Function to process a single translation file
function processTranslationFile(filePath) {
  try {
    console.log(`\nProcessing file: ${filePath}`);
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(fileContent);
    
    // Find duplicates
    const duplicates = findDuplicateKeys(translations);
    
    if (Object.keys(duplicates).length > 0) {
      console.log('Found duplicate keys:');
      console.log(JSON.stringify(duplicates, null, 2));
      
      // Remove duplicates
      const cleanedTranslations = removeDuplicateKeys(translations);
      
      // Write the cleaned content back to the file
      fs.writeFileSync(
        filePath,
        JSON.stringify(cleanedTranslations, null, 2) + '\n',
        'utf8'
      );
      
      console.log(`✅ Successfully removed duplicates from ${path.basename(filePath)}`);
    } else {
      console.log('✅ No duplicate keys found.');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function to process all translation files
function main() {
  const localesDir = path.join(__dirname, '..', 'src', 'locales');
  
  // Process all JSON files in the locales directory
  const files = [];
  
  // Find all JSON files in the locales directory
  function findJsonFiles(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        findJsonFiles(fullPath);
      } else if (item.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }
  
  findJsonFiles(localesDir);
  
  if (files.length === 0) {
    console.log('No JSON files found in the locales directory.');
    return;
  }
  
  console.log(`Found ${files.length} translation files to process.`);
  
  // Process each file
  files.forEach(filePath => {
    processTranslationFile(filePath);
  });
  
  console.log('\n🎉 All translation files have been processed.');
}

// Run the script
main();
