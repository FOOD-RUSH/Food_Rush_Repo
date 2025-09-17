const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);

// Optimize bundle size
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Enable consistent module IDs for better caching
config.serializer = {
  ...config.serializer,
  createModuleIdFactory: () => (path) => {
    return require('crypto').createHash('sha1').update(path).digest('hex');
  },
};

// Optimize resolver for better tree shaking
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'native', 'web'],
};

module.exports = withNativeWind(config, { input: './globals.css' });
