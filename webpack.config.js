const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Customize the config before returning it.
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify')
  };

  // Add ts-loader to handle TypeScript files
  config.module.rules.push({
    test: /\.ts(x?)$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  });

  return config;
};
