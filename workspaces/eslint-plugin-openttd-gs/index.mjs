export const meta = { name: 'eslint-plugin-openttd-gs' };

import { getCachedMethodsForClass, CLASS_TO_PAGE, findCallsInNut } from '../gs-doc-cache/gs-doc-cache.mjs';
import Fuse from 'fuse.js';

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

// Get all available methods for a class (for suggestions)
function getAllMethodsForClass(cls) {
  const methods = getCachedClassMethods(cls);
  if (!methods) return [];
  return Array.from(methods.keys());
}

// Generate fuzzy search suggestions for a method
function getMethodSuggestions(cls, methodName, maxSuggestions = 3) {
  const allMethods = getAllMethodsForClass(cls);
  if (allMethods.length === 0) return [];

  // Convert to objects for Fuse.js
  const methodObjects = allMethods.map(name => ({ name }));

  const fuse = new Fuse(methodObjects, {
    keys: ['name'],
    threshold: 0.8, // Higher = more lenient matching
    distance: 100,
    includeScore: true
  });

  const results = fuse.search(methodName);
  return results.slice(0, maxSuggestions).map(result => result.item.name);
}

// Generate better error message with context and suggestions
function generateEnhancedErrorMessage(cls, method, arity, errorType) {
  const baseMessage = `${cls}.${method}`;
  const suggestions = getMethodSuggestions(cls, method);

  let message = '';
  let suggestionText = '';

  switch (errorType) {
    case 'method_not_found':
      message = `${baseMessage} not found in API documentation`;
      if (suggestions.length > 0) {
        suggestionText = ` Did you mean: ${suggestions.map(s => `${cls}.${s}`).join(', ')}?`;
      }
      break;

    case 'invalid_arity':
      const methods = getCachedClassMethods(cls);
      const allowedArities = methods?.get(method);
      if (allowedArities) {
        const sortedArities = [...allowedArities].sort();
        message = `Invalid arity for ${baseMessage} -> ${arity} args (allowed: ${sortedArities.join('/')})`;
        suggestionText = ` Expected ${sortedArities.length === 1 ? 'exactly' : 'one of'} ${sortedArities.join(' or ')} argument${sortedArities.some(a => a !== 1) ? 's' : ''}.`;
      } else {
        message = `Invalid arity for ${baseMessage} -> ${arity} args`;
      }
      break;

    case 'class_not_found':
      message = `API documentation not available for ${cls}`;
      suggestionText = ` Cache may not be initialized. Run 'npm run update-cache' to refresh the API documentation.`;
      break;

    default:
      message = `${baseMessage} validation failed`;
  }

  return message + suggestionText;
}

// Get object type information from the file content
function getObjectTypeInfo(fileContent, lineNumber) {
  // Simple heuristic to determine object type from context
  const lines = fileContent.split('\n');
  const currentLine = lines[lineNumber - 1] || '';

  // Look for common patterns
  if (currentLine.includes('GSController')) return 'Controller object';
  if (currentLine.includes('GSNews')) return 'News object';
  if (currentLine.includes('GSCompany')) return 'Company object';
  if (currentLine.includes('GSDate')) return 'Date object';
  if (currentLine.includes('GSEvent')) return 'Event object';
  if (currentLine.includes('GSGoal')) return 'Goal object';
  if (currentLine.includes('GSSign')) return 'Sign object';
  if (currentLine.includes('GSTown')) return 'Town object';
  if (currentLine.includes('GSCargo')) return 'Cargo object';
  if (currentLine.includes('GSStation')) return 'Station object';

  return 'GameScript object';
}

export const processors = {
  // Treat .nut files as text and lint via our rule runner
  '.nut': {
    preprocess(text, filename) {
      const out = [];
      const lines = text.split('\n');

      // Process all GS API calls found in the file
      for (const call of findCallsInNut(text)) {
        const { cls, method, arity } = call;
        if (!CLASS_TO_PAGE.has(cls)) continue;

        // Find the line number for this call (approximate)
        const callPattern = new RegExp(`\\b${cls}\\.${method}\\s*\\(`);
        let lineNumber = 1;
        for (let i = 0; i < lines.length; i++) {
          if (callPattern.test(lines[i])) {
            lineNumber = i + 1;
            break;
          }
        }

        // Lazy load cached data for this class
        const methods = getCachedClassMethods(cls);
        if (!methods) {
          const _objectType = getObjectTypeInfo(text, lineNumber);
          out.push({
            ruleId: 'openttd-gs/api-docs',
            message: generateEnhancedErrorMessage(cls, method, arity, 'class_not_found'),
            severity: 1, // warning
            line: lineNumber,
            column: 1
          });
          continue;
        }

        // Check if method exists
        if (!methods.has(method)) {
          const _objectType = getObjectTypeInfo(text, lineNumber);
          out.push({
            ruleId: 'openttd-gs/api-docs',
            message: generateEnhancedErrorMessage(cls, method, arity, 'method_not_found'),
            severity: 2, // error
            line: lineNumber,
            column: 1
          });
          continue;
        }

        // Check arity
        const allowedArities = methods.get(method);
        if (!allowedArities.has(arity)) {
          out.push({
            ruleId: 'openttd-gs/api-docs',
            message: generateEnhancedErrorMessage(cls, method, arity, 'invalid_arity'),
            severity: 2, // error
            line: lineNumber,
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
