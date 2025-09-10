import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse as parseYAML } from 'yaml'
import type { Goal } from '~/types'

export default defineEventHandler(async (_event) => {
  try {
    // Path to goals directory
    const goalsPath = join(process.cwd(), '../..', 'campaigns', 'quickstart', 'goals')

    // Read goal files
    const files = await readdir(goalsPath)
    const goalFiles = files.filter((file) => file.endsWith('.yaml'))

    const goals: Goal[] = []

    for (const file of goalFiles) {
      try {
        const filePath = join(goalsPath, file)
        const content = await readFile(filePath, 'utf-8')
        const goal = parseYAML(content) as Goal

        // Ensure the goal has an ID
        if (!goal.__id) {
          goal.__id = `goal/${file.replace('.yaml', '')}`
        }

        goals.push(goal)
      } catch (error) {
        console.warn(`Failed to parse goal file ${file}:`, error)
      }
    }

    return {
      goals,
      count: goals.length,
    }
  } catch (error) {
    console.error('Failed to load goals:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load goals',
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
