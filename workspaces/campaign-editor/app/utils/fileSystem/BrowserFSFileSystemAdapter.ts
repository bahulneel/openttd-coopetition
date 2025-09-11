import type { AnyEntity, FileSystemAdapter, Storable, EntityFile, FeatureZipImport, FeatureZipExport } from '~/types'
import { FileSystemFeature } from '~/types'
import { parse as parseYAML, stringify as stringifyYAML } from 'yaml'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import * as BrowserFS from 'browserfs'

// BrowserFS adapter using IndexedDB backend
export class BrowserFSFileSystemAdapter implements FileSystemAdapter, FeatureZipImport, FeatureZipExport {
  private fs: any
  private initialized = false

  constructor() {
    this.initializeBrowserFS()
  }

  private async initializeBrowserFS(): Promise<void> {
    if (this.initialized) return

    return new Promise((resolve, reject) => {
      BrowserFS.configure({
        fs: 'IndexedDB',
        options: {
          storeName: 'campaignFileSystem'
        }
      }, (err) => {
        if (err) {
          console.error('Failed to initialize BrowserFS:', err)
          reject(err)
          return
        }

        this.fs = BrowserFS.BFSRequire('fs')
        this.initialized = true
        resolve()
      })
    })
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initializeBrowserFS()
    }
  }

  async load<T extends AnyEntity>(path: string): Promise<Storable<T> | undefined> {
    await this.ensureInitialized()

    try {
      if (!this.fs.existsSync(path)) {
        return undefined
      }

      const content = this.fs.readFileSync(path, 'utf8')
      return parseYAML(content) as Storable<T>
    } catch (error) {
      console.warn(`Failed to load entity from ${path}:`, error)
      return undefined
    }
  }

  async save<T extends AnyEntity>(entityFile: EntityFile<T>): Promise<void> {
    await this.ensureInitialized()

    try {
      // Ensure directory exists
      const dir = this.fs.dirname(entityFile.path)
      if (!this.fs.existsSync(dir)) {
        this.fs.mkdirSync(dir, { recursive: true })
      }

      const content = stringifyYAML(entityFile.storable)
      this.fs.writeFileSync(entityFile.path, content, 'utf8')
    } catch (error) {
      console.error(`Failed to save entity to ${entityFile.path}:`, error)
      throw error
    }
  }

  async delete(path: string): Promise<void> {
    await this.ensureInitialized()

    try {
      if (this.fs.existsSync(path)) {
        this.fs.unlinkSync(path)
      }
    } catch (error) {
      console.error(`Failed to delete ${path}:`, error)
      throw error
    }
  }

  async loadAll<T extends AnyEntity>(pattern: string): Promise<Storable<T>[]> {
    await this.ensureInitialized()

    try {
      const entityTypes = this.parsePattern(pattern)
      const allEntities: Storable<T>[] = []

      // Load entities based on pattern
      if (entityTypes.has('campaigns') || pattern === '*' || pattern.includes('campaigns')) {
        const campaigns = await this.loadEntitiesFromDirectory('campaigns', 'Campaign')
        allEntities.push(...(campaigns as Storable<T>[]))
      }

      if (entityTypes.has('goals') || pattern === '*' || pattern.includes('goals')) {
        const goals = await this.loadEntitiesFromDirectory('goals', 'Goal')
        allEntities.push(...(goals as Storable<T>[]))
      }

      if (entityTypes.has('scenarios') || pattern === '*' || pattern.includes('scenarios')) {
        const scenarios = await this.loadEntitiesFromDirectory('scenarios', 'Scenario')
        allEntities.push(...(scenarios as Storable<T>[]))
      }

      if (entityTypes.has('manifest') || pattern === '*' || pattern.includes('manifest')) {
        const manifest = await this.load('manifest.yaml')
        if (manifest) {
          allEntities.push(manifest as Storable<T>)
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
        return true // BrowserFS adapter supports ZIP import
      case FileSystemFeature.ZIP_EXPORT:
        return true // BrowserFS adapter supports ZIP export
      case FileSystemFeature.WATCH:
        return false // BrowserFS doesn't support watching in this implementation
      case FileSystemFeature.PERSISTENCE:
        return true // BrowserFS supports persistence via IndexedDB
      default:
        return false
    }
  }

  // ZIP export functionality
  async exportAll(): Promise<Blob> {
    await this.ensureInitialized()

    const zip = new JSZip()

    try {
      // Group entities by type for folder structure
      const campaigns = await this.loadEntitiesFromDirectory('campaigns', 'Campaign')
      const goals = await this.loadEntitiesFromDirectory('goals', 'Goal')
      const scenarios = await this.loadEntitiesFromDirectory('scenarios', 'Scenario')
      const manifest = await this.load('manifest.yaml')

      // Add campaigns
      if (campaigns.length > 0) {
        const campaignsFolder = zip.folder('campaigns')
        for (const campaign of campaigns) {
          const yamlContent = stringifyYAML(campaign)
          campaignsFolder?.file(`${campaign.__meta.filename}`, yamlContent)
        }
      }

      // Add goals
      if (goals.length > 0) {
        const goalsFolder = zip.folder('goals')
        for (const goal of goals) {
          const yamlContent = stringifyYAML(goal)
          goalsFolder?.file(`${goal.__meta.filename}`, yamlContent)
        }
      }

      // Add scenarios
      if (scenarios.length > 0) {
        const scenariosFolder = zip.folder('scenarios')
        for (const scenario of scenarios) {
          const yamlContent = stringifyYAML(scenario)
          scenariosFolder?.file(`${scenario.__meta.filename}`, yamlContent)
        }
      }

      // Add manifest
      if (manifest) {
        const manifestContent = stringifyYAML(manifest)
        zip.file('manifest.yaml', manifestContent)
      }

      return await zip.generateAsync({ type: 'blob' })
    } catch (error) {
      console.error('Failed to export all entities:', error)
      throw error
    }
  }

  // ZIP import functionality
  async importFromZip(file: File): Promise<void> {
    await this.ensureInitialized()

    try {
      const zip = new JSZip()
      const zipContents = await zip.loadAsync(file)

      // Clear existing data
      await this.clearAllData()

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

        // Ensure directory exists
        const dir = this.fs.dirname(path)
        if (!this.fs.existsSync(dir)) {
          this.fs.mkdirSync(dir, { recursive: true })
        }

        this.fs.writeFileSync(path, stringifyYAML(yamlData), 'utf8')
      }
    } catch (error) {
      console.error('Failed to import from ZIP:', error)
      throw error
    }
  }

  async downloadExport(filename = 'campaigns.zip'): Promise<void> {
    const blob = await this.exportAll()
    saveAs(blob, filename)
  }

  private async loadEntitiesFromDirectory<T extends AnyEntity>(directory: string, entityType: string): Promise<Storable<T>[]> {
    const entities: Storable<T>[] = []

    try {
      if (!this.fs.existsSync(directory)) {
        return entities
      }

      const files = this.fs.readdirSync(directory)

      for (const file of files) {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          const filePath = `${directory}/${file}`
          const entity = await this.load<T>(filePath)
          if (entity && entity.__type === entityType) {
            entities.push(entity)
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to load entities from ${directory}:`, error)
    }

    return entities
  }

  private async clearAllData(): Promise<void> {
    try {
      // Remove all directories and files
      const rootContents = this.fs.readdirSync('/')

      for (const item of rootContents) {
        const itemPath = `/${item}`
        if (this.fs.statSync(itemPath).isDirectory()) {
          this.fs.rmSync(itemPath, { recursive: true, force: true })
        } else {
          this.fs.unlinkSync(itemPath)
        }
      }
    } catch (error) {
      console.warn('Failed to clear all data:', error)
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
}