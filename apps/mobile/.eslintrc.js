const baseConfig = require('@react-native/eslint-config');

const overrides = (baseConfig.overrides || []).map(override => {
  if (override.env && override.env['jest/globals']) {
    const { ['jest/globals']: _unused, ...restEnv } = override.env;
    return {
      ...override,
      env: {
        ...restEnv,
        jest: true,
      },
    };
  }
  return override;
});

module.exports = {
  ...baseConfig,
  root: true,
  overrides,
  rules: {
    ...baseConfig.rules,
    'prettier/prettier': 'off',
  },
};
