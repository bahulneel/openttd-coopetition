<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          <slot name="title">{{ _props.title }}</slot>
        </h1>
        <p class="text-muted-foreground">
          <slot name="subtitle">{{ _props.subtitle }}</slot>
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <slot name="actions"/>
      </div>
    </div>

    <!-- Content -->
    <div
      v-if="_props.hasContent"
      class="space-y-4"
    >
      <slot />
    </div>

    <!-- Empty State -->
    <Card
      v-else
      class="openttd-titlebar"
    >
      <CardContent class="pt-12 pb-12">
        <div class="text-center">
          <div class="text-6xl mb-4">🎯</div>
          <CardTitle class="text-lg font-semibold text-foreground mb-2">
            <slot name="empty-title">{{ _props.emptyTitle }}</slot>
          </CardTitle>
          <p class="text-muted-foreground mb-6">
            <slot name="empty-description">{{ _props.emptyDescription }}</slot>
          </p>
          <slot name="empty-actions"/>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TemplateScreenCollection',
})

interface Props {
  title?: string
  subtitle?: string
  emptyTitle?: string
  emptyDescription?: string
  hasContent?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  title: 'Collection',
  subtitle: 'Manage your items',
  emptyTitle: 'No Items Yet',
  emptyDescription: 'Create your first item to get started.',
  hasContent: true,
})
</script>
