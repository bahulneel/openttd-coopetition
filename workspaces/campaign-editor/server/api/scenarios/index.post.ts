import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { stringify as stringifyYAML } from 'yaml'
import type { Scenario } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const { scenario } = await readBody<{ scenario: Scenario }>(event)

    if (!scenario || !scenario.__id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid scenario data',
      })
    }

    // Path to scenarios directory
    const scenariosPath = join(process.cwd(), '../..', 'campaigns', 'quickstart', 'scenarios')
    const filePath = join(scenariosPath, `${scenario.__id.replace('scenario/', '')}.yaml`)

    // Convert to YAML
    const yamlContent = stringifyYAML(scenario, {
      indent: 2,
      lineWidth: 100,
      minContentWidth: 40,
    })

    // Write file
    await writeFile(filePath, yamlContent, 'utf-8')

    return {
      success: true,
      scenario: {
        ...scenario,
        filePath,
      },
    }
  } catch (error) {
    console.error('Failed to save scenario:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save scenario',
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
