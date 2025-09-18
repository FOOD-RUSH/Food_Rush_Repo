#!/usr/bin/env node

/**
 * Qodo Configuration Validator
 * Validates the Qodo configuration files for the Food Rush project
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILES = [
  '.qodo.json',
  '.qodo/templates.json',
  '.qodo/rules.json',
  '.qodo/workflows.json',
];

const REQUIRED_DIRECTORIES = [
  'src',
  'src/components',
  'src/screens',
  'src/services',
  'src/utils',
  'src/types',
];

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${filePath} - Valid JSON`);
    return true;
  } catch (error) {
    console.error(`❌ ${filePath} - Invalid JSON: ${error.message}`);
    return false;
  }
}

function validateDirectoryStructure() {
  console.log('\n📁 Validating directory structure...');
  let allValid = true;

  for (const dir of REQUIRED_DIRECTORIES) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      console.log(`✅ ${dir} - Directory exists`);
    } else {
      console.error(`❌ ${dir} - Directory missing`);
      allValid = false;
    }
  }

  return allValid;
}

function validateProjectFiles() {
  console.log('\n📄 Validating project files...');
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    '.eslintrc.json',
    '.prettierrc',
    'app.json',
  ];

  let allValid = true;

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} - File exists`);
    } else {
      console.error(`❌ ${file} - File missing`);
      allValid = false;
    }
  }

  return allValid;
}

function validateQodoConfig() {
  console.log('\n⚙️ Validating Qodo configuration...');

  try {
    const config = JSON.parse(fs.readFileSync('.qodo.json', 'utf8'));

    // Validate required sections
    const requiredSections = [
      'project',
      'paths',
      'review',
      'testing',
      'linting',
    ];
    let allValid = true;

    for (const section of requiredSections) {
      if (config[section]) {
        console.log(`✅ ${section} - Section configured`);
      } else {
        console.error(`❌ ${section} - Section missing`);
        allValid = false;
      }
    }

    // Validate project type
    if (
      config.project?.type === 'react-native' &&
      config.project?.framework === 'expo'
    ) {
      console.log('✅ Project type - React Native with Expo');
    } else {
      console.error(
        '❌ Project type - Should be react-native with expo framework',
      );
      allValid = false;
    }

    return allValid;
  } catch (error) {
    console.error(`❌ Error reading .qodo.json: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🔍 Qodo Configuration Validator');
  console.log('================================\n');

  let allValid = true;

  // Validate JSON files
  console.log('📋 Validating configuration files...');
  for (const file of CONFIG_FILES) {
    if (!validateJSON(file)) {
      allValid = false;
    }
  }

  // Validate directory structure
  if (!validateDirectoryStructure()) {
    allValid = false;
  }

  // Validate project files
  if (!validateProjectFiles()) {
    allValid = false;
  }

  // Validate Qodo configuration
  if (!validateQodoConfig()) {
    allValid = false;
  }

  console.log('\n' + '='.repeat(50));

  if (allValid) {
    console.log('🎉 All validations passed! Qodo is properly configured.');
    process.exit(0);
  } else {
    console.log('❌ Some validations failed. Please fix the issues above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateJSON,
  validateDirectoryStructure,
  validateProjectFiles,
  validateQodoConfig,
};
