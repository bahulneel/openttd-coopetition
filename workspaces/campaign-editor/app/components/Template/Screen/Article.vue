<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          <slot name="title">{{ title }}</slot>
        </h1>
        <p class="text-muted-foreground">
          <slot name="subtitle">{{ subtitle }}</slot>
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <slot name="actions" />
      </div>
    </div>

    <!-- Content -->
    <Card class="openttd-titlebar">
      <CardContent class="pt-6">
        <slot />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TemplateScreenArticle'
})

interface Props {
  title?: string
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Article',
  subtitle: 'Edit your content'
})
</script>