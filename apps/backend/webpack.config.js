const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  return {
    ...config,
    entry: './src/main.ts',
    mode: 'development',
    target: 'node',
    externals: [],
    resolve: {
      extensions: ['.ts', '.js'],
    },
  };
});
