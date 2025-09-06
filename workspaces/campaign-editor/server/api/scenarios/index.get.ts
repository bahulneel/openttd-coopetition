import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse as parseYAML } from 'yaml'
import type { Scenario } from '~/types'

export default defineEventHandler(async (_event) => {
  try {
    // Path to scenarios directory
    const scenariosPath = join(process.cwd(), '../..', 'campaigns', 'quickstart', 'scenarios')

    // Read scenario files
    const files = await readdir(scenariosPath)
    const scenarioFiles = files.filter((file) => file.endsWith('.yaml'))

    const scenarios: Scenario[] = []

    for (const file of scenarioFiles) {
      try {
        const filePath = join(scenariosPath, file)
        const content = await readFile(filePath, 'utf-8')
        const scenario = parseYAML(content) as Scenario

        // Ensure the scenario has an ID
        if (!scenario.__id) {
          scenario.__id = `scenario/${file.replace('.yaml', '')}`
        }

        scenarios.push(scenario)
      } catch (error) {
        console.warn(`Failed to parse scenario file ${file}:`, error)
      }
    }

    return {
      scenarios,
      count: scenarios.length,
    }
  } catch (error) {
    console.error('Failed to load scenarios:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load scenarios',
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
