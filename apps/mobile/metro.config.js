const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { join } = require('path');

const config = getDefaultConfig(__dirname);

// Add support for monorepo structure
config.watchFolders = [
  join(__dirname, '../../node_modules'),
  join(__dirname, '../../libs'),
];

// Ensure proper resolver configuration for monorepo
config.resolver.nodeModulesPaths = [
  join(__dirname, 'node_modules'),
  join(__dirname, '../../node_modules'),
];

module.exports = withNativeWind(config, { input: './global.css' });
