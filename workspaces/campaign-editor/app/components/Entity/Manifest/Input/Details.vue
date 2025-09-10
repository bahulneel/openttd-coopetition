<template>
  <div class="space-y-6">
    <!-- Basic Information -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <span class="text-lg">ℹ️</span>
          <CardTitle class="text-lg font-semibold">Basic Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <MoleculeFormGroup>
          <FormField
            v-slot="{ componentField }"
            name="name"
          >
            <FormItem>
              <FormLabel>Manifest Name *</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Campaign Pack Name"
                />
              </FormControl>
              <FormDescription>Name of the campaign pack</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="version"
          >
            <FormItem>
              <FormLabel>Version *</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="1.0.0"
                />
              </FormControl>
              <FormDescription>Version number for this pack</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="author"
          >
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Author Name"
                />
              </FormControl>
              <FormDescription>Name of the pack author</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </MoleculeFormGroup>

        <div class="mt-6">
          <FormField
            v-slot="{ componentField }"
            name="description"
          >
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="Describe your campaign pack..."
                  class="min-h-24"
                />
              </FormControl>
              <FormDescription>Detailed description of the campaign pack</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
    </Card>

    <!-- Actions Slot -->
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EntityManifestInputDetails',
})
</script>
