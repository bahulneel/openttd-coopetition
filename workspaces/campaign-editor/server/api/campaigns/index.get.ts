import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse as parseYAML } from 'yaml'
import type { Campaign } from '~/types/campaign'

export default defineEventHandler(async (event) => {
  try {
    // Path to campaigns directory - adjust based on your structure
    const campaignsPath = join(process.cwd(), '../..', 'campaigns', 'quickstart')
    
    // Read campaign files
    const files = await readdir(campaignsPath)
    const campaignFiles = files.filter(file => 
      file.endsWith('.yaml') && 
      !file.startsWith('manifest') &&
      !file.includes('/')
    )
    
    const campaigns: Campaign[] = []
    
    for (const file of campaignFiles) {
      try {
        const filePath = join(campaignsPath, file)
        const content = await readFile(filePath, 'utf-8')
        const campaign = parseYAML(content) as Campaign
        
        // Ensure the campaign has an ID
        if (!campaign.id) {
          campaign.id = file.replace('.yaml', '')
        }
        
        // Add file path for reference
        campaign.filePath = filePath
        
        campaigns.push(campaign)
      } catch (error) {
        console.warn(`Failed to parse campaign file ${file}:`, error)
      }
    }
    
    return {
      campaigns,
      count: campaigns.length
    }
  } catch (error) {
    console.error('Failed to load campaigns:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load campaigns',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})