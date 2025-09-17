# Qodo Configuration for Food Rush

This directory contains the Qodo AI configuration for the Food Rush React Native application.

## Configuration Files

### `.qodo.json`
Main configuration file containing:
- Project settings and metadata
- File paths and ignore patterns
- Code review rules and preferences
- Testing configuration
- Linting and formatting settings
- AI feature preferences
- Mobile-specific and Expo-specific settings

### `templates.json`
Code generation templates for:
- React Native components
- Screen components
- Custom hooks
- Service classes
- Test files

### `rules.json`
Code quality rules including:
- React Native best practices
- Expo-specific guidelines
- TypeScript standards
- Performance optimization rules
- Accessibility requirements
- Security guidelines
- Naming conventions

### `workflows.json`
Automated workflows for:
- Feature development
- Bug fixing
- Release preparation
- Custom commands and automation rules

## Usage

### Basic Commands

```bash
# Initialize Qodo (already done)
qodo init

# Review code changes
qodo review

# Generate a new component
qodo generate component MyComponent

# Generate a new screen
qodo generate screen MyScreen

# Generate tests
qodo generate test MyComponent

# Analyze code quality
qodo analyze

# Get AI suggestions
qodo suggest improvements
```

### Custom Workflows

```bash
# Set up a new screen with navigation
qodo run setup_new_screen --name ProfileScreen

# Refactor an existing component
qodo run refactor_component --name UserCard

# Optimize app performance
qodo run optimize_performance
```

## Project-Specific Features

### React Native Optimizations
- Performance monitoring and suggestions
- Bundle size analysis
- Platform-specific code validation
- Accessibility compliance checking

### Expo Integration
- App configuration validation
- Asset optimization
- Permission management
- EAS Build support

### TypeScript Support
- Strict type checking
- Interface recommendations
- Type safety improvements

## Customization

You can modify any of the configuration files to match your team's preferences:

1. **Rules**: Edit `rules.json` to add/remove code quality rules
2. **Templates**: Modify `templates.json` to customize code generation
3. **Workflows**: Update `workflows.json` to add custom automation
4. **Main Config**: Adjust `.qodo.json` for project-wide settings

## Integration with Existing Tools

Qodo integrates with your existing development tools:
- **ESLint**: Uses your `.eslintrc.json` configuration
- **Prettier**: Respects your `.prettierrc` settings
- **TypeScript**: Works with your `tsconfig.json`
- **Jest**: Integrates with your test configuration
- **Git**: Provides pre-commit hooks and commit validation

## Best Practices

1. **Regular Reviews**: Run `qodo review` before committing changes
2. **Template Usage**: Use templates for consistent code structure
3. **Performance Monitoring**: Regularly check bundle size and performance
4. **Security Audits**: Run security checks before releases
5. **Accessibility**: Ensure all components meet accessibility standards

## Support

For questions about Qodo configuration or usage:
1. Check the official Qodo documentation
2. Review the configuration files in this directory
3. Use `qodo help` for command-specific guidance