module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['prettier'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'max-len': [ 'error', { code: 120 } ]
  }
}
