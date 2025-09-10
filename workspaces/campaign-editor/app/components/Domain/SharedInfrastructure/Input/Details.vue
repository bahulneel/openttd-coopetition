<template>
  <FormField :name="name">
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
            <FormField
              v-slot="{ componentField: trackField }"
              name="track"
            >
              <FormItem>
                <FormLabel>Track</FormLabel>
                <FormControl>
                  <Input
                    v-bind="trackField"
                    placeholder="e.g., RAIL, ROAD, WATER"
                  />
                </FormControl>
                <FormDescription>Type of track to share</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField: stationsField }"
              name="stations"
            >
              <FormItem>
                <FormLabel>Stations</FormLabel>
                <FormControl>
                  <Input
                    v-bind="stationsField"
                    placeholder="e.g., true, false"
                  />
                </FormControl>
                <FormDescription>Whether stations are shared</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField: vehiclesField }"
              name="vehicles"
            >
              <FormItem>
                <FormLabel>Vehicles</FormLabel>
                <FormControl>
                  <Input
                    v-bind="vehiclesField"
                    placeholder="e.g., true, false"
                  />
                </FormControl>
                <FormDescription>Whether vehicles are shared</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField: depotsField }"
              name="depots"
            >
              <FormItem>
                <FormLabel>Depots</FormLabel>
                <FormControl>
                  <Input
                    v-bind="depotsField"
                    placeholder="e.g., true, false"
                  />
                </FormControl>
                <FormDescription>Whether depots are shared</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </MoleculeFormGroup>
        </CardContent>
      </Card>
    </div>
  </FormField>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainSharedInfrastructureInputDetails',
})

interface Props {
  name: string
}

defineProps<Props>()
</script>
