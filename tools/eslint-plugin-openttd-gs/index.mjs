export const meta = { name: 'eslint-plugin-openttd-gs' };

import { getMethodsForClass, CLASS_TO_PAGE, findCallsInNut } from '../gs-doc-cache.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { homedir } from 'node:os';

const fileToDiagnostics = new Map();
const classMethodsCache = new Map();
let cacheInitialized = false;

// Synchronously load cached data at module initialization
function loadCachedData() {
  if (cacheInitialized) return;

  const verbose = process.env.GS_LINT_VERBOSE === '1';
  const refresh = process.env.GS_LINT_REFRESH === '1';
  const cacheDir = process.env.GS_DOC_CACHE_DIR || path.join(homedir(), '.openttd-gs-api-cache');

  if (refresh) {
    // If refresh is requested, we'll need to do async loading
    // For now, just mark as not initialized so processor can handle it
    return;
  }

  // Try to load cached data synchronously
  for (const cls of CLASS_TO_PAGE.keys()) {
    try {
      const cacheFile = path.join(cacheDir, `${cls}.json`);
      const raw = fs.readFileSync(cacheFile, 'utf8');
      const json = JSON.parse(raw);
      if (verbose) console.log(`[cache-hit] ${cls} from ${cacheFile}`);

      const methods = new Map();
      for (const [name, arities] of Object.entries(json.methods || {})) {
        methods.set(name, new Set(arities));
      }
      if (methods.size > 0) {
        classMethodsCache.set(cls, methods);
      }
    } catch (error) {
      // Cache file doesn't exist or is invalid, will need async loading
      if (verbose) console.log(`[cache-miss] ${cls}: ${error.message}`);
    }
  }

  cacheInitialized = true;
}

// Load cached data immediately
loadCachedData();

export const processors = {
  // Treat .nut files as text and lint via our rule runner
  '.nut': {
    preprocess(text, filename) {
      const out = [];

      // If cache is not ready yet, defer processing
      if (!cacheInitialized) {
        out.push({
          ruleId: 'openttd-gs/api-docs',
          message: `API documentation cache not ready yet, validation deferred`,
          severity: 0, // info
          line: 1,
          column: 1
        });
        fileToDiagnostics.set(filename, out);
        return [''];
      }

      // Process all GS API calls found in the file
      for (const call of findCallsInNut(text)) {
        const { cls, method, arity } = call;
        if (!CLASS_TO_PAGE.has(cls)) continue;

        // Check if we have cached data for this class
        const methods = classMethodsCache.get(cls);
        if (!methods || methods.size === 0) {
          out.push({
            ruleId: 'openttd-gs/api-docs',
            message: `Failed to load API documentation for ${cls}`,
            severity: 1, // warning
            line: 1,
            column: 1
          });
          continue;
        }

        // Check if method exists
        if (!methods.has(method)) {
          out.push({
            ruleId: 'openttd-gs/api-docs',
            message: `${cls}.${method} not found in API documentation`,
            severity: 2, // error
            line: 1,
            column: 1
          });
          continue;
        }

        // Check arity
        const allowedArities = methods.get(method);
        if (!allowedArities.has(arity)) {
          const sortedArities = [...allowedArities].sort();
          out.push({
            ruleId: 'openttd-gs/api-docs',
            message: `Invalid arity for ${cls}.${method} -> ${arity} args (allowed: ${sortedArities.join('/')})`,
            severity: 2, // error
            line: 1,
            column: 1
          });
        }
      }

      fileToDiagnostics.set(filename, out);
      return [''];
    },
    postprocess(_messages, filename) {
      return fileToDiagnostics.get(filename) || [];
    },
    supportsAutofix: false,
  }
};

// Default export for flat-config usage
export default {
  meta,
  processors,
  // Export processors at the top level for flat config
  ...processors,
};
