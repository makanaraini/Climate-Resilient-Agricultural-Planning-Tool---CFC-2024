const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ensure the fallback for process is set
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        vm: require.resolve('vm-browserify'),
        process: require.resolve('process/browser'), // Polyfill for process
      };

      // Add the ProvidePlugin to make process available in all modules
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser', // Polyfill for process
        }),
      ];

      return webpackConfig;
    },
  },
};
