import { unlink } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Goal ID is required'
      })
    }
    
    // Path to goals directory
    const goalsPath = join(process.cwd(), '../..', 'campaigns', 'quickstart', 'goals')
    const filePath = join(goalsPath, `${id}.yaml`)
    
    // Delete file
    await unlink(filePath)
    
    return {
      success: true,
      message: `Goal ${id} deleted successfully`
    }
  } catch (error) {
    console.error('Failed to delete goal:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete goal',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})