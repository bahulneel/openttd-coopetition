import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse as parseYAML } from 'yaml'
import type { Manifest } from '~/types'

export default defineEventHandler(async (_event) => {
  try {
    // Path to manifest file
    const manifestPath = join(process.cwd(), '../..', 'campaigns', 'quickstart', 'manifest.yaml')

    try {
      const content = await readFile(manifestPath, 'utf-8')
      const manifest = parseYAML(content) as Manifest

      return {
        manifest,
      }
    } catch {
      // Manifest file doesn't exist or is invalid
      return {
        manifest: undefined,
      }
    }
  } catch (error) {
    console.error('Failed to load manifest:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load manifest',
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
