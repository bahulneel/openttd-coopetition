import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // OpenTTD Campaign Editor specific rules
      'no-console': 'warn',
      'vue/no-unused-vars': 'warn',
      'vue/require-default-prop': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      
      // Allow template expressions in OpenTTD themed components
      'vue/no-v-html': 'off',
      
      // Prefer explicit imports for shadcn-vue components
      'import/no-unresolved': 'off',
      
      // OpenTTD naming conventions
      'camelcase': ['error', { 
        properties: 'never',
        allow: ['^openttd_', '^OPENTTD_', '^campaign_', '^goal_', '^scenario_'] 
      }]
    }
  },
  {
    files: ['app/server/**/*.{js,ts}'],
    rules: {
      // Server-side specific rules
      'no-console': 'off' // Allow console in server
    }
  },
  {
    files: ['**/*.vue'],
    rules: {
      // Vue-specific rules for campaign editor
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/multi-word-component-names': 'off', // Allow single word components like Card, Button
      'vue/no-multiple-template-root': 'off', // Vue 3 allows multiple template roots
      
      // OpenTTD specific component patterns
      'vue/component-tags-order': ['error', {
        order: ['script', 'template', 'style']
      }]
    }
  },
  {
    files: ['app/types/**/*.ts'],
    rules: {
      // TypeScript interface files
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'warn' // Prefer unknown over any
    }
  }
)