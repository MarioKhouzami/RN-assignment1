const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const projectRoot = __dirname;

const config = {
  resolver: {
    extraNodeModules: {
      zod: path.resolve(projectRoot, 'node_modules/zod'),
      '@react-navigation/native': path.resolve(
        projectRoot,
        'node_modules/@react-navigation/native',
      ),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
