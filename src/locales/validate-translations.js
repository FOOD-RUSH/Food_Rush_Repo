#!/usr/bin/env node

/**
 * Translation Validation Script
 *
 * This script validates that all translation files have consistent keys
 * and helps identify missing translations.
 */

const fs = require('fs');
const path = require('path');

// Use import.meta.url for ES modules or process.cwd() for broader compatibility
const LOCALES_DIR = process.cwd() + '/src/locales';
const SUPPORTED_LANGUAGES = ['en', 'fr'];
const NAMESPACES = ['translation', 'auth', 'generated'];

function loadTranslationFile(language, namespace) {
  const filePath = path.join(LOCALES_DIR, language, `${namespace}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function validateTranslations() {
  console.log('🔍 Validating translation files...\n');

  let hasErrors = false;

  for (const namespace of NAMESPACES) {
    console.log(`📁 Namespace: ${namespace}`);

    // Load all translations for this namespace
    const translations = {};
    const allKeys = new Set();

    for (const language of SUPPORTED_LANGUAGES) {
      const translation = loadTranslationFile(language, namespace);
      if (translation) {
        translations[language] = translation;
        const keys = getAllKeys(translation);
        keys.forEach((key) => allKeys.add(key));
      } else {
        hasErrors = true;
      }
    }

    // Check for missing keys
    for (const language of SUPPORTED_LANGUAGES) {
      const translation = translations[language];
      if (!translation) continue;

      const languageKeys = new Set(getAllKeys(translation));
      const missingKeys = [...allKeys].filter((key) => !languageKeys.has(key));

      if (missingKeys.length > 0) {
        console.log(`❌ Missing keys in ${language}:`);
        missingKeys.forEach((key) => console.log(`   - ${key}`));
        hasErrors = true;
      } else {
        console.log(`✅ ${language}: All keys present`);
      }
    }

    // Check for extra keys
    const baseLanguage = 'en';
    const baseKeys = new Set(getAllKeys(translations[baseLanguage] || {}));

    for (const language of SUPPORTED_LANGUAGES) {
      if (language === baseLanguage) continue;

      const translation = translations[language];
      if (!translation) continue;

      const languageKeys = new Set(getAllKeys(translation));
      const extraKeys = [...languageKeys].filter((key) => !baseKeys.has(key));

      if (extraKeys.length > 0) {
        console.log(`⚠️  Extra keys in ${language} (not in ${baseLanguage}):`);
        extraKeys.forEach((key) => console.log(`   + ${key}`));
      }
    }

    console.log('');
  }

  if (!hasErrors) {
    console.log('🎉 All translation files are valid!');
  } else {
    console.log(
      '❌ Translation validation failed. Please fix the issues above.',
    );
    process.exit(1);
  }
}

function generateMissingKeys() {
  console.log('🔧 Generating missing translation keys...\n');

  for (const namespace of NAMESPACES) {
    const baseTranslation = loadTranslationFile('en', namespace);
    if (!baseTranslation) continue;

    const baseKeys = getAllKeys(baseTranslation);

    for (const language of SUPPORTED_LANGUAGES) {
      if (language === 'en') continue;

      const translation = loadTranslationFile(language, namespace);
      if (!translation) continue;

      const languageKeys = new Set(getAllKeys(translation));
      const missingKeys = baseKeys.filter((key) => !languageKeys.has(key));

      if (missingKeys.length > 0) {
        console.log(`Missing keys for ${language}/${namespace}.json:`);
        console.log('```json');
        const missingTranslations = {};
        missingKeys.forEach((key) => {
          const value = getNestedValue(baseTranslation, key);
          setNestedValue(
            missingTranslations,
            key,
            `[TODO: Translate] ${value}`,
          );
        });
        console.log(JSON.stringify(missingTranslations, null, 2));
        console.log('```\n');
      }
    }
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'validate':
    validateTranslations();
    break;
  case 'generate':
    generateMissingKeys();
    break;
  default:
    console.log('Usage:');
    console.log(
      '  node validate-translations.js validate  - Validate translation files',
    );
    console.log(
      '  node validate-translations.js generate  - Generate missing translation keys',
    );
    break;
}
