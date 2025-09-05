import { unlink } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Campaign ID is required'
      })
    }
    
    // Path to campaigns directory
    const campaignsPath = join(process.cwd(), '../..', 'campaigns', 'quickstart')
    const filePath = join(campaignsPath, `${id}.yaml`)
    
    // Delete file
    await unlink(filePath)
    
    return {
      success: true,
      message: `Campaign ${id} deleted successfully`
    }
  } catch (error) {
    console.error('Failed to delete campaign:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete campaign',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})