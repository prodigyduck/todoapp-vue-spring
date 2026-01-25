/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended'
  ],
  parser: 'vue-eslint-parser',
  plugins: [
    'vue'
  ],
  rules: {
    'no-console': 'off',  // Allow console.log for debugging
    'no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off'  // For gradual TypeScript migration
  },
  ignorePatterns: [
    'dist/**',
    'node_modules/**'
  ],
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off'  // Allow multiple words in component names
        '@typescript-eslint/no-explicit-any': 'off'  // Allow any during migration
      }
    }
  ]
}