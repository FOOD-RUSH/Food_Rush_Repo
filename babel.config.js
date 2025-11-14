module.exports = function (api) {
  api.cache(true);

  const plugins = [];

  // Remove console.log, console.debug, console.info in production
  // Keep console.error and console.warn for error tracking
  if (process.env.NODE_ENV === 'production') {
    plugins.push([
      'transform-remove-console',
      {
        exclude: ['error', 'warn'],
      },
    ]);
  }

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
    plugins,
  };
};
