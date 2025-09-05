#!/usr/bin/env node

import { updateCache } from '../gs-doc-cache.mjs';

const args = process.argv.slice(2);
const verbose = args.includes('--verbose') || args.includes('-v');
const force = args.includes('--force') || args.includes('-f');

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: update-gs-cache [options]

Options:
  --verbose, -v    Enable verbose output
  --force, -f      Force refresh all cache entries
  --help, -h       Show this help message

This script updates the OpenTTD GS API documentation cache.
Cache files are stored in ~/.openttd-gs-api-cache/ by default.
`);
  process.exit(0);
}

try {
  await updateCache({ verbose, force });
  console.log('✅ GS API cache updated successfully');
} catch (error) {
  console.error('❌ Failed to update GS API cache:', error.message);
  process.exit(1);
}
