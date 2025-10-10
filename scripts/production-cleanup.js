#!/usr/bin/env node

/**
 * Production Cleanup Script
 * Removes development artifacts and optimizes code for production
 */

const fs = require('fs');
const glob = require('glob');

// Files to exclude from cleanup
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.expo/**',
  '**/.git/**',
  '**/scripts/**', // Keep scripts directory
  '**/*.test.js',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.js',
  '**/*.spec.ts',
  '**/*.spec.tsx',
];

// Console methods to remove
const CONSOLE_METHODS = [
  'console.log',
  'console.debug',
  'console.info',
  'console.warn', // Keep console.error for production error handling
];

// Debugger statements to remove
const DEBUG_STATEMENTS = [
  'debugger;',
  'debugger',
];

// TODO/FIXME patterns to report
const TODO_PATTERNS = [
  'TODO',
  'FIXME',
  'XXX',
  'HACK',
];

class ProductionCleaner {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      consoleStatementsRemoved: 0,
      debuggerStatementsRemoved: 0,
      todosFound: 0,
      errors: [],
    };
  }

  /**
   * Main cleanup function
   */
  async cleanup() {
    console.log('🧹 Starting Production Cleanup...');
    console.log('================================\\n');

    try {
      // Get all TypeScript and JavaScript files
      const files = await this.getSourceFiles();
      console.log(`📁 Found ${files.length} source files to process\\n`);

      // Process each file
      for (const file of files) {
        await this.processFile(file);
      }

      // Generate report
      this.generateReport();

    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      process.exit(1);
    }
  }

  /**
   * Get all source files to process
   */
  async getSourceFiles() {
    const patterns = [
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.js',
      'src/**/*.jsx',
      'App.tsx',
      'App.js',
    ];

    let files = [];
    for (const pattern of patterns) {
      const matches = glob.sync(pattern, {
        ignore: EXCLUDE_PATTERNS,
      });
      files = files.concat(matches);
    }

    // Remove duplicates
    return [...new Set(files)];
  }

  /**
   * Process a single file
   */
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let modifiedContent = content;
      let fileModified = false;

      // Remove console statements
      const consoleResult = this.removeConsoleStatements(modifiedContent);
      if (consoleResult.modified) {
        modifiedContent = consoleResult.content;
        fileModified = true;
        this.stats.consoleStatementsRemoved += consoleResult.removedCount;
      }

      // Remove debugger statements
      const debuggerResult = this.removeDebuggerStatements(modifiedContent);
      if (debuggerResult.modified) {
        modifiedContent = debuggerResult.content;
        fileModified = true;
        this.stats.debuggerStatementsRemoved += debuggerResult.removedCount;
      }

      // Check for TODOs (report only, don't remove)
      const todos = this.findTodos(content);
      if (todos.length > 0) {
        this.stats.todosFound += todos.length;
        console.log(`📝 TODOs found in ${filePath}:`);
        todos.forEach(todo => {
          console.log(`   Line ${todo.line}: ${todo.text}`);
        });
      }

      // Write file if modified
      if (fileModified) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
        console.log(`✅ Cleaned: ${filePath}`);
      }

      this.stats.filesProcessed++;

    } catch (error) {
      this.stats.errors.push({ file: filePath, error: error.message });
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  /**
   * Remove console statements
   */
  removeConsoleStatements(content) {
    let modifiedContent = content;
    let removedCount = 0;
    let modified = false;

    for (const method of CONSOLE_METHODS) {
      // Match console statements (single line and multiline)
      const regex = new RegExp(
        `\\s*${method.replace('.', '\\.')}\\s*\\([^;]*\\);?`,
        'g'
      );
      
      const matches = modifiedContent.match(regex);
      if (matches) {
        removedCount += matches.length;
        modifiedContent = modifiedContent.replace(regex, '');
        modified = true;
      }

      // Handle multiline console statements
      const multilineRegex = new RegExp(
        `\\s*${method.replace('.', '\\.')}\\s*\\([\\s\\S]*?\\);`,
        'g'
      );
      
      const multilineMatches = modifiedContent.match(multilineRegex);
      if (multilineMatches) {
        removedCount += multilineMatches.length;
        modifiedContent = modifiedContent.replace(multilineRegex, '');
        modified = true;
      }
    }

    return { content: modifiedContent, modified, removedCount };
  }

  /**
   * Remove debugger statements
   */
  removeDebuggerStatements(content) {
    let modifiedContent = content;
    let removedCount = 0;
    let modified = false;

    for (const statement of DEBUG_STATEMENTS) {
      const regex = new RegExp(`\\s*${statement}\\s*;?`, 'g');
      const matches = modifiedContent.match(regex);
      
      if (matches) {
        removedCount += matches.length;
        modifiedContent = modifiedContent.replace(regex, '');
        modified = true;
      }
    }

    return { content: modifiedContent, modified, removedCount };
  }

  /**
   * Find TODO/FIXME comments
   */
  findTodos(content) {
    const todos = [];
    const lines = content.split('\\n');

    lines.forEach((line, index) => {
      for (const pattern of TODO_PATTERNS) {
        if (line.includes(pattern)) {
          todos.push({
            line: index + 1,
            text: line.trim(),
            pattern,
          });
        }
      }
    });

    return todos;
  }

  /**
   * Generate cleanup report
   */
  generateReport() {
    console.log('\\n📊 Production Cleanup Report');
    console.log('============================');
    console.log(`Files Processed: ${this.stats.filesProcessed}`);
    console.log(`Console Statements Removed: ${this.stats.consoleStatementsRemoved}`);
    console.log(`Debugger Statements Removed: ${this.stats.debuggerStatementsRemoved}`);
    console.log(`TODOs Found: ${this.stats.todosFound}`);
    console.log(`Errors: ${this.stats.errors.length}`);

    if (this.stats.errors.length > 0) {
      console.log('\\n❌ Errors encountered:');
      this.stats.errors.forEach(error => {
        console.log(`   ${error.file}: ${error.error}`);
      });
    }

    console.log('\\n✅ Production cleanup completed!');
    
    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
    };
    
    fs.writeFileSync('production-cleanup-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Report saved to production-cleanup-report.json');
  }
}

// Run cleanup if called directly
if (require.main === module) {
  const cleaner = new ProductionCleaner();
  cleaner.cleanup();
}

module.exports = ProductionCleaner;