<template>
  <div class="space-y-4">
    <!-- Collection Display -->
    <div v-if="modelValue && modelValue.length > 0" class="space-y-2">
      <slot name="collection" :items="modelValue" :remove="removeItem">
        <div v-for="(item, index) in modelValue" :key="index"
          class="flex items-center justify-between p-3 border border-border rounded-lg">
          <div class="flex-1">
            <slot name="item" :item="item" :index="index">
              {{ item }}
            </slot>
          </div>
          <Button type="button" variant="ghost" size="sm" class="text-destructive hover:text-destructive-foreground"
            @click="removeItem(index)">
            🗑️ Remove
          </Button>
        </div>
      </slot>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-muted-foreground border border-dashed border-muted-foreground rounded-lg">
      <slot name="empty">
        <p>No items added yet.</p>
      </slot>
    </div>

    <!-- Add New Item -->
    <div class="border-t pt-4">
      <slot name="new-item" :add="addItem">
        <Button type="button" variant="outline" class="openttd-button" @click="addItem">
          ➕ Add Item
        </Button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
defineOptions({
  name: 'AggregateInput'
})

interface Props<T> {
  modelValue: T[]
}

const props = defineProps<Props<T>>()

const emit = defineEmits<{
  'update:modelValue': [value: T[]]
  'add-item': []
}>()

const modelValue = defineModel<T[]>({ required: true })

function addItem() {
  // This will be handled by the parent component
  emit('add-item')
}

function removeItem(index: number) {
  const newItems = modelValue.value.filter((_, i) => i !== index)
  modelValue.value = newItems
}
</script>
