#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { globby } from 'globby';
import { load as cheerioLoad } from 'cheerio';

const DOCS_BASE = 'https://docs.openttd.org/gs-api';
const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('-v');
const REFRESH = process.argv.includes('--refresh');
const CACHE_DIR = process.env.GS_DOC_CACHE_DIR || path.join(homedir(), '.openttd-gs-api-cache');

// Map class -> doc page slug (classGSNews.html, classGSCompany.html, etc.)
const CLASS_TO_PAGE = new Map([
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
  return await res.text();
}

async function getMethodsForClass(cls) {
  const page = CLASS_TO_PAGE.get(cls);
  if (!page) return null;
  await fs.mkdir(CACHE_DIR, { recursive: true }).catch(() => { });
  const cacheFile = path.join(CACHE_DIR, `${cls}.json`);
  if (!REFRESH) {
    try {
      const raw = await fs.readFile(cacheFile, 'utf8');
      const json = JSON.parse(raw);
      if (VERBOSE) console.log(`[cache-hit] ${cls} from ${cacheFile}`);
      const m = new Map();
      for (const [name, arities] of Object.entries(json.methods || {})) {
        m.set(name, new Set(arities));
      }
      if (m.size > 0) return m;
    } catch (_e) {
      if (VERBOSE) console.log(`[cache-miss] ${cls}`);
    }
  }
  const url = `${DOCS_BASE}/${page}`;
  if (VERBOSE) console.log(`[fetch] ${cls} -> ${url}`);
  const html = await fetchHtml(url);
  const $ = cheerioLoad(html);
  const methods = new Map();
  // Try legacy table layout
  const rows = $('table.memberdecls tr.memitem');
  if (VERBOSE) console.log(`[parse] ${cls} table rows: ${rows.length}`);
  rows.each((_, el) => {
    const sig = $(el).find('td.memItemLeft, td.memItemRight').text().replace(/\s+/g, ' ').trim();
    const m = sig.match(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/);
    if (!m) return;
    const name = m[1];
    const paramsRaw = m[2].trim();
    const arity = paramsRaw === '' ? 0 : paramsRaw.split(',').length;
    if (!methods.has(name)) methods.set(name, new Set());
    methods.get(name).add(arity);
  });
  // Try modern div layout
  const memitems = $('div.memitem');
  if (VERBOSE) console.log(`[parse] ${cls} div.memitem: ${memitems.length}`);
  memitems.each((_, el) => {
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
  if (VERBOSE) {
    console.log(`[methods] ${cls}:`);
    for (const [name, arities] of methods) {
      console.log(`  - ${name}(${[...arities].sort().join('/')})`);
    }
  }
  // Persist cache
  try {
    const obj = { methods: {} };
    for (const [name, arities] of methods) obj.methods[name] = [...arities];
    await fs.writeFile(cacheFile, JSON.stringify(obj, null, 2));
    if (VERBOSE) console.log(`[cache-write] ${cls} -> ${cacheFile}`);
  } catch (e) {
    if (VERBOSE) console.log(`[cache-fail] ${cls}: ${String(e)}`);
  }
  return methods; // name -> set of arities
}

function* findCalls(code) {
  // Very tolerant regex; not a full parser. Matches GSClass.Method( ... ) and counts commas paren-wise.
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

async function main() {
  const root = path.dirname(fileURLToPath(import.meta.url));
  const repo = path.resolve(root, '..');
  const files = await globby(['**/*.nut'], { cwd: repo, gitignore: true, absolute: true });
  if (VERBOSE) console.log(`[scan] files: ${files.length}`);
  const cache = new Map(); // cls -> methods map
  let errors = 0;

  for (const file of files) {
    const code = await fs.readFile(file, 'utf8');
    if (VERBOSE) console.log(`[file] ${path.relative(repo, file)}`);
    for (const call of findCalls(code)) {
      const { cls, method, arity } = call;
      if (VERBOSE) console.log(`  [call] ${cls}.${method} -> ${arity} args`);
      if (!CLASS_TO_PAGE.has(cls)) continue; // not tracked
      if (!cache.has(cls)) cache.set(cls, await getMethodsForClass(cls));
      const methods = cache.get(cls);
      if (!methods || methods.size === 0) {
        console.error(`${file}: Failed to parse methods for ${cls} from docs`);
        errors++;
        continue;
      }
      if (!methods.has(method)) {
        console.error(`${file}: ${cls}.${method} not found in docs`);
        errors++;
        continue;
      }
      const allowed = methods.get(method);
      if (!allowed.has(arity)) {
        console.error(`${file}: Invalid arity for ${cls}.${method} -> ${arity} args (allowed: ${[...allowed].sort().join('/')})`);
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`Found ${errors} API usage errors`);
    process.exit(1);
  }
  console.log('GS API usage looks OK');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


