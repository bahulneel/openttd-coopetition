<script setup lang="ts">
defineOptions({ name: 'TemplateScreenDashboard' })
</script>

<template>
  <TemplateLayoutSection>
    <template #actions>
      <slot name="actions" />
    </template>

    <TemplateLayoutSequential>
      <TemplateLayoutGrid>
        <slot name="stats" />
      </TemplateLayoutGrid>

      <slot />
    </TemplateLayoutSequential>
  </TemplateLayoutSection>
</template>
