<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <Label class="text-sm font-medium">{{ _props.label }}</Label>
      <Button variant="outline" size="sm" class="openttd-button" @click="$emit('add')">
        ➕ {{ _props.addLabel }}
      </Button>
    </div>

    <div v-if="_props.items.length > 0" class="space-y-3">
      <div
v-for="(item, index) in _props.items" :key="index"
        class="flex items-center gap-3 p-3 border rounded-lg bg-card">
        <div class="flex-1">
          <slot name="item" :item="item" :index="index" ></slot>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" class="openttd-button" @click="$emit('edit', index, item)">
            ✏️
          </Button>
          <Button
variant="ghost" size="sm" class="openttd-button text-red-600 hover:text-red-700"
            @click="$emit('remove', index)">
            🗑️
          </Button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
      <p class="mb-2">{{ _props.emptyMessage }}</p>
      <Button variant="outline" size="sm" class="openttd-button" @click="$emit('add')">
        ➕ {{ _props.addLabel }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MoleculeFormCollection'
})

interface Props {
  label: string
  addLabel: string
  emptyMessage: string
  items: unknown[]
}

const _props = withDefaults(defineProps<Props>(), {
  label: 'Items',
  addLabel: 'Add Item',
  emptyMessage: 'No items added yet.'
})

defineEmits<{
  add: []
  edit: [index: number, item: unknown]
  remove: [index: number]
}>()
</script>