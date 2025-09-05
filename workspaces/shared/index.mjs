/**
 * Shared utilities for Coopetition tools
 */

/**
 * Get the current version from version.nut
 * @param {string} versionNutPath - Path to version.nut file
 * @returns {number} Current version number
 */
export function getVersion(versionNutPath = '../../src/version.nut') {
  try {
    const fs = require('node:fs');
    const content = fs.readFileSync(versionNutPath, 'utf8');
    const match = content.match(/COOPETITION_VERSION = (\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  } catch (error) {
    console.warn('Could not read version from version.nut:', error.message);
    return 0;
  }
}

/**
 * Validate that a file exists
 * @param {string} filePath - Path to file
 * @returns {boolean} True if file exists
 */
export function fileExists(filePath) {
  try {
    const fs = require('node:fs');
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Create a directory if it doesn't exist
 * @param {string} dirPath - Path to directory
 */
export async function ensureDir(dirPath) {
  const fs = require('node:fs');

  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Log with timestamp
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, warn, error)
 */
export function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  console.log(`${prefix} ${message}`);
}

/**
 * Common error handling
 * @param {Error} error - Error to handle
 * @param {string} context - Context where error occurred
 */
export function handleError(error, context = 'Unknown') {
  log(`Error in ${context}: ${error.message}`, 'error');
  if (error.stack) {
    log(error.stack, 'error');
  }
  process.exit(1);
}
