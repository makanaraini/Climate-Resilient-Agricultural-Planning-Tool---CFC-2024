module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
    };
    return config;
  },
};
