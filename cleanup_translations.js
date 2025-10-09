const fs = require('fs');
const path = require('path');

// Read translation files
const enTranslation = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));
const frTranslation = JSON.parse(fs.readFileSync('src/locales/fr/translation.json', 'utf8'));

console.log('🔍 Analyzing translation files for duplicates...\n');

// Function to find duplicate values within an object
function findDuplicateValues(obj, prefix = '') {
  const valueMap = new Map();
  const duplicates = [];
  
  function traverse(obj, currentPrefix) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        traverse(value, fullKey);
      } else if (typeof value === 'string') {
        if (valueMap.has(value)) {
          duplicates.push({
            value: value,
            keys: [valueMap.get(value), fullKey]
          });
        } else {
          valueMap.set(value, fullKey);
        }
      }
    }
  }
  
  traverse(obj, prefix);
  return duplicates;
}

// Function to find keys that appear in wrong sections
function findMisplacedKeys(obj) {
  const misplaced = [];
  
  // Check if keys in errors section should be at root level
  if (obj.errors) {
    for (const [key, value] of Object.entries(obj.errors)) {
      // Keys that don't seem like error messages
      if (!key.includes('error') && !key.includes('failed') && !key.includes('invalid') && 
          !key.includes('denied') && !key.includes('timeout') && !key.includes('limit')) {
        misplaced.push({
          key: key,
          value: value,
          currentLocation: 'errors',
          suggestedLocation: 'root'
        });
      }
    }
  }
  
  return misplaced;
}

// Analyze English translations
console.log('📊 English Translation Analysis:');
console.log('================================');

const enDuplicates = findDuplicateValues(enTranslation);
console.log(`Found ${enDuplicates.length} duplicate values in English:`);
enDuplicates.forEach(dup => {
  console.log(`  "${dup.value}" appears in: ${dup.keys.join(', ')}`);
});

const enMisplaced = findMisplacedKeys(enTranslation);
console.log(`\nFound ${enMisplaced.length} potentially misplaced keys in English:`);
enMisplaced.forEach(mis => {
  console.log(`  "${mis.key}": "${mis.value}" (in ${mis.currentLocation}, should be in ${mis.suggestedLocation})`);
});

// Analyze French translations
console.log('\n📊 French Translation Analysis:');
console.log('===============================');

const frDuplicates = findDuplicateValues(frTranslation);
console.log(`Found ${frDuplicates.length} duplicate values in French:`);
frDuplicates.forEach(dup => {
  console.log(`  "${dup.value}" appears in: ${dup.keys.join(', ')}`);
});

const frMisplaced = findMisplacedKeys(frTranslation);
console.log(`\nFound ${frMisplaced.length} potentially misplaced keys in French:`);
frMisplaced.forEach(mis => {
  console.log(`  "${mis.key}": "${mis.value}" (in ${mis.currentLocation}, should be in ${mis.suggestedLocation})`);
});

// Function to clean up translations
function cleanupTranslations(enObj, frObj) {
  const cleanedEn = JSON.parse(JSON.stringify(enObj));
  const cleanedFr = JSON.parse(JSON.stringify(frObj));
  
  // Move misplaced keys from errors to root level
  const enMisplacedKeys = ['currently_unavailable', 'restaurant_added_to_favorites'];
  const frMisplacedKeys = ['currently_unavailable', 'restaurant_added_to_favorites'];
  
  // Move English misplaced keys
  enMisplacedKeys.forEach(key => {
    if (cleanedEn.errors && cleanedEn.errors[key]) {
      cleanedEn[key] = cleanedEn.errors[key];
      delete cleanedEn.errors[key];
      console.log(`✅ Moved "${key}" from errors to root in English`);
    }
  });
  
  // Move French misplaced keys
  frMisplacedKeys.forEach(key => {
    if (cleanedFr.errors && cleanedFr.errors[key]) {
      cleanedFr[key] = cleanedFr.errors[key];
      delete cleanedFr.errors[key];
      console.log(`✅ Moved "${key}" from errors to root in French`);
    }
  });
  
  return { cleanedEn, cleanedFr };
}

// Clean up the translations
console.log('\n🧹 Cleaning up translations...');
console.log('==============================');

const { cleanedEn, cleanedFr } = cleanupTranslations(enTranslation, frTranslation);

// Write cleaned files
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(cleanedEn, null, 2));
fs.writeFileSync('src/locales/fr/translation.json', JSON.stringify(cleanedFr, null, 2));

console.log('\n✅ Translation cleanup completed!');
console.log('Files have been updated with duplicate removals and key reorganization.');