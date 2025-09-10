<template>
  <div class="space-y-4">
    <!-- Collection Display -->
    <div
      v-if="modelValue && modelValue.length > 0"
      class="space-y-2"
    >
      <slot
        name="collection"
        :items="modelValue"
        :remove="removeItem"
        :reorder="reorderItems"
      >
        <div
          v-for="(item, index) in modelValue"
          :key="getItemKey(item, index)"
          class="flex items-center justify-between p-3 border border-border rounded-lg"
        >
          <div class="flex-1">
            <slot
              name="item"
              :item="item"
              :index="index"
            >
              {{ item }}
            </slot>
          </div>
          <div class="flex items-center space-x-2">
            <Button
              v-if="index > 0"
              type="button"
              variant="ghost"
              size="sm"
              @click="moveItemUp(index)"
            >
              ⬆️
            </Button>
            <Button
              v-if="index < modelValue.length - 1"
              type="button"
              variant="ghost"
              size="sm"
              @click="moveItemDown(index)"
            >
              ⬇️
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              class="text-destructive hover:text-destructive-foreground"
              @click="removeItem(index)"
            >
              🗑️ Remove
            </Button>
          </div>
        </div>
      </slot>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-8 text-muted-foreground border border-dashed border-muted-foreground rounded-lg"
    >
      <slot name="empty">
        <p>No items added yet.</p>
      </slot>
    </div>

    <!-- Add New Item -->
    <div class="border-t pt-4">
      <slot
        name="new-item"
        :add="addItem"
      >
        <Button
          type="button"
          variant="outline"
          class="openttd-button"
          @click="addItem"
        >
          ➕ Add Item
        </Button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
defineOptions({
  name: 'AggregateInput',
})

const emit = defineEmits<{
  'add-item': []
  'remove-item': [index: number]
  'reorder-items': [fromIndex: number, toIndex: number]
}>()

const modelValue = defineModel<T[]>({ required: true })

// Props for default item creation
interface Props {
  defaultItem?: () => T
}

const props = withDefaults(defineProps<Props>(), {
  defaultItem: undefined,
})

// Key generation for better Vue reactivity
function getItemKey(item: T, index: number): string {
  if (typeof item === 'object' && item !== null && 'id' in item) {
    return String((item as { id: unknown }).id) || `item-${index}`
  }
  return `item-${index}`
}

function addItem() {
  if (props.defaultItem) {
    const newItem = props.defaultItem()
    modelValue.value = [...modelValue.value, newItem]
  }
  emit('add-item')
}

function removeItem(index: number) {
  const newItems = modelValue.value.filter((_, i) => i !== index)
  modelValue.value = newItems
  emit('remove-item', index)
}

function moveItemUp(index: number) {
  if (index > 0) {
    reorderItems(index, index - 1)
  }
}

function moveItemDown(index: number) {
  if (index < modelValue.value.length - 1) {
    reorderItems(index, index + 1)
  }
}

function reorderItems(fromIndex: number, toIndex: number) {
  const newItems = [...modelValue.value]
  const [movedItem] = newItems.splice(fromIndex, 1)
  if (movedItem !== undefined) {
    newItems.splice(toIndex, 0, movedItem)
  }
  modelValue.value = newItems
  emit('reorder-items', fromIndex, toIndex)
}
</script>
