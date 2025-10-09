const fs = require('fs');

// Read translation files
const enContent = fs.readFileSync('src/locales/en/translation.json', 'utf8');
const frContent = fs.readFileSync('src/locales/fr/translation.json', 'utf8');

console.log('🔍 Removing duplicate translations...\n');

// Function to remove duplicate keys from JSON content
function removeDuplicateKeys(content, language) {
  const lines = content.split('\n');
  const seenKeys = new Set();
  const cleanedLines = [];
  let removedCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check if this line contains a JSON key
    const keyMatch = trimmedLine.match(/^"([^"]+)":/);
    if (keyMatch) {
      const key = keyMatch[1];
      
      if (seenKeys.has(key)) {
        console.log(`🗑️  Removing duplicate key "${key}" in ${language}`);
        removedCount++;
        // Skip this line (don't add to cleanedLines)
        continue;
      } else {
        seenKeys.add(key);
      }
    }
    
    cleanedLines.push(line);
  }
  
  console.log(`✅ Removed ${removedCount} duplicate keys from ${language} translation`);
  return cleanedLines.join('\n');
}

// Clean both files
const cleanedEn = removeDuplicateKeys(enContent, 'English');
const cleanedFr = removeDuplicateKeys(frContent, 'French');

// Write cleaned files back
fs.writeFileSync('src/locales/en/translation.json', cleanedEn);
fs.writeFileSync('src/locales/fr/translation.json', cleanedFr);

console.log('\n✅ Duplicate removal completed!');
console.log('Translation files have been cleaned of duplicate keys.');

// Verify the files are still valid JSON
try {
  JSON.parse(cleanedEn);
  JSON.parse(cleanedFr);
  console.log('✅ Both files are still valid JSON after cleanup.');
} catch (error) {
  console.error('❌ Error: Files may have JSON syntax issues after cleanup:', error.message);
}