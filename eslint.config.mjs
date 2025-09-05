import plugin from './workspaces/eslint-plugin-openttd-gs/index.mjs';

// Polyfill for File global that undici expects
if (typeof globalThis.File === 'undefined') {
  globalThis.File = class File {
    constructor() {
      throw new Error('File constructor not implemented');
    }
  };
}

export default [
  {
    files: ['**/*.nut'],
    plugins: {
      'openttd-gs': plugin,
    },
    processor: plugin['.nut'],
  }
];


