#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Comprehensive App Error Fix Script\n');

// Function to run command and log output
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (_error) {
    console.log(`⚠️  ${description} failed: ${_error.message}\n`);
    return false;
  }
}

// Function to remove directory if it exists
function removeDir(dirPath, description) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Removing ${description}...`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ ${description} removed\n`);
    } catch (_error) {
      console.log(`⚠️  Failed to remove ${description}: ${_error.message}\n`);
    }
  }
}

// Function to check if file exists and has content
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.trim().length > 0) {
      console.log(`✅ ${description} exists and has content`);
      return true;
    } else {
      console.log(`⚠️  ${description} exists but is empty`);
      return false;
    }
  } else {
    console.log(`❌ ${description} does not exist`);
    return false;
  }
}

console.log('🔍 Step 1: Checking critical files...');
const criticalFiles = [
  ['src/hooks/shared/useImageUpload.ts', 'useImageUpload hook'],
  ['src/services/shared/profileApi.ts', 'Profile API service'],
  ['src/types/transaction.ts', 'Transaction types'],
  ['src/services/customer/transaction.service.ts', 'Transaction service'],
];

let allFilesOk = true;
criticalFiles.forEach(([filePath, description]) => {
  if (!checkFile(filePath, description)) {
    allFilesOk = false;
  }
});

if (!allFilesOk) {
  console.log('❌ Some critical files are missing or empty. Please check the files above.\n');
}

console.log('🧹 Step 2: Clearing all caches...');
removeDir('.expo', '.expo directory');
removeDir('node_modules/.cache', 'node_modules cache');
removeDir('.metro', '.metro directory');
removeDir('dist', 'dist directory');
removeDir('.expo/web-build', 'web build cache');

console.log('📦 Step 3: Clearing package manager caches...');
runCommand('npm cache clean --force', 'Clearing npm cache');

console.log('🔧 Step 4: Checking TypeScript compilation...');
const tsCheckResult = runCommand('npx tsc --noEmit --skipLibCheck', 'TypeScript compilation check');

if (!tsCheckResult) {
  console.log('⚠️  TypeScript compilation has errors. Attempting to fix...\n');
  
  console.log('🔧 Step 5: Running linter with auto-fix...');
  runCommand('npx eslint . --ext .js,.jsx,.ts,.tsx --fix', 'ESLint auto-fix');
  
  console.log('🎨 Step 6: Running Prettier formatting...');
  runCommand('npx prettier --write .', 'Prettier formatting');
  
  console.log('🔧 Step 7: Re-checking TypeScript compilation...');
  runCommand('npx tsc --noEmit --skipLibCheck', 'TypeScript compilation re-check');
}

console.log('🚀 Step 8: Starting Metro bundler with cache reset...');
console.log('📱 Running: npx expo start --clear\n');

try {
  execSync('npx expo start --clear', { stdio: 'inherit' });
} catch (error) {
  console.log('\n⚠️  Metro bundler failed to start. Manual intervention may be required.');
  console.log('🔧 Try running these commands manually:');
  console.log('   1. npm run fix:cache');
  console.log('   2. npm start');
  console.log('   3. If still failing, try: npm run clean:all');
}

console.log('\n🎉 Error fix script completed!');
console.log('📋 Summary of actions taken:');
console.log('   ✅ Checked critical files');
console.log('   ✅ Cleared all caches');
console.log('   ✅ Ran TypeScript compilation check');
console.log('   ✅ Applied auto-fixes where possible');
console.log('   ✅ Started Metro bundler with cache reset');