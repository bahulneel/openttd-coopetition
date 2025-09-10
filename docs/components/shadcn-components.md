# shadcn-vue Components Used

This document lists all shadcn-vue components currently installed and used in the Campaign Editor.

## Installed Components

Based on the existing codebase, these shadcn-vue components are currently installed:

### Form Components
- **Button** (`components/ui/button.vue`) - Primary action component with variants
- **Input** (`components/ui/input.vue`) - Text input fields
- **Textarea** (`components/ui/textarea.vue`) - Multi-line text input
- **Label** (`components/ui/label.vue`) - Form field labels
- **Select** (`components/ui/select/`) - Dropdown selection system
  - `select.vue` - Main select component
  - `select-content.vue` - Dropdown content container
  - `select-item.vue` - Individual select option
  - `select-trigger.vue` - Select button trigger
  - `select-value.vue` - Selected value display

### Layout Components
- **Card** (`components/ui/card.vue`) - Content container with header/content sections
- **Separator** (`components/ui/separator.vue`) - Visual divider/separator

### Form Validation Components (VeeValidate Integration)
- **Form** (`components/ui/form/`) - Form validation system
  - `form-control.vue` - Form control wrapper
  - `form-description.vue` - Form field description
  - `form-field.vue` - Form field wrapper with validation context
  - `form-item.vue` - Form item container
  - `form-label.vue` - Form label with validation state
  - `form-message.vue` - Validation message display

### Feedback Components
- **Badge** (`components/ui/badge.vue`) - Status/type indicators
- **Alert** (`components/ui/alert.vue`) - Alert messages
- **Toast** (via vue-sonner) - Notification system

### Navigation Components
- **Dropdown Menu** (`components/ui/dropdown-menu/`) - Dropdown menu system
  - `dropdown-menu.vue` - Main dropdown component
  - `dropdown-menu-content.vue` - Menu content container
  - `dropdown-menu-item.vue` - Menu item
  - `dropdown-menu-trigger.vue` - Menu trigger button

## Component Usage Patterns

### Form Pattern
```vue
<template>
  <Card>
    <CardContent>
      <form @submit.prevent="onSubmit">
        <FormField name="title">
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter title" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        
        <Button type="submit">Save</Button>
      </form>
    </CardContent>
  </Card>
</template>
```

### Display Pattern
```vue
<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <Badge>{{ type }}</Badge>
    </CardHeader>
    <CardContent>
      <p>{{ description }}</p>
    </CardContent>
  </Card>
</template>
```

### Selection Pattern
```vue
<template>
  <FormField name="type">
    <FormItem>
      <FormLabel>Type</FormLabel>
      <FormControl>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
    </FormItem>
  </FormField>
</template>
```

## OpenTTD Styling Integration

All shadcn components are styled with OpenTTD theme classes:

```css
/* Applied to shadcn components */
.openttd-input        /* Input styling */
.openttd-button       /* Button styling */
.openttd-titlebar     /* Card/container styling */
```

## Installation Commands

To add additional shadcn-vue components:

```bash
# Install specific components
npx shadcn-vue@latest add [component-name]

# Examples
npx shadcn-vue@latest add table
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add checkbox
```

## Component File Locations

All shadcn-vue components are installed in:
```
workspaces/campaign-editor/app/components/ui/
├── button.vue
├── input.vue
├── textarea.vue
├── label.vue
├── card.vue
├── badge.vue
├── separator.vue
├── alert.vue
├── select/
│   ├── select.vue
│   ├── select-content.vue
│   ├── select-item.vue
│   ├── select-trigger.vue
│   └── select-value.vue
├── form/
│   ├── form-control.vue
│   ├── form-description.vue
│   ├── form-field.vue
│   ├── form-item.vue
│   ├── form-label.vue
│   └── form-message.vue
└── dropdown-menu/
    ├── dropdown-menu.vue
    ├── dropdown-menu-content.vue
    ├── dropdown-menu-item.vue
    └── dropdown-menu-trigger.vue
```

## Auto-Import Configuration

shadcn-vue components are auto-imported via Nuxt configuration, so they can be used directly without explicit imports:

```vue
<template>
  <!-- No import needed -->
  <Card>
    <CardContent>
      <Button>Click me</Button>
    </CardContent>
  </Card>
</template>
```
