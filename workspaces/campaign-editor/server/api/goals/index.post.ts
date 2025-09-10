import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { stringify as stringifyYAML } from 'yaml'
import type { Goal } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const { goal } = await readBody<{ goal: Goal }>(event)

    if (!goal || !goal.__id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid goal data',
      })
    }

    // Path to goals directory
    const goalsPath = join(process.cwd(), '../..', 'campaigns', 'quickstart', 'goals')
    const filePath = join(goalsPath, `${goal.__id.replace('goal/', '')}.yaml`)

    // Convert to YAML
    const yamlContent = stringifyYAML(goal, {
      indent: 2,
      lineWidth: 100,
      minContentWidth: 40,
    })

    // Write file
    await writeFile(filePath, yamlContent, 'utf-8')

    return {
      success: true,
      goal: {
        ...goal,
        filePath,
      },
    }
  } catch (error) {
    console.error('Failed to save goal:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save goal',
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
