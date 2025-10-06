module.exports = function (api) {
  api.cache(true);

  const isProduction = process.env.NODE_ENV === 'production';

  const plugins = [
    'react-native-worklets/plugin',
    // Production optimizations only
    ...(isProduction
      ? [
          // Remove console.log statements in production
          ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
          // Optimize React components
          ['@babel/plugin-transform-react-constant-elements'],
          ['@babel/plugin-transform-react-inline-elements'],
        ]
      : []),
  ].filter(Boolean);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxImportSource: 'nativewind',
          // Use automatic JSX runtime (React 17+)
          jsxRuntime: 'automatic',
        },
      ],
      'nativewind/babel',
    ],
    plugins: plugins.filter(Boolean),
    // Environment-specific configurations
    env: {
      production: {
        plugins: [
          'react-native-worklets/plugin',
          // Additional production-only optimizations
          ['transform-remove-console', { exclude: ['error', 'warn'] }],
        ],
      },
    },
  };
};

// Note: Some plugins like transform-remove-console may need to be installed
// Run: npm install --save-dev babel-plugin-transform-remove-console
