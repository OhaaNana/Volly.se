import prettierConfig from 'eslint-config-prettier'

export default [
  {
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
    },
  },
  prettierConfig,
]
