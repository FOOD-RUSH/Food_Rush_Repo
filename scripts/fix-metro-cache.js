#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Metro bundler cache and syntax issues...\n');

// Function to run command and log output
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.log(`⚠️  ${description} failed, continuing...\n`);
  }
}

// Function to remove directory if it exists
function removeDir(dirPath, description) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Removing ${description}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ ${description} removed\n`);
  }
}

// Clear Metro cache
console.log('🧹 Clearing Metro bundler cache...');
removeDir('.expo', '.expo directory');
removeDir('node_modules/.cache', 'node_modules cache');
removeDir('.metro', '.metro directory');

// Clear other caches
removeDir('dist', 'dist directory');
removeDir('.expo/web-build', 'web build cache');

// Clear npm cache
runCommand('npm cache clean --force', 'Clearing npm cache');

// Reset Metro bundler
runCommand('npx expo r -c', 'Resetting Metro bundler with cache clear');

console.log('🎉 Cache clearing completed!');
console.log('📱 You can now run "npm start" to restart the development server.');