<template>
  <DefineContent>
    <div class="space-y-3 p-4">
      <!-- Author -->
      <div
        v-if="metaInfo.author"
        class="flex items-center space-x-2"
      >
        <span class="text-muted-foreground">Author:</span>
        <span class="text-foreground">{{ metaInfo.author }}</span>
      </div>

      <!-- Difficulty -->
      <div
        v-if="metaInfo.difficulty"
        class="flex items-center space-x-2"
      >
        <span class="text-muted-foreground">Difficulty:</span>
        <Badge
          :class="getDifficultyBadgeClass(metaInfo.difficulty)"
          class="text-xs"
        >
          {{ metaInfo.difficulty }}
        </Badge>
      </div>

      <!-- Description -->
      <div
        v-if="metaInfo.description"
        class="text-sm"
      >
        <span class="text-muted-foreground">Description:</span>
        <p class="text-foreground mt-1">{{ metaInfo.description }}</p>
      </div>

      <!-- Estimated Time -->
      <div
        v-if="metaInfo.estimated_time"
        class="flex items-center space-x-2"
      >
        <span class="text-muted-foreground">Time:</span>
        <span class="text-foreground">{{ metaInfo.estimated_time }}</span>
      </div>

      <!-- Tags -->
      <div
        v-if="metaInfo.tags && metaInfo.tags.length > 0"
        class="flex flex-wrap gap-1"
      >
        <Badge
          v-for="tag in metaInfo.tags"
          :key="tag"
          variant="secondary"
          class="text-xs"
        >
          {{ tag }}
        </Badge>
      </div>

      <!-- Requirements -->
      <div
        v-if="metaInfo.requirements && metaInfo.requirements.length > 0"
        class="text-sm"
      >
        <span class="text-muted-foreground">Requirements:</span>
        <ul class="ml-4 list-disc text-foreground">
          <li
            v-for="req in metaInfo.requirements"
            :key="req"
          >
            {{ req }}
          </li>
        </ul>
      </div>

      <!-- Prerequisites -->
      <div
        v-if="metaInfo.prerequisites && metaInfo.prerequisites.length > 0"
        class="text-sm"
      >
        <span class="text-muted-foreground">Prerequisites:</span>
        <ul class="ml-4 list-disc text-foreground">
          <li
            v-for="prereq in metaInfo.prerequisites"
            :key="prereq"
          >
            {{ prereq }}
          </li>
        </ul>
      </div>
    </div>
  </DefineContent>

  <!-- Standalone mode (default) -->
  <Card
    v-if="!asPartial"
    class="meta-info-card hover:shadow-lg transition-shadow duration-200"
  >
    <CardContent>
      <Content />
    </CardContent>
  </Card>

  <!-- Partial mode (for composition) -->
  <Content v-else />
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import type { MetaInfo } from '~/types'

defineOptions({
  name: 'DomainMetaInfoDisplayCard',
})

interface Props {
  metaInfo: MetaInfo
  asPartial?: boolean
}

defineProps<Props>()

const [DefineContent, Content] = createReusableTemplate()

function getDifficultyBadgeClass(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500 text-white'
    case 'medium':
      return 'bg-yellow-500 text-white'
    case 'hard':
      return 'bg-orange-500 text-white'
    case 'expert':
      return 'bg-red-500 text-white'
    case 'legendary':
      return 'bg-purple-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}
</script>
