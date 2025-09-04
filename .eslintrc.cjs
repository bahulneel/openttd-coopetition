/* Minimal ESLint config to run the openttd-gs processor on .nut files */
module.exports = [
  {
    files: ['**/*.nut'],
    plugins: {},
    processor: {
      'tools/eslint-plugin-openttd-gs/index.mjs': '.nut'
    },
  }
];


