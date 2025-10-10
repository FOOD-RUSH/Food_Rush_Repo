const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Production optimization flag
const isProduction = process.env.NODE_ENV === 'production';

// Extend resolver with NativeWind and custom settings
config.resolver = {
  ...config.resolver,
  // Important: Always extend from Expo's defaults
  sourceExts: [
    ...getDefaultConfig(__dirname).resolver.sourceExts,
    'svg', // Add SVG support
  ],
  assetExts: [
    ...getDefaultConfig(__dirname).resolver.assetExts,
    // Note: Don't remove extensions here, only add if needed
  ],
  platforms: ['ios', 'android', 'native'],
  // Path alias for cleaner imports
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
};

// Transformer configuration for production optimization
config.transformer = {
  ...config.transformer,
  // Minifier configuration (only applies to production)
  minifierConfig: isProduction
    ? {
        keep_fnames: false, // Remove function names in production
        mangle: true,
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
      }
    : undefined,
};

// Serializer configuration
config.serializer = {
  ...config.serializer,
  // Create consistent module IDs for better caching
  createModuleIdFactory: () => (path) => {
    return require('crypto')
      .createHash('sha1')
      .update(path)
      .digest('hex')
      .substr(0, 8);
  },
};

// Only set processModuleFilter for production
if (isProduction) {
  config.serializer.processModuleFilter = (module) => {
    // Exclude development-only modules in production
    const excludePatterns = [
      '__DEV__',
      '.test.',
      '.spec.',
      '__tests__',
      '__mocks__',
      '.old.',
      '.backup.',
      '.tmp.',
      'debug-',
      'scripts/',
    ];

    return !excludePatterns.some((pattern) => module.path.includes(pattern));
  };
}

// Watch folders - keep it minimal
config.watchFolders = [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'assets')];

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: './globals.css' });