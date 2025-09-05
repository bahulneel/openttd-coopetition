import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { stringify as stringifyYAML } from 'yaml'
import type { Campaign } from '~/types/campaign'

export default defineEventHandler(async (event) => {
  try {
    const { campaign } = await readBody<{ campaign: Campaign }>(event)
    
    if (!campaign || !campaign.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid campaign data'
      })
    }
    
    // Path to campaigns directory
    const campaignsPath = join(process.cwd(), '../..', 'campaigns', 'quickstart')
    const filePath = join(campaignsPath, `${campaign.id}.yaml`)
    
    // Clean up editor-specific properties before saving
    const cleanCampaign = { ...campaign }
    delete cleanCampaign.lastModified
    delete cleanCampaign.modified
    delete cleanCampaign.filePath
    
    // Convert to YAML
    const yamlContent = stringifyYAML(cleanCampaign, {
      indent: 2,
      lineWidth: 100,
      minContentWidth: 40
    })
    
    // Write file
    await writeFile(filePath, yamlContent, 'utf-8')
    
    return {
      success: true,
      campaign: {
        ...campaign,
        filePath,
        lastModified: Date.now(),
        modified: false
      }
    }
  } catch (error) {
    console.error('Failed to save campaign:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save campaign',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})