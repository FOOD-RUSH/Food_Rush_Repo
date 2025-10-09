# Translation Cleanup Scripts

This directory contains scripts to help maintain clean and duplicate-free translation files.

## Available Scripts

### 1. `clean-translations.js` (Recommended)
A simple, safe script that focuses on cleaning obvious duplicates.

**Usage:**
```bash
npm run clean:translations
```

**What it does:**
- Removes duplicate keys (JSON automatically handles this)
- Identifies duplicate values (but keeps them for manual review)
- Creates backup files before making changes
- Provides detailed reporting

**Safe to run:** ✅ Yes, creates backups and is conservative

### 2. `remove-duplicate-translations.js` (Advanced)
A more comprehensive script that performs deep duplicate analysis.

**Usage:**
```bash
npm run remove:duplicates
```

**What it does:**
- Deep analysis of nested objects
- Identifies various types of duplicates
- More aggressive duplicate removal
- Detailed reporting with categorization

**Safe to run:** ⚠️ Use with caution, review changes carefully

## How to Use

### Quick Cleanup (Recommended)
```bash
# Clean translation files safely
npm run clean:translations
```

### Advanced Cleanup
```bash
# More thorough duplicate removal
npm run remove:duplicates
```

### Manual Execution
```bash
# Run scripts directly
node scripts/clean-translations.js
node scripts/remove-duplicate-translations.js
```

## What Gets Cleaned

### Duplicate Keys
```json
{
  "hello": "Hello",
  "hello": "Hello World"  // ← This duplicate key will be removed
}
```

### Duplicate Values (Identified but preserved)
```json
{
  "greeting": "Hello",
  "welcome": "Hello"  // ← Same value, different keys (flagged for review)
}
```

## Backup Files

Both scripts create backup files with `.backup` extension:
- `translation.json.backup`
- `auth.json.backup`

**To restore from backup:**
```bash
# Example: restore English translations
cp src/locales/en/translation.json.backup src/locales/en/translation.json
```

## File Structure

The scripts process all JSON files in:
```
src/locales/
├── en/
│   ├── translation.json
│   ├── auth.json
│   └── generated.json
└── fr/
    ├── translation.json
    ├── auth.json
    └── generated.json
```

## Output Example

```
🧹 Translation File Cleaner
============================
Found 6 translation files:
  - src/locales/en/translation.json
  - src/locales/en/auth.json
  - src/locales/fr/translation.json
  - src/locales/fr/auth.json

Processing: src/locales/en/translation.json
  📁 Backup created: src/locales/en/translation.json.backup
  ✓ Original keys: 1250
  ✓ Cleaned keys: 1248
  ✓ Removed duplicates: 2
  ⚠️  Duplicate values found: 5

📊 Summary
===========
Total original keys: 2500
Total cleaned keys: 2495
Total removed duplicates: 5
Total duplicate values found: 12

✅ Successfully cleaned 5 duplicate keys!
💡 Found 12 duplicate values. Review if these should be consolidated.
```

## Best Practices

1. **Always review changes** before committing
2. **Keep backup files** until you're sure changes are correct
3. **Run scripts in development** environment first
4. **Check translation functionality** after cleanup
5. **Consider duplicate values** - some may be intentional, others may need consolidation

## Troubleshooting

### Script fails to run
```bash
# Make sure you're in the project root
cd /path/to/food-rush-project

# Check if Node.js is installed
node --version

# Run with explicit path
node scripts/clean-translations.js
```

### No files found
- Ensure you're in the correct directory
- Check that `src/locales/` exists
- Verify JSON files are present

### Permission errors
```bash
# On Unix systems, make scripts executable
chmod +x scripts/*.js
```

## Contributing

When adding new translation cleanup logic:

1. Always create backups
2. Provide detailed logging
3. Make scripts idempotent (safe to run multiple times)
4. Add appropriate error handling
5. Update this README with new functionality