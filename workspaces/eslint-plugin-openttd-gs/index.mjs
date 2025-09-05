export const meta = { name: 'eslint-plugin-openttd-gs' };

import { getCachedMethodsForClass, CLASS_TO_PAGE, findCallsInNut } from '../gs-doc-cache/gs-doc-cache.mjs';

const fileToDiagnostics = new Map();
const classMethodsCache = new Map();

// Lazy load cached data for a specific class
function getCachedClassMethods(cls) {
  if (classMethodsCache.has(cls)) {
    return classMethodsCache.get(cls);
  }

  const methods = getCachedMethodsForClass(cls);
  if (methods) {
    classMethodsCache.set(cls, methods);
    return methods;
  }

  return null;
}

export const processors = {
  // Treat .nut files as text and lint via our rule runner
  '.nut': {
    preprocess(text, filename) {
      const out = [];

      // Process all GS API calls found in the file
      for (const call of findCallsInNut(text)) {
        const { cls, method, arity } = call;
        if (!CLASS_TO_PAGE.has(cls)) continue;

        // Lazy load cached data for this class
        const methods = getCachedClassMethods(cls);
        if (!methods) {
          out.push({
            ruleId: 'openttd-gs/api-docs',
            message: `API documentation not available for ${cls} (cache may not be initialized)`,
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
