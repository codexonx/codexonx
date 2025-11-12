module.exports = {
  root: true,
  extends: [
    '@react-native/eslint-config',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  env: {
    'jest/globals': true,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
          },
        ],
        'func-call-spacing': 'off',
        '@typescript-eslint/func-call-spacing': ['error'],
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
      env: {
        jest: true,
      },
      rules: {
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
  rules: {
    'prettier/prettier': 'off',
  },
};
