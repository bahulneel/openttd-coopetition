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
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Manifest Name *</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Campaign Pack Name" />
              </FormControl>
              <FormDescription>Name of the campaign pack</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="version">
            <FormItem>
              <FormLabel>Version *</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="1.0.0" />
              </FormControl>
              <FormDescription>Version number for this pack</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="author">
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Author Name" />
              </FormControl>
              <FormDescription>Name of the pack author</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </MoleculeFormGroup>

        <div class="mt-6">
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Describe your campaign pack..." class="min-h-24" />
              </FormControl>
              <FormDescription>Detailed description of the campaign pack</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
    </Card>

    <!-- Campaigns -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-lg">📁</span>
            <CardTitle class="text-lg font-semibold">Campaigns</CardTitle>
          </div>
          <Button type="button" variant="outline" class="openttd-button" @click="addCampaign">
            ➕ Add Campaign
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="formData.campaigns && formData.campaigns.length > 0" class="space-y-4">
          <div
v-for="(campaign, index) in formData.campaigns" :key="index"
            class="p-4 border border-border rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium">Campaign {{ index + 1 }}</h4>
              <Button
type="button" variant="ghost" size="sm"
                class="text-destructive hover:text-destructive-foreground" @click="removeCampaign(index)">
                🗑️ Remove
              </Button>
            </div>

            <MoleculeFormGroup>
              <FormField v-slot="{ componentField }" :name="`campaigns.${index}.name`">
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Campaign Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" :name="`campaigns.${index}.difficulty`">
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger class="openttd-button">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="hard">🟠 Hard</SelectItem>
                      <SelectItem value="expert">🔴 Expert</SelectItem>
                      <SelectItem value="legendary">🟣 Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" :name="`campaigns.${index}.description`">
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea v-bind="componentField" placeholder="Campaign description..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </MoleculeFormGroup>
          </div>
        </div>

        <div v-else class="text-center py-8 text-muted-foreground">
          <p>No campaigns added yet. Click "Add Campaign" to get started.</p>
        </div>
      </CardContent>
    </Card>

    <!-- Actions Slot -->
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
// import type { Manifest } from '~/types' // TODO: Use when implementing manifest functionality

defineOptions({
  name: 'EntityManifestInputDetails'
})

interface Props {
  formData: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:formData': [value: any]
}>()

// Form methods
function addCampaign() {
  const currentCampaigns = props.formData.campaigns || []
  const newCampaign = {
    name: '',
    difficulty: 'medium',
    description: ''
  }
  emit('update:formData', {
    ...props.formData,
    campaigns: [...currentCampaigns, newCampaign]
  })
}

function removeCampaign(index: number) {
  const currentCampaigns = props.formData.campaigns || []
  const newCampaigns = currentCampaigns.filter((_: unknown, i: number) => i !== index)
  emit('update:formData', {
    ...props.formData,
    campaigns: newCampaigns
  })
}
</script>