import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['./app/components/ui/**'],
}).override('nuxt/vue/rules', {
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
})
