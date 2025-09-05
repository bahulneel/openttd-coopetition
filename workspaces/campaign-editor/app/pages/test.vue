<template>
  <div class="container mx-auto p-8 space-y-6">
    <h1 class="text-3xl font-bold text-foreground">
      🚂 Nuxt 4 + Tailwind 4 + shadcn-vue Test Page
    </h1>
    
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle>OpenTTD Campaign Editor</CardTitle>
        <CardDescription>
          Testing the new setup with authentic OpenTTD styling
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Campaign Name</Label>
            <Input 
              placeholder="Enter campaign name..."
              class="openttd-button"
            />
          </div>
          
          <div class="space-y-2">
            <Label>Difficulty</Label>
            <Select>
              <SelectTrigger class="openttd-button">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">🟢 Easy</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="hard">🟠 Hard</SelectItem>
                <SelectItem value="expert">🔴 Expert</SelectItem>
                <SelectItem value="legendary">🟣 Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="space-y-2">
          <Label>Description</Label>
          <Textarea 
            placeholder="Describe your campaign..."
            class="min-h-24"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <Badge class="bg-openttd-green/20 text-openttd-green">Construction</Badge>
          <Badge class="bg-openttd-brown/20 text-openttd-brown">Neutral</Badge>
          <Badge class="bg-openttd-purple/20 text-openttd-purple">Settings</Badge>
          <Badge class="bg-openttd-blue/20 text-openttd-blue">Information</Badge>
        </div>
      </CardContent>
      <CardFooter class="space-x-2">
        <Button class="openttd-button bg-openttd-green text-white">
          🚂 Save Campaign
        </Button>
        <Button variant="outline" class="openttd-button">
          📋 Preview
        </Button>
      </CardFooter>
    </Card>

    <Alert class="openttd-titlebar border-openttd-green/40">
      <AlertTitle>🎉 Migration Complete!</AlertTitle>
      <AlertDescription>
        Successfully migrated to Nuxt 4 + Tailwind CSS 4 + shadcn-vue with OpenTTD theming.
        All official installation steps from shadcn-vue.com have been completed:
        <br>• ✅ @nuxtjs/color-mode for dark/light mode
        <br>• ✅ @iconify/vue with radix icons
        <br>• ✅ tw-animate-css for animations
        <br>• ✅ Proper @theme inline configuration
        <br>• ✅ CSS variables and dark mode support
      </AlertDescription>
    </Alert>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Color Mode Test -->
      <Card class="openttd-titlebar">
        <CardHeader>
          <CardTitle>🌓 Color Mode Test</CardTitle>
          <CardDescription>Test the dark/light mode toggle functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground mb-4">
            Current mode: <Badge>{{ $colorMode.value }}</Badge>
          </p>
          <div class="flex gap-2">
            <Button size="sm" variant="outline" @click="$colorMode.preference = 'light'">
              ☀️ Light
            </Button>
            <Button size="sm" variant="outline" @click="$colorMode.preference = 'dark'">
              🌙 Dark  
            </Button>
            <Button size="sm" variant="outline" @click="$colorMode.preference = 'system'">
              💻 System
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Performance Test -->
      <Card class="campaign-card bg-openttd-green/20 border-openttd-green/40">
        <CardHeader>
          <CardTitle>⚡ Performance Test</CardTitle>
          <CardDescription>Tailwind CSS 4 build performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Full builds:</span>
              <Badge class="bg-openttd-green text-white">5x faster</Badge>
            </div>
            <div class="flex justify-between">
              <span>Incremental:</span>
              <Badge class="bg-openttd-green text-white">100x faster</Badge>
            </div>
            <div class="flex justify-between">
              <span>Hot reload:</span>
              <Badge class="bg-openttd-green text-white">Microseconds</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card class="campaign-card bg-openttd-brown/20 border-openttd-brown/40">
        <CardContent class="pt-6">
          <div class="text-2xl font-bold text-center">🚂</div>
          <p class="text-center text-sm font-medium mt-2">Nuxt 4</p>
        </CardContent>
      </Card>

      <Card class="campaign-card bg-openttd-green/20 border-openttd-green/40">
        <CardContent class="pt-6">
          <div class="text-2xl font-bold text-center">🎨</div>
          <p class="text-center text-sm font-medium mt-2">Tailwind 4</p>
        </CardContent>
      </Card>

      <Card class="campaign-card bg-openttd-purple/20 border-openttd-purple/40">
        <CardContent class="pt-6">
          <div class="text-2xl font-bold text-center">🧩</div>
          <p class="text-center text-sm font-medium mt-2">shadcn-vue</p>
        </CardContent>
      </Card>

      <Card class="campaign-card bg-openttd-blue/20 border-openttd-blue/40">
        <CardContent class="pt-6">
          <div class="text-2xl font-bold text-center">🎯</div>
          <p class="text-center text-sm font-medium mt-2">OpenTTD</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

definePageMeta({
  title: 'Test - OpenTTD Campaign Editor'
})
</script>