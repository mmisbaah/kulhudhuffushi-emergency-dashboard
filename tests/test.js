/* =====================================================
   TESTS — run with:  node tests/test.js
   Validates data integrity (data.js), i18n removal
   and source hygiene without a browser.
   Exit code 1 on failure.
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
let D;
try { D = loadScript('js/data.js'); } catch (e) { console.error('FATAL data.js:', e.message); process.exit(1); }

const TTX_DATA = D.TTX_DATA;

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
check('scenarios have 6 resource types', SC.every(s =>
  s.resources && ['arff', 'ambulances', 'fireTrucks', 'buses', 'police', 'medical'].every(k => Number.isInteger(s.resources[k]) && s.resources[k] >= 0)));
check('scenarios have injects (>=4)', SC.every(s => Array.isArray(s.injects) && s.injects.length >= 4));
check('scenario soulsOnBoard is number >= 0', SC.every(s => Number.isFinite(s.soulsOnBoard) && s.soulsOnBoard >= 0));
check('required exercise scenarios present',
  ['atr72-crash', 'water-rescue', 'volcanic-ash', 'active-shooter', 'earthquake'].every(id => SC.some(s => s.id === id)));
check('built-in scenarios >= 17', SC.length >= 17, 'found ' + SC.length);
check('sibling-app scenario coverage',
  ['bomb-threat', 'power-failure', 'medical-emergency', 'runway-incursion', 'severe-weather',
   'hijack-threat', 'mass-casualty', 'chemical-spill', 'security-breach'].every(id => SC.some(s => s.id === id)));

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

/* ---------- i18n fully removed (English only) ---------- */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const appjs = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
check('js/i18n.js deleted', !fs.existsSync(path.join(ROOT, 'js/i18n.js')));
check('index.html has no data-i18n attributes', !html.includes('data-i18n'));
check('index.html has no language toggle', !html.includes('langToggle'));
check('index.html has no ttx-lang reference', !html.includes('ttx-lang'));
check('index.html does not set dir=rtl', !/dir\s*=\s*["']rtl["']/.test(html));
check('app.js has no t() translation calls', !/\bt\(/.test(appjs));
check('app.js has no ttx-lang reference', !appjs.includes('ttx-lang'));
check('app.js has no ttx:langchange listeners', !appjs.includes('ttx:langchange'));
check('app.js has no data-i18n writes', !appjs.includes('data-i18n'));
check('styles.css has no .lang-dv rules', !css.includes('lang-dv'));
check('styles.css has no Thaana/Dhivehi fonts', !/Thaana|Dhivehi/i.test(css));

/* ---------- localStorage key contract ---------- */
const keysFound = [...appjs.matchAll(/'(ttx-[a-z-]+)'/g)].map(m => m[1]);
['ttx-checklist-state', 'ttx-pin-positions', 'ttx-crash-zone-positions',
 'ttx-custom-scenarios', 'ttx-ics-names', 'ttx-casualties',
 'ttx-resource-deployed', 'ttx-resource-meta', 'ttx-timeline-events', 'ttx-map-config'].forEach(k => {
  check('app.js uses storage key ' + k, keysFound.includes(k));
});
const backupBlock = appjs.slice(appjs.indexOf('BACKUP_KEYS'), appjs.indexOf('BACKUP_KEYS') + 700);
['ttx-theme', 'ttx-font-scale', 'ttx-checklist-state', 'ttx-timeline-events',
 'ttx-clock', 'ttx-aar-notes', 'ttx-map-config', 'ttx-resource-meta'].forEach(k => {
  check('BACKUP_KEYS includes ' + k, backupBlock.includes("'" + k + "'"));
});
check('BACKUP_KEYS excludes ttx-lang', !backupBlock.includes("'ttx-lang'"));

/* ---------- Map customization editor ---------- */
check('index.html exposes zone ring ids for the map editor',
  html.includes('id="hotZone"') && html.includes('id="diagHotZone"') &&
  html.includes('id="diagWarmZone"') && html.includes('id="diagColdZone"'));
check('app.js has the map customization editor',
  appjs.includes('openMapEditor') && appjs.includes('MAP_CFG_KEY'));
check('app.js builds map UI via buildMapUI()', appjs.includes('var buildMapUI = function'));
check('styles.css styles the map editor', css.includes('.maploc-row') && css.includes('.maped-field'));

/* ---------- User guide + PWA update toast ---------- */
check('index.html has Guide button and dock link',
  html.includes('id="guideBtn"') && html.includes('id="guideDockLink"'));
check('app.js builds the user guide modal', appjs.includes('var openGuide') && appjs.includes('guideOverlay'));
check('changelog dropped the Dhivehi toggle item', !appjs.includes('Dhivehi / English'));
check('index.html registers SW with update toast',
  html.includes('updateToast') && html.includes('SKIP_WAITING'));
const swjs = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
check('sw.js handles SKIP_WAITING', swjs.includes("'SKIP_WAITING'") || swjs.includes('"SKIP_WAITING"'));
check('sw.js cache is versioned', /hdk-emergency-v\d+/.test(swjs));
check('styles.css styles guide + toast', css.includes('.guide-toc') && css.includes('#updateToast'));

/* ---------- Feature parity: print, exports, shortcuts, resource types ---------- */
check('index.html has the Print button', html.includes('id="printBtn"'));
check('app.js wires full-plan print', appjs.includes('fullPlanPrint') && appjs.includes('beforeprint'));
check('styles.css prints the dated header', css.includes('.print-header'));
check('app.js has Ctrl+E scenario editor shortcut',
  appjs.includes('scenEditBtn') && appjs.includes('scenNewBtn'));
check('app.js has Ctrl+P print shortcut', /e\.key === 'p' \|\| e\.key === 'P'/.test(appjs));
check('resource tracker exports status report',
  appjs.includes('rtExportBtn') && appjs.includes('Resource-Status-'));
check('resource tracker resets with restore point',
  appjs.includes('rtResetBtn') && appjs.includes('Before resource reset'));
check('resource tracker has per-type location & notes',
  appjs.includes('rt-meta-loc') && appjs.includes('rt-meta-note') && appjs.includes('ttx-resource-meta'));
check('casualty tracker exports report',
  appjs.includes('ctExport') && appjs.includes('Casualty-Report-'));
check('casualty cards have a location field', appjs.includes('ct-loc'));
check('AAR covers police + medical resource types',
  appjs.includes("key: 'police'") && appjs.includes("key: 'medical'"));
check('scenario editor covers police + medical',
  appjs.includes('se-police') && appjs.includes('se-medical'));

/* ---------- Static syntax gates ---------- */
['js/app.js', 'js/data.js', 'sw.js'].forEach(f => {
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
