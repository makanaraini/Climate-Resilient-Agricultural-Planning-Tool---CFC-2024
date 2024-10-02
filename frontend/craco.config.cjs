const path = require("path-browserify");
const os = require("os-browserify/browser");
const crypto = require("crypto-browserify");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        path: path,
        os: os,
        crypto: crypto,
      };
      return webpackConfig;
    },
  },
};
