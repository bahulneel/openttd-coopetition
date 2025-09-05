export default [
  {
    files: ['**/*.mjs'],
    rules: {
      'no-unused-vars': ['error', { "varsIgnorePattern": "^_" }],
      'no-console': 'off',
    },
  },
];
