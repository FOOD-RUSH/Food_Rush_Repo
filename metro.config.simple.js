const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Get the default Expo Metro config
const config = getDefaultConfig(__dirname);

// Add platform support explicitly
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure proper source extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'svg'
];

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: './globals.css' });