import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import JSZip from 'jszip'

export default defineEventHandler(async (event) => {
  try {
    const zip = new JSZip()

    // Base path
    const basePath = join(process.cwd(), '../..', 'campaigns', 'quickstart')

    // Add campaign files (root level YAML files, excluding manifest)
    const files = await readdir(basePath)
    const campaignFiles = files.filter((file) => file.endsWith('.yaml') && !file.startsWith('manifest'))

    for (const file of campaignFiles) {
      const content = await readFile(join(basePath, file), 'utf-8')
      zip.file(file, content)
    }

    // Add goals folder
    try {
      const goalsPath = join(basePath, 'goals')
      const goalFiles = await readdir(goalsPath)
      const goalsFolder = zip.folder('goals')

      for (const file of goalFiles.filter((f) => f.endsWith('.yaml'))) {
        const content = await readFile(join(goalsPath, file), 'utf-8')
        goalsFolder?.file(file, content)
      }
    } catch {
      console.warn('No goals folder found or accessible')
    }

    // Add scenarios folder
    try {
      const scenariosPath = join(basePath, 'scenarios')
      const scenarioFiles = await readdir(scenariosPath)
      const scenariosFolder = zip.folder('scenarios')

      for (const file of scenarioFiles.filter((f) => f.endsWith('.yaml'))) {
        const content = await readFile(join(scenariosPath, file), 'utf-8')
        scenariosFolder?.file(file, content)
      }
    } catch {
      console.warn('No scenarios folder found or accessible')
    }

    // Add manifest if it exists
    try {
      const manifestContent = await readFile(join(basePath, 'manifest.yaml'), 'utf-8')
      zip.file('manifest.yaml', manifestContent)
    } catch {
      console.warn('No manifest file found')
    }

    // Generate ZIP
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Set response headers
    setHeader(event, 'Content-Type', 'application/zip')
    setHeader(event, 'Content-Disposition', 'attachment; filename="campaigns.zip"')

    return zipBuffer
  } catch (error) {
    console.error('Failed to create export:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create export',
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
