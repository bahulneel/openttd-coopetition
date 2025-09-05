// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    rules: {
      // OpenTTD Campaign Editor specific rules
      'no-console': 'warn',
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off', // Allow single word components like Card, Button from shadcn-vue
      'vue/attributes-order': 'off', // Disable strict attribute ordering for better developer experience
      'vue/html-self-closing': 'off', // Allow non-self-closing tags
      'vue/html-end-tags': 'off', // Allow missing end tags in some cases
      
      // Allow template expressions in OpenTTD themed components  
      'vue/no-v-html': 'off',
      
      // TypeScript - more lenient for development  
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_|^event|^err|^error',
        varsIgnorePattern: '^_|^\\$|^difficultyOptions|^sortOptions|^economyOptions|^getDifficultyColor|^spaMode|^CardHeader',
        ignoreRestSiblings: true
      }],
      '@typescript-eslint/no-explicit-any': 'warn', // Warn instead of error
      
      // OpenTTD naming conventions - allow underscores for campaign/goal/scenario IDs
      'camelcase': ['error', { 
        properties: 'never',
        allow: ['^openttd_', '^OPENTTD_', '^campaign_', '^goal_', '^scenario_'] 
      }],
      
      // Switch case declarations
      'no-case-declarations': 'off',
      
      // Vue-specific allowances for campaign editor patterns
      'vue/no-side-effects-in-computed-properties': 'off'
    }
  },
  {
    // Server-side specific rules  
    files: ['server/**/*.{js,ts}'],
    rules: {
      'no-console': 'off', // Allow console in server code
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_|^event', // Allow unused event parameter in API handlers
        varsIgnorePattern: '^_|^error' // Allow unused error variables in catch blocks
      }]
    }
  },
  {
    // Development and utility files
    files: ['**/*.d.ts', '**/types/**/*.ts', '**/*.config.*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
])