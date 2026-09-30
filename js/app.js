/* =====================================================
   APP — All interactive logic for the dashboard.
   Depends on: data.js (TTX_DATA)
   ===================================================== */

(function () {
  'use strict';

  try {

    /* ================= THEME TOGGLE ================= */
    var THEME_KEY = 'ttx-theme';
    var themeToggle = document.getElementById('themeToggle');

    var setTheme = function (theme) {
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.textContent = '☀️';
      } else if (theme === 'hc') {
        document.documentElement.setAttribute('data-theme', 'hc');
        if (themeToggle) themeToggle.textContent = '◑';
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggle) themeToggle.textContent = '🌙';
      }
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    };

    var loadTheme = function () {
      try {
        var saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'hc') setTheme(saved);
        else setTheme('dark');
      } catch (e) { setTheme('dark'); }
    };

    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        if (current === 'light') setTheme('hc');
        else if (current === 'hc') setTheme('dark');
        else setTheme('light');
      });
    }

    /* ================= LANGUAGE TOGGLE (EN / ދިވެހި) ================= */
    var langToggle = document.getElementById('langToggle');
    var syncLangToggle = function () {
      if (langToggle) langToggle.textContent = TTX_LANG === 'dv' ? 'EN' : 'ދިވެހި';
    };
    if (langToggle) {
      langToggle.addEventListener('click', function () {
        toggleLang();
        syncLangToggle();
      });
    }
    if (typeof applyLang === 'function') applyLang();
    syncLangToggle();

    /* ================= FONT SIZE CONTROLS ================= */
    var FONT_KEY = 'ttx-font-scale';
    var fontScale = 1;
    try {
      var savedScale = parseFloat(localStorage.getItem(FONT_KEY));
      if (savedScale >= 0.8 && savedScale <= 1.6) fontScale = savedScale;
    } catch (e) {}
    var fontResetBtn = document.getElementById('fontReset');
    var applyFontScale = function () {
      document.documentElement.style.zoom = fontScale === 1 ? '' : fontScale;
      if (fontResetBtn) fontResetBtn.textContent = Math.round(fontScale * 100) + '%';
      try { localStorage.setItem(FONT_KEY, String(fontScale)); } catch (e) {}
    };
    var stepFont = function (dir) {
      fontScale = Math.min(1.6, Math.max(0.8, Math.round((fontScale + dir * 0.1) * 10) / 10));
      applyFontScale();
    };
    var fontDec = document.getElementById('fontDec');
    var fontInc = document.getElementById('fontInc');
    if (fontDec) fontDec.addEventListener('click', function () { stepFont(-1); });
    if (fontInc) fontInc.addEventListener('click', function () { stepFont(1); });
    if (fontResetBtn) fontResetBtn.addEventListener('click', function () { fontScale = 1; applyFontScale(); });
    applyFontScale();

    /* ================= EXPORT PDF =================
       The print stylesheet already renders the full exercise package
       (all sections, white paper). "Save as PDF" in the dialog does
       the rest — no library needed. */
    var exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', function () {
        window.print();
      });
    }

    loadTheme();

    /* ================= AIRCRAFT TABLE + CARDS (data-driven) ================= */
    var escapeHtml = function (s) {
      return String(s === null || s === undefined ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
    var renderAircraft = function () {
      try {
        var tbody = document.getElementById('acTableBody');
        if (tbody && TTX_DATA.aircraftComparison) {
          var rows = '';
          TTX_DATA.aircraftComparison.forEach(function (a) {
            rows += '<tr>' +
              '<td class="ac-name">' + escapeHtml(a.name) + '</td>' +
              '<td class="num">' + escapeHtml(a.pax) + '</td>' +
              '<td class="num">' + escapeHtml(a.crew) + '</td>' +
              '<td class="num">' + escapeHtml(a.total) + '</td>' +
              '<td>' + escapeHtml(a.fuel) + '</td>' +
              '<td class="num">' + escapeHtml(a.wheels) + '</td>' +
              '<td>' + escapeHtml(a.door) + '</td>' +
              '<td>' + escapeHtml(a.baggage) + '</td>' +
              '</tr>';
          });
          tbody.innerHTML = rows;
        }
        var grid = document.getElementById('acGrid');
        if (grid && TTX_DATA.aircraftDetails) {
          var cards = '';
          TTX_DATA.aircraftDetails.forEach(function (d) {
            cards += '<div class="ac-card">' +
              '<div class="ac-head"><div class="ac-badge">✈️</div><div>' +
              '<h4>' + escapeHtml(d.name) + '</h4>' +
              '<p>' + escapeHtml(d.operator) + '</p></div></div>' +
              '<div class="stat-grid">' +
              '<div class="stat"><span class="num">' + escapeHtml(d.pax) + '</span><span class="lbl">Pax</span></div>' +
              '<div class="stat"><span class="num">' + escapeHtml(d.crew) + '</span><span class="lbl">Crew</span></div>' +
              '<div class="stat"><span class="num">' + escapeHtml(d.total) + '</span><span class="lbl">Total</span></div>' +
              '<div class="stat"><span class="num">' + escapeHtml(d.wheels) + '</span><span class="lbl">Wheels</span></div>' +
              '</div><div class="spec-rows">';
            (d.specs || []).forEach(function (sp) {
              cards += '<div class="spec-row"><span class="k">' + escapeHtml(sp.k) + '</span><span class="v">' + escapeHtml(sp.v) + '</span></div>';
            });
            cards += '</div></div>';
          });
          grid.innerHTML = cards;
        }
      } catch (e) {
        if (window.console) console.warn('aircraft render skipped:', e);
      }
    };
    renderAircraft();

    /* ================= IC ROLE CARDS (data-driven) ================= */
    var renderRoleCards = function () {
      try {
        var grid = document.getElementById('roleGrid');
        if (!grid || !TTX_DATA.roleCards) return;
        var html = '';
        TTX_DATA.roleCards.forEach(function (r) {
          html += '<div class="role-card">' +
            '<div class="role-head">' +
            '<span class="role-tag role-tag-' + (/^Incident/.test(r.role) ? 'cmd' : (/Command Staff/.test(r.tag) ? 'cs' : 'gs')) + '">' + escapeHtml(r.tag) + '</span>' +
            '<h4>' + escapeHtml(r.role) + '</h4>' +
            '</div>' +
            '<p class="role-who">' + escapeHtml(r.who) + '</p>' +
            '<ul class="role-duties">';
          (r.duties || []).forEach(function (d) {
            html += '<li>' + escapeHtml(d) + '</li>';
          });
          html += '</ul>' +
            '<div class="role-reports">' + escapeHtml(r.reports) + '</div>' +
            '</div>';
        });
        grid.innerHTML = html;
      } catch (e) {
        if (window.console) console.warn('role cards render skipped:', e);
      }
    };
    renderRoleCards();

    /* ================= GLOSSARY (data-driven + filter) ================= */
    var renderGlossary = function (filter) {
      try {
        var grid = document.getElementById('glossaryGrid');
        if (!grid || !TTX_DATA.glossary) return;
        var q = (filter || '').trim().toLowerCase();
        var html = '', shown = 0;
        TTX_DATA.glossary.forEach(function (g) {
          if (q && (g.term + ' ' + g.full + ' ' + g.def).toLowerCase().indexOf(q) === -1) return;
          shown++;
          html += '<div class="glossary-card">' +
            '<div class="g-term">' + escapeHtml(g.term) + '</div>' +
            '<div class="g-full">' + escapeHtml(g.full) + '</div>' +
            '<p class="g-def">' + escapeHtml(g.def) + '</p>' +
            '</div>';
        });
        if (!shown) html = '<p class="glossary-empty">No terms match “' + escapeHtml(filter) + '”.</p>';
        grid.innerHTML = html;
        var count = document.getElementById('glossaryCount');
        if (count) count.textContent = shown + ' / ' + TTX_DATA.glossary.length + ' terms';
      } catch (e) {
        if (window.console) console.warn('glossary render skipped:', e);
      }
    };
    renderGlossary('');
    var glossaryFilter = document.getElementById('glossaryFilter');
    if (glossaryFilter) {
      glossaryFilter.addEventListener('input', function () {
        renderGlossary(glossaryFilter.value);
      });
    }

    /* ================= REGULATORY REFERENCES (data-driven) ================= */
    var renderReferences = function () {
      try {
        var grid = document.getElementById('refGrid');
        if (!grid || !TTX_DATA.references) return;
        var html = '';
        TTX_DATA.references.forEach(function (r) {
          html += '<div class="ref-card">' +
            '<div class="ref-head"><span class="ref-src">' + escapeHtml(r.src) + '</span>' +
            '<h4>' + escapeHtml(r.doc) + '</h4></div>' +
            '<p class="ref-scope">' + escapeHtml(r.scope) + '</p>' +
            '<ul class="ref-list">';
          (r.key || []).forEach(function (k) {
            html += '<li>' + escapeHtml(k) + '</li>';
          });
          html += '</ul></div>';
        });
        grid.innerHTML = html;
      } catch (e) {
        if (window.console) console.warn('references render skipped:', e);
      }
    };
    renderReferences();

    /* ================= VERSION HISTORY (changelog) ================= */
    var APP_VERSION = '2026.09.30';
    var CHANGELOG = [
      { v: '2026.09.30', items: [
        'Dhivehi / English language toggle with RTL layout',
        'PWA: installable, offline support via service worker',
        'JSON backup / restore of all dashboard data',
        'High-contrast theme (dark → light → high contrast cycle)',
        'Text size controls with Ctrl +/−/0 shortcuts',
        'Accessibility: skip link, visible focus rings, ARIA labels',
        'Print-friendly export (PDF) and ICS 201/202/203 forms'
      ]},
      { v: '2026.09.29', items: [
        'Exercise timeline with inject tracker and undo/redo',
        'Scenario editor: create, edit, duplicate, compare scenarios',
        'Resource tracker and casualty tracker with triage cards',
        'Draggable map pins and crash zone with persistence',
        'Live weather widget (Open-Meteo, VRBK)',
        'Keyboard shortcuts (Ctrl/Alt + 1-7, T, Esc)',
        'Light / dark theme with instant toggle'
      ]},
      { v: '2026.09.28', items: [
        'Initial release: IC phases, team labels, key locations,',
        'incident zones, emergency types, aircraft specs, checklist'
      ]}
    ];
    var changelogBtn = document.getElementById('changelogBtn');
    if (changelogBtn) {
      changelogBtn.addEventListener('click', function () {
        var existing = document.getElementById('changelogOverlay');
        if (existing) { existing.remove(); return; }
        var ov = document.createElement('div');
        ov.id = 'changelogOverlay';
        ov.className = 'se-overlay';
        var html = '<div class="se-modal" style="max-width:560px;max-height:80vh;overflow-y:auto;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">';
        html += '<h3 style="margin:0;font-size:16px;">Version History</h3>';
        html += '<button class="reset-btn" type="button" id="clClose" style="padding:5px 12px;">✕ Close</button></div>';
        CHANGELOG.forEach(function (rel, i) {
          html += '<div style="margin-bottom:' + (i === CHANGELOG.length - 1 ? '0' : '18px') + ';">';
          html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
          html += '<span style="font-weight:700;font-size:14px;">v' + rel.v + '</span>';
          if (i === 0) html += '<span style="font-size:10px;background:var(--green);color:#04210e;padding:2px 8px;border-radius:99px;font-weight:700;">CURRENT</span>';
          html += '</div><ul style="margin:0;padding-left:18px;">';
          rel.items.forEach(function (it) {
            html += '<li style="font-size:13px;color:var(--muted);margin-bottom:4px;">' + it + '</li>';
          });
          html += '</ul></div>';
        });
        html += '</div>';
        ov.innerHTML = html;
        document.body.appendChild(ov);
        var close = function () { ov.remove(); };
        document.getElementById('clClose').addEventListener('click', close);
        ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
      });
    }
    var footerVer = document.getElementById('footerVer');
    if (footerVer) footerVer.textContent = 'v' + APP_VERSION;

    /* ================= BACKUP / RESTORE (JSON) =================
       Serialises every ttx-* key (except the transient weather
       cache) into one portable JSON file, and restores it back. */
    var BACKUP_KEYS = [
      'ttx-theme', 'ttx-lang', 'ttx-font-scale',
      'ttx-checklist-state', 'ttx-pin-positions', 'ttx-crash-zone-positions',
      'ttx-custom-scenarios', 'ttx-ics-names',
      'ttx-casualties', 'ttx-resource-deployed', 'ttx-timeline-events'
    ];

    var backupBtn = document.getElementById('backupBtn');
    if (backupBtn) {
      backupBtn.addEventListener('click', function () {
        var payload = { app: 'kulhudhuffushi-emergency-dashboard', format: 1,
                        exportedAt: new Date().toISOString(), data: {} };
        BACKUP_KEYS.forEach(function (k) {
          var v = localStorage.getItem(k);
          if (v !== null) payload.data[k] = v;
        });
        var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'dashboard-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    var restoreBtn = document.getElementById('restoreBtn');
    var restoreFile = document.getElementById('restoreFile');
    if (restoreBtn && restoreFile) {
      restoreBtn.addEventListener('click', function () { restoreFile.click(); });
      restoreFile.addEventListener('change', function () {
        var file = restoreFile.files && restoreFile.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          var ok = false, count = 0;
          try {
            var payload = JSON.parse(reader.result);
            var data = payload && payload.data;
            if (payload && payload.app === 'kulhudhuffushi-emergency-dashboard' && data && typeof data === 'object') {
              BACKUP_KEYS.forEach(function (k) {
                if (typeof data[k] === 'string') { localStorage.setItem(k, data[k]); count++; }
              });
              ok = count > 0;
            }
          } catch (e) { ok = false; }
          if (ok) {
            alert('Backup restored (' + count + ' entries). Reloading…');
            location.reload();
          } else {
            alert('This file is not a valid dashboard backup.');
            restoreFile.value = '';
          }
        };
        reader.readAsText(file);
      });
    }

    /* ================= WEATHER (Open-Meteo, VRBK) ================= */
    var weatherEl = document.getElementById('weatherWidget');
    var WX_CACHE_KEY = 'ttx-wx-cache';

    var WX_CODES = {
      0: ['☀️', 'Clear'], 1: ['🌤', 'Mainly clear'], 2: ['⛅', 'Partly cloudy'], 3: ['☁️', 'Overcast'],
      45: ['🌫', 'Fog'], 48: ['🌫', 'Rime fog'],
      51: ['🌦', 'Light drizzle'], 53: ['🌦', 'Drizzle'], 55: ['🌧', 'Dense drizzle'],
      56: ['🌧', 'Freezing drizzle'], 57: ['🌧', 'Freezing drizzle'],
      61: ['🌧', 'Light rain'], 63: ['🌧', 'Rain'], 65: ['🌧', 'Heavy rain'],
      66: ['🌧', 'Freezing rain'], 67: ['🌧', 'Freezing rain'],
      71: ['🌨', 'Light snow'], 73: ['🌨', 'Snow'], 75: ['❄️', 'Heavy snow'], 77: ['❄️', 'Snow grains'],
      80: ['🌦', 'Rain showers'], 81: ['🌧', 'Rain showers'], 82: ['⛈', 'Violent showers'],
      85: ['🌨', 'Snow showers'], 86: ['🌨', 'Snow showers'],
      95: ['⛈', 'Thunderstorm'], 96: ['⛈', 'Thunderstorm + hail'], 99: ['⛈', 'Severe t-storm']
    };

    var windDirLabel = function (deg) {
      var dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      return dirs[Math.round(deg / 22.5) % 16];
    };

    var renderWeather = function (data) {
      if (!weatherEl || !data || !data.current) return;
      var c = data.current;
      var code = WX_CODES[c.weather_code] || ['🌡', '—'];
      var html = '<span class="wx-icon" title="' + code[1] + '">' + code[0] + '</span>';
      html += '<span class="wx-temp">' + Math.round(c.temperature_2m) + '°C</span>';
      html += '<span class="wx-meta">' + Math.round(c.wind_speed_10m) + ' kt ' + windDirLabel(c.wind_direction_10m) + '</span>';
      html += '<span class="wx-meta">RH ' + Math.round(c.relative_humidity_2m) + '%</span>';
      html += '<span class="wx-cond">' + code[1] + '</span>';
      html += '<span class="wx-fresh" title="Data refreshed from Open-Meteo">● live</span>';
      weatherEl.innerHTML = html;
      weatherEl.setAttribute('aria-label',
        'Weather at Kulhudhuffushi: ' + code[1] + ', ' + Math.round(c.temperature_2m) +
        ' degrees, wind ' + Math.round(c.wind_speed_10m) + ' knots ' + windDirLabel(c.wind_direction_10m));
    };

    var loadWeather = function (force) {
      if (!weatherEl) return;
      /* Cache for 10 minutes so refreshes don't hammer the API */
      try {
        if (!force) {
          var cached = JSON.parse(localStorage.getItem(WX_CACHE_KEY) || 'null');
          if (cached && cached.t && (Date.now() - cached.t) < 10 * 60 * 1000) {
            renderWeather(cached.data);
            var f = weatherEl.querySelector('.wx-fresh');
            if (f) { f.textContent = '● cached'; f.classList.add('wx-cached'); }
            return;
          }
        }
      } catch (e) {}

      var url = 'https://api.open-meteo.com/v1/forecast?latitude=6.887&longitude=73.481' +
        '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m' +
        '&wind_speed_unit=kn&timezone=Indian/Maldives';

      if (typeof fetch !== 'function') return;
      fetch(url)
        .then(function (r) { if (!r.ok) throw new Error('wx ' + r.status); return r.json(); })
        .then(function (data) {
          renderWeather(data);
          try { localStorage.setItem(WX_CACHE_KEY, JSON.stringify({ t: Date.now(), data: data })); } catch (e) {}
        })
        .catch(function () {
          /* Offline or blocked — fall back to any cached copy */
          try {
            var cached = JSON.parse(localStorage.getItem(WX_CACHE_KEY) || 'null');
            if (cached && cached.data) {
              renderWeather(cached.data);
              var f = weatherEl.querySelector('.wx-fresh');
              if (f) { f.textContent = '● offline'; f.classList.add('wx-cached'); }
            } else {
              weatherEl.innerHTML = '<span class="wx-cond">' + t('wx.unavailable') + '</span>';
            }
          } catch (e) {
            weatherEl.innerHTML = '<span class="wx-cond">' + t('wx.unavailable') + '</span>';
          }
        });
    };

    loadWeather(false);
    /* Refresh when the tab becomes visible again */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) loadWeather(false);
    });
    if (weatherEl) {
      weatherEl.addEventListener('click', function () { loadWeather(true); });
      weatherEl.style.cursor = 'pointer';
    }

    /* ================= KEYBOARD SHORTCUTS =================
       Ctrl/Alt + 1-7 : switch tabs
       Ctrl/Alt + T   : toggle theme
       Esc            : close scenario editor
       (Browsers reserve Ctrl+1-7 and Ctrl+T for themselves, so the
       Alt variants are provided as the always-working fallback.) */
    var SHORTCUT_TAB_IDS = [
      'ttx-tab-phases', 'ttx-tab-teams', 'ttx-tab-locations',
      'ttx-tab-zones', 'ttx-tab-emergencies', 'ttx-tab-aircraft',
      'ttx-tab-checklist'
    ];

    var isTypingTarget = function (el) {
      if (!el) return false;
      var tag = el.tagName;
      return tag === 'TEXTAREA' || tag === 'SELECT' ||
        (tag === 'INPUT' && el.type !== 'radio' && el.type !== 'checkbox') ||
        el.isContentEditable;
    };

    document.addEventListener('keydown', function (e) {
      /* Esc closes the scenario editor / comparison / ICS forms (even while typing) */
      if (e.key === 'Escape') {
        var ov = document.getElementById('scenarioEditorOverlay') ||
                 document.getElementById('compareOverlay') ||
                 document.getElementById('icsOverlay') ||
                 document.getElementById('changelogOverlay');
        if (ov) { ov.remove(); e.preventDefault(); }
        return;
      }

      if (e.metaKey || e.ctrlKey && e.altKey) return;
      if (isTypingTarget(e.target)) return;

      /* Timeline undo/redo: Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z */
      if (e.ctrlKey && (e.key === 'z' || e.key === 'Z' || e.key === 'y' || e.key === 'Y')) {
        var tl = document.getElementById('timelineSection');
        if (tl && getComputedStyle(tl).display !== 'none') {
          e.preventDefault();
          if (e.key === 'y' || e.key === 'Y' || e.shiftKey) redoTimeline();
          else undoTimeline();
          return;
        }
      }

      var mod = e.ctrlKey || e.altKey;
      if (!mod || e.shiftKey) return;

      /* Theme toggle: Ctrl+T or Alt+T */
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        if (themeToggle) themeToggle.click();
        return;
      }

      /* Text size: Ctrl+/-/0 (zoom buttons) */
      if (e.key === '=' || e.key === '+' || e.key === '-' || e.key === '0') {
        if (e.altKey) return; /* let Alt+- etc. pass through to the browser */
        e.preventDefault();
        if (e.key === '0') { if (fontResetBtn) fontResetBtn.click(); }
        else if (e.key === '-' || e.key === '_') stepFont(-1);
        else stepFont(1);
        return;
      }

      /* Tab switch: Ctrl+1-7 or Alt+1-7 (use e.code so Alt on macOS
         keyboards, which changes e.key, still works) */
      if (e.code && e.code.indexOf('Digit') === 0) {
        var digit = parseInt(e.code.charAt(5), 10);
        if (digit >= 1 && digit <= 7) {
          var radio = document.getElementById(SHORTCUT_TAB_IDS[digit - 1]);
          if (radio && !radio.checked) {
            e.preventDefault();
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    });

    /* ================= KEYBOARD FOCUS MIRROR (tabs) =================
       The tab radios are visually hidden, so a keyboard user gets no
       focus ring. Mirror focus onto the visible label. */
    Array.prototype.forEach.call(document.querySelectorAll('.tab-radio'), function (radio) {
      var label = document.querySelector('label[for="' + radio.id + '"]');
      if (!label) return;
      var on = function () { label.classList.add('kb-focus'); };
      var off = function () { label.classList.remove('kb-focus'); };
      radio.addEventListener('focus', on);
      radio.addEventListener('blur', off);
      radio.addEventListener('click', off);
    });

    /* ================= TAB BAR SCROLL (mobile) =================
       The tab strip scrolls horizontally on narrow screens. Show a
       themed fade on whichever edge still has more to reveal, and
       keep the active tab in view (centred) when it changes. */
    var tabsWrap = document.querySelector('.tabs .wrap');
    if (tabsWrap) {
      var tabsBar = tabsWrap.closest('.tabs');
      var updTabEdges = function () {
        var over = tabsWrap.scrollWidth - tabsWrap.clientWidth;
        tabsBar.classList.toggle('can-scroll-r', tabsWrap.scrollLeft < over - 4);
        tabsBar.classList.toggle('can-scroll-l', tabsWrap.scrollLeft > 4);
      };
      var centreActiveTab = function (smooth) {
        updTabEdges();
        if (tabsWrap.scrollWidth <= tabsWrap.clientWidth + 1) return;
        var radio = document.querySelector('.tab-radio:checked');
        if (!radio) return;
        var lab = document.querySelector('label.tab[for="' + radio.id + '"]');
        if (!lab) return;
        var target = lab.offsetLeft - (tabsWrap.clientWidth - lab.offsetWidth) / 2;
        target = Math.max(0, Math.min(target, tabsWrap.scrollWidth - tabsWrap.clientWidth));
        tabsWrap.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'instant' });
      };
      tabsWrap.addEventListener('scroll', updTabEdges, { passive: true });
      window.addEventListener('resize', updTabEdges);
      Array.prototype.forEach.call(document.querySelectorAll('.tab-radio'), function (radio) {
        radio.addEventListener('change', function () { centreActiveTab(true); });
      });
      document.addEventListener('ttx:langchange', function () {
        setTimeout(function () { centreActiveTab(false); }, 60);
      });
      centreActiveTab(false);
    }

    /* ================= SUB NAV (Aircraft tab) ================= */
    var subNav = document.getElementById('aircraftSubNav');
    if (subNav) {
      var subNavLinks = subNav.querySelectorAll('.sub-nav-link');
      var sections = ['ac-comparison','ac-details','ac-diagrams','ac-fuel','ac-flow','ac-implications'].map(function(id){ return document.getElementById(id); });

      /* The sticky chrome (tab bar + sub-nav) is taller on touch
         devices, so measure it instead of hard-coding an offset. */
      var stickyOffset = function () {
        var tabsEl = document.querySelector('.tabs');
        return (tabsEl ? tabsEl.offsetHeight : 0) + subNav.offsetHeight + 16;
      };

      var setActiveLink = function(idx) {
        subNavLinks.forEach(function(link, i) {
          link.classList.toggle('active', i === idx);
        });
      };

      subNavLinks.forEach(function(link, idx) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          var target = sections[idx];
          if (target) {
            var y = target.getBoundingClientRect().top + window.scrollY - stickyOffset();
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
          setActiveLink(idx);
        });
      });

      var onScroll = function() {
        var scrollPos = window.scrollY + stickyOffset() + 40;
        var activeIdx = 0;
        sections.forEach(function(sec, idx) {
          if (sec && sec.offsetTop <= scrollPos) activeIdx = idx;
        });
        setActiveLink(activeIdx);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ================= BACK TO TOP ================= */
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
      var onScroll = function () {
        if (window.scrollY > 300) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ================= CHECKLIST ================= */
    var STORAGE_KEY = 'ttx-checklist-state';

    var grid  = document.getElementById('checkGrid');
    var fill  = document.getElementById('progressFill');
    var num   = document.getElementById('progressNum');
    var reset = document.getElementById('resetBtn');

    if (grid) {
      var ITEMS = TTX_DATA.checklistItems;

      ITEMS.forEach(function (text) {
        var label = document.createElement('label');
        label.className = 'check-item';
        label.innerHTML =
          '<input type="checkbox" class="check-input">' +
          '<span class="check-box">✓</span>' +
          '<span class="check-label">' + text + '</span>';
        grid.appendChild(label);
      });

      var inputs = Array.prototype.slice.call(grid.querySelectorAll('.check-input'));

      var saveState = function () {
        var state = inputs.map(function (i) { return i.checked; });
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
      };

      var loadState = function () {
        try {
          var raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return;
          var state = JSON.parse(raw);
          if (!Array.isArray(state) || state.length !== inputs.length) return;
          inputs.forEach(function (i, idx) { i.checked = !!state[idx]; });
        } catch (e) {}
      };

      var updateProgress = function () {
        var done = inputs.filter(function (i) { return i.checked; }).length;
        var pct  = Math.round((done / inputs.length) * 100);
        fill.style.width = pct + '%';
        num.textContent = done + ' / ' + inputs.length;
        num.classList.toggle('ready', done === inputs.length);
        saveState();
      };

      inputs.forEach(function (i) { i.addEventListener('change', updateProgress); });

      loadState();
      updateProgress();

      reset.addEventListener('click', function () {
        inputs.forEach(function (i) { i.checked = false; });
        updateProgress();
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      });
    }

    /* ================= MAP PINS & LEGEND ================= */
    var CATS = TTX_DATA.pinCategories;
    var LOCATIONS = TTX_DATA.locations;
    var PIN_STORAGE_KEY = 'ttx-pin-positions';

    var pinLayer = document.getElementById('pinLayer');
    var legend   = document.getElementById('legend');
    var NS = 'http://www.w3.org/2000/svg';

    /* ---------- Pin position persistence ---------- */
    var savePinPositions = function () {
      var positions = {};
      LOCATIONS.forEach(function (loc) {
        var pin = pinLayer.querySelector('.pin[data-id="' + loc.id + '"]');
        if (pin) {
          var transform = pin.getAttribute('transform');
          var match = transform.match(/translate\(([^,]+),([^)]+)\)/);
          if (match) {
            positions[loc.id] = { x: parseFloat(match[1]), y: parseFloat(match[2]) };
          }
        }
      });
      try { localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(positions)); } catch (e) {}
    };

    var loadPinPositions = function () {
      try {
        var raw = localStorage.getItem(PIN_STORAGE_KEY);
        if (!raw) return {};
        var positions = JSON.parse(raw);
        if (typeof positions !== 'object' || positions === null) return {};
        return positions;
      } catch (e) { return {}; }
    };

    var resetPinPositions = function () {
      try { localStorage.removeItem(PIN_STORAGE_KEY); } catch (e) {}
      LOCATIONS.forEach(function (loc) {
        var pin = pinLayer.querySelector('.pin[data-id="' + loc.id + '"]');
        if (pin) {
          pin.setAttribute('transform', 'translate(' + loc.x + ',' + loc.y + ')');
        }
      });
    };

    /* ---------- Drag logic ---------- */
    var draggedPin = null;
    var dragOffset = { x: 0, y: 0 };

    var getSVGPoint = function (svg, clientX, clientY) {
      var pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      var ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      var svgPt = pt.matrixTransform(ctm.inverse());
      return { x: svgPt.x, y: svgPt.y };
    };

    var onPinMouseDown = function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      var pin = e.currentTarget;
      var svg = pin.closest('svg');
      if (!svg) return;

      var transform = pin.getAttribute('transform');
      var match = transform.match(/translate\(([^,]+),([^)]+)\)/);
      if (!match) return;

      var pinX = parseFloat(match[1]);
      var pinY = parseFloat(match[2]);
      var svgPt = getSVGPoint(svg, e.clientX, e.clientY);

      draggedPin = pin;
      dragOffset.x = svgPt.x - pinX;
      dragOffset.y = svgPt.y - pinY;

      pin.classList.add('dragging');
    };

    var onMouseMove = function (e) {
      if (!draggedPin) return;
      var svg = draggedPin.closest('svg');
      if (!svg) return;

      var svgPt = getSVGPoint(svg, e.clientX, e.clientY);
      var newX = svgPt.x - dragOffset.x;
      var newY = svgPt.y - dragOffset.y;

      /* Clamp to SVG bounds */
      var vb = svg.viewBox.baseVal;
      var margin = 20;
      newX = Math.max(margin, Math.min(vb.width - margin, newX));
      newY = Math.max(margin, Math.min(vb.height - margin, newY));

      draggedPin.setAttribute('transform', 'translate(' + newX + ',' + newY + ')');
    };

    var onMouseUp = function () {
      if (!draggedPin) return;
      draggedPin.classList.remove('dragging');
      draggedPin = null;
      savePinPositions();
    };

    /* ---------- Pin creation ---------- */
    var makePin = function (loc) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'pin');
      g.setAttribute('data-cat', loc.cat);
      g.setAttribute('data-id', loc.id);

      /* Use saved position if available */
      var savedPositions = loadPinPositions();
      var x = loc.x, y = loc.y;
      if (savedPositions[loc.id]) {
        x = savedPositions[loc.id].x;
        y = savedPositions[loc.id].y;
      }
      g.setAttribute('transform', 'translate(' + x + ',' + y + ')');

      var catColor = CATS[loc.cat].color;

      var title = document.createElementNS(NS, 'title');
      title.textContent = loc.id + '. ' + loc.name + ' (drag to move)';
      g.appendChild(title);

      var halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('class', 'halo');
      halo.setAttribute('r', '19');
      halo.setAttribute('stroke', catColor);
      g.appendChild(halo);

      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', 'dot');
      dot.setAttribute('r', '13');
      dot.setAttribute('fill', catColor);
      dot.setAttribute('stroke', '#0a1220');
      dot.setAttribute('stroke-width', '2');
      g.appendChild(dot);

      var num = document.createElementNS(NS, 'text');
      num.setAttribute('text-anchor', 'middle');
      num.setAttribute('dominant-baseline', 'central');
      num.setAttribute('font-size', '12');
      num.setAttribute('font-weight', '700');
      num.setAttribute('fill', '#ffffff');
      num.setAttribute('pointer-events', 'none');
      num.textContent = loc.id;
      g.appendChild(num);

      return g;
    };

    var itemEls = {};

    if (pinLayer && legend) {
      LOCATIONS.forEach(function (loc) {
        var pin = makePin(loc);
        pinLayer.appendChild(pin);
        pin.addEventListener('mouseenter', function () { highlight(loc.id, true); });
        pin.addEventListener('mouseleave', function () { highlight(loc.id, false); });
        pin.addEventListener('mousedown', onPinMouseDown);
      });

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      Object.keys(CATS).forEach(function (catKey) {
        var cat = CATS[catKey];
        var heading = document.createElement('div');
        heading.className = 'legend-cat';
        heading.textContent = cat.label;
        legend.appendChild(heading);

        LOCATIONS.filter(function (l) { return l.cat === catKey; })
          .sort(function (a, b) { return a.id - b.id; })
          .forEach(function (loc) {
            var item = document.createElement('div');
            item.className = 'legend-item';
            item.setAttribute('data-id', loc.id);
            item.innerHTML =
              '<div class="legend-num" style="background:' + cat.color + '">' + loc.id + '</div>' +
              '<div class="legend-txt"><b>' + loc.name + '</b><span>' + loc.desc + '</span></div>';
            item.addEventListener('mouseenter', function () { highlight(loc.id, true); });
            item.addEventListener('mouseleave', function () { highlight(loc.id, false); });
            legend.appendChild(item);
            itemEls[loc.id] = item;
          });
      });

      /* Add reset button for pin positions */
      var resetPinsBtn = document.createElement('button');
      resetPinsBtn.className = 'reset-btn';
      resetPinsBtn.type = 'button';
      resetPinsBtn.textContent = 'Reset Pin Positions';
      resetPinsBtn.style.marginTop = '12px';
      resetPinsBtn.addEventListener('click', function () {
        resetPinPositions();
      });
      legend.appendChild(resetPinsBtn);
    }

    function highlight(id, on) {
      var pin  = pinLayer.querySelector('.pin[data-id="' + id + '"]');
      var item = itemEls[id];
      if (pin)  pin.classList.toggle('hl', on);
      if (item) item.classList.toggle('hl', on);
    }

    /* ================= DRAG CRASH SITE & ZONE RINGS ================= */
    var CRASH_ZONE_STORAGE_KEY = 'ttx-crash-zone-positions';
    var DEFAULT_CRASH_POS = { x: 507, y: 270 };

    var saveCrashZonePositions = function () {
      var group = document.getElementById('crashZoneGroup');
      if (!group) return;
      var transform = group.getAttribute('transform');
      var match = transform.match(/translate\(([^,]+),([^)]+)\)/);
      if (match) {
        var positions = { x: parseFloat(match[1]), y: parseFloat(match[2]) };
        try { localStorage.setItem(CRASH_ZONE_STORAGE_KEY, JSON.stringify(positions)); } catch (e) {}
      }
    };

    var loadCrashZonePositions = function () {
      try {
        var raw = localStorage.getItem(CRASH_ZONE_STORAGE_KEY);
        if (!raw) return {};
        var positions = JSON.parse(raw);
        if (typeof positions !== 'object' || positions === null) return {};
        return positions;
      } catch (e) { return {}; }
    };

    var resetCrashZonePositions = function () {
      try { localStorage.removeItem(CRASH_ZONE_STORAGE_KEY); } catch (e) {}
      var group = document.getElementById('crashZoneGroup');
      if (group) group.setAttribute('transform', 'translate(0,0)');
    };

    var draggedCrashGroup = null;
    var dragStartMouse = { x: 0, y: 0 };
    var dragStartPos = { x: 0, y: 0 };

    var onCrashZoneMouseDown = function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      var el = e.currentTarget;
      var svg = el.closest('svg');
      if (!svg) return;

      var transform = el.getAttribute('transform');
      var match = transform.match(/translate\(([^,]+),([^)]+)\)/);
      if (!match) return;

      var elX = parseFloat(match[1]);
      var elY = parseFloat(match[2]);
      var svgPt = getSVGPoint(svg, e.clientX, e.clientY);

      draggedCrashGroup = el;
      dragStartMouse.x = svgPt.x;
      dragStartMouse.y = svgPt.y;
      dragStartPos.x = elX;
      dragStartPos.y = elY;

      el.style.cursor = 'grabbing';
    };

    var onCrashZoneMouseMove = function (e) {
      if (!draggedCrashGroup) return;
      var svg = draggedCrashGroup.closest('svg');
      if (!svg) return;

      var svgPt = getSVGPoint(svg, e.clientX, e.clientY);
      var dx = svgPt.x - dragStartMouse.x;
      var dy = svgPt.y - dragStartMouse.y;
      var newX = dragStartPos.x + dx;
      var newY = dragStartPos.y + dy;

      /* Allow movement across the entire map — no lower clamp */
      draggedCrashGroup.setAttribute('transform', 'translate(' + newX + ',' + newY + ')');
    };

    var onCrashZoneMouseUp = function () {
      if (!draggedCrashGroup) return;
      draggedCrashGroup.style.cursor = 'grab';
      draggedCrashGroup = null;
      saveCrashZonePositions();
    };

    var crashZoneGroup = document.getElementById('crashZoneGroup');

    if (crashZoneGroup) {
      /* Load saved positions */
      var savedCrashZone = loadCrashZonePositions();
      if (savedCrashZone.x !== undefined) {
        crashZoneGroup.setAttribute('transform', 'translate(' + savedCrashZone.x + ',' + savedCrashZone.y + ')');
      }

      crashZoneGroup.addEventListener('mousedown', onCrashZoneMouseDown);
      document.addEventListener('mousemove', onCrashZoneMouseMove);
      document.addEventListener('mouseup', onCrashZoneMouseUp);

      /* Add reset button for crash site and zone positions */
      var resetCrashZoneBtn = document.createElement('button');
      resetCrashZoneBtn.className = 'reset-btn';
      resetCrashZoneBtn.type = 'button';
      resetCrashZoneBtn.textContent = 'Reset Crash Site & Zones';
      resetCrashZoneBtn.style.marginTop = '8px';
      resetCrashZoneBtn.addEventListener('click', function () {
        resetCrashZonePositions();
      });
      legend.appendChild(resetCrashZoneBtn);
    }

    /* ================= SCENARIO SELECTOR + EDITOR ================= */
    var scenarioSelect = document.getElementById('scenarioSelect');
    var CUSTOM_SCEN_KEY = 'ttx-custom-scenarios';
    var BUILTIN_IDS = (TTX_DATA.scenarios || []).map(function (s) { return s.id; });

    var loadCustomScenarios = function () {
      try {
        var raw = localStorage.getItem(CUSTOM_SCEN_KEY);
        var arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      } catch (e) { return []; }
    };
    var saveCustomScenarios = function (arr) {
      try { localStorage.setItem(CUSTOM_SCEN_KEY, JSON.stringify(arr)); } catch (e) {}
    };

    /* Built-in scenarios + custom ones (custom with same id overrides built-in) */
    var getAllScenarios = function () {
      var base = (TTX_DATA.scenarios || []).slice();
      loadCustomScenarios().forEach(function (c) {
        var idx = -1;
        base.forEach(function (s, i) { if (s.id === c.id) idx = i; });
        if (idx >= 0) base[idx] = c; else base.push(c);
      });
      return base;
    };
    var findScenario = function (id) {
      if (!id) return null;
      var found = null;
      getAllScenarios().forEach(function (s) { if (s.id === id) found = s; });
      return found;
    };
    var isCustomScenario = function (id) {
      return loadCustomScenarios().some(function (c) { return c.id === id; });
    };

    var populateScenarioSelect = function (selectedId) {
      if (!scenarioSelect) return;
      scenarioSelect.innerHTML = '<option value="">' + t('opt.selectScenario') + '</option>';
      getAllScenarios().forEach(function (sc) {
        var opt = document.createElement('option');
        opt.value = sc.id;
        opt.textContent = sc.name + (BUILTIN_IDS.indexOf(sc.id) < 0 ? ' (custom)' : '');
        scenarioSelect.appendChild(opt);
      });
      scenarioSelect.value = selectedId || '';
    };

    /* ---------- Editor modal ---------- */
    var closeScenarioEditor = function () {
      var ov = document.getElementById('scenarioEditorOverlay');
      if (ov) ov.remove();
    };

    var openScenarioEditor = function (mode) {
      closeScenarioEditor();
      var editing = mode === 'edit' ? findScenario(scenarioSelect.value) : null;
      if (mode === 'edit' && !editing) return;

      var sc = editing || {
        name: '', aircraft: '', soulsOnBoard: '', fuelLoad: '', fireInvolved: false,
        casualties: { red: 0, yellow: 0, green: 0, deceased: 0 },
        resources: { arff: 0, ambulances: 0, fireTrucks: 0, buses: 0 },
        injects: []
      };
      var isCustom = editing ? isCustomScenario(editing.id) : false;
      var isBuiltin = editing ? BUILTIN_IDS.indexOf(editing.id) >= 0 : false;

      var numField = function (id, label, val) {
        return '<div class="se-field"><label for="' + id + '">' + label + '</label>' +
          '<input class="se-input" id="' + id + '" type="number" min="0" value="' + (val || 0) + '"></div>';
      };

      var html = '<div class="scenario-editor" role="dialog" aria-modal="true" aria-label="Scenario editor">';
      html += '<div class="se-head"><h3>' + (mode === 'edit' ? 'Edit Scenario' : 'New Scenario') + '</h3>';
      html += '<button class="reset-btn" type="button" id="seClose" aria-label="Close">✕</button></div>';

      html += '<div class="se-field"><label for="se-name">Scenario name *</label>' +
        '<input class="se-input" id="se-name" type="text" placeholder="e.g. ACR 72 Crash on Runway" value="' + (sc.name || '').replace(/"/g, '&quot;') + '"></div>';

      html += '<div class="se-grid">';
      html += '<div class="se-field"><label for="se-aircraft">Aircraft</label>' +
        '<input class="se-input" id="se-aircraft" type="text" placeholder="e.g. ATR 72-600 (optional)" value="' + (sc.aircraft || '').replace(/"/g, '&quot;') + '"></div>';
      html += '<div class="se-field"><label for="se-souls">Souls on board</label>' +
        '<input class="se-input" id="se-souls" type="number" min="0" value="' + (sc.soulsOnBoard || 0) + '"></div>';
      html += '<div class="se-field"><label for="se-fuel">Fuel load</label>' +
        '<input class="se-input" id="se-fuel" type="text" placeholder="e.g. 5,000 kg" value="' + (sc.fuelLoad || '').replace(/"/g, '&quot;') + '"></div>';
      html += '<div class="se-field se-check"><label><input id="se-fire" type="checkbox" ' + (sc.fireInvolved ? 'checked' : '') + '> Fire involved</label></div>';
      html += '</div>';

      html += '<h4 class="se-sub">Estimated casualties</h4><div class="se-grid">';
      html += numField('se-red', 'Red (Immediate)', sc.casualties.red);
      html += numField('se-yellow', 'Yellow (Delayed)', sc.casualties.yellow);
      html += numField('se-green', 'Green (Minor)', sc.casualties.green);
      html += numField('se-deceased', 'Deceased', sc.casualties.deceased);
      html += '</div>';

      html += '<h4 class="se-sub">Resource requirements</h4><div class="se-grid">';
      html += numField('se-arff', 'ARFF vehicles', sc.resources.arff);
      html += numField('se-amb', 'Ambulances', sc.resources.ambulances);
      html += numField('se-firetrucks', 'Fire trucks', sc.resources.fireTrucks);
      html += numField('se-buses', 'Buses', sc.resources.buses);
      html += '</div>';

      html += '<div class="se-field"><label for="se-injects">Exercise injects <span class="se-hint">(one per line, start with time e.g. 09:00 —)</span></label>' +
        '<textarea class="se-input" id="se-injects" rows="6">' + (sc.injects || []).join('\n').replace(/</g, '&lt;') + '</textarea></div>';

      html += '<div class="se-actions">';
      if (editing) html += '<button class="reset-btn se-danger" type="button" id="seDelete">' + (isCustom && !isBuiltin ? 'Delete' : (isCustom ? 'Discard override' : '')) + '</button>';
      html += '<span class="se-spacer"></span>';
      html += '<button class="reset-btn" type="button" id="seCancel">Cancel</button>';
      html += '<button class="reset-btn se-save" type="button" id="seSave">Save</button>';
      html += '</div></div>';

      var overlay = document.createElement('div');
      overlay.id = 'scenarioEditorOverlay';
      overlay.className = 'scenario-editor-overlay';
      overlay.innerHTML = html;
      overlay.addEventListener('click', function (e) { if (e.target === overlay) closeScenarioEditor(); });
      document.body.appendChild(overlay);

      document.getElementById('seClose').addEventListener('click', closeScenarioEditor);
      document.getElementById('seCancel').addEventListener('click', closeScenarioEditor);
      document.getElementById('seSave').addEventListener('click', function () {
        var name = document.getElementById('se-name').value.trim();
        if (!name) { alert('Scenario name is required.'); document.getElementById('se-name').focus(); return; }
        var v = function (id) { return parseInt(document.getElementById(id).value, 10) || 0; };
        var result = {
          id: editing ? editing.id : 'custom-' + Date.now().toString(36),
          name: name,
          aircraft: document.getElementById('se-aircraft').value.trim() || null,
          soulsOnBoard: v('se-souls'),
          fuelLoad: document.getElementById('se-fuel').value.trim() || 'N/A',
          fireInvolved: document.getElementById('se-fire').checked,
          casualties: { red: v('se-red'), yellow: v('se-yellow'), green: v('se-green'), deceased: v('se-deceased') },
          resources: { arff: v('se-arff'), ambulances: v('se-amb'), fireTrucks: v('se-firetrucks'), buses: v('se-buses') },
          injects: document.getElementById('se-injects').value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean)
        };
        var customs = loadCustomScenarios();
        var idx = -1;
        customs.forEach(function (c, i) { if (c.id === result.id) idx = i; });
        if (idx >= 0) customs[idx] = result; else customs.push(result);
        saveCustomScenarios(customs);
        populateScenarioSelect(result.id);
        if (scenarioSelect) scenarioSelect.dispatchEvent(new Event('change'));
        closeScenarioEditor();
      });

      var delBtn = document.getElementById('seDelete');
      if (delBtn && editing) {
        if (!delBtn.textContent) { delBtn.remove(); }
        else {
          delBtn.addEventListener('click', function () {
            var msg = isBuiltin
              ? 'Discard your changes and restore the original built-in scenario?'
              : 'Delete scenario "' + editing.name + '"? This cannot be undone.';
            if (!confirm(msg)) return;
            saveCustomScenarios(loadCustomScenarios().filter(function (c) { return c.id !== editing.id; }));
            populateScenarioSelect('');
            if (scenarioSelect) scenarioSelect.dispatchEvent(new Event('change'));
            closeScenarioEditor();
          });
        }
      }

      var nameInput = document.getElementById('se-name');
      if (nameInput) nameInput.focus();
    };

    if (scenarioSelect) {
      populateScenarioSelect('');

      scenarioSelect.addEventListener('change', function () {
        var scenario = findScenario(scenarioSelect.value);
        updateScenarioPanel(scenario);
        /* Exercise Timeline is only relevant once a scenario is chosen */
        var ts = document.getElementById('timelineSection');
        if (ts) ts.style.display = scenario ? '' : 'none';
        /* Editor buttons state */
        if (editBtn) editBtn.disabled = !scenario;
      });

      /* Action buttons next to the select */
      var newBtn = document.createElement('button');
      newBtn.type = 'button';
      newBtn.className = 'reset-btn';
      newBtn.setAttribute('data-i18n', 'btn.new');
      newBtn.textContent = t('btn.new');
      newBtn.title = 'Create a new scenario';
      newBtn.addEventListener('click', function () { openScenarioEditor('new'); });

      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'reset-btn';
      editBtn.setAttribute('data-i18n', 'btn.edit');
      editBtn.textContent = t('btn.edit');
      editBtn.title = 'Edit the selected scenario';
      editBtn.disabled = true;
      editBtn.addEventListener('click', function () { openScenarioEditor('edit'); });

      var cmpBtn = document.createElement('button');
      cmpBtn.type = 'button';
      cmpBtn.className = 'reset-btn';
      cmpBtn.setAttribute('data-i18n', 'btn.compare');
      cmpBtn.textContent = t('btn.compare');
      cmpBtn.title = 'Compare two scenarios side by side';
      cmpBtn.addEventListener('click', openCompare);

      var icsBtn = document.createElement('button');
      icsBtn.type = 'button';
      icsBtn.className = 'reset-btn';
      icsBtn.setAttribute('data-i18n', 'btn.ics');
      icsBtn.textContent = t('btn.ics');
      icsBtn.title = 'Generate ICS 201 / 202 / 203 forms from exercise data';
      icsBtn.addEventListener('click', openIcsForms);

      var actions = document.createElement('span');
      actions.className = 'scenario-actions';
      actions.appendChild(newBtn);
      actions.appendChild(editBtn);
      actions.appendChild(cmpBtn);
      actions.appendChild(icsBtn);
      scenarioSelect.insertAdjacentElement('afterend', actions);
    }

    /* ---------- Scenario comparison (side-by-side) ---------- */
    function openCompare() {
      var existing = document.getElementById('compareOverlay');
      if (existing) { existing.remove(); return; }

      var all = getAllScenarios();
      if (all.length < 2) { alert('Need at least two scenarios to compare.'); return; }

      var opts = function (sel) {
        return all.map(function (s, i) {
          return '<option value="' + s.id + '"' + (s.id === sel ? ' selected' : '') + '>' + s.name + '</option>';
        }).join('');
      };

      var pre1 = scenarioSelect.value || all[0].id;
      var pre2 = (all[1] && all[1].id !== pre1) ? all[1].id : (all.find(function (s) { return s.id !== pre1; }) || all[0]).id;

      var html = '<div class="scenario-editor" role="dialog" aria-modal="true" aria-label="Scenario comparison">';
      html += '<div class="se-head"><h3>Scenario Comparison</h3>';
      html += '<button class="reset-btn" type="button" id="cmpClose" aria-label="Close">✕</button></div>';
      html += '<div class="cmp-selectors">';
      html += '<select class="se-input" id="cmpA">' + opts(pre1) + '</select>';
      html += '<span class="cmp-vs">vs</span>';
      html += '<select class="se-input" id="cmpB">' + opts(pre2) + '</select>';
      html += '</div>';
      html += '<div id="cmpBody"></div></div>';

      var ov = document.createElement('div');
      ov.id = 'compareOverlay';
      ov.className = 'scenario-editor-overlay';
      ov.innerHTML = html;
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
      document.body.appendChild(ov);

      document.getElementById('cmpClose').addEventListener('click', function () { ov.remove(); });
      document.getElementById('cmpA').addEventListener('change', renderCompare);
      document.getElementById('cmpB').addEventListener('change', renderCompare);

      function renderCompare() {
        var a = findScenario(document.getElementById('cmpA').value);
        var b = findScenario(document.getElementById('cmpB').value);
        var body = document.getElementById('cmpBody');
        if (!a || !b) { body.innerHTML = ''; return; }

        var rows = [
          ['Aircraft', function (s) { return s.aircraft || 'N/A'; }, null],
          ['Souls on Board', function (s) { return s.soulsOnBoard || 0; }, 'num'],
          ['Fuel Load', function (s) { return s.fuelLoad || 'N/A'; }, null],
          ['Fire Involved', function (s) { return s.fireInvolved ? 'Yes' : 'No'; }, null],
          ['Red (Immediate)', function (s) { return (s.casualties && s.casualties.red) || 0; }, 'num'],
          ['Yellow (Delayed)', function (s) { return (s.casualties && s.casualties.yellow) || 0; }, 'num'],
          ['Green (Minor)', function (s) { return (s.casualties && s.casualties.green) || 0; }, 'num'],
          ['Deceased', function (s) { return (s.casualties && s.casualties.deceased) || 0; }, 'num'],
          ['Total Casualties', function (s) {
            var c = s.casualties || {};
            return (c.red || 0) + (c.yellow || 0) + (c.green || 0) + (c.deceased || 0);
          }, 'num'],
          ['ARFF Vehicles', function (s) { return (s.resources && s.resources.arff) || 0; }, 'num'],
          ['Ambulances', function (s) { return (s.resources && s.resources.ambulances) || 0; }, 'num'],
          ['Fire Trucks', function (s) { return (s.resources && s.resources.fireTrucks) || 0; }, 'num'],
          ['Buses', function (s) { return (s.resources && s.resources.buses) || 0; }, 'num'],
          ['Exercise Injects', function (s) { return (s.injects || []).length; }, 'num']
        ];

        var h = '<table class="cmp-table"><thead><tr>';
        h += '<th>' + a.name + '</th><th class="cmp-metric">Metric</th><th>' + b.name + '</th>';
        h += '</tr></thead><tbody>';
        rows.forEach(function (row) {
          var va = row[1](a), vb = row[1](b);
          var ca = '', cb = '';
          if (row[2] === 'num' && typeof va === 'number' && va !== vb) {
            if (va > vb) ca = ' cmp-win'; else cb = ' cmp-win';
          }
          h += '<tr><td class="cmp-val' + ca + '">' + va + '</td>';
          h += '<td class="cmp-metric">' + row[0] + '</td>';
          h += '<td class="cmp-val' + cb + '">' + vb + '</td></tr>';
        });
        h += '</tbody></table>';
        body.innerHTML = h;
      }

      renderCompare();
    }

    /* ---------- ICS Form generator (201 / 202 / 203) ---------- */
    var ICS_NAMES_KEY = 'ttx-ics-names';

    var loadIcsNames = function () {
      try {
        var raw = localStorage.getItem(ICS_NAMES_KEY);
        var obj = raw ? JSON.parse(raw) : {};
        return (obj && typeof obj === 'object') ? obj : {};
      } catch (e) { return {}; }
    };
    var saveIcsNames = function (obj) {
      try { localStorage.setItem(ICS_NAMES_KEY, JSON.stringify(obj)); } catch (e) {}
    };

    var icsEscape = function (s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    function openIcsForms() {
      var existing = document.getElementById('icsOverlay');
      if (existing) { existing.remove(); return; }

      var html = '<div class="scenario-editor ics-editor" role="dialog" aria-modal="true" aria-label="ICS form generator">';
      html += '<div class="se-head"><h3>ICS Form Generator</h3>';
      html += '<button class="reset-btn" type="button" id="icsClose" aria-label="Close">✕</button></div>';
      html += '<div class="ics-tabs">';
      html += '<button class="reset-btn ics-tab active" type="button" data-form="201">ICS 201 — Briefing</button>';
      html += '<button class="reset-btn ics-tab" type="button" data-form="202">ICS 202 — Objectives</button>';
      html += '<button class="reset-btn ics-tab" type="button" data-form="203">ICS 203 — Assignments</button>';
      html += '</div>';
      html += '<div id="icsBody"></div>';
      html += '<div class="se-actions">';
      html += '<button class="reset-btn" type="button" id="icsPrint">🖨 Print Form</button>';
      html += '<span class="se-spacer"></span>';
      html += '<button class="reset-btn" type="button" id="icsDone">Close</button>';
      html += '</div></div>';

      var ov = document.createElement('div');
      ov.id = 'icsOverlay';
      ov.className = 'scenario-editor-overlay';
      ov.innerHTML = html;
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
      document.body.appendChild(ov);

      var currentForm = '201';

      var getScenario = function () {
        var sel = document.getElementById('scenarioSelect');
        return (sel && sel.value) ? findScenario(sel.value) : null;
      };

      var getChecklistState = function () {
        var done = [];
        try {
          var raw = localStorage.getItem('ttx-checklist-state');
          var state = raw ? JSON.parse(raw) : [];
          if (Array.isArray(state)) {
            (TTX_DATA.checklistItems || []).forEach(function (item, i) {
              if (state[i]) done.push(item);
            });
          }
        } catch (e) {}
        return done;
      };

      var getChecklistPending = function () {
        var pending = [];
        try {
          var raw = localStorage.getItem('ttx-checklist-state');
          var state = raw ? JSON.parse(raw) : [];
          if (Array.isArray(state)) {
            (TTX_DATA.checklistItems || []).forEach(function (item, i) {
              if (!state[i]) pending.push(item);
            });
          } else {
            pending = (TTX_DATA.checklistItems || []).slice();
          }
        } catch (e) { pending = (TTX_DATA.checklistItems || []).slice(); }
        return pending;
      };

      var getTimeline = function () {
        try {
          var raw = localStorage.getItem('ttx-timeline-events');
          var arr = raw ? JSON.parse(raw) : [];
          return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
      };

      var names = loadIcsNames();

      var renderForm = function () {
        var body = document.getElementById('icsBody');
        if (!body) return;
        var sc = getScenario();
        var done = getChecklistState();
        var events = getTimeline();
        var now = new Date();
        var dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        var timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        var h = '<div class="ics-form" id="icsFormContent">';

        if (currentForm === '201') {
          h += '<div class="ics-head"><b>ICS 201 — INCIDENT BRIEFING</b><span>Kulhudhuffushi Airport · VRBK/HDK</span></div>';
          h += '<div class="ics-grid">';
          h += '<div class="ics-cell"><label>1. Incident Name</label><div>' + icsEscape(sc ? sc.name : '______________________') + '</div></div>';
          h += '<div class="ics-cell"><label>2. Date / Time Prepared</label><div>' + dateStr + ' · ' + timeStr + '</div></div>';
          h += '<div class="ics-cell"><label>3. Location</label><div>Kulhudhuffushi Island (VRBK), Maldives</div></div>';
          h += '<div class="ics-cell"><label>4. Incident Commander</label><div>' + icsEscape(names.ic || '______________________') + '</div></div>';
          h += '</div>';
          h += '<div class="ics-cell"><label>5. Situation Summary</label><div class="ics-lines">';
          if (sc) {
            h += '<p>' + icsEscape(sc.name) + ' — ' + (sc.aircraft ? icsEscape(sc.aircraft) + ', ' : '') +
              (sc.soulsOnBoard || 0) + ' souls on board' + (sc.fireInvolved ? ', fire involved' : '') + '.</p>';
            var c = sc.casualties || {};
            h += '<p>Casualties: ' + (c.red || 0) + ' red · ' + (c.yellow || 0) + ' yellow · ' +
              (c.green || 0) + ' green · ' + (c.deceased || 0) + ' deceased.</p>';
            var r = sc.resources || {};
            h += '<p>Resources requested: ' + (r.arff || 0) + ' ARFF · ' + (r.ambulances || 0) + ' ambulances · ' +
              (r.fireTrucks || 0) + ' fire trucks · ' + (r.buses || 0) + ' buses.</p>';
          } else {
            h += '<p>No scenario selected — fill in manually.</p>';
          }
          h += '</div></div>';
          h += '<div class="ics-cell"><label>6. Actions Taken / Current Actions</label><div class="ics-lines">';
          if (done.length) {
            done.forEach(function (d) { h += '<p>✓ ' + icsEscape(d) + '</p>'; });
          } else {
            h += '<p>_______________________________________________________</p><p>_______________________________________________________</p>';
          }
          h += '</div></div>';
          h += '<div class="ics-cell"><label>7. Planned Actions / Next Steps</label><div class="ics-lines">';
          var pending = getChecklistPending().slice(0, 5);
          if (pending.length) pending.forEach(function (p) { h += '<p>○ ' + icsEscape(p) + '</p>'; });
          else h += '<p>_______________________________________________________</p>';
          h += '</div></div>';
          h += '<div class="ics-cell"><label>8. Attachments / Remarks</label><div class="ics-lines"><p>_______________________________________________________</p><p>_______________________________________________________</p></div></div>';

        } else if (currentForm === '202') {
          h += '<div class="ics-head"><b>ICS 202 — INCIDENT OBJECTIVES</b><span>Kulhudhuffushi Airport · VRBK/HDK</span></div>';
          h += '<div class="ics-grid">';
          h += '<div class="ics-cell"><label>Incident Name</label><div>' + icsEscape(sc ? sc.name : '______________________') + '</div></div>';
          h += '<div class="ics-cell"><label>Operational Period</label><div>' + dateStr + ' · ' + timeStr + ' onwards</div></div>';
          h += '</div>';
          h += '<div class="ics-cell"><label>Overall Incident Objectives</label><ol class="ics-ol">';
          var objs = [
            'Protect life safety of exercise participants, passengers and airport staff',
            'Establish and maintain Incident Command with clear span of control',
            'Control the hazard — contain fire / spill / security threat within zones',
            'Triage, treat and transport all casualties per contingency plan',
            'Protect airport property, critical infrastructure and the environment',
            'Maintain communication with ATC, airlines, CAA and national emergency services',
            'Manage family reunification and public information through approved channels',
            'Document decisions and timings for the After-Action Report'
          ];
          if (sc && sc.fireInvolved) objs.splice(3, 0, 'Extinguish / isolate fuel fire and prevent spread to parked aircraft or terminal');
          objs.forEach(function (o) { h += '<li>' + icsEscape(o) + '</li>'; });
          h += '</ol></div>';
          h += '<div class="ics-cell"><label>Site / Situation Objectives</label><div class="ics-lines">';
          if (sc && sc.injects && sc.injects.length) {
            sc.injects.forEach(function (inj) { h += '<p>• ' + icsEscape(inj) + '</p>'; });
          } else {
            h += '<p>_______________________________________________________</p><p>_______________________________________________________</p>';
          }
          h += '</div></div>';
          h += '<div class="ics-cell"><label>Safety Message</label><div class="ics-lines"><p>All responders: observe hot / warm / cold zone boundaries, wear PPE as briefed, and report to the Safety Officer before entering the hot zone.</p></div></div>';
          h += '<div class="ics-grid">';
          h += '<div class="ics-cell"><label>Prepared by (Planning)</label><div>' + icsEscape(names.planning || '______________________') + '</div></div>';
          h += '<div class="ics-cell"><label>Approved by (IC)</label><div>' + icsEscape(names.ic || '______________________') + '</div></div>';
          h += '</div>';

        } else {
          h += '<div class="ics-head"><b>ICS 203 — ORGANIZATION ASSIGNMENT LIST</b><span>Kulhudhuffushi Airport · VRBK/HDK</span></div>';
          h += '<div class="ics-cell"><label>Incident Name</label><div>' + icsEscape(sc ? sc.name : '______________________') + '</div></div>';
          h += '<table class="ics-table"><thead><tr><th>Position</th><th>Name</th><th>Contact / Agency</th></tr></thead><tbody>';
          var roles = [
            ['ic', 'Incident Commander'],
            ['safety', 'Safety Officer'],
            ['pio', 'Public Information Officer'],
            ['liaison', 'Liaison Officer'],
            ['ops', 'Operations Section Chief'],
            ['plan', 'Planning Section Chief'],
            ['log', 'Logistics Section Chief'],
            ['fin', 'Finance / Admin Section Chief'],
            ['arff', 'ARFF / Fire & Rescue Lead'],
            ['ems', 'EMS / Triage Lead'],
            ['sec', 'Law Enforcement / Security Lead'],
            ['airside', 'Airside / Operations Lead'],
            ['fac', 'Family Assistance Center Lead']
          ];
          roles.forEach(function (r) {
            h += '<tr><td>' + r[1] + '</td>';
            h += '<td><input class="ics-input" data-ics="' + r[0] + '" value="' + icsEscape(names[r[0]] || '') + '" placeholder="________________"></td>';
            h += '<td><input class="ics-input" data-ics="' + r[0] + '-org" value="' + icsEscape(names[r[0] + '-org'] || '') + '" placeholder="________________"></td></tr>';
          });
          h += '</tbody></table>';
          h += '<p class="ics-note">Names entered here are saved in this browser and reused next time.</p>';
        }

        h += '</div>';
        body.innerHTML = h;

        /* Persist name edits (ICS 203 + commander fields) */
        body.querySelectorAll('.ics-input').forEach(function (inp) {
          inp.addEventListener('input', function () {
            names[inp.getAttribute('data-ics')] = inp.value;
            saveIcsNames(names);
          });
        });
      };

      document.getElementById('icsClose').addEventListener('click', function () { ov.remove(); });
      document.getElementById('icsDone').addEventListener('click', function () { ov.remove(); });
      ov.querySelectorAll('.ics-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          currentForm = tab.getAttribute('data-form');
          ov.querySelectorAll('.ics-tab').forEach(function (t) { t.classList.toggle('active', t === tab); });
          renderForm();
        });
      });
      document.getElementById('icsPrint').addEventListener('click', function () {
        document.body.classList.add('printing-ics');
        window.print();
        setTimeout(function () { document.body.classList.remove('printing-ics'); }, 500);
      });

      renderForm();
    }

    function updateScenarioPanel(scenario) {
      var panel = document.getElementById('scenarioPanel');
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'scenarioPanel';
        panel.style.cssText = 'background:var(--panel);border:1px solid var(--line-soft);border-radius:var(--radius);padding:20px;margin-top:20px;';
        var main = document.querySelector('main.wrap');
        if (main) main.insertBefore(panel, main.firstChild);
      }

      if (!scenario) {
        panel.innerHTML = '<p style="color:var(--muted);margin:0;">' + t('panel.empty') + '</p>';
        return;
      }

      /* Normalize custom/edited scenarios so missing fields never break the panel */
      scenario.casualties = scenario.casualties || {};
      scenario.resources = scenario.resources || {};
      scenario.injects = Array.isArray(scenario.injects) ? scenario.injects : [];
      var n = function (v) { return (v === null || v === undefined || isNaN(v)) ? 0 : v; };
      scenario.casualties.red = n(scenario.casualties.red);
      scenario.casualties.yellow = n(scenario.casualties.yellow);
      scenario.casualties.green = n(scenario.casualties.green);
      scenario.casualties.deceased = n(scenario.casualties.deceased);
      scenario.resources.arff = n(scenario.resources.arff);
      scenario.resources.ambulances = n(scenario.resources.ambulances);
      scenario.resources.fireTrucks = n(scenario.resources.fireTrucks);
      scenario.resources.buses = n(scenario.resources.buses);
      if (scenario.soulsOnBoard === null || scenario.soulsOnBoard === undefined) scenario.soulsOnBoard = 0;
      if (!scenario.fuelLoad) scenario.fuelLoad = 'N/A';

      var html = '<h3 style="margin:0 0 16px;font-size:16px;">' + scenario.name + '</h3>';

      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:16px;">';
      html += '<div class="stat" style="background:#0a1220;border:1px solid var(--line-soft);border-radius:9px;padding:12px;text-align:center;"><span class="num" style="font-size:20px;font-weight:700;color:#fff;">' + scenario.soulsOnBoard + '</span><span class="lbl" style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:4px;">' + t('panel.souls') + '</span></div>';
      html += '<div class="stat" style="background:#0a1220;border:1px solid var(--line-soft);border-radius:9px;padding:12px;text-align:center;"><span class="num" style="font-size:20px;font-weight:700;color:#fff;">' + scenario.fuelLoad + '</span><span class="lbl" style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:4px;">' + t('panel.fuel') + '</span></div>';
      html += '<div class="stat" style="background:#0a1220;border:1px solid var(--line-soft);border-radius:9px;padding:12px;text-align:center;"><span class="num" style="font-size:20px;font-weight:700;color:' + (scenario.fireInvolved ? '#ef4444' : '#22c55e') + ';">' + (scenario.fireInvolved ? 'Yes' : 'No') + '</span><span class="lbl" style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:4px;">' + t('panel.fire') + '</span></div>';
      html += '</div>';

      html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">' + t('panel.casualties') + '</h4>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-bottom:16px;">';
      html += '<div style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:18px;font-weight:700;color:#fca5a5;">' + scenario.casualties.red + '</span><span style="font-size:10px;color:#fca5a5;text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + t('panel.red') + '</span></div>';
      html += '<div style="background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:18px;font-weight:700;color:#fcd34d;">' + scenario.casualties.yellow + '</span><span style="font-size:10px;color:#fcd34d;text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + t('panel.yellow') + '</span></div>';
      html += '<div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:18px;font-weight:700;color:#86efac;">' + scenario.casualties.green + '</span><span style="font-size:10px;color:#86efac;text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + t('panel.green') + '</span></div>';
      html += '<div style="background:rgba(148,163,184,.1);border:1px solid rgba(148,163,184,.3);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:18px;font-weight:700;color:#94a3b8;">' + scenario.casualties.deceased + '</span><span style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + t('panel.deceased') + '</span></div>';
      html += '</div>';

      html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">' + t('panel.resources') + '</h4>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:16px;">';
      html += '<div style="background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:16px;font-weight:700;color:#fff;">' + scenario.resources.arff + '</span><span style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + t('panel.arff') + '</span></div>';
      html += '<div style="background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:16px;font-weight:700;color:#fff;">' + scenario.resources.ambulances + '</span><span style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + t('panel.ambulances') + '</span></div>';
      html += '<div style="background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:16px;font-weight:700;color:#fff;">' + scenario.resources.fireTrucks + '</span><span style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + t('panel.fireTrucks') + '</span></div>';
      html += '<div style="background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:16px;font-weight:700;color:#fff;">' + scenario.resources.buses + '</span><span style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + t('panel.buses') + '</span></div>';
      html += '</div>';

      /* ---- Resource tracker: deployed vs available (persisted per scenario) ---- */
      html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">' + t('rt.title') + ' <span style="font-weight:400;text-transform:none;letter-spacing:0;">' + t('rt.subtitle') + '</span></h4>';
      html += '<div id="resourceTracker" class="rt-grid" data-scenario="' + scenario.id + '"></div>';

      /* ---- Casualty tracker: individual cards with triage + transport ---- */
      html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">' + t('ct.title') + ' <span style="font-weight:400;text-transform:none;letter-spacing:0;">' + t('ct.subtitle') + '</span></h4>';
      html += '<div class="ct-toolbar">';
      html += '<button class="reset-btn" type="button" id="ctAdd" title="Add a casualty card" data-i18n="ct.add">' + t('ct.add') + '</button>';
      html += '<button class="reset-btn" type="button" id="ctSeed" title="Create one card per estimated casualty in the scenario" data-i18n="ct.seed">' + t('ct.seed') + '</button>';
      html += '<button class="reset-btn" type="button" id="ctClear" title="Remove all casualty cards" data-i18n="ct.clear">' + t('ct.clear') + '</button>';
      html += '<span class="ct-tally" id="ctTally"></span>';
      html += '</div>';
      html += '<div id="casualtyTracker" class="ct-grid" data-scenario="' + scenario.id + '"></div>';

      html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">' + t('panel.injects') + '</h4>';
      html += '<ul class="clean" style="margin:0;">';
      scenario.injects.forEach(function (inject) {
        html += '<li style="padding-left:20px;margin-bottom:8px;font-size:13px;color:#c4d3e8;position:relative;"><span style="position:absolute;left:4px;top:8px;width:6px;height:6px;border-radius:2px;background:var(--blue);transform:rotate(45deg);"></span>' + inject + '</li>';
      });
      html += '</ul>';

      panel.innerHTML = html;
      renderResourceTracker(scenario);
      renderCasualtyTracker(scenario);
    }

    /* ---- Casualty tracker logic ---- */
    var CT_KEY = 'ttx-casualties';
    var CT_TRIAGE = ['Red (Immediate)', 'Yellow (Delayed)', 'Green (Minor)', 'Deceased'];
    var CT_TRANSPORT = ['Awaiting transport', 'Loaded', 'En route', 'Arrived at hospital', 'Deceased'];

    var loadCasualties = function (scenarioId) {
      try {
        var all = JSON.parse(localStorage.getItem(CT_KEY) || '{}');
        var arr = all[scenarioId];
        return Array.isArray(arr) ? arr : [];
      } catch (e) { return []; }
    };

    var saveCasualties = function (scenarioId, arr) {
      try {
        var all = JSON.parse(localStorage.getItem(CT_KEY) || '{}');
        all[scenarioId] = arr;
        localStorage.setItem(CT_KEY, JSON.stringify(all));
      } catch (e) {}
    };

    var newCasualty = function (seq, triage) {
      return {
        id: 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        ref: seq,
        triage: triage || 'Red (Immediate)',
        transport: 'Awaiting transport',
        note: ''
      };
    };

    function renderCasualtyTracker(scenario) {
      var wrap = document.getElementById('casualtyTracker');
      if (!wrap || !scenario) return;

      var casualties = loadCasualties(scenario.id);

      var addBtn = document.getElementById('ctAdd');
      var seedBtn = document.getElementById('ctSeed');
      var clearBtn = document.getElementById('ctClear');
      var tally = document.getElementById('ctTally');

      var rebindToolbar = function () {
        if (addBtn) addBtn.onclick = function () {
          var arr = loadCasualties(scenario.id);
          arr.push(newCasualty(arr.length + 1, 'Red (Immediate)'));
          saveCasualties(scenario.id, arr);
          renderCasualtyTracker(scenario);
        };
        if (seedBtn) seedBtn.onclick = function () {
          var arr = loadCasualties(scenario.id);
          if (arr.length && !confirm('Add estimated casualties to the existing ' + arr.length + ' card(s)?')) return;
          var c = scenario.casualties || {};
          var plan = [
            ['Red (Immediate)', c.red || 0],
            ['Yellow (Delayed)', c.yellow || 0],
            ['Green (Minor)', c.green || 0],
            ['Deceased', c.deceased || 0]
          ];
          plan.forEach(function (p) {
            for (var i = 0; i < p[1]; i++) arr.push(newCasualty(arr.length + 1, p[0]));
          });
          saveCasualties(scenario.id, arr);
          renderCasualtyTracker(scenario);
        };
        if (clearBtn) clearBtn.onclick = function () {
          if (!casualties.length) return;
          if (!confirm('Remove all ' + casualties.length + ' casualty cards?')) return;
          saveCasualties(scenario.id, []);
          renderCasualtyTracker(scenario);
        };
      };
      rebindToolbar();

      /* Tally line */
      if (tally) {
        if (!casualties.length) {
          tally.textContent = t('ct.noCards');
        } else {
          var counts = {};
          casualties.forEach(function (c) { counts[c.triage] = (counts[c.triage] || 0) + 1; });
          var transported = casualties.filter(function (c) { return c.transport !== 'Awaiting transport'; }).length;
          tally.textContent = casualties.length + ' casualties · ' +
            (counts['Red (Immediate)'] || 0) + ' red · ' +
            (counts['Yellow (Delayed)'] || 0) + ' yellow · ' +
            (counts['Green (Minor)'] || 0) + ' green · ' +
            (counts['Deceased'] || 0) + ' deceased · ' +
            transported + ' moved';
        }
      }

      if (!casualties.length) {
        wrap.innerHTML = '<div class="ct-empty">' + t('ct.empty') + '</div>';
        return;
      }

      var h = '';
      casualties.forEach(function (c, idx) {
        var triageCls = 'ct-red';
        if (c.triage === 'Yellow (Delayed)') triageCls = 'ct-yellow';
        else if (c.triage === 'Green (Minor)') triageCls = 'ct-green';
        else if (c.triage === 'Deceased') triageCls = 'ct-dead';

        h += '<div class="ct-card ' + triageCls + '" data-ct="' + c.id + '">';
        h += '<div class="ct-head"><span class="ct-ref">C-' + (idx + 1) + '</span>';
        h += '<button class="ct-del" type="button" title="Remove this casualty" aria-label="Remove casualty C-' + (idx + 1) + '">×</button></div>';
        h += '<label class="ct-lbl">' + t('ct.triage') + '</label>';
        h += '<select class="ct-sel ct-triage" aria-label="Triage status for C-' + (idx + 1) + '">';
        CT_TRIAGE.forEach(function (t) {
          h += '<option' + (t === c.triage ? ' selected' : '') + '>' + t + '</option>';
        });
        h += '</select>';
        h += '<label class="ct-lbl">' + t('ct.transport') + '</label>';
        h += '<select class="ct-sel ct-transport" aria-label="Transport status for C-' + (idx + 1) + '">';
        CT_TRANSPORT.forEach(function (t) {
          h += '<option' + (t === c.transport ? ' selected' : '') + '>' + t + '</option>';
        });
        h += '</select>';
        h += '<input class="ct-note" type="text" placeholder="Notes (injuries, destination…)" value="" aria-label="Notes for C-' + (idx + 1) + '">';
        h += '</div>';
      });
      wrap.innerHTML = h;

      /* Fix the note value attribute (needs escaped value) */
      casualties.forEach(function (c, idx) {
        var card = wrap.children[idx];
        if (card) card.querySelector('.ct-note').value = c.note || '';
      });

      wrap.querySelectorAll('.ct-card').forEach(function (card) {
        var cid = card.getAttribute('data-ct');
        var update = function (patch) {
          var arr = loadCasualties(scenario.id);
          var target = arr.find(function (x) { return x.id === cid; });
          if (!target) return;
          Object.assign(target, patch);
          saveCasualties(scenario.id, arr);
        };

        var triSel = card.querySelector('.ct-triage');
        triSel.addEventListener('change', function () {
          update({ triage: triSel.value });
          renderCasualtyTracker(scenario);
        });

        card.querySelector('.ct-transport').addEventListener('change', function (e) {
          update({ transport: e.target.value });
        });

        card.querySelector('.ct-note').addEventListener('input', function (e) {
          update({ note: e.target.value });
        });

        card.querySelector('.ct-del').addEventListener('click', function () {
          var arr = loadCasualties(scenario.id).filter(function (x) { return x.id !== cid; });
          saveCasualties(scenario.id, arr);
          renderCasualtyTracker(scenario);
        });
      });
    }

    /* ---- Resource tracker logic ---- */
    var RT_KEY = 'ttx-resource-deployed';

    var loadDeployed = function (scenarioId) {
      try {
        var all = JSON.parse(localStorage.getItem(RT_KEY) || '{}');
        var d = all[scenarioId];
        return (d && typeof d === 'object') ? d : {};
      } catch (e) { return {}; }
    };

    var saveDeployed = function (scenarioId, obj) {
      try {
        var all = JSON.parse(localStorage.getItem(RT_KEY) || '{}');
        all[scenarioId] = obj;
        localStorage.setItem(RT_KEY, JSON.stringify(all));
      } catch (e) {}
    };

    var RT_TYPES = [
      { key: 'arff',        labelKey: 'panel.arff' },
      { key: 'ambulances',  labelKey: 'panel.ambulances' },
      { key: 'fireTrucks',  labelKey: 'panel.fireTrucks' },
      { key: 'buses',       labelKey: 'panel.buses' }
    ];

    function renderResourceTracker(scenario) {
      var wrap = document.getElementById('resourceTracker');
      if (!wrap || !scenario) return;

      var required = scenario.resources || {};
      var deployed = loadDeployed(scenario.id);

      var h = '';
      RT_TYPES.forEach(function (rt) {
        var lbl = t(rt.labelKey);
        var need = Number(required[rt.key]) || 0;
        var have = Math.min(Number(deployed[rt.key]) || 0, need);
        var pct = need === 0 ? 100 : Math.round((have / need) * 100);
        var statusCls = need === 0 ? 'rt-ok' : (have >= need ? 'rt-ok' : (have > 0 ? 'rt-part' : 'rt-none'));

        h += '<div class="rt-item">';
        h += '<div class="rt-label">' + lbl + '</div>';
        h += '<div class="rt-controls">';
        h += '<button class="rt-btn" type="button" data-rt="' + rt.key + '" data-dir="-1" aria-label="One fewer ' + lbl + '"' + (have <= 0 ? ' disabled' : '') + '>−</button>';
        h += '<span class="rt-count ' + statusCls + '">' + have + ' / ' + need + '</span>';
        h += '<button class="rt-btn" type="button" data-rt="' + rt.key + '" data-dir="1" aria-label="One more ' + lbl + '"' + (have >= need ? ' disabled' : '') + '>+</button>';
        h += '</div>';
        h += '<div class="rt-bar"><div class="rt-fill ' + statusCls + '" style="width:' + pct + '%"></div></div>';
        h += '<div class="rt-status">' + (need === 0 ? t('rt.notRequired') : (have >= need ? t('rt.allDeployed') : (need - have) + ' ' + t('rt.available'))) + '</div>';
        h += '</div>';
      });

      /* Overall summary line */
      var totalNeed = 0, totalHave = 0;
      RT_TYPES.forEach(function (rt) {
        totalNeed += Number(required[rt.key]) || 0;
        totalHave += Math.min(Number(deployed[rt.key]) || 0, Number(required[rt.key]) || 0);
      });
      h += '<div class="rt-summary' + (totalNeed > 0 && totalHave >= totalNeed ? ' rt-ok' : '') + '">' +
        totalHave + ' ' + t('rt.of') + ' ' + totalNeed + ' ' + t('rt.summary') +
        (totalNeed > 0 && totalHave >= totalNeed ? ' ' + t('rt.summaryDone') : '') + '</div>';

      wrap.innerHTML = h;

      wrap.querySelectorAll('.rt-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.getAttribute('data-rt');
          var dir = Number(btn.getAttribute('data-dir'));
          var cur = loadDeployed(scenario.id);
          var need = Number(scenario.resources[key]) || 0;
          var next = Math.max(0, Math.min(need, (Number(cur[key]) || 0) + dir));
          cur[key] = next;
          saveDeployed(scenario.id, cur);
          renderResourceTracker(scenario);
        });
      });
    }

    /* ================= TIMELINE / INJECT TRACKER ================= */
    var TIMELINE_STORAGE_KEY = 'ttx-timeline-events';

    var timelineEvents = [];

    var loadTimeline = function () {
      try {
        var raw = localStorage.getItem(TIMELINE_STORAGE_KEY);
        if (!raw) return;
        var events = JSON.parse(raw);
        if (Array.isArray(events)) {
          timelineEvents = events;
        }
      } catch (e) {}
    };

    var saveTimeline = function () {
      try { localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(timelineEvents)); } catch (e) {}
    };

    /* ---- Undo / redo (state snapshots before each mutation) ---- */
    var undoStack = [];
    var redoStack = [];
    var UNDO_LIMIT = 50;

    var snapshotTimeline = function () {
      undoStack.push(JSON.stringify(timelineEvents));
      if (undoStack.length > UNDO_LIMIT) undoStack.shift();
      redoStack = [];
      updateUndoButtons();
    };

    var updateUndoButtons = function () {
      var u = document.getElementById('timelineUndoBtn');
      var r = document.getElementById('timelineRedoBtn');
      if (u) u.disabled = undoStack.length === 0;
      if (r) r.disabled = redoStack.length === 0;
    };

    var undoTimeline = function () {
      if (!undoStack.length) return;
      redoStack.push(JSON.stringify(timelineEvents));
      timelineEvents = JSON.parse(undoStack.pop());
      saveTimeline();
      renderTimeline();
      updateUndoButtons();
    };

    var redoTimeline = function () {
      if (!redoStack.length) return;
      undoStack.push(JSON.stringify(timelineEvents));
      timelineEvents = JSON.parse(redoStack.pop());
      saveTimeline();
      renderTimeline();
      updateUndoButtons();
    };

    window.undoTimeline = undoTimeline;
    window.redoTimeline = redoTimeline;

    var clearTimeline = function () {
      if (timelineEvents.length === 0) return;
      snapshotTimeline();
      timelineEvents = [];
      try { localStorage.removeItem(TIMELINE_STORAGE_KEY); } catch (e) {}
      renderTimeline();
      updateUndoButtons();
    };

    var addTimelineEvent = function (time, text, category) {
      snapshotTimeline();
      timelineEvents.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        time: time,
        text: text,
        category: category || 'info',
        timestamp: new Date().toISOString()
      });
      saveTimeline();
      renderTimeline();
      updateUndoButtons();
    };

    var deleteTimelineEvent = function (id) {
      snapshotTimeline();
      timelineEvents = timelineEvents.filter(function (e) { return e.id !== id; });
      saveTimeline();
      renderTimeline();
      updateUndoButtons();
    };

    var renderTimeline = function () {
      var container = document.getElementById('timelineContainer');
      if (!container) return;

      if (timelineEvents.length === 0) {
        container.innerHTML = '<p style="color:var(--muted);margin:0;font-size:13px;">' + t('tl.empty') + '</p>';
        return;
      }

      var html = '';
      timelineEvents.forEach(function (evt) {
        var catColor = '#3b82f6';
        if (evt.category === 'inject') catColor = '#a855f7';
        else if (evt.category === 'decision') catColor = '#22c55e';
        else if (evt.category === 'milestone') catColor = '#f59e0b';
        else if (evt.category === 'casualty') catColor = '#ef4444';

        html += '<div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--line-soft);">';
        html += '<div style="flex:0 0 60px;font-size:12px;font-weight:700;color:' + catColor + ';font-variant-numeric:tabular-nums;">' + evt.time + '</div>';
        html += '<div style="flex:1;font-size:13px;color:#c4d3e8;">' + evt.text + '</div>';
        html += '<button class="reset-btn" style="flex:0 0 auto;padding:2px 8px;font-size:11px;" onclick="deleteTimelineEvent(\'' + evt.id + '\')">×</button>';
        html += '</div>';
      });

      container.innerHTML = html;
    };

    /* Expose delete function globally for inline onclick */
    window.deleteTimelineEvent = deleteTimelineEvent;

    /* Build timeline UI */
    var timelineSection = document.createElement('div');
    timelineSection.id = 'timelineSection';
    timelineSection.style.cssText = 'background:var(--panel);border:1px solid var(--line-soft);border-radius:var(--radius);padding:20px;margin-top:20px;';

    var timelineHTML = '<h3 style="margin:0 0 16px;font-size:16px;" data-i18n="tl.title">' + t('tl.title') + '</h3>';

    timelineHTML += '<div class="tl-form" style="display:grid;grid-template-columns:100px 1fr 120px auto;gap:8px;margin-bottom:16px;align-items:end;">';
    timelineHTML += '<div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;" data-i18n="tl.time">' + t('tl.time') + '</label><input id="timelineTime" type="text" placeholder="09:30" style="width:100%;background:#0a1220;border:1px solid var(--line-soft);border-radius:6px;padding:6px 10px;color:var(--text);font:inherit;font-size:13px;"></div>';
    timelineHTML += '<div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;" data-i18n="tl.text">' + t('tl.text') + '</label><input id="timelineText" type="text" placeholder="Describe the event..." style="width:100%;background:#0a1220;border:1px solid var(--line-soft);border-radius:6px;padding:6px 10px;color:var(--text);font:inherit;font-size:13px;"></div>';
    timelineHTML += '<div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;" data-i18n="tl.category">' + t('tl.category') + '</label><select id="timelineCategory" style="width:100%;background:#0a1220;border:1px solid var(--line-soft);border-radius:6px;padding:6px 10px;color:var(--text);font:inherit;font-size:13px;"><option value="info" data-i18n="tl.cat.info">' + t('tl.cat.info') + '</option><option value="inject" data-i18n="tl.cat.inject">' + t('tl.cat.inject') + '</option><option value="decision" data-i18n="tl.cat.decision">' + t('tl.cat.decision') + '</option><option value="milestone" data-i18n="tl.cat.milestone">' + t('tl.cat.milestone') + '</option><option value="casualty" data-i18n="tl.cat.casualty">' + t('tl.cat.casualty') + '</option></select></div>';
    timelineHTML += '<button id="timelineAddBtn" class="reset-btn" style="padding:6px 16px;" data-i18n="tl.add">' + t('tl.add') + '</button>';
    timelineHTML += '</div>';

    timelineHTML += '<div id="timelineContainer" style="max-height:400px;overflow-y:auto;"></div>';

    timelineHTML += '<div class="tl-actions" style="margin-top:12px;display:flex;gap:8px;">';
    timelineHTML += '<button id="timelineUndoBtn" class="reset-btn" type="button" title="Undo last change (Ctrl+Z)" data-i18n="tl.undo" disabled>' + t('tl.undo') + '</button>';
    timelineHTML += '<button id="timelineRedoBtn" class="reset-btn" type="button" title="Redo (Ctrl+Y)" data-i18n="tl.redo" disabled>' + t('tl.redo') + '</button>';
    timelineHTML += '<button id="timelineClearBtn" class="reset-btn" type="button" data-i18n="tl.clear">' + t('tl.clear') + '</button>';
    timelineHTML += '<button id="timelineExportBtn" class="reset-btn" type="button" data-i18n="tl.export">' + t('tl.export') + '</button>';
    timelineHTML += '</div>';

    timelineSection.innerHTML = timelineHTML;

    var mainWrap = document.querySelector('main.wrap');
    if (mainWrap) mainWrap.insertBefore(timelineSection, mainWrap.firstChild);

    /* Hidden until a scenario is selected */
    timelineSection.style.display = 'none';

    /* Wire up events */
    var timelineTime = document.getElementById('timelineTime');
    var timelineText = document.getElementById('timelineText');
    var timelineCategory = document.getElementById('timelineCategory');
    var timelineAddBtn = document.getElementById('timelineAddBtn');
    var timelineClearBtn = document.getElementById('timelineClearBtn');
    var timelineExportBtn = document.getElementById('timelineExportBtn');

    var handleAdd = function () {
      var time = timelineTime.value.trim() || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      var text = timelineText.value.trim();
      if (!text) { timelineText.focus(); return; }
      addTimelineEvent(time, text, timelineCategory.value);
      timelineText.value = '';
      timelineText.focus();
    };

    if (timelineAddBtn) {
      timelineAddBtn.addEventListener('click', handleAdd);
      timelineText.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
      });
    }

    if (timelineClearBtn) {
      timelineClearBtn.addEventListener('click', function () {
        if (confirm('Clear all timeline events?')) clearTimeline();
      });
    }

    var timelineUndoBtn = document.getElementById('timelineUndoBtn');
    var timelineRedoBtn = document.getElementById('timelineRedoBtn');
    if (timelineUndoBtn) timelineUndoBtn.addEventListener('click', undoTimeline);
    if (timelineRedoBtn) timelineRedoBtn.addEventListener('click', redoTimeline);
    updateUndoButtons();

    if (timelineExportBtn) {
      timelineExportBtn.addEventListener('click', function () {
        if (timelineEvents.length === 0) { alert('No events to export.'); return; }
        var scenarioName = '';
        var scenarioSelect = document.getElementById('scenarioSelect');
        if (scenarioSelect && scenarioSelect.value) {
          var sc = findScenario(scenarioSelect.value);
          if (sc) scenarioName = sc.name;
        }
        var report = 'KULHUDHUFFUSHI AIRPORT — EXERCISE TIMELINE\n';
        report += '==========================================\n';
        if (scenarioName) report += 'Scenario: ' + scenarioName + '\n';
        report += 'Generated: ' + new Date().toLocaleString() + '\n\n';
        timelineEvents.forEach(function (evt) {
          report += '[' + evt.time + '] [' + evt.category.toUpperCase() + '] ' + evt.text + '\n';
        });
        var blob = new Blob([report], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'exercise-timeline-' + new Date().toISOString().slice(0, 10) + '.txt';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    loadTimeline();
    renderTimeline();

    /* ================= AAR EXPORT ================= */
    var aarBtn = document.createElement('button');
    aarBtn.className = 'reset-btn';
    aarBtn.type = 'button';
    aarBtn.textContent = 'Export AAR Summary';
    aarBtn.style.marginTop = '12px';
    aarBtn.addEventListener('click', function () {
      var scenarioName = '';
      var scenarioSelect = document.getElementById('scenarioSelect');
      if (scenarioSelect && scenarioSelect.value) {
        var sc = TTX_DATA.scenarios.find(function (s) { return s.id === scenarioSelect.value; });
        if (sc) scenarioName = sc.name;
      }

      var checklistState = [];
      try {
        var raw = localStorage.getItem('ttx-checklist-state');
        if (raw) checklistState = JSON.parse(raw);
      } catch (e) {}

      var report = '';
      report += '============================================================\n';
      report += '  KULHUDHUFFUSHI AIRPORT — AFTER ACTION REPORT SUMMARY\n';
      report += '============================================================\n\n';
      report += 'Generated: ' + new Date().toLocaleString() + '\n';
      if (scenarioName) report += 'Scenario: ' + scenarioName + '\n';
      report += '\n';

      report += '------------------------------------------------------------\n';
      report += 'CHECKLIST STATUS\n';
      report += '------------------------------------------------------------\n';
      var checkedCount = 0;
      TTX_DATA.checklistItems.forEach(function (item, idx) {
        var checked = checklistState[idx] === true;
        if (checked) checkedCount++;
        report += (checked ? '[✓]' : '[ ]') + ' ' + item + '\n';
      });
      report += '\nProgress: ' + checkedCount + ' / ' + TTX_DATA.checklistItems.length + ' completed\n\n';

      report += '------------------------------------------------------------\n';
      report += 'EXERCISE TIMELINE\n';
      report += '------------------------------------------------------------\n';
      if (timelineEvents.length === 0) {
        report += 'No events recorded.\n';
      } else {
        timelineEvents.forEach(function (evt) {
          report += '[' + evt.time + '] [' + evt.category.toUpperCase() + '] ' + evt.text + '\n';
        });
      }
      report += '\n';

      report += '------------------------------------------------------------\n';
      report += 'NOTES\n';
      report += '------------------------------------------------------------\n';
      report += '\n\n\n\n';

      var blob = new Blob([report], { type: 'text/plain' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'AAR-Summary-' + new Date().toISOString().slice(0, 10) + '.txt';
      a.click();
      URL.revokeObjectURL(url);
    });
    timelineSection.appendChild(aarBtn);

    /* ================= LANGUAGE CHANGE → re-render dynamic UI ================= */
    document.addEventListener('ttx:langchange', function () {
      try {
        /* Static tagged elements were already re-translated by toggleLang() */
        if (typeof applyLang === 'function') applyLang();

        /* Scenario select placeholder + options are rebuilt in populateScenarioSelect */
        if (typeof scenarioSelect !== 'undefined' && scenarioSelect && typeof populateScenarioSelect === 'function') {
          var keep = scenarioSelect.value;
          populateScenarioSelect(keep);
        }

        /* Rebuild anything generated from JS strings */
        if (typeof updateScenarioPanel === 'function' && typeof findScenario === 'function' &&
            typeof scenarioSelect !== 'undefined' && scenarioSelect) {
          updateScenarioPanel(findScenario(scenarioSelect.value));
        }
        if (typeof renderTimeline === 'function') renderTimeline();
      } catch (e) {
        if (window.console) console.warn('langchange refresh skipped:', e);
      }
    });

  } catch (err) {
    if (window.console) console.warn('Enhancement script skipped:', err);
  }

})();
