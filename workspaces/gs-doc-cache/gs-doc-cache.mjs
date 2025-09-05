import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { homedir } from 'node:os';
import { load as cheerioLoad } from 'cheerio';

export const DOCS_BASE = 'https://docs.openttd.org/gs-api';
export const CACHE_DIR = process.env.GS_DOC_CACHE_DIR || path.join(homedir(), '.openttd-gs-api-cache');

export const CLASS_TO_PAGE = new Map([
  ['GSNews', 'classGSNews.html'],
  ['GSCompany', 'classGSCompany.html'],
  ['GSController', 'classGSController.html'],
  ['GSDate', 'classGSDate.html'],
  ['GSEventController', 'classGSEventController.html'],
  ['GSStoryPage', 'classGSStoryPage.html'],
  ['GSGoal', 'classGSGoal.html'],
  ['GSSign', 'classGSSign.html'],
  ['GSTown', 'classGSTown.html'],
  ['GSCargo', 'classGSCargo.html'],
  ['GSStation', 'classGSStation.html'],
]);

async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);

  // Extract cache headers
  const cacheHeaders = {
    'last-modified': res.headers.get('last-modified'),
    'etag': res.headers.get('etag'),
    'cache-control': res.headers.get('cache-control'),
    'expires': res.headers.get('expires'),
    'date': res.headers.get('date')
  };

  return {
    html: await res.text(),
    headers: cacheHeaders
  };
}

// Initialize cache directory (no refresh by default)
export async function initCache({ verbose = false } = {}) {
  if (verbose) {
    console.log('[cache-init] Initializing API documentation cache...');
  }
  await fs.mkdir(CACHE_DIR, { recursive: true }).catch(() => { });
}

// Update all class documentation cache
export async function updateCache({ verbose = false, force = false } = {}) {
  await fs.mkdir(CACHE_DIR, { recursive: true }).catch(() => { });

  if (verbose) console.log('[cache-update] Updating API documentation cache...');
  for (const cls of CLASS_TO_PAGE.keys()) {
    await refreshClassCache(cls, { verbose, force });
  }
  if (verbose) console.log('[cache-update] Cache update complete');
}

// Check if cache needs refresh based on HTTP headers
function shouldRefreshCache(cachedHeaders, currentHeaders) {
  if (!cachedHeaders || !currentHeaders) return true;

  // Check ETag first (strongest validation)
  if (cachedHeaders.etag && currentHeaders.etag) {
    return cachedHeaders.etag !== currentHeaders.etag;
  }

  // Check Last-Modified
  if (cachedHeaders['last-modified'] && currentHeaders['last-modified']) {
    return cachedHeaders['last-modified'] !== currentHeaders['last-modified'];
  }

  // Check Cache-Control max-age
  if (currentHeaders['cache-control']) {
    const maxAgeMatch = currentHeaders['cache-control'].match(/max-age=(\d+)/);
    if (maxAgeMatch) {
      const maxAge = parseInt(maxAgeMatch[1], 10);
      const cacheDate = new Date(cachedHeaders.date || 0);
      const now = new Date();
      return (now - cacheDate) > (maxAge * 1000);
    }
  }

  // Default to refresh if we can't determine
  return true;
}

// Refresh documentation for a specific class
export async function refreshClassCache(cls, { verbose = false, force = false } = {}) {
  const page = CLASS_TO_PAGE.get(cls);
  if (!page) return null;

  const url = `${DOCS_BASE}/${page}`;
  const cacheFile = path.join(CACHE_DIR, `${cls}.json`);

  // Check if we need to refresh
  if (!force) {
    try {
      const cached = JSON.parse(await fs.readFile(cacheFile, 'utf8'));
      if (cached.headers) {
        // Make a HEAD request to check headers
        const headRes = await fetch(url, { method: 'HEAD' });
        if (headRes.ok) {
          const currentHeaders = {
            'last-modified': headRes.headers.get('last-modified'),
            'etag': headRes.headers.get('etag'),
            'cache-control': headRes.headers.get('cache-control'),
            'expires': headRes.headers.get('expires'),
            'date': headRes.headers.get('date')
          };

          if (!shouldRefreshCache(cached.headers, currentHeaders)) {
            if (verbose) console.log(`[cache-hit] ${cls} - no refresh needed`);
            const methods = new Map();
            for (const [name, arities] of Object.entries(cached.methods || {})) {
              methods.set(name, new Set(arities));
            }
            return methods;
          }
        }
      }
    } catch {
      // Cache file doesn't exist or is invalid, proceed with fetch
    }
  }

  if (verbose) console.log(`[fetch] ${cls} -> ${url}`);
  const { html, headers } = await fetchHtml(url);
  const $ = cheerioLoad(html);
  const methods = new Map();

  // legacy table rows
  $('table.memberdecls tr.memitem').each((_, el) => {
    const sig = $(el).find('td.memItemLeft, td.memItemRight').text().replace(/\s+/g, ' ').trim();
    const m = sig.match(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/);
    if (!m) return;
    const name = m[1];
    const paramsRaw = m[2].trim();
    const arity = paramsRaw === '' ? 0 : paramsRaw.split(',').length;
    if (!methods.has(name)) methods.set(name, new Set());
    methods.get(name).add(arity);
  });

  // modern div layout
  $('div.memitem').each((_, el) => {
    const proto = $(el).find('div.memproto').text().replace(/\s+/g, ' ').trim();
    if (!proto) return;
    const m = proto.match(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/);
    if (!m) return;
    const name = m[1];
    const paramsRaw = m[2].trim();
    const arity = paramsRaw === '' ? 0 : paramsRaw.split(',').length;
    if (!methods.has(name)) methods.set(name, new Set());
    methods.get(name).add(arity);
  });

  try {
    const obj = {
      methods: {},
      headers: headers,
      cached_at: new Date().toISOString()
    };
    for (const [name, arities] of methods) obj.methods[name] = [...arities];
    await fs.writeFile(cacheFile, JSON.stringify(obj, null, 2));
    if (verbose) console.log(`[cache-saved] ${cls} to ${cacheFile}`);
  } catch (error) {
    if (verbose) console.log(`[cache-error] Failed to save ${cls}: ${error.message}`);
  }

  return methods;
}

// Synchronously read cached methods for a class (for ESLint plugin)
export function getCachedMethodsForClass(cls) {
  const page = CLASS_TO_PAGE.get(cls);
  if (!page) return null;

  try {
    const cacheFile = path.join(CACHE_DIR, `${cls}.json`);
    const raw = fsSync.readFileSync(cacheFile, 'utf8');
    const json = JSON.parse(raw);
    const methods = new Map();
    for (const [name, arities] of Object.entries(json.methods || {})) {
      methods.set(name, new Set(arities));
    }
    return methods.size > 0 ? methods : null;
  } catch {
    return null;
  }
}

// Legacy async function for backward compatibility
export async function getMethodsForClass(cls, { refresh = false, verbose = false } = {}) {
  const page = CLASS_TO_PAGE.get(cls);
  if (!page) return null;

  if (refresh) {
    return await refreshClassCache(cls, { verbose, force: true });
  }

  // Try to read from cache first
  const cached = getCachedMethodsForClass(cls);
  if (cached) {
    if (verbose) console.log(`[cache-hit] ${cls} from ${path.join(CACHE_DIR, `${cls}.json`)}`);
    return cached;
  }

  // If not in cache, fetch and save
  return await refreshClassCache(cls, { verbose });
}

export function* findCallsInNut(code) {
  const callRe = /(GS[A-Z][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  let m;
  while ((m = callRe.exec(code))) {
    const cls = m[1];
    const method = m[2];
    let idx = m.index + m[0].length;
    let depth = 1;
    let args = '';
    while (idx < code.length && depth > 0) {
      const ch = code[idx++];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      if (depth > 0) args += ch;
    }
    const trimmed = args.trim();
    const arity = trimmed === '' ? 0 : trimmed.split(',').length;
    yield { cls, method, arity };
  }
}


