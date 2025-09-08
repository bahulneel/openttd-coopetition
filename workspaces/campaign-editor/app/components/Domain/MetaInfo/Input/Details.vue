<template>
  <FormField v-slot="{ componentField }" :name="name">
    <MoleculeFormGroup>
      <FormField v-slot="{ componentField: authorField }" name="author">
        <FormItem>
          <FormLabel>Author</FormLabel>
          <FormControl>
            <Input v-bind="authorField" placeholder="e.g., John Doe" class="openttd-input" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField: difficultyField }" name="difficulty">
        <FormItem>
          <FormLabel>Difficulty</FormLabel>
          <Select v-bind="difficultyField">
            <FormControl>
              <SelectTrigger class="openttd-input">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField: descriptionField }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea v-bind="descriptionField" placeholder="Describe what this requires..." class="openttd-input"
              rows="3" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField: timeField }" name="estimated_time">
        <FormItem>
          <FormLabel>Estimated Time</FormLabel>
          <FormControl>
            <Input v-bind="timeField" placeholder="e.g., 30 minutes" class="openttd-input" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </MoleculeFormGroup>
  </FormField>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainMetaInfoInputDetails'
})

interface Props {
  name: string
}

defineProps<Props>()
</script>