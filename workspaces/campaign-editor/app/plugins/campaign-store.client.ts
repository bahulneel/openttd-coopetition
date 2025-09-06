export default defineNuxtPlugin(() => {
  // The entity store is available globally
  const entityStore = useEntityStore()

  return {
    provide: {
      entityStore,
    },
  }
})
