import type { AnyEntity, FileSystemAdapter, Storable, EntityFile, FeatureZipImport, FeatureZipExport } from '~/types'
import { FileSystemFeature } from '~/types'
import { parse as parseYAML, stringify as stringifyYAML } from 'yaml'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

// In-memory adapter (for browser-only mode) - simple KV store
export class InMemFileSystemAdapter implements FileSystemAdapter, FeatureZipImport, FeatureZipExport {
  private store: Map<string, Storable<AnyEntity>> = new Map()

  constructor() {
    // Load from localStorage if available
    this.loadFromLocalStorage()
  }

  async load<T extends AnyEntity>(path: string): Promise<Storable<T> | undefined> {
    return this.store.get(path) as Storable<T> | undefined
  }

  async save<T extends AnyEntity>(entityFile: EntityFile<T>): Promise<void> {
    this.store.set(entityFile.path, entityFile.storable)
    this.saveToLocalStorage()
  }

  async delete(path: string): Promise<void> {
    this.store.delete(path)
    this.saveToLocalStorage()
  }

  async loadAll<T extends AnyEntity>(pattern: string): Promise<Storable<T>[]> {
    // Parse pattern to filter entities
    const entityTypes = this.parsePattern(pattern)
    
    if (entityTypes.has('*')) {
      // Return all entities for wildcard pattern
      return Array.from(this.store.values()) as Storable<T>[]
    }
    
    // Filter entities by type based on pattern
    const filteredEntities: Storable<T>[] = []
    for (const entity of this.store.values()) {
      if (this.matchesPattern(entity, entityTypes)) {
        filteredEntities.push(entity as Storable<T>)
      }
    }
    
    return filteredEntities
  }

  supports(feature: FileSystemFeature): boolean {
    switch (feature) {
      case FileSystemFeature.ZIP_IMPORT:
        return true // In-memory adapter supports ZIP import
      case FileSystemFeature.ZIP_EXPORT:
        return true // In-memory adapter supports ZIP export
      case FileSystemFeature.WATCH:
        return false // In-memory adapter doesn't support watching
      case FileSystemFeature.PERSISTENCE:
        return true // In-memory adapter supports persistence via localStorage
      default:
        return false
    }
  }

  // ZIP export functionality
  async exportAll(): Promise<Blob> {
    const zip = new JSZip()

    // Group entities by type for folder structure
    const campaigns: Storable<AnyEntity>[] = []
    const goals: Storable<AnyEntity>[] = []
    const scenarios: Storable<AnyEntity>[] = []
    let manifest: Storable<AnyEntity> | undefined

    for (const entity of this.store.values()) {
      if (entity.__type === 'Campaign') {
        campaigns.push(entity)
      } else if (entity.__type === 'Goal') {
        goals.push(entity)
      } else if (entity.__type === 'Scenario') {
        scenarios.push(entity)
      } else if (entity.__type === 'Manifest') {
        manifest = entity
      }
    }

    // Add campaigns
    const campaignsFolder = zip.folder('campaigns')
    for (const campaign of campaigns) {
      const yamlContent = stringifyYAML(campaign)
      campaignsFolder?.file(`${campaign.__meta.filename}`, yamlContent)
    }

    // Add goals
    const goalsFolder = zip.folder('goals')
    for (const goal of goals) {
      const yamlContent = stringifyYAML(goal)
      goalsFolder?.file(`${goal.__meta.filename}`, yamlContent)
    }

    // Add scenarios
    const scenariosFolder = zip.folder('scenarios')
    for (const scenario of scenarios) {
      const yamlContent = stringifyYAML(scenario)
      scenariosFolder?.file(`${scenario.__meta.filename}`, yamlContent)
    }

    // Add manifest
    if (manifest) {
      const manifestContent = stringifyYAML(manifest)
      zip.file('manifest.yaml', manifestContent)
    }

    return await zip.generateAsync({ type: 'blob' })
  }

  // ZIP import functionality
  async importFromZip(file: File): Promise<void> {
    const zip = new JSZip()
    const zipContents = await zip.loadAsync(file)

    // Clear existing data
    this.store.clear()

    // Process each file in the ZIP
    for (const [filename, zipFile] of Object.entries(zipContents.files)) {
      if (zipFile.dir) continue

      const content = await zipFile.async('text')
      const yamlData = parseYAML(content)

      // Determine the path based on the file location
      let path: string
      if (filename.startsWith('campaigns/')) {
        path = `campaigns/${filename.replace('campaigns/', '')}`
      } else if (filename.startsWith('goals/')) {
        path = `goals/${filename.replace('goals/', '')}`
      } else if (filename.startsWith('scenarios/')) {
        path = `scenarios/${filename.replace('scenarios/', '')}`
      } else if (filename === 'manifest.yaml') {
        path = 'manifest.yaml'
      } else {
        continue // Skip unknown files
      }

      this.store.set(path, yamlData as Storable<AnyEntity>)
    }

    this.saveToLocalStorage()
  }

  async downloadExport(filename = 'campaigns.zip'): Promise<void> {
    const blob = await this.exportAll()
    saveAs(blob, filename)
  }

  private loadFromLocalStorage(): void {
    try {
      const storeData = localStorage.getItem('fileSystemStore')
      if (storeData) {
        const parsed = JSON.parse(storeData)
        this.store = new Map(parsed)
      }
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error)
    }
  }

  private parsePattern(pattern: string): Set<string> {
    const entityTypes = new Set<string>()
    
    // Handle wildcard patterns
    if (pattern === '*' || pattern === '**/*') {
      entityTypes.add('*')
      return entityTypes
    }
    
    // Parse specific patterns
    if (pattern.includes('campaigns') || pattern.includes('campaign')) {
      entityTypes.add('Campaign')
    }
    if (pattern.includes('goals') || pattern.includes('goal')) {
      entityTypes.add('Goal')
    }
    if (pattern.includes('scenarios') || pattern.includes('scenario')) {
      entityTypes.add('Scenario')
    }
    if (pattern.includes('manifest')) {
      entityTypes.add('Manifest')
    }
    
    // If no specific patterns matched, default to all
    if (entityTypes.size === 0) {
      entityTypes.add('*')
    }
    
    return entityTypes
  }

  private matchesPattern(entity: Storable<AnyEntity>, entityTypes: Set<string>): boolean {
    if (entityTypes.has('*')) {
      return true
    }
    
    return entityTypes.has(entity.__type)
  }

  private saveToLocalStorage(): void {
    try {
      const storeArray = Array.from(this.store.entries())
      localStorage.setItem('fileSystemStore', JSON.stringify(storeArray))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }
}
