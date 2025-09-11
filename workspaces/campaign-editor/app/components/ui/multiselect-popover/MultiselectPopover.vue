<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        class="openttd-button justify-between"
        :class="{ 'border-primary': selectedItems.length > 0 }"
      >
        <span v-if="selectedItems.length === 0">
          {{ placeholder }}
        </span>
        <span v-else>
          {{ selectedItems.length }} template{{ selectedItems.length === 1 ? '' : 's' }} selected
        </span>
        <ChevronDown class="ml-2 h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="space-y-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">{{ title }}</h4>
          <p class="text-sm text-muted-foreground">{{ description }}</p>
        </div>
        
        <div class="space-y-2">
          <div
            v-for="(item, key) in items"
            :key="key"
            class="flex items-center space-x-2"
          >
            <Checkbox
              :id="key"
              :checked="selectedItems.includes(key)"
              :disabled="key === 'defaults'"
              @update:checked="toggleItem(key)"
            />
            <label
              :for="key"
              class="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              :class="{ 'opacity-50': key === 'defaults' }"
            >
              <div class="flex items-center space-x-2">
                <span class="text-base">{{ item.icon }}</span>
                <div class="flex-1">
                  <div class="font-medium">{{ item.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ item.description }}</div>
                  <div v-if="item.category" class="text-xs text-muted-foreground">
                    <span class="inline-block px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {{ item.category }}
                    </span>
                  </div>
                </div>
                <span v-if="key === 'defaults'" class="text-xs text-muted-foreground">(required)</span>
              </div>
            </label>
          </div>
        </div>
        
        <div class="flex justify-between pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            @click="clearAll"
          >
            Clear All
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="selectAll"
          >
            Select All
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts" generic="T extends Record<string, { name: string; description: string; data: any }>">
import { ChevronDown } from 'lucide-vue-next'

interface Props {
  items: T
  selectedItems: (keyof T)[]
  title?: string
  description?: string
  placeholder?: string
}

interface Emits {
  (e: 'update:selectedItems', items: (keyof T)[]): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Select Templates',
  description: 'Choose which template pieces to include',
  placeholder: 'Select templates...',
})

const emit = defineEmits<Emits>()

function toggleItem(key: keyof T) {
  const newSelected = props.selectedItems.includes(key)
    ? props.selectedItems.filter(item => item !== key)
    : [...props.selectedItems, key]
  emit('update:selectedItems', newSelected)
}

function clearAll() {
  emit('update:selectedItems', [])
}

function selectAll() {
  emit('update:selectedItems', Object.keys(props.items) as (keyof T)[])
}
</script>