import fs from 'node:fs/promises';
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
  return await res.text();
}

export async function getMethodsForClass(cls, { refresh = false, verbose = false } = {}) {
  const page = CLASS_TO_PAGE.get(cls);
  if (!page) return null;
  await fs.mkdir(CACHE_DIR, { recursive: true }).catch(() => { });
  const cacheFile = path.join(CACHE_DIR, `${cls}.json`);
  if (!refresh) {
    try {
      const raw = await fs.readFile(cacheFile, 'utf8');
      const json = JSON.parse(raw);
      if (verbose) console.log(`[cache-hit] ${cls} from ${cacheFile}`);
      const m = new Map();
      for (const [name, arities] of Object.entries(json.methods || {})) m.set(name, new Set(arities));
      if (m.size > 0) return m;
    } catch { }
  }
  const url = `${DOCS_BASE}/${page}`;
  if (verbose) console.log(`[fetch] ${cls} -> ${url}`);
  const html = await fetchHtml(url);
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
    const obj = { methods: {} };
    for (const [name, arities] of methods) obj.methods[name] = [...arities];
    await fs.writeFile(cacheFile, JSON.stringify(obj, null, 2));
  } catch { }
  return methods;
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


