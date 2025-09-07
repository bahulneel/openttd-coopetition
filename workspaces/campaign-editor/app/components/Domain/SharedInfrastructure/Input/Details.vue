<template>
  <div class="space-y-6">
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <span class="text-lg">🏗️</span>
          <CardTitle class="text-lg font-semibold">Shared Infrastructure</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <MoleculeFormGroup>
          <FormField v-slot="{ componentField }" name="track">
            <FormItem>
              <FormLabel>Track</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="e.g., RAIL, ROAD, WATER" />
              </FormControl>
              <FormDescription>Type of track to share</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="stations">
            <FormItem>
              <FormLabel>Stations</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="e.g., true, false" />
              </FormControl>
              <FormDescription>Whether stations are shared</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="vehicles">
            <FormItem>
              <FormLabel>Vehicles</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="e.g., true, false" />
              </FormControl>
              <FormDescription>Whether vehicles are shared</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="depots">
            <FormItem>
              <FormLabel>Depots</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="e.g., true, false" />
              </FormControl>
              <FormDescription>Whether depots are shared</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </MoleculeFormGroup>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainSharedInfrastructureInputDetails'
})
</script>