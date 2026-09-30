/* =====================================================
   TESTS — run with:  node tests/test.js
   Validates data integrity (data.js) and i18n parity
   (i18n.js) without a browser. Exit code 1 on failure.
   ===================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let passed = 0, failed = 0;
const failures = [];

function check(name, cond, detail) {
  if (cond) { passed++; }
  else { failed++; failures.push(name + (detail ? ' — ' + detail : '')); }
}
function loadScript(rel) {
  const code = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const sandbox = { console, window: {}, document: null, localStorage: null };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: rel });
  return sandbox;
}

/* ---------- Load scripts ---------- */
let D, I;
try { D = loadScript('js/data.js'); } catch (e) { console.error('FATAL data.js:', e.message); process.exit(1); }
try { I = loadScript('js/i18n.js'); } catch (e) { console.error('FATAL i18n.js:', e.message); process.exit(1); }

const TTX_DATA = D.TTX_DATA;
const TTX_I18N = I.TTX_I18N;
const t = I.t;

/* ---------- Data structure ---------- */
check('TTX_DATA exists', !!TTX_DATA);
check('checklistItems non-empty', Array.isArray(TTX_DATA.checklistItems) && TTX_DATA.checklistItems.length > 0);
check('checklist has no empty entries', TTX_DATA.checklistItems.every(s => typeof s === 'string' && s.trim().length > 0));

/* ---------- Locations ---------- */
const locs = TTX_DATA.locations || [];
check('locations non-empty', locs.length > 0);
check('locations unique ids', new Set(locs.map(l => l.id)).size === locs.length);
check('locations have x/y in viewBox (0-1000 / 0-720)',
  locs.every(l => l.x >= 0 && l.x <= 1000 && l.y >= 0 && l.y <= 720));
check('location cats exist in pinCategories',
  locs.every(l => TTX_DATA.pinCategories && TTX_DATA.pinCategories[l.cat]));
check('locations have name + desc',
  locs.every(l => typeof l.name === 'string' && l.name && typeof l.desc === 'string' && l.desc));

/* ---------- Scenarios ---------- */
const SC = TTX_DATA.scenarios || [];
check('scenarios non-empty', SC.length > 0);
check('scenario ids unique', new Set(SC.map(s => s.id)).size === SC.length);
check('scenario ids slug-safe', SC.every(s => /^[a-z0-9-]+$/.test(s.id)));
check('scenarios have name', SC.every(s => typeof s.name === 'string' && s.name.length > 0));
check('scenarios have 4 casualty classes', SC.every(s =>
  s.casualties && ['red', 'yellow', 'green', 'deceased'].every(k => Number.isInteger(s.casualties[k]) && s.casualties[k] >= 0)));
check('scenarios have 4 resource types', SC.every(s =>
  s.resources && ['arff', 'ambulances', 'fireTrucks', 'buses'].every(k => Number.isInteger(s.resources[k]) && s.resources[k] >= 0)));
check('scenarios have injects (>=4)', SC.every(s => Array.isArray(s.injects) && s.injects.length >= 4));
check('scenario soulsOnBoard is number >= 0', SC.every(s => Number.isFinite(s.soulsOnBoard) && s.soulsOnBoard >= 0));
check('required exercise scenarios present',
  ['atr72-crash', 'water-rescue', 'volcanic-ash', 'active-shooter', 'earthquake'].every(id => SC.some(s => s.id === id)));

/* ---------- Aircraft ---------- */
const AC = TTX_DATA.aircraftComparison || [];
const ACD = TTX_DATA.aircraftDetails || [];
check('aircraftComparison non-empty', AC.length > 0);
check('aircraft names unique (comparison)', new Set(AC.map(a => a.name)).size === AC.length);
check('aircraft names unique (details)', new Set(ACD.map(a => a.name)).size === ACD.length);
check('aircraft pax/total sane', AC.every(a => a.pax >= 0 && a.total >= a.pax));
check('aircraft details have 6 specs', ACD.every(a => Array.isArray(a.specs) && a.specs.length === 6));
check('aircraft details spec keys present', ACD.every(a => a.specs.every(s => s.k && s.v !== undefined)));
check('requested jet types present', ['Boeing 737-800', 'A320-200', 'Fokker 100'].every(n => AC.some(a => a.name === n) && ACD.some(a => a.name === n)));
check('every detail card has a comparison row', ACD.every(a => AC.some(c => c.name === a.name)));

/* ---------- Role cards / glossary / references ---------- */
const RC = TTX_DATA.roleCards || [];
check('roleCards: 8 roles', RC.length === 8);
check('roleCards: unique roles', new Set(RC.map(r => r.role)).size === RC.length);
check('roleCards: duties 3-6 each', RC.every(r => Array.isArray(r.duties) && r.duties.length >= 3 && r.duties.length <= 6));
check('roleCards: has tag/who/reports', RC.every(r => r.tag && r.who && r.reports));

const GL = TTX_DATA.glossary || [];
check('glossary: >= 15 terms', GL.length >= 15);
check('glossary: unique terms', new Set(GL.map(g => g.term)).size === GL.length);
check('glossary: all fields non-empty', GL.every(g => g.term && g.full && g.def));

const RF = TTX_DATA.references || [];
check('references: >= 5 docs', RF.length >= 5);
check('references: required sources present',
  ['ICAO', 'FAA', 'EASA'].every(src => RF.some(r => r.src === src)));
check('references: all fields present', RF.every(r => r.src && r.doc && r.scope && Array.isArray(r.key) && r.key.length > 0));

/* ---------- i18n parity ---------- */
check('TTX_I18N has en + dv', !!TTX_I18N && !!TTX_I18N.en && !!TTX_I18N.dv);
if (TTX_I18N) {
  const enKeys = Object.keys(TTX_I18N.en).sort();
  const dvKeys = Object.keys(TTX_I18N.dv).sort();
  check('en/dv key sets identical', enKeys.length === dvKeys.length && enKeys.every((k, i) => k === dvKeys[i]),
    'en=' + enKeys.length + ' dv=' + dvKeys.length + ' diff=' +
    enKeys.filter(k => !TTX_I18N.dv.hasOwnProperty(k)).concat(dvKeys.filter(k => !TTX_I18N.en.hasOwnProperty(k))).join(','));
  check('no empty translations', enKeys.every(k => String(TTX_I18N.en[k]).length > 0 && String(TTX_I18N.dv[k]).length > 0));
  check('t() returns English for known key', t('tab.phases') === TTX_I18N.en['tab.phases']);
  check('t() falls back for unknown key', t('no.such.key') === 'no.such.key');
  check('app title keys exist', 'app.title' in TTX_I18N.en && 'app.subtitle' in TTX_I18N.en);
}

/* ---------- index.html data-i18n coverage ---------- */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
if (TTX_I18N) {
  const used = [...html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)].map(m => m[1]);
  const missing = used.filter(k => !(k in TTX_I18N.en));
  check('every data-i18n key exists in en dict', missing.length === 0, 'missing: ' + missing.join(','));
  const missingDv = used.filter(k => !(k in TTX_I18N.dv));
  check('every data-i18n key exists in dv dict', missingDv.length === 0, 'missing: ' + missingDv.join(','));
}

/* ---------- app.js dynamic i18n keys ---------- */
const appjs = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
if (TTX_I18N) {
  const used = [...appjs.matchAll(/\bt\('([^']+)'\)/g)].map(m => m[1]);
  const missing = [...new Set(used)].filter(k => !(k in TTX_I18N.en));
  check("every t('...') key exists in en dict", missing.length === 0, 'missing: ' + missing.join(','));
  const missingDv = [...new Set(used)].filter(k => !(k in TTX_I18N.dv));
  check("every t('...') key exists in dv dict", missingDv.length === 0, 'missing: ' + missingDv.join(','));
}

/* ---------- localStorage key contract ---------- */
const keysFound = [...appjs.matchAll(/'(ttx-[a-z-]+)'/g)].map(m => m[1]);
['ttx-checklist-state', 'ttx-pin-positions', 'ttx-crash-zone-positions',
 'ttx-custom-scenarios', 'ttx-ics-names', 'ttx-casualties',
 'ttx-resource-deployed', 'ttx-timeline-events'].forEach(k => {
  check('app.js uses storage key ' + k, keysFound.includes(k));
});
const backupBlock = appjs.slice(appjs.indexOf('BACKUP_KEYS'), appjs.indexOf('BACKUP_KEYS') + 600);
['ttx-theme', 'ttx-lang', 'ttx-font-scale', 'ttx-checklist-state', 'ttx-timeline-events'].forEach(k => {
  check('BACKUP_KEYS includes ' + k, backupBlock.includes("'" + k + "'"));
});

/* ---------- Static syntax gates ---------- */
['js/app.js', 'js/data.js', 'js/i18n.js', 'sw.js'].forEach(f => {
  const code = fs.readFileSync(path.join(ROOT, f), 'utf8');
  try { new vm.Script(code, { filename: f }); check('parses: ' + f, true); }
  catch (e) { check('parses: ' + f, false, e.message); }
});

/* ---------- Version consistency ---------- */
const versions = [...html.matchAll(/\?v=([0-9a-z]+(?:[a-z])?)/g)].map(m => m[1]);
check('index.html asset versions all identical', new Set(versions).size === 1, versions.join(','));

/* ---------- Report ---------- */
console.log('\n' + passed + ' passed, ' + failed + ' failed');
if (failed) {
  console.log('\nFailures:');
  failures.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
