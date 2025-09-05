export default defineNuxtPlugin(() => {
  // The composable will be available globally
  const campaignStore = useCampaignStore()
  
  return {
    provide: {
      campaignStore
    }
  }
})