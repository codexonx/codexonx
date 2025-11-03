module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@store': './src/store',
          '@navigation': './src/navigation',
          '@config': './src/config',
          '@i18n': './src/i18n',
          '@types': './src/types'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
};
