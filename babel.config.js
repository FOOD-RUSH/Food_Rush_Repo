module.exports = function (api) {
  api.cache(true);

  const isProduction = process.env.NODE_ENV === 'production';

  const plugins = [
    'react-native-worklets/plugin',
    // Production optimizations only
    ...(isProduction
      ? [
          '@babel/plugin-transform-react-constant-elements',
          '@babel/plugin-transform-react-inline-elements',
        ]
      : []),
  ].filter(Boolean);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxImportSource: 'nativewind',
          jsxRuntime: 'automatic',
        },
      ],
      'nativewind/babel',
    ],
    plugins: plugins.filter(Boolean),
  };
};