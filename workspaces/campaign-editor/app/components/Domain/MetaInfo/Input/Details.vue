<template>
  <MoleculeFormGroup>
    <FormField v-slot="{ componentField }" name="author">
      <FormItem>
        <FormLabel>Author</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="e.g., John Doe" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="difficulty">
      <FormItem>
        <FormLabel>Difficulty</FormLabel>
        <Select v-bind="componentField">
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

    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField" placeholder="Describe what this requires..." class="openttd-input" rows="3" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="estimated_time">
      <FormItem>
        <FormLabel>Estimated Time</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="e.g., 30 minutes" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </MoleculeFormGroup>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainMetaInfoInputDetails'
})
</script>