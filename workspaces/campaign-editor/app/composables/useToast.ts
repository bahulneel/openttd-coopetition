import { toast } from 'vue-sonner'

export const useToast = () => {
  return {
    add: ({ title, description, color }: { 
      title: string
      description?: string
      color?: 'green' | 'red' | 'blue' | 'yellow' | 'purple'
    }) => {
      switch (color) {
        case 'green':
          toast.success(title, { description })
          break
        case 'red':
          toast.error(title, { description })
          break
        case 'blue':
          toast.info(title, { description })
          break
        case 'yellow':
          toast.warning(title, { description })
          break
        default:
          toast(title, { description })
          break
      }
    }
  }
}