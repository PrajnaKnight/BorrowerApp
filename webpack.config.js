const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add alias for react-native-vector-icons
  config.resolve.alias['react-native-vector-icons'] = 'react-native-vector-icons/dist';

  // Add rule to handle font files
  config.module.rules.push({
    test: /\.ttf$/,
    loader: 'url-loader',
    include: path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
  });

  // Add fallback for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,  // Ensure any existing fallbacks are preserved
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify'),
  };

  console.log(config.resolve.fallback);  // Add logging to verify fallbacks
  return config;
};