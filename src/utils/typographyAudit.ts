/**
 * Typography Audit Utility
 * 
 * This utility helps identify and suggest fixes for typography inconsistencies
 * in the Food Rush app codebase.
 */

import { TYPOGRAPHY_MIGRATION_PATTERNS, getTypographyVariantFromFontSize } from './typographyMigration';

export interface TypographyIssue {
  file: string;
  line: number;
  column: number;
  type: 'raw-text' | 'hardcoded-font' | 'missing-urbanist' | 'inconsistent-sizing';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
  code: string;
}

export interface AuditResult {
  issues: TypographyIssue[];
  summary: {
    totalIssues: number;
    errors: number;
    warnings: number;
    info: number;
    filesAffected: number;
  };
}

/**
 * Common patterns that indicate typography issues
 */
export const TYPOGRAPHY_ISSUE_PATTERNS = {
  // Raw Text component usage
  rawText: /<Text[\s\S]*?>/g,
  
  // Hardcoded fontSize
  hardcodedFontSize: /fontSize:\s*\d+/g,
  
  // Hardcoded fontFamily (non-Urbanist)
  nonUrbanistFont: /fontFamily:\s*['"](?!Urbanist)[^'"]+['"]/g,
  
  // System fonts
  systemFonts: /fontFamily:\s*['"](?:system|monospace|serif|sans-serif)['"]/g,
  
  // Inline font styles
  inlineFontStyles: /style=\{\{[^}]*(?:fontSize|fontFamily|fontWeight)[^}]*\}\}/g,
  
  // className font utilities
  classNameFonts: /className=["'][^"']*(?:text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)|font-(?:thin|light|normal|medium|semibold|bold|black))[^"']*["']/g,
};

/**
 * Analyzes code for typography issues
 */
export const analyzeCode = (code: string, filePath: string): TypographyIssue[] => {
  const issues: TypographyIssue[] = [];
  const lines = code.split('\n');

  lines.forEach((line, lineIndex) => {
    const lineNumber = lineIndex + 1;

    // Check for raw Text components
    const rawTextMatches = line.match(TYPOGRAPHY_ISSUE_PATTERNS.rawText);
    if (rawTextMatches) {
      rawTextMatches.forEach((match) => {
        const column = line.indexOf(match) + 1;
        issues.push({
          file: filePath,
          line: lineNumber,
          column,
          type: 'raw-text',
          severity: 'error',
          message: 'Raw Text component found. Use Typography components instead.',
          suggestion: 'Replace with appropriate Typography component (Body, Heading1, etc.)',
          code: match,
        });
      });
    }

    // Check for hardcoded fontSize
    const fontSizeMatches = line.match(TYPOGRAPHY_ISSUE_PATTERNS.hardcodedFontSize);
    if (fontSizeMatches) {
      fontSizeMatches.forEach((match) => {
        const column = line.indexOf(match) + 1;
        const fontSize = parseInt(match.match(/\d+/)?.[0] || '16');
        const suggestedVariant = getTypographyVariantFromFontSize(fontSize);
        
        issues.push({
          file: filePath,
          line: lineNumber,
          column,
          type: 'hardcoded-font',
          severity: 'warning',
          message: `Hardcoded fontSize found: ${fontSize}px`,
          suggestion: `Use Typography variant: ${suggestedVariant}`,
          code: match,
        });
      });
    }

    // Check for non-Urbanist fonts
    const nonUrbanistMatches = line.match(TYPOGRAPHY_ISSUE_PATTERNS.nonUrbanistFont);
    if (nonUrbanistMatches) {
      nonUrbanistMatches.forEach((match) => {
        const column = line.indexOf(match) + 1;
        issues.push({
          file: filePath,
          line: lineNumber,
          column,
          type: 'missing-urbanist',
          severity: 'error',
          message: 'Non-Urbanist font family detected',
          suggestion: 'Use Urbanist font family through Typography components',
          code: match,
        });
      });
    }

    // Check for system fonts (except monospace for code)
    const systemFontMatches = line.match(TYPOGRAPHY_ISSUE_PATTERNS.systemFonts);
    if (systemFontMatches) {
      systemFontMatches.forEach((match) => {
        const column = line.indexOf(match) + 1;
        const isMonospace = match.includes('monospace');
        
        issues.push({
          file: filePath,
          line: lineNumber,
          column,
          type: 'missing-urbanist',
          severity: isMonospace ? 'info' : 'warning',
          message: `System font detected: ${match}`,
          suggestion: isMonospace 
            ? 'Consider if monospace is necessary, otherwise use Urbanist'
            : 'Replace with Urbanist font through Typography components',
          code: match,
        });
      });
    }

    // Check for className font utilities
    const classNameMatches = line.match(TYPOGRAPHY_ISSUE_PATTERNS.classNameFonts);
    if (classNameMatches) {
      classNameMatches.forEach((match) => {
        const column = line.indexOf(match) + 1;
        issues.push({
          file: filePath,
          line: lineNumber,
          column,
          type: 'inconsistent-sizing',
          severity: 'info',
          message: 'Tailwind font classes detected',
          suggestion: 'Use Typography components with semantic variants instead',
          code: match,
        });
      });
    }
  });

  return issues;
};

/**
 * Generates a comprehensive audit report
 */
export const generateAuditReport = (issues: TypographyIssue[]): AuditResult => {
  const summary = {
    totalIssues: issues.length,
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
    filesAffected: new Set(issues.map(i => i.file)).size,
  };

  return {
    issues,
    summary,
  };
};

/**
 * Formats audit results for console output
 */
export const formatAuditResults = (result: AuditResult): string => {
  const { issues, summary } = result;
  
  let output = '\n🔍 Typography Audit Results\n';
  output += '═'.repeat(50) + '\n\n';
  
  // Summary
  output += `📊 Summary:\n`;
  output += `   Total Issues: ${summary.totalIssues}\n`;
  output += `   Errors: ${summary.errors}\n`;
  output += `   Warnings: ${summary.warnings}\n`;
  output += `   Info: ${summary.info}\n`;
  output += `   Files Affected: ${summary.filesAffected}\n\n`;

  if (issues.length === 0) {
    output += '✅ No typography issues found! Great job!\n';
    return output;
  }

  // Group issues by file
  const issuesByFile = issues.reduce((acc, issue) => {
    if (!acc[issue.file]) {
      acc[issue.file] = [];
    }
    acc[issue.file].push(issue);
    return acc;
  }, {} as Record<string, TypographyIssue[]>);

  // Output issues by file
  Object.entries(issuesByFile).forEach(([file, fileIssues]) => {
    output += `📁 ${file}\n`;
    output += '─'.repeat(file.length + 3) + '\n';
    
    fileIssues.forEach((issue, index) => {
      const icon = issue.severity === 'error' ? '❌' : 
                   issue.severity === 'warning' ? '⚠️' : 'ℹ️';
      
      output += `${icon} Line ${issue.line}:${issue.column} - ${issue.message}\n`;
      output += `   💡 ${issue.suggestion}\n`;
      output += `   📝 Code: ${issue.code.trim()}\n`;
      
      if (index < fileIssues.length - 1) {
        output += '\n';
      }
    });
    
    output += '\n';
  });

  // Recommendations
  output += '💡 Recommendations:\n';
  output += '─'.repeat(20) + '\n';
  output += '1. Replace all raw <Text> components with Typography components\n';
  output += '2. Remove hardcoded fontSize and fontFamily properties\n';
  output += '3. Use semantic Typography variants (Heading1, Body, etc.)\n';
  output += '4. Ensure all text uses Urbanist font family\n';
  output += '5. Test responsive behavior on different screen sizes\n\n';

  output += '📚 Resources:\n';
  output += '─'.repeat(15) + '\n';
  output += '• Typography Guide: src/docs/TYPOGRAPHY_GUIDE.md\n';
  output += '• Typography Components: src/components/common/Typography.tsx\n';
  output += '• Migration Utility: src/utils/typographyMigration.ts\n';
  output += '• Font Configuration: src/config/fonts.ts\n\n';

  return output;
};

/**
 * Quick fix suggestions for common patterns
 */
export const getQuickFixes = (issue: TypographyIssue): string[] => {
  const fixes: string[] = [];

  switch (issue.type) {
    case 'raw-text':
      fixes.push('Import Typography components: import { Body, Heading1 } from "@/src/components/common/Typography"');
      fixes.push('Replace <Text> with appropriate Typography component');
      fixes.push('Remove style props and use Typography props instead');
      break;

    case 'hardcoded-font':
      const fontSize = parseInt(issue.code.match(/\d+/)?.[0] || '16');
      const variant = getTypographyVariantFromFontSize(fontSize);
      fixes.push(`Use Typography variant: <${variant}>`);
      fixes.push('Remove fontSize from style prop');
      break;

    case 'missing-urbanist':
      fixes.push('Remove fontFamily prop');
      fixes.push('Use Typography components which automatically use Urbanist');
      break;

    case 'inconsistent-sizing':
      fixes.push('Replace Tailwind classes with Typography components');
      fixes.push('Use semantic variants instead of size classes');
      break;
  }

  return fixes;
};

/**
 * Validates that a file follows typography best practices
 */
export const validateTypography = (code: string, filePath: string): boolean => {
  const issues = analyzeCode(code, filePath);
  const errors = issues.filter(i => i.severity === 'error');
  return errors.length === 0;
};

export default {
  analyzeCode,
  generateAuditReport,
  formatAuditResults,
  getQuickFixes,
  validateTypography,
  TYPOGRAPHY_ISSUE_PATTERNS,
};