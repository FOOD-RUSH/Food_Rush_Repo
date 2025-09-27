#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('⚡ Quick Bundle Check\n');

try {
  // Quick size check
  const totalSize = execSync('du -sh . --exclude=node_modules --exclude=.git --exclude=.expo', { encoding: 'utf8' });
  console.log(`📦 Total app size: ${totalSize.trim().split('\t')[0]}`);
  
  const assetsSize = execSync('du -sh assets', { encoding: 'utf8' });
  console.log(`🖼️  Assets size: ${assetsSize.trim().split('\t')[0]}`);
  
  const srcSize = execSync('du -sh src', { encoding: 'utf8' });
  console.log(`💻 Source code: ${srcSize.trim().split('\t')[0]}`);
  
  // Quick wins
  console.log('\n🎯 Quick optimization wins:');
  
  // Check vendor_background.jpg
  try {
    const vendorBg = execSync('du -h assets/images/vendor_background.jpg', { encoding: 'utf8' });
    const size = vendorBg.trim().split('\t')[0];
    console.log(`├── vendor_background.jpg: ${size} (⚠️  OPTIMIZE THIS!)`);
  } catch (e) {
    console.log('├── vendor_background.jpg: Not found');
  }
  
  // Check for large files
  const largeFiles = execSync('find assets -type f -size +1M', { encoding: 'utf8' }).trim();
  if (largeFiles) {
    console.log('├── Files >1MB found - consider optimization');
  } else {
    console.log('├── No files >1MB found ✅');
  }
  
  console.log('\n✅ Quick check complete!');
  
} catch (error) {
  console.error('Error during quick check:', error.message);
}