import plugin from './workspaces/eslint-plugin-openttd-gs/index.mjs';

export default [
  {
    files: ['**/*.nut'],
    plugins: {
      'openttd-gs': plugin,
    },
    processor: plugin['.nut'],
  },
];
