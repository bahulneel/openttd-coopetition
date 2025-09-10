<script setup lang="ts">
defineOptions({ name: 'TemplateScreenDashboard' })
</script>

<template>
  <TemplateLayoutSection>
    <template #actions>
      <slot name="actions"></slot>
    </template>

    <TemplateLayoutSequential>
      <TemplateLayoutGrid>
        <slot name="stats"></slot>
      </TemplateLayoutGrid>

      <slot />
    </TemplateLayoutSequential>
  </TemplateLayoutSection>
</template>
