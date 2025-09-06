import type { AnyEntity, FileSystemAdapter, Storable, EntityFile } from '~/types'
import { FileSystemFeature } from '~/types'

// Backend file system adapter (for development/server mode)
export class BackendFileSystemAdapter implements FileSystemAdapter {
  private basePath: string

  constructor(basePath = '/campaigns') {
    this.basePath = basePath
  }

  async load<T extends AnyEntity>(path: string): Promise<Storable<T> | undefined> {
    try {
      // Extract entity type and ID from path
      const pathParts = path.split('/')
      const filename = pathParts[pathParts.length - 1]
      const entityType = this.getEntityTypeFromPath(path)

      if (!entityType) {
        console.warn(`Unknown entity type for path: ${path}`)
        return undefined
      }

      const response = await $fetch<{ entity: Storable<T> }>(`/api/${entityType.toLowerCase()}s/${filename}`)
      return response.entity
    } catch (error) {
      console.warn(`Failed to load entity from ${path}:`, error)
      return undefined
    }
  }

  async save<T extends AnyEntity>(entityFile: EntityFile<T>): Promise<void> {
    const entityType = this.getEntityTypeFromPath(entityFile.path)

    if (!entityType) {
      throw new Error(`Unknown entity type for path: ${entityFile.path}`)
    }

    await $fetch(`/api/${entityType.toLowerCase()}s`, {
      method: 'POST',
      body: entityFile,
    })
  }

  async delete(path: string): Promise<void> {
    const entityType = this.getEntityTypeFromPath(path)

    if (!entityType) {
      throw new Error(`Unknown entity type for path: ${path}`)
    }

    const pathParts = path.split('/')
    const filename = pathParts[pathParts.length - 1]
    if (!filename) {
      throw new Error(`Invalid path: ${path}`)
    }
    const id = filename.replace('.yaml', '')

    await $fetch(`/api/${entityType.toLowerCase()}s/${id}`, {
      method: 'DELETE',
    })
  }

  async loadAll<T extends AnyEntity>(pattern: string): Promise<Storable<T>[]> {
    try {
      // Parse pattern to determine which entity types to load
      const entityTypes = this.parsePattern(pattern)
      const allEntities: Storable<T>[] = []

      // Load entities based on pattern
      if (entityTypes.has('campaigns') || pattern === '*' || pattern.includes('campaigns')) {
        try {
          const campaignsResponse = await $fetch<{ campaigns: Storable<T>[] }>('/api/campaigns')
          allEntities.push(...(campaignsResponse.campaigns || []))
        } catch (error) {
          console.warn('Failed to load campaigns:', error)
        }
      }

      if (entityTypes.has('goals') || pattern === '*' || pattern.includes('goals')) {
        try {
          const goalsResponse = await $fetch<{ goals: Storable<T>[] }>('/api/goals')
          allEntities.push(...(goalsResponse.goals || []))
        } catch (error) {
          console.warn('Failed to load goals:', error)
        }
      }

      if (entityTypes.has('scenarios') || pattern === '*' || pattern.includes('scenarios')) {
        try {
          const scenariosResponse = await $fetch<{ scenarios: Storable<T>[] }>('/api/scenarios')
          allEntities.push(...(scenariosResponse.scenarios || []))
        } catch (error) {
          console.warn('Failed to load scenarios:', error)
        }
      }

      if (entityTypes.has('manifest') || pattern === '*' || pattern.includes('manifest')) {
        try {
          const manifestResponse = await $fetch<{ manifest: Storable<T> }>('/api/manifest')
          if (manifestResponse.manifest) {
            allEntities.push(manifestResponse.manifest)
          }
        } catch (error) {
          console.warn('Failed to load manifest:', error)
        }
      }

      return allEntities
    } catch (error) {
      console.warn('Failed to load all entities:', error)
      return []
    }
  }

  supports(feature: FileSystemFeature): boolean {
    switch (feature) {
      case FileSystemFeature.ZIP_IMPORT:
        return false // Backend doesn't support ZIP import
      case FileSystemFeature.ZIP_EXPORT:
        return false // Backend doesn't support ZIP export
      case FileSystemFeature.WATCH:
        return false // Backend doesn't support watching
      case FileSystemFeature.PERSISTENCE:
        return true // Backend supports persistence
      default:
        return false
    }
  }

  private parsePattern(pattern: string): Set<string> {
    const entityTypes = new Set<string>()
    
    // Handle wildcard patterns
    if (pattern === '*' || pattern === '**/*') {
      entityTypes.add('campaigns')
      entityTypes.add('goals')
      entityTypes.add('scenarios')
      entityTypes.add('manifest')
      return entityTypes
    }
    
    // Parse specific patterns
    if (pattern.includes('campaigns') || pattern.includes('campaign')) {
      entityTypes.add('campaigns')
    }
    if (pattern.includes('goals') || pattern.includes('goal')) {
      entityTypes.add('goals')
    }
    if (pattern.includes('scenarios') || pattern.includes('scenario')) {
      entityTypes.add('scenarios')
    }
    if (pattern.includes('manifest')) {
      entityTypes.add('manifest')
    }
    
    // If no specific patterns matched, default to all
    if (entityTypes.size === 0) {
      entityTypes.add('campaigns')
      entityTypes.add('goals')
      entityTypes.add('scenarios')
      entityTypes.add('manifest')
    }
    
    return entityTypes
  }

  private getEntityTypeFromPath(path: string): string | undefined {
    if (path.includes('/campaigns/') || path.startsWith('campaigns/')) {
      return 'Campaign'
    } else if (path.includes('/goals/') || path.startsWith('goals/')) {
      return 'Goal'
    } else if (path.includes('/scenarios/') || path.startsWith('scenarios/')) {
      return 'Scenario'
    } else if (path === 'manifest.yaml' || path.endsWith('/manifest.yaml')) {
      return 'Manifest'
    }
    return undefined
  }
}
