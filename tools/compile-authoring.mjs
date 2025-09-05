import { promises as fs } from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

const ROOT = '/workspace/coopetition';
const AUTHOR = path.join(ROOT, 'authoring');
const BUILD = path.join(ROOT, 'build');

const RANGES = {
  cash: [-1000000, 1000000],
  score: [-100, 100],
  reputation: [-100, 100],
};

function assert(cond, msg, ctx) {
  if (!cond) {
    const hint = ctx ? ` at ${ctx}` : '';
    throw new Error(msg + hint);
  }
}

function clampRange(name, value) {
  if (value == null) return value;
  const [min, max] = RANGES[name] || [-Infinity, Infinity];
  assert(typeof value === 'number' && Number.isFinite(value), `${name} must be a finite number`);
  assert(value >= min && value <= max, `${name} out of range [${min}, ${max}]`);
  return value;
}

function mergeDeep(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) return b ?? a;
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) {
      out[k] = mergeDeep(a[k], v);
    }
    return out;
  }
  return b ?? a;
}

function validateGoal(doc, file) {
  assert(doc && typeof doc === 'object', 'goal must be an object', file);
  assert(typeof doc.id === 'string' && doc.id.length > 0, 'id required', file);
  assert(['player','company','scenario','campaign'].includes(doc.type), 'invalid type', file);
  assert(doc.objective && typeof doc.objective === 'object', 'objective required', file);
  if (doc.constraints) {
    const { players, date } = doc.constraints;
    if (players) {
      if (players.min != null) assert(Number.isInteger(players.min) && players.min >= 1, 'players.min >= 1', file);
      if (players.max != null) assert(Number.isInteger(players.max) && players.max >= (players.min ?? 1), 'players.max >= players.min', file);
    }
    if (date) {
      if (date.after != null) assert(Number.isInteger(date.after), 'date.after integer', file);
      if (date.before != null) assert(Number.isInteger(date.before), 'date.before integer', file);
      if (date.after != null && date.before != null) assert(date.after <= date.before, 'date.after <= date.before', file);
    }
  }
  if (doc.shared) {
    for (const k of Object.keys(doc.shared)) {
      assert(typeof doc.shared[k] === 'boolean', `shared.${k} must be boolean`, file);
    }
  }
  if (doc.result) {
    for (const [k, v] of Object.entries(doc.result)) {
      clampRange(k, v);
    }
  }
}

function toNutTable(obj, indent = 0) {
  const pad = '    '.repeat(indent);
  const padIn = '    '.repeat(indent + 1);
  if (obj == null) return 'null';
  if (typeof obj === 'number') return String(obj);
  if (typeof obj === 'boolean') return obj ? 'true' : 'false';
  if (typeof obj === 'string') return `"${obj.replace(/\\/g,'\\\\').replace(/"/g,'\\"')}"`;
  if (Array.isArray(obj)) {
    const items = obj.map(v => padIn + toNutTable(v, indent + 1)).join(',\n');
    return '[\n' + items + '\n' + pad + ']';
  }
  const entries = Object.entries(obj).map(([k,v]) => `${padIn}${k} = ${toNutTable(v, indent + 1)}`).join(',\n');
  return '{\n' + entries + '\n' + pad + '}';
}

async function compileGoals() {
  const dir = path.join(AUTHOR, 'goals');
  await fs.mkdir(path.join(BUILD, 'goals'), { recursive: true });
  let index = [];
  for (const f of (await fs.readdir(dir)).filter(f => f.endsWith('.yaml'))) {
    const file = path.join(dir, f);
    const doc = yaml.parse(await fs.readFile(file, 'utf8')) || {};
    validateGoal(doc, file);
    const out = {
      id: doc.id,
      type: doc.type,
      objective: doc.objective,
      constraints: doc.constraints || undefined,
      shared: doc.shared || undefined,
      result: doc.result || undefined,
      meta: doc.meta || undefined,
    };
    const nutBody = toNutTable(out);
    const varName = `Goal_${doc.id}`;
    const content = `${varName} <- ${nutBody};\n`;
    const base = path.basename(f, '.yaml') + '.nut';
    await fs.writeFile(path.join(BUILD, 'goals', base), content);
    index.push({ id: out.id, file: `goals/${base}` });
  }
  return index;
}

function applyScenarioDefaults(goal, defaults) {
  if (!defaults) return goal;
  const merged = { ...goal };
  if (defaults.shared) merged.shared = mergeDeep(defaults.shared, goal.shared);
  if (defaults.result) merged.result = mergeDeep(defaults.result, goal.result);
  return merged;
}

async function compileScenarios() {
  const dir = path.join(AUTHOR, 'scenarios');
  await fs.mkdir(path.join(BUILD, 'scenarios'), { recursive: true });
  const index = [];
  for (const f of (await fs.readdir(dir)).filter(f => f.endsWith('.yaml'))) {
    const file = path.join(dir, f);
    const doc = yaml.parse(await fs.readFile(file, 'utf8')) || {};
    const defaults = doc.defaults || {};
    const compiledGoals = [];
    if (Array.isArray(doc.goals)) {
      for (const g of doc.goals) {
        assert(g && g.include, 'goals[].include required', file);
        const goalPath = path.join(AUTHOR, 'goals', g.include.replace(/\.nut$/,'').replace(/\.yaml$/,'') + '.yaml');
        const goalDoc = yaml.parse(await fs.readFile(goalPath, 'utf8')) || {};
        validateGoal(goalDoc, goalPath);
        const merged = applyScenarioDefaults(goalDoc, defaults);
        compiledGoals.push(merged);
      }
    }
    const out = {
      meta: doc.meta || undefined,
      defaults: doc.defaults || undefined,
      goals: compiledGoals,
    };
    const nutBody = toNutTable(out);
    const varName = `Scenario_${path.basename(f, '.yaml')}`;
    const content = `${varName} <- ${nutBody};\n`;
    const base = path.basename(f, '.yaml') + '.nut';
    await fs.writeFile(path.join(BUILD, 'scenarios', base), content);
    index.push({ id: path.basename(f, '.yaml'), file: `scenarios/${base}` });
  }
  return index;
}

async function compileCampaigns() {
  const dir = path.join(AUTHOR, 'campaigns');
  await fs.mkdir(path.join(BUILD, 'campaigns'), { recursive: true });
  const index = [];
  for (const f of (await fs.readdir(dir)).filter(f => f.endsWith('.yaml'))) {
    const file = path.join(dir, f);
    const doc = yaml.parse(await fs.readFile(file, 'utf8')) || {};
    // scenarios are references; keep as-is for loader to resolve if needed
    const out = {
      meta: doc.meta || undefined,
      scenarios: doc.scenarios || [],
    };
    const nutBody = toNutTable(out);
    const varName = `Campaign_${path.basename(f, '.yaml')}`;
    const content = `${varName} <- ${nutBody};\n`;
    const base = path.basename(f, '.yaml') + '.nut';
    await fs.writeFile(path.join(BUILD, 'campaigns', base), content);
    index.push({ id: path.basename(f, '.yaml'), file: `campaigns/${base}` });
  }
  return index;
}

async function writeIndex(goals, scenarios, campaigns) {
  const index = { goals, scenarios, campaigns };
  const body = toNutTable(index);
  // Expose a global for the GS to read after require()
  const content = `CoopetitionIndex <- ${body};\n`;
  await fs.writeFile(path.join(BUILD, 'index.nut'), content);
}

(async () => {
  await fs.mkdir(BUILD, { recursive: true });
  const goals = await compileGoals();
  const scenarios = await compileScenarios();
  const campaigns = await compileCampaigns();
  await writeIndex(goals, scenarios, campaigns);
  console.log(`Compiled ${goals.length} goals, ${scenarios.length} scenarios, ${campaigns.length} campaigns.`);
})().catch(err => {
  console.error(err.stack || err.message || String(err));
  process.exit(1);
});

