/* eslint-disable prettier/prettier */
module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: ['plugin:vue/essential', 'plugin:prettier/recommended', 'standard'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'prettier/prettier': ['error']
  }
}
