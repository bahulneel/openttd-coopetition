import { unlink } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Scenario ID is required'
      })
    }
    
    // Path to scenarios directory
    const scenariosPath = join(process.cwd(), '../..', 'campaigns', 'quickstart', 'scenarios')
    const filePath = join(scenariosPath, `${id}.yaml`)
    
    // Delete file
    await unlink(filePath)
    
    return {
      success: true,
      message: `Scenario ${id} deleted successfully`
    }
  } catch (error) {
    console.error('Failed to delete scenario:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete scenario',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})