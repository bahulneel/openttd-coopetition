import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { stringify as stringifyYAML } from 'yaml'
import type { PackageManifest } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const { manifest } = await readBody<{ manifest: PackageManifest }>(event)

    if (!manifest) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid manifest data',
      })
    }

    // Path to manifest file
    const manifestPath = join(process.cwd(), '../..', 'campaigns', 'quickstart', 'manifest.yaml')

    // Convert to YAML
    const yamlContent = stringifyYAML(manifest, {
      indent: 2,
      lineWidth: 100,
      minContentWidth: 40,
    })

    // Write file
    await writeFile(manifestPath, yamlContent, 'utf-8')

    return {
      success: true,
      manifest,
    }
  } catch (error) {
    console.error('Failed to save manifest:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save manifest',
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
