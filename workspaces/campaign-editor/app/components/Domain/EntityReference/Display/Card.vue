<template>
  <WithEntity v-slot="{ value: entity }" :entity="entityRef">
    <DefineContent>
      <div class="space-y-3 p-4">
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <CardTitle class="font-semibold text-foreground text-sm">
              {{ entity.name }}
            </CardTitle>
          </div>

          <div class="flex items-center space-x-1">
            <Badge variant="outline" class="text-xs">
              {{ entityType(entity) }}
            </Badge>
          </div>
        </div>

        <!-- Description -->
        <p v-if="entity?.meta?.description" class="text-sm text-muted-foreground line-clamp-2">
          {{ entity.meta.description }}
        </p>

        <!-- Additional metadata -->
        <div v-if="entity?.meta" class="text-sm space-y-1">
          <div v-if="entity.meta.difficulty" class="flex items-center space-x-2">
            <span class="text-muted-foreground">Difficulty:</span>
            <Badge :class="getDifficultyBadgeClass(entity.meta.difficulty)" class="text-xs">
              {{ entity.meta.difficulty }}
            </Badge>
          </div>
          <div v-if="entity.meta.estimated_time" class="flex items-center space-x-2">
            <span class="text-muted-foreground">Time:</span>
            <span class="text-foreground">{{ entity.meta.estimated_time }}</span>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="entity?.meta?.tags && entity.meta.tags.length > 0" class="flex flex-wrap gap-1">
          <Badge v-for="tag in entity.meta.tags" :key="tag" variant="secondary" class="text-xs">
            {{ tag }}
          </Badge>
        </div>
      </div>
    </DefineContent>

    <!-- Standalone mode (default) -->
    <Card v-if="!asPartial" class="entity-reference-card hover:shadow-lg transition-shadow duration-200">
      <CardContent>
        <Content />
      </CardContent>
    </Card>

    <!-- Partial mode (for composition) -->
    <Content v-else />
  </WithEntity>
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import type { EntityReference, AnyEntity } from '~/types'

defineOptions({
  name: 'DomainEntityReferenceDisplayCard'
})

interface Props {
  entityRef: EntityReference<AnyEntity>
  asPartial?: boolean
}

defineProps<Props>()

const [DefineContent, Content] = createReusableTemplate()

function getDifficultyBadgeClass(difficulty: string) {
  switch (difficulty) {
    case 'easy': return 'bg-green-500 text-white'
    case 'medium': return 'bg-yellow-500 text-white'
    case 'hard': return 'bg-orange-500 text-white'
    case 'expert': return 'bg-red-500 text-white'
    case 'legendary': return 'bg-purple-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}
</script>
