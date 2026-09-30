/* =====================================================
   I18N — Dhivehi (ދިވެހި) / English language support.
   Usage:  t('key')                 -> string for current language
           data-i18n="key"          -> element textContent
           data-i18n-html="key"     -> element innerHTML (allows <strong>)
           data-i18n-title="key"    -> element title attribute
   ===================================================== */

var TTX_LANG_KEY = 'ttx-lang';
var TTX_LANG = 'en';

var TTX_I18N = {

  en: {
    /* Header */
    'app.title': 'Kulhudhuffushi Airport — Emergency Exercise',
    'app.subtitle': 'Incident Commander Dashboard · VRBK / HDK',
    'header.status': 'Exercise Planning Mode',
    'header.scenario': 'Scenario:',
    'btn.exportPdf': '⬇ Export PDF',
    'btn.lang': 'ދިވެހި',

    /* Tabs */
    'tab.phases': 'IC Role',
    'tab.teams': 'Team Labels',
    'tab.locations': 'Key Locations',
    'tab.zones': 'Incident Zones',
    'tab.emergencies': 'Emergency Types',
    'tab.aircraft': 'Aircraft Specs',
    'tab.checklist': 'TTX Flow & Checklist',

    /* Section headings */
    'head.phases': 'Incident Commander Role by Phase',
    'head.teams': 'Tabletop Exercise Team Labels',
    'head.locations': 'Key Locations — Kulhudhuffushi Airport',
    'head.zones': 'Aircraft Incident Zones',
    'head.emergencies': 'Types of Airport Emergencies',
    'head.aircraft': 'Aircraft Used on Maldivian Domestic Routes',
    'head.checklist': 'TTX Flow & IC Checklist',

    /* Section subtitles */
    'sub.phases': 'Your responsibilities move through three distinct phases. Preparation builds the foundation, execution tests your command decisions, and evaluation turns the exercise into real improvement.',
    'sub.teams': 'Two distinct sets of labels matter: the staff who <em>run</em> the drill, and the simulated response teams that <em>play</em> in it.',
    'sub.zones': 'The scene is organized into three concentric safety zones, adapted from hazardous materials response. Aircraft accidents involve high fuel loads and composite materials, so the boundaries matter.',
    'sub.emergencies': 'Categorizing potential emergencies helps you test specific response plans and resource coordination. Frameworks from ICAO, EASA and the FAA group them broadly like this.',
    'sub.checklist': 'A recommended build order for your tabletop exercise, followed by a working checklist for the day itself. Tap any item to tick it off — the progress bar updates live.',

    /* Scenario actions */
    'btn.new': '+ New',
    'btn.edit': '✎ Edit',
    'btn.compare': '⇄ Compare',
    'btn.ics': '📄 ICS Forms',
    'opt.selectScenario': '— Select a scenario —',

    /* Scenario panel */
    'panel.empty': 'Select a scenario above to see casualty estimates, resource requirements, and exercise injects.',
    'panel.souls': 'Souls on Board',
    'panel.fuel': 'Fuel Load',
    'panel.fire': 'Fire Involved',
    'panel.casualties': 'Estimated Casualties',
    'panel.red': 'Red (Immediate)',
    'panel.yellow': 'Yellow (Delayed)',
    'panel.green': 'Green (Minor)',
    'panel.deceased': 'Deceased',
    'panel.resources': 'Resource Requirements',
    'panel.arff': 'ARFF Vehicles',
    'panel.ambulances': 'Ambulances',
    'panel.fireTrucks': 'Fire Trucks',
    'panel.buses': 'Buses',
    'panel.injects': 'Exercise Injects',

    /* Timeline */
    'tl.title': 'Exercise Timeline',
    'tl.empty': 'No events logged yet. Use the form above to add injects, decisions, or milestones.',
    'tl.time': 'Time',
    'tl.text': 'Event / Inject',
    'tl.category': 'Category',
    'tl.add': 'Add',
    'tl.undo': '↶ Undo',
    'tl.redo': '↷ Redo',
    'tl.clear': 'Clear All Events',
    'tl.export': 'Export for AAR',
    'tl.cat.info': 'Info',
    'tl.cat.inject': 'Inject',
    'tl.cat.decision': 'Decision',
    'tl.cat.milestone': 'Milestone',
    'tl.cat.casualty': 'Casualty',

    /* Checklist */
    'ck.title': 'Incident Commander Checklist',
    'ck.reset': 'Reset',

    /* Resource tracker */
    'rt.title': 'Resource Tracker',
    'rt.subtitle': '— mark units as they arrive on scene',
    'rt.notRequired': 'Not required',
    'rt.allDeployed': '✓ All deployed',
    'rt.available': 'still available',
    'rt.summary': 'units deployed',
    'rt.summaryDone': '— resources complete ✓',
    'rt.of': 'of',

    /* Casualty tracker */
    'ct.title': 'Casualty Tracker',
    'ct.subtitle': '— per-patient triage & transport status',
    'ct.add': '+ Add Casualty',
    'ct.seed': 'Generate from Estimates',
    'ct.clear': 'Clear',
    'ct.triage': 'Triage',
    'ct.transport': 'Transport',
    'ct.empty': 'No casualty cards. Use <b>+ Add Casualty</b> or <b>Generate from Estimates</b> to start tracking patients.',
    'ct.noCards': 'No casualty cards yet',

    /* Weather */
    'wx.unavailable': 'Weather unavailable'
  },

  dv: {
    /* Header */
    'app.title': 'ޚުލުދޫފުނި އެއިރައްޕޯޓް — އެމުރުޖީ އެއްސަރސަލް',
    'app.subtitle': 'ހަދައްކަންތަކުގެ އެމިރާގެ ޑައްސްބޯރް · VRBK / HDK',
    'header.status': 'އެއްސަރސަލް ޕްލަނިންގާ މޯޑު',
    'header.scenario': 'ސިގަރިއޯ:',
    'btn.exportPdf': '⬇ PDF އައްޑުކުރަން',
    'btn.lang': 'English',

    /* Tabs */
    'tab.phases': 'IC ރޯލް',
    'tab.teams': 'ޓީމުގެ ފަންވައި',
    'tab.locations': 'މުހިމަތުގެ ތަންތަން',
    'tab.zones': 'ހަދައްކަންތަކުގެ ޒޯންތައް',
    'tab.emergencies': 'އެމުރުޖީނިސަބްގެ ތަފާސްތައް',
    'tab.aircraft': 'އެއިރަފްޓް ފަރުތައް',
    'tab.checklist': 'TTX ފްލޯއު އަށް ޗެކްލިސްޓް',

    /* Section headings */
    'head.phases': 'ފީޒް އައި އެމިރާގެ ބަދަލު',
    'head.teams': 'ޓީބުލް އެއްސަރސަލުގެ ޓީމުގެ ފަންވައި',
    'head.locations': 'މުހިމަތުގެ ތަންތަން — ޚުލުދޫފުނި އެއިރައްޕޯޓް',
    'head.zones': 'އެއިރަފްޓް ހަދައްކަންތަކުގެ ޒޯންތައް',
    'head.emergencies': 'އެއިރައްޕޯޓްގެ އެމުރުޖީނިސަބްގެ ތަފާސްތައް',
    'head.aircraft': 'ދިވެހި ދިވާއި މަރުކަޒުތަކަށް ބޭނުމުގައި ބޭނުމުގެ އެއިރަފްޓް',
    'head.checklist': 'TTX ފްލޯއު އަށް IC ޗެކްލިސްޓް',

    /* Section subtitles */
    'sub.phases': 'ތިޔަން ބުނަންމެން ދަރުޖާގެ ބަރައްކަންތައް ފަދައި ފީޒް އައި ބަދަލަށް ޖަމަޏުކުރަންޔާ. ތައްޔާރުކުރަން މަސްލައްކަން ބިނާކުކުރަން އައިކަމަށް، ތުރިއަށް ގެންދާ ތަނަކަށް ފައިލާކުރަން މައްސަލަށް، އަށްގަޅުއްސަރސަލްގެ ނިޒަމަށް ލިބި ނިޒަމުގައި ފަރާމުކުރަން އައިކަމަށް ފަހުގައި ލިބިޔާ.',
    'sub.teams': 'ފަންވައި އައި ބުނަންމެން ތަކަށް މުހިމަތާއެއް އައި: އުންމުން އައި ޓީބުލްގެ ކަމާއަށް ފަރާމުކުރަން ބައިގަނޑުމެން، އަށްގަޅުއްސަރސަލްގައި ބަދަލުވަމުންދާ އަންހެންނަށް ފަރާމުކުރަން ޓީމްތައް.',
    'sub.zones': 'ތަންތަންގައި ލިބިޔާ އައި ފަދައި ހަމައެކަނި ތަރައްޗަށް ގެންދާ ޒޯން އައިކަމަށް ބަންދުބައިކުރަންޔާ. އެއިރަފްޓް އަދުތަކަށް މުއައްޒީ ބަންޑުތައް އަށް ނިޔައީ ދަންނަމުންޔެއްޔާ، އަށްގަޅު މުއްޒަތުތައް މުހިމަތާއެއް އައިކަނަށް.',
    'sub.emergencies': 'އެމުރުޖީނިސަބްތަކަށް ބުނެ ފަންވައިކުރަން ފައްދަވާން ތައްޔާރުކޮށް ފަރުތަކަށް އައްޗައްކަން އަށް މައްސަލައިކުރަންޔާ. ICAO، EASA އަށް FAAގެ ފްރޭމްވޯށްތަކަށް އެއްކޮށް އައި ފަދައި ތަފާސްތައް ފަންވައިކުރަންޔާ.',
    'sub.checklist': 'ތިޔަން ބުނަންމެން ޓީބުލް އެއްސަރސަލްގެ ބިނާކުކުރަން އައި ފަދައި، އަށްގަޅު ފުން އައި ޗެކްލިސްޓްއެއް. އައި އައި ލިޔުން ކުރަން ޓައްކުން ކުރަން — ޕްރޯގްރެސް ބަރު މައްސަލަށް ފަރާމުކުރަންޔާ.',

    /* Scenario actions */
    'btn.new': '+ މުއައްގައި',
    'btn.edit': '✎ ސަންދަމުން',
    'btn.compare': '⇄ މުޤާކައްކުން',
    'btn.ics': '📄 ICS ފޯމުތައް',
    'opt.selectScenario': '— ސިގަރިއޯއެއް އައިވައި —',

    /* Scenario panel */
    'panel.empty': 'އެމުރުޖީނިސަބްގެ ނިޒަމުތައް، ފުން ދިމާތައް އަށް އައިވާ ފަރުތައް އަށް ފަހުގައި މުންފަތުކުރަންޔާ، މާލައިގަނޑުމެން މުއައްޒީ ސިގަރިއޯއެއް އައިވައި.',
    'panel.souls': 'އައިގަޅުން',
    'panel.fuel': 'ފުންގެ މިއްޒަތު',
    'panel.fire': 'އީގި އައިކަން',
    'panel.casualties': 'މައްސަލަށް ދަރުޖާގެ ނިޒަމުތައް',
    'panel.red': 'މާ (ސަބަންތަކް)',
    'panel.yellow': 'މޮޅާ (ގައިރީ)',
    'panel.green': 'މޮގު (ތަކަތަކެއް)',
    'panel.deceased': 'ވަންނައި',
    'panel.resources': 'ފުން ދިމާތައް',
    'panel.arff': 'ARFF މުއްނާސްތައް',
    'panel.ambulances': 'އެމބުލަންސްތައް',
    'panel.fireTrucks': 'އީގި ޓްރަކްތައް',
    'panel.buses': 'ބަސްތައް',
    'panel.injects': 'އެއްސަރސަލުގެ އިންޖެކްޓް',

    /* Timeline */
    'tl.title': 'އެއްސަރސަލް ޓައިމްލައިން',
    'tl.empty': 'ފަހުގައި މައިގާނަށް އުފައްދަވެއްވާ. މާލައިގަނޑުމެން އިންޖެކްޓް، ފައިސާތައް އަށް ތާލީބްތައްއައިވައި.',
    'tl.time': 'ވައްޓާ',
    'tl.text': 'މައިގާނު / އިންޖެކްޓް',
    'tl.category': 'ތަފާސް',
    'tl.add': 'އައްޑުކުރަން',
    'tl.undo': '↶ އުންނަން',
    'tl.redo': '↷ އައްޑުކުރަން',
    'tl.clear': 'އައި ލިޔުންތައް ފައްޓާކުރަން',
    'tl.export': 'AAR އައްޑުކުރަން',
    'tl.cat.info': 'މައިގާނު',
    'tl.cat.inject': 'އިންޖެކްޓް',
    'tl.cat.decision': 'ފައިސާ',
    'tl.cat.milestone': 'މަޒިލައްޓު',
    'tl.cat.casualty': 'މައްސަލާތާ',

    /* Checklist */
    'ck.title': 'އެމިރާގެ ޗެކްލިސްޓް',
    'ck.reset': 'ރީސެޓް',

    /* Resource tracker */
    'rt.title': 'ފުން ދިމާތައް',
    'rt.subtitle': '— ތަނަކަށް ފަރާމުވާ މައިގާންތައް އައްޑުކުރަން',
    'rt.notRequired': 'ފުން ދިމާއެއް ނެއްލެއްވާނެއްނެއް',
    'rt.allDeployed': '✓ އައި އައްޑުކުރެއްވާނެއް',
    'rt.available': 'އައި ނެއްލެއްވާނެއް',
    'rt.summary': 'މައިގާން އައްޑުކުރެއްވާ',
    'rt.summaryDone': '— ފުން ދިމާ އެއިކަންޔާ ✓',
    'rt.of': 'ގަނޑުގައި',

    /* Casualty tracker */
    'ct.title': 'މައްސަލާތާ ޓްރާކަރް',
    'ct.subtitle': '— އައި އައި މައްސަލާތާގެ ޓްރައިޖް އަށް ފުން ދިމާގެ މޮޅި',
    'ct.add': '+ މައްސަލާތާއެއް އައްޑުކުރަން',
    'ct.seed': 'ނިޒަމުތަކަށް އައިވައި',
    'ct.clear': 'ފައްޓާކުރަން',
    'ct.triage': 'ޓްރައިޖް',
    'ct.transport': 'ފުން ދިމާ',
    'ct.empty': 'މައްސަލާތާގެ ކާރްޑް ނެއްލެއްވާނެއްނެއް. <b>+ މައްސަލާތާ އައްޑުކުރަން</b> އަށްގަޅު <b>ނިޒަމުތަކަށް އައިވައި</b> އައްޑުކުރަން އުފައްދަވާ.',
    'ct.noCards': 'މައްސަލާތާގެ ކާރްޑް ނެއްލެއްވާނެއްނެއް',

    /* Weather */
    'wx.unavailable': 'މުއި ފަހުގައި ގިނަވާކުރަން ނެއްލެއްވާނެއް'
  }
};

/* Get translation for the current language (falls back to English, then the key) */
function t(key) {
  var lang = TTX_LANG === 'dv' ? 'dv' : 'en';
  var v = TTX_I18N[lang] && TTX_I18N[lang][key];
  if (v === undefined && lang !== 'en') v = TTX_I18N.en[key];
  if (v === undefined) return key;
  return v;
}

/* Apply the current language to every tagged element */
function applyLang() {
  var isDv = TTX_LANG === 'dv';
  document.documentElement.setAttribute('lang', isDv ? 'dv' : 'en');
  document.documentElement.setAttribute('dir', isDv ? 'rtl' : 'ltr');
  document.body.classList.toggle('lang-dv', isDv);

  var i;
  var els = document.querySelectorAll('[data-i18n]');
  for (i = 0; i < els.length; i++) els[i].textContent = t(els[i].getAttribute('data-i18n'));

  var elsHtml = document.querySelectorAll('[data-i18n-html]');
  for (i = 0; i < elsHtml.length; i++) elsHtml[i].innerHTML = t(elsHtml[i].getAttribute('data-i18n-html'));

  var elsTitle = document.querySelectorAll('[data-i18n-title]');
  for (i = 0; i < elsTitle.length; i++) elsTitle[i].setAttribute('title', t(elsTitle[i].getAttribute('data-i18n-title')));
}

function setLang(lang) {
  TTX_LANG = (lang === 'dv') ? 'dv' : 'en';
  try { localStorage.setItem(TTX_LANG_KEY, TTX_LANG); } catch (e) {}
  applyLang();
}

function toggleLang() {
  setLang(TTX_LANG === 'dv' ? 'en' : 'dv');
  /* Re-render dynamic components so generated strings follow the language */
  if (typeof document !== 'undefined') {
    var evt = new CustomEvent('ttx:langchange', { detail: { lang: TTX_LANG } });
    document.dispatchEvent(evt);
  }
}

/* Load saved language before first paint when possible */
try {
  var savedLang = localStorage.getItem(TTX_LANG_KEY);
  if (savedLang === 'dv' || savedLang === 'en') TTX_LANG = savedLang;
} catch (e) {}
