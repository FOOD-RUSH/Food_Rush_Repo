const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);

// Production optimization flags
const isProduction = process.env.NODE_ENV === 'production';

// Optimize bundle size and performance
config.transformer = {
  ...config.transformer,
  // Enhanced minification for production
  minifierConfig: {
    keep_fnames: !isProduction, // Remove function names in production
    mangle: {
      keep_fnames: !isProduction,
    },
    // Additional optimizations for production
    ...(isProduction && {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
      },
    }),
  },
  // Optimize asset transformations
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

// Enable consistent module IDs for better caching
config.serializer = {
  ...config.serializer,
  createModuleIdFactory: () => (path) => {
    // Use shorter, consistent IDs for better caching
    return require('crypto').createHash('sha1').update(path).digest('hex').substr(0, 8);
  },
  // Optimize output for production
  ...(isProduction && {
    processModuleFilter: (module) => {
      // Filter out development-only modules in production
      if (module.path.includes('__DEV__')) return false;
      if (module.path.includes('.test.')) return false;
      if (module.path.includes('.spec.')) return false;
      return true;
    },
  }),
};

// Optimize resolver for better tree shaking and performance
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'native', 'web'],
  // Asset extensions optimization
  assetExts: [
    ...config.resolver.assetExts,
    // Remove unused extensions to speed up resolution
  ].filter(ext => !['gif'].includes(ext)), // Remove gif since we converted to png
  // Source extensions optimization
  sourceExts: [
    ...config.resolver.sourceExts,
    'svg', // Add SVG support
  ],
  // Alias for better tree shaking
  alias: {
    '@': __dirname,
  },
};

// Cache configuration for better performance
// Note: Removed custom cacheStores configuration to fix cache issues

// Watch folder optimization
config.watchFolders = [
  // Only watch necessary folders
  require('path').resolve(__dirname, 'src'),
  require('path').resolve(__dirname, 'assets'),
];

module.exports = withNativeWind(config, { input: './globals.css' });
