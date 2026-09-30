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

    /* ================= SAVE CHIP + RESTORE POINTS + HISTORY ================= */
    /* Subtle "✓ saved" flash in the scenario row whenever exercise
       state is written to this device. */
    var flashSaved = function (label) {
      var chip = document.getElementById('saveChip');
      if (!chip) return;
      chip.textContent = '✓ ' + (label || 'saved');
      chip.classList.add('on');
      clearTimeout(flashSaved._t);
      flashSaved._t = setTimeout(function () { chip.classList.remove('on'); }, 1800);
    };

    var pickJSON = function (key) {
      try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    };

    /* ---------- Restore points: undo for destructive actions ---------- */
    var SNAPSHOT_KEY = 'ttx-restore-points';
    var SNAPSHOT_MAX = 15;
    var STATE_FIELDS = [
      'ttx-timeline-events', 'ttx-checklist-state', 'ttx-casualties',
      'ttx-resource-deployed', 'ttx-custom-scenarios'
    ];
    var suppressHook = false;

    var collectState = function () {
      var s = {};
      STATE_FIELDS.forEach(function (k) { s[k] = pickJSON(k); });
      return s;
    };

    var pushSnapshot = function (label) {
      var points = pickJSON(SNAPSHOT_KEY);
      if (!Array.isArray(points)) points = [];
      points.push({
        id: Date.now(), timestamp: new Date().toISOString(),
        label: label || 'Manual point', data: collectState()
      });
      if (points.length > SNAPSHOT_MAX) points = points.slice(-SNAPSHOT_MAX);
      try { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(points)); } catch (e) {}
      return true;
    };

    var restoreSnapshot = function (id) {
      var points = pickJSON(SNAPSHOT_KEY);
      if (!Array.isArray(points)) return false;
      var pt = null;
      points.forEach(function (p) { if (p && p.id === id) pt = p; });
      if (!pt || !pt.data) return false;
      pushSnapshot('Auto — before restore');   /* restoring is itself undoable */
      suppressHook = true;
      STATE_FIELDS.forEach(function (k) {
        try {
          var v = pt.data[k];
          if (v === null || v === undefined) localStorage.removeItem(k);
          else localStorage.setItem(k, JSON.stringify(v));
        } catch (e) {}
      });
      suppressHook = false;
      return true;
    };

    /* ---------- Per-scenario audit trail (last 50 changes) ---------- */
    var HISTORY_KEY = 'ttx-version-history';
    var HISTORY_MAX = 50;
    var historyData = {};
    try {
      var hd0 = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
      if (hd0 && typeof hd0 === 'object') historyData = hd0;
    } catch (e) {}

    var addHistoryEntry = function (scenarioId, action, details) {
      if (!historyData[scenarioId]) historyData[scenarioId] = [];
      historyData[scenarioId].push({
        timestamp: new Date().toISOString(), action: action, details: details
      });
      if (historyData[scenarioId].length > HISTORY_MAX) {
        historyData[scenarioId] = historyData[scenarioId].slice(-HISTORY_MAX);
      }
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(historyData)); } catch (e) {}
    };

    /* ---------- Hook state writes: chip flash + audit entry ---------- */
    var STATE_WATCH = {
      'ttx-timeline-events':    'Timeline updated',
      'ttx-checklist-state':    'Checklist updated',
      'ttx-casualties':         'Casualties updated',
      'ttx-resource-deployed':  'Resources updated',
      'ttx-custom-scenarios':   'Scenario library updated',
      'ttx-pin-positions':      'Map pins moved',
      'ttx-crash-zone-positions': 'Crash zone moved',
      'ttx-ics-names':          'ICS names saved'
    };
    var AUDIT_KEYS = {
      'ttx-timeline-events': 1, 'ttx-checklist-state': 1, 'ttx-casualties': 1,
      'ttx-resource-deployed': 1, 'ttx-custom-scenarios': 1
    };

    var summarizeState = function (key) {
      try {
        if (key === 'ttx-timeline-events') {
          var t = pickJSON(key) || [];
          return t.length + ' event' + (t.length === 1 ? '' : 's');
        }
        if (key === 'ttx-checklist-state') {
          var c = pickJSON(key) || [];
          var done = c.filter(function (x) { return !!x; }).length;
          return done + '/' + c.length + ' checked';
        }
        if (key === 'ttx-casualties') {
          var ca = pickJSON(key) || {}; var n = 0;
          Object.keys(ca).forEach(function (s) { if (Array.isArray(ca[s])) n += ca[s].length; });
          return n + ' card' + (n === 1 ? '' : 's');
        }
        if (key === 'ttx-resource-deployed') {
          var re = pickJSON(key) || {}; var d = 0;
          Object.keys(re).forEach(function (s) {
            var o = re[s];
            if (o && typeof o === 'object') {
              Object.keys(o).forEach(function (t2) { d += Number(o[t2]) || 0; });
            }
          });
          return d + ' units deployed';
        }
        if (key === 'ttx-custom-scenarios') {
          var sc = pickJSON(key) || [];
          return sc.length + ' custom scenario' + (sc.length === 1 ? '' : 's');
        }
      } catch (e) {}
      return '';
    };

    var currentScenarioId = function () {
      try {
        var sel = document.getElementById('scenarioSelect');
        if (sel && sel.value) return sel.value;
      } catch (e) {}
      return 'general';
    };

    /* Only arm after real user input so start-up writes never flash */
    var hookArmed = false;
    var armHook = function () { hookArmed = true; };
    document.addEventListener('pointerdown', armHook, { once: true, capture: true });
    document.addEventListener('keydown', armHook, { once: true, capture: true });

    var pendingKey = null, pendingTimer = null;
    var flushPending = function () {
      var key = pendingKey; pendingKey = null;
      if (!key || suppressHook) return;
      var label = STATE_WATCH[key];
      if (!label || !AUDIT_KEYS[key]) return;
      var sum = summarizeState(key);
      addHistoryEntry(currentScenarioId(), 'updated', label + (sum ? ' — ' + sum : ''));
    };

    var origSetItem = localStorage.setItem;
    localStorage.setItem = function (k, v) {
      origSetItem.call(localStorage, k, v);
      try {
        if (!hookArmed || suppressHook) return;
        var label = STATE_WATCH[k];
        if (!label) return;
        flashSaved('saved');
        if (k === 'ttx-custom-scenarios') updateDockCount();
        if (AUDIT_KEYS[k]) {
          pendingKey = k;
          clearTimeout(pendingTimer);
          pendingTimer = setTimeout(flushPending, 1200);
        }
      } catch (e) {}
    };

    /* Live scenario count in the bottom dock */
    var updateDockCount = function () {
      var el = document.getElementById('dockScenarioCount');
      if (!el) return;
      var builtIn = (TTX_DATA.scenarios || []);
      var ids = {};
      builtIn.forEach(function (s) { ids[s.id] = 1; });
      var custom = pickJSON('ttx-custom-scenarios');
      if (!Array.isArray(custom)) custom = [];
      var extra = custom.filter(function (c) { return c && !ids[c.id]; }).length;
      var total = builtIn.length + extra;
      el.textContent = total + ' scenario' + (total === 1 ? '' : 's');
    };
    updateDockCount();

    /* ---------- History modal: restore points + audit trail ---------- */
    var historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
      historyBtn.addEventListener('click', function () {
        var existing = document.getElementById('historyOverlay');
        if (existing) { existing.remove(); return; }

        var ov = document.createElement('div');
        ov.id = 'historyOverlay';
        ov.className = 'se-overlay';
        var html = '<div class="se-modal" style="max-width:680px;max-height:84vh;overflow-y:auto;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">';
        html += '<h3 style="margin:0;font-size:16px;">📜 History &amp; Restore Points</h3>';
        html += '<button class="reset-btn" type="button" id="histClose" style="padding:5px 12px;">✕ Close</button></div>';

        /* Restore points */
        var points = pickJSON(SNAPSHOT_KEY);
        if (!Array.isArray(points)) points = [];
        if (points.length === 0) {
          html += '<p style="color:var(--muted);margin:0 0 6px;font-size:12.5px;">No restore points yet. One is created automatically before every clear, reset, delete or import — the last 15 are kept here.</p>';
        } else {
          html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">Restore points</h4>';
          html += '<div style="display:flex;flex-direction:column;gap:8px;">';
          points.slice().reverse().forEach(function (pt) {
            var date = new Date(pt.timestamp);
            var d = pt.data || {};
            var counts = [];
            if (Array.isArray(d['ttx-timeline-events'])) counts.push(d['ttx-timeline-events'].length + ' timeline');
            if (Array.isArray(d['ttx-casualties']) || (d['ttx-casualties'] && typeof d['ttx-casualties'] === 'object')) {
              var cn = 0; var cObj = d['ttx-casualties'];
              if (Array.isArray(cObj)) cn = cObj.length;
              else Object.keys(cObj).forEach(function (s) { if (Array.isArray(cObj[s])) cn += cObj[s].length; });
              counts.push(cn + ' casualties');
            }
            if (Array.isArray(d['ttx-checklist-state'])) {
              counts.push(d['ttx-checklist-state'].filter(function (x) { return !!x; }).length + '/' + d['ttx-checklist-state'].length + ' ticks');
            }
            html += '<div style="padding:12px;background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">';
            html += '<div style="min-width:0;">';
            html += '<div style="font-size:12px;color:var(--muted);">' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + (counts.length ? ' · ' + counts.join(' · ') : '') + '</div>';
            html += '</div>';
            html += '<button class="reset-btn" type="button" style="padding:5px 14px;font-size:12px;" data-restore-id="' + pt.id + '">↶ Restore</button>';
            html += '</div>';
          });
          html += '</div>';
          html += '<p style="font-size:12px;color:var(--muted);margin:10px 0 0;">Restoring replaces the current timeline, checklist, casualties, resources and custom scenarios. Your present state is saved as a restore point first, so you can switch back.</p>';
        }

        /* Audit trail */
        html += '<h4 style="margin:20px 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">Change history</h4>';
        html += '<select id="historyScenSel" style="width:100%;background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;padding:8px 12px;color:var(--text);font:inherit;font-size:13px;">';
        html += '<option value="">— Select a scenario —</option>';
        var scenIds = {};
        (typeof getAllScenarios === 'function' ? getAllScenarios() : (TTX_DATA.scenarios || [])).forEach(function (sc) {
          scenIds[sc.id] = sc.name;
          html += '<option value="' + escapeHtml(sc.id) + '">' + escapeHtml(sc.name) + '</option>';
        });
        if (historyData['general'] && historyData['general'].length) {
          html += '<option value="general">General (no scenario)</option>';
        }
        html += '</select>';
        html += '<div id="historyList" style="margin-top:10px;"><p style="color:var(--muted);margin:0;font-size:12.5px;">Select a scenario above to view its history.</p></div>';
        html += '</div>';
        ov.innerHTML = html;
        document.body.appendChild(ov);

        var close = function () { ov.remove(); };
        document.getElementById('histClose').addEventListener('click', close);
        ov.addEventListener('click', function (e) { if (e.target === ov) close(); });

        /* Restore buttons */
        Array.prototype.forEach.call(ov.querySelectorAll('[data-restore-id]'), function (btn) {
          btn.addEventListener('click', function () {
            var id = Number(btn.getAttribute('data-restore-id'));
            if (!confirm('Restore this point? The current timeline, checklist, casualties, resources and custom scenarios will be replaced (your present state is saved as a restore point first).')) return;
            if (restoreSnapshot(id)) {
              flashSaved('restored');
              setTimeout(function () { location.reload(); }, 400);
            } else {
              alert('That restore point could not be found.');
            }
          });
        });

        /* Audit list */
        var scenSel = document.getElementById('historyScenSel');
        var listEl = document.getElementById('historyList');
        var renderList = function (scenarioId) {
          if (!listEl) return;
          if (!scenarioId) {
            listEl.innerHTML = '<p style="color:var(--muted);margin:0;font-size:12.5px;">Select a scenario above to view its history.</p>';
            return;
          }
          var entries = historyData[scenarioId] || [];
          if (!entries.length) {
            listEl.innerHTML = '<p style="color:var(--muted);margin:0;font-size:12.5px;">No history recorded for this scenario.</p>';
            return;
          }
          var h = '<div style="display:flex;flex-direction:column;gap:8px;">';
          entries.slice().reverse().forEach(function (entry) {
            var date = new Date(entry.timestamp);
            var dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            var color = entry.action === 'created' ? 'var(--green)'
                      : entry.action === 'deleted' ? 'var(--red)'
                      : entry.action === 'updated' ? 'var(--blue)'
                      : 'var(--muted)';
            h += '<div style="padding:11px 12px;background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;">';
            h += '<span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:' + color + ';">' + escapeHtml(entry.action) + '</span>';
            h += '<div style="font-size:12px;color:var(--muted);margin-top:2px;">' + dateStr + '</div>';
            if (entry.details) h += '<div style="font-size:12.5px;color:var(--text);margin-top:6px;">' + escapeHtml(entry.details) + '</div>';
            h += '</div>';
          });
          h += '</div>';
          listEl.innerHTML = h;
        };
        if (scenSel) {
          var pre = currentScenarioId();
          if (pre && pre !== 'general' && scenIds[pre]) { scenSel.value = pre; renderList(pre); }
          scenSel.addEventListener('change', function () { renderList(this.value); });
        }
      });
    }

    /* ================= BACKUP / RESTORE (JSON) =================
       Serialises every ttx-* key (except the transient weather
       cache) into one portable JSON file, and restores it back. */
    var BACKUP_KEYS = [
      'ttx-theme', 'ttx-font-scale',
      'ttx-checklist-state', 'ttx-pin-positions', 'ttx-crash-zone-positions',
      'ttx-custom-scenarios', 'ttx-ics-names',
      'ttx-casualties', 'ttx-resource-deployed', 'ttx-timeline-events',
      'ttx-restore-points', 'ttx-version-history', 'ttx-clock', 'ttx-aar-notes'
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
              pushSnapshot('Before backup restore');
              suppressHook = true;
              BACKUP_KEYS.forEach(function (k) {
                if (typeof data[k] === 'string') { localStorage.setItem(k, data[k]); count++; }
              });
              suppressHook = false;
              addHistoryEntry(currentScenarioId(), 'updated', 'Backup restored — ' + count + ' entries');
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
              weatherEl.innerHTML = '<span class="wx-cond">' + "Weather unavailable" + '</span>';
            }
          } catch (e) {
            weatherEl.innerHTML = '<span class="wx-cond">' + "Weather unavailable" + '</span>';
          }
        });
    };

    loadWeather(false);
    /* Refresh when the tab becomes visible again */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) loadWeather(false);
    });

    /* ---------- Weather search modal: any location (Open-Meteo) ---------- */
    var renderWxResult = function (loc, w) {
      var result = document.getElementById('wxSearchResult');
      if (!result || !w || !w.current) return;
      var c = w.current;
      var code = WX_CODES[c.weather_code] || ['🌡', '—'];
      var wind = Math.round(c.wind_speed_10m);
      var dir = windDirLabel(c.wind_direction_10m);
      var temp = Math.round(c.temperature_2m);
      var feels = Math.round(c.apparent_temperature);

      var html = '<div style="text-align:center;padding:18px;background:var(--panel2);border:1px solid var(--line-soft);border-radius:10px;">';
      html += '<div style="font-size:44px;margin-bottom:6px;">' + code[0] + '</div>';
      html += '<div style="font-size:14px;font-weight:600;color:var(--text);">' + escapeHtml(loc.name) + (loc.country ? ', ' + escapeHtml(loc.country) : '') + '</div>';
      html += '<div style="font-size:32px;font-weight:700;color:var(--text);margin:8px 0 2px;">' + temp + '°C</div>';
      html += '<div style="font-size:12px;color:var(--muted);">Feels like ' + feels + '°C · ' + code[1] + '</div>';
      html += '</div>';

      var tile = function (label, value) {
        return '<div style="padding:11px 12px;background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;">' +
          '<div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;">' + label + '</div>' +
          '<div style="font-size:16px;font-weight:600;color:var(--text);margin-top:2px;">' + value + '</div></div>';
      };
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">';
      html += tile('Wind', wind + ' kt ' + dir);
      html += tile('Direction', c.wind_direction_10m + '° ' + dir);
      html += tile('Humidity', Math.round(c.relative_humidity_2m) + '%');
      html += tile('Pressure', Math.round(c.pressure_msl) + ' hPa');
      html += '</div>';

      /* Exercise impact assessment */
      var impacts = [];
      if (wind > 30) impacts.push('⚠ High winds — check smoke drift, helicopter and lifting operations');
      if (temp > 35) impacts.push('⚠ Extreme heat — monitor responders for heat stress');
      if (temp < 5) impacts.push('⚠ Cold conditions — consider hypothermia risk for casualties');
      if (c.weather_code >= 500 && c.weather_code < 600) impacts.push('🌧 Rain may reduce visibility and runway conditions');
      if (c.weather_code >= 200 && c.weather_code < 300) impacts.push('⛈ Thunderstorms — consider lightning safety for outdoor operations');
      if (c.weather_code === 45 || c.weather_code === 48) impacts.push('🌫 Fog — reduced visibility affects rescue vehicle movement');
      if (!impacts.length) impacts.push('✓ Weather conditions are favourable for exercise operations');

      html += '<div style="margin-top:12px;padding:12px;background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.28);border-left:3px solid var(--blue);border-radius:8px;">';
      html += '<div style="font-size:11px;font-weight:600;color:var(--text);margin-bottom:4px;">Exercise Impact Assessment</div>';
      impacts.forEach(function (imp) {
        html += '<div style="font-size:12.5px;color:var(--text);margin-top:4px;">' + imp + '</div>';
      });
      html += '</div>';
      result.innerHTML = html;
    };

    var openWeatherModal = function () {
      var existing = document.getElementById('weatherOverlay');
      if (existing) { existing.remove(); return; }

      var ov = document.createElement('div');
      ov.id = 'weatherOverlay';
      ov.className = 'se-overlay';
      var html = '<div class="se-modal" style="max-width:560px;max-height:84vh;overflow-y:auto;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
      html += '<h3 style="margin:0;font-size:16px;">🌦 Weather anywhere</h3>';
      html += '<button class="reset-btn" type="button" id="wxClose" style="padding:5px 12px;">✕ Close</button></div>';
      html += '<p style="color:var(--muted);font-size:12.5px;margin:0 0 12px;">Current conditions for any airport or city worldwide (Open-Meteo, needs internet). The header widget stays fixed to VRBK / Kulhudhuffushi.</p>';
      html += '<div style="display:flex;gap:8px;">';
      html += '<input class="se-input" id="wxSearchInput" type="search" placeholder="e.g. Kulhudhuffushi, Malé, London…" style="flex:1;min-width:0;" value="Kulhudhuffushi" aria-label="Search location">';
      html += '<button class="reset-btn" type="button" id="wxSearchBtn" style="padding:8px 16px;white-space:nowrap;">Search</button>';
      html += '</div>';
      html += '<div id="wxSearchResult" style="margin-top:14px;" aria-live="polite"></div>';
      html += '</div>';
      ov.innerHTML = html;
      document.body.appendChild(ov);

      var input = document.getElementById('wxSearchInput');
      var result = document.getElementById('wxSearchResult');
      var fetchWx = function () {
        var q = (input.value || '').trim();
        if (!q) { result.innerHTML = '<p style="color:var(--red);margin:0;">Enter a location.</p>'; return; }
        result.innerHTML = '<p style="color:var(--muted);margin:0;">Fetching weather…</p>';
        var geoUrl = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(q) + '&count=1&language=en&format=json';
        fetch(geoUrl)
          .then(function (r) { if (!r.ok) throw new Error('geo ' + r.status); return r.json(); })
          .then(function (g) {
            if (!g.results || !g.results.length) {
              result.innerHTML = '<p style="color:var(--red);margin:0;">Location not found. Try a different city or airport name.</p>';
              return null;
            }
            var loc = g.results[0];
            var wUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + loc.latitude + '&longitude=' + loc.longitude +
              '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl' +
              '&wind_speed_unit=kn&timezone=auto';
            return fetch(wUrl)
              .then(function (r2) { if (!r2.ok) throw new Error('wx ' + r2.status); return r2.json(); })
              .then(function (w) { renderWxResult(loc, w); });
          })
          .catch(function () {
            result.innerHTML = '<p style="color:var(--red);margin:0;">Failed to fetch weather data. Check your internet connection and try again.</p>';
          });
      };

      document.getElementById('wxClose').addEventListener('click', function () { ov.remove(); });
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
      document.getElementById('wxSearchBtn').addEventListener('click', fetchWx);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); fetchWx(); }
      });
      input.focus();
      fetchWx();   /* show the default location straight away */
    };

    if (weatherEl) {
      weatherEl.addEventListener('click', openWeatherModal);
      weatherEl.style.cursor = 'pointer';
      weatherEl.setAttribute('role', 'button');
      weatherEl.setAttribute('tabindex', '0');
      weatherEl.setAttribute('title', 'Current conditions at VRBK — click for weather anywhere');
      weatherEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWeatherModal(); }
      });
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
                 document.getElementById('changelogOverlay') ||
                 document.getElementById('historyOverlay') ||
                 document.getElementById('weatherOverlay') ||
                 document.getElementById('aarOverlay');
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
        pushSnapshot('Before checklist reset');
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
      scenarioSelect.innerHTML = '<option value="">' + "— Select a scenario —" + '</option>';
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
            pushSnapshot('Before scenario delete');
            suppressHook = true;
            saveCustomScenarios(loadCustomScenarios().filter(function (c) { return c.id !== editing.id; }));
            suppressHook = false;
            addHistoryEntry(editing.id, isBuiltin ? 'updated' : 'deleted',
              isBuiltin ? 'Override discarded — built-in restored' : '"' + editing.name + '" deleted');
            flashSaved('saved');
            updateDockCount();
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
        /* Exercise clock follows the scenario */
        if (typeof renderClockPanel === 'function') renderClockPanel();
      });

      /* Action buttons next to the select */
      var newBtn = document.createElement('button');
      newBtn.type = 'button';
      newBtn.className = 'reset-btn';
      newBtn.textContent = "+ New";
      newBtn.title = 'Create a new scenario';
      newBtn.addEventListener('click', function () { openScenarioEditor('new'); });

      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'reset-btn';
      editBtn.textContent = "✎ Edit";
      editBtn.title = 'Edit the selected scenario';
      editBtn.disabled = true;
      editBtn.addEventListener('click', function () { openScenarioEditor('edit'); });

      var cmpBtn = document.createElement('button');
      cmpBtn.type = 'button';
      cmpBtn.className = 'reset-btn';
      cmpBtn.textContent = "⇄ Compare";
      cmpBtn.title = 'Compare two scenarios side by side';
      cmpBtn.addEventListener('click', openCompare);

      var icsBtn = document.createElement('button');
      icsBtn.type = 'button';
      icsBtn.className = 'reset-btn';
      icsBtn.textContent = "📄 ICS Forms";
      icsBtn.title = 'Generate ICS 201–206 and 209 forms from exercise data';
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
      html += '<button class="reset-btn ics-tab" type="button" data-form="204">ICS 204 — Assignment List</button>';
      html += '<button class="reset-btn ics-tab" type="button" data-form="205">ICS 205 — Comms</button>';
      html += '<button class="reset-btn ics-tab" type="button" data-form="206">ICS 206 — Medical</button>';
      html += '<button class="reset-btn ics-tab" type="button" data-form="209">ICS 209 — Summary</button>';
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

      /* Casualty counts for the current scenario (string triage cards) */
      var getCasCounts = function () {
        var counts = { red: 0, yellow: 0, green: 0, deceased: 0, total: 0 };
        try {
          var all = JSON.parse(localStorage.getItem('ttx-casualties') || '{}');
          var sel = document.getElementById('scenarioSelect');
          var arr = (sel && sel.value && Array.isArray(all[sel.value])) ? all[sel.value] : [];
          counts.total = arr.length;
          arr.forEach(function (c) {
            var tri = String(c.triage || '');
            if (tri.indexOf('Red') === 0) counts.red++;
            else if (tri.indexOf('Yellow') === 0) counts.yellow++;
            else if (tri.indexOf('Green') === 0) counts.green++;
            else if (tri.indexOf('Deceased') === 0) counts.deceased++;
          });
        } catch (e) {}
        return counts;
      };

      /* Total resources deployed for the current scenario */
      var getDeployedTotal = function () {
        var n = 0;
        try {
          var all = JSON.parse(localStorage.getItem('ttx-resource-deployed') || '{}');
          var sel = document.getElementById('scenarioSelect');
          var obj = (sel && sel.value && all[sel.value] && typeof all[sel.value] === 'object') ? all[sel.value] : {};
          Object.keys(obj).forEach(function (k) { n += Number(obj[k]) || 0; });
        } catch (e) {}
        return n;
      };

      var names = loadIcsNames();

      var renderForm = function () {
        var body = document.getElementById('icsBody');
        if (!body) return;
        var sc = getScenario();
        var res = (sc && sc.resources) ? sc.resources : {};
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

        } else if (currentForm === '203') {
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

        } else if (currentForm === '204') {
          h += '<div class="ics-head"><b>ICS 204 — ASSIGNMENT LIST</b><span>Kulhudhuffushi Airport · VRBK/HDK</span></div>';
          h += '<div class="ics-grid">';
          h += '<div class="ics-cell"><label>1. Incident Name</label><div>' + icsEscape(sc ? sc.name : 'Airport Emergency Exercise') + '</div></div>';
          h += '<div class="ics-cell"><label>2. Operational Period</label><div>' + dateStr + ' · ongoing</div></div>';
          h += '</div>';
          h += '<table class="ics-table"><thead><tr><th>Group / Unit</th><th>Assignment</th><th>Resources</th><th>Communications</th></tr></thead><tbody>';
          var groups = [
            ['Command', 'Establish ICP, unified command, overall control', 'ICP, command staff', 'Command channel'],
            ['ARFF', 'Extinguish fire, rescue trapped occupants', 'ARFF × ' + (res.arff != null ? res.arff : '____'), 'Fire ground channel'],
            ['EMS / Triage', 'Triage, treatment, transport', 'Ambulances × ' + (res.ambulances != null ? res.ambulances : '____'), 'EMS channel'],
            ['Security / Perimeter', 'Establish cordon, control access', 'Police / security unit', 'Security channel'],
            ['Logistics', 'Staging, resupply, communications', 'Staging area, comms unit', 'Logistics channel'],
            ['Family Assistance', 'Support for families and survivors', 'FAC team', 'FAC channel']
          ];
          groups.forEach(function (g) {
            h += '<tr><td><b>' + icsEscape(g[0]) + '</b></td><td>' + icsEscape(g[1]) + '</td><td>' + icsEscape(g[2]) + '</td><td>' + icsEscape(g[3]) + '</td></tr>';
          });
          h += '</tbody></table>';
          h += '<p class="ics-note">Channels are filled in from your ICS 205 Communications List.</p>';

        } else if (currentForm === '205') {
          h += '<div class="ics-head"><b>ICS 205 — COMMUNICATIONS LIST</b><span>Kulhudhuffushi Airport · VRBK/HDK</span></div>';
          h += '<div class="ics-grid">';
          h += '<div class="ics-cell"><label>1. Incident Name</label><div>' + icsEscape(sc ? sc.name : 'Airport Emergency Exercise') + '</div></div>';
          h += '<div class="ics-cell"><label>2. Radio System</label><div><input class="ics-input" data-ics="radioSystem" value="' + icsEscape(names.radioSystem || '') + '" placeholder="e.g. VHF + TETRA talkgroups"></div></div>';
          h += '</div>';
          h += '<table class="ics-table"><thead><tr><th>Function</th><th>Channel / Talkgroup</th><th>Callsign</th><th>Remarks</th></tr></thead><tbody>';
          var comms = [
            ['Command', 'CMD', 'Unified command net'],
            ['Fire / ARFF', 'FIRE', 'Fire ground operations'],
            ['EMS / Medical', 'EMS', 'Triage and transport'],
            ['Security / Perimeter', 'SEC', 'Cordon control'],
            ['Logistics', 'LOG', 'Staging and resupply'],
            ['Airport Operations', 'AQD', 'Airfield status / redirects'],
            ['ATC / Tower', 'TWR', 'Airfield closure and status']
          ];
          comms.forEach(function (c, i) {
            var key = 'ch-' + c[1];
            h += '<tr><td><b>' + icsEscape(c[0]) + '</b></td>' +
              '<td><input class="ics-input" data-ics="' + key + '" value="' + icsEscape(names[key] || '') + '" placeholder="CH ______"></td>' +
              '<td>' + icsEscape(c[1]) + '</td>' +
              '<td>' + icsEscape(c[2]) + '</td></tr>';
          });
          h += '</tbody></table>';
          h += '<p class="ics-note">Channels entered here are saved in this browser and reused next time.</p>';

        } else if (currentForm === '206') {
          h += '<div class="ics-head"><b>ICS 206 — MEDICAL PLAN</b><span>Kulhudhuffushi Airport · VRBK/HDK</span></div>';
          h += '<div class="ics-grid">';
          h += '<div class="ics-cell"><label>1. Incident Name</label><div>' + icsEscape(sc ? sc.name : 'Airport Emergency Exercise') + '</div></div>';
          h += '<div class="ics-cell"><label>2. Operational Period</label><div>' + dateStr + ' · ongoing</div></div>';
          h += '</div>';
          h += '<table class="ics-table"><thead><tr><th>Resource</th><th>Quantity</th><th>Base / Location</th><th>Notes</th></tr></thead><tbody>';
          var med = [
            ['Ambulances', res.ambulances != null ? String(res.ambulances) : '____', 'Transport to hospital'],
            ['Medical teams', '____', 'On-scene treatment'],
            ['Hospital — primary', '1', 'Receiving hospital'],
            ['Hospital — secondary', '1', 'Backup / overflow']
          ];
          med.forEach(function (m) {
            h += '<tr><td><b>' + icsEscape(m[0]) + '</b></td><td>' + icsEscape(m[1]) + '</td>' +
              '<td><input class="ics-input" data-ics="med-' + icsEscape(m[0].toLowerCase().replace(/[^a-z]+/g, '-')) + '" value="' +
              icsEscape(names['med-' + m[0].toLowerCase().replace(/[^a-z]+/g, '-')] || '') + '" placeholder="________________"></td>' +
              '<td>' + icsEscape(m[2]) + '</td></tr>';
          });
          h += '</tbody></table>';
          var cc = getCasCounts();
          h += '<div class="ics-cell" style="margin-top:12px;"><label>3. Triage summary (tracker)</label><div>' +
            (cc.total
              ? 'Red ' + cc.red + ' · Yellow ' + cc.yellow + ' · Green ' + cc.green + ' · Deceased ' + cc.deceased + ' · <b>Total ' + cc.total + '</b>'
              : 'No casualties recorded yet — add cards in the Casualty Tracker.') +
            '</div></div>';
          h += '<div class="ics-cell"><label>4. Medical direction</label><div class="ics-lines"><p>_______________________________________________________</p><p>_______________________________________________________</p></div></div>';

        } else {
          /* ICS 209 — INCIDENT SUMMARY */
          h += '<div class="ics-head"><b>ICS 209 — INCIDENT SUMMARY</b><span>Kulhudhuffushi Airport · VRBK/HDK</span></div>';
          h += '<div class="ics-grid">';
          h += '<div class="ics-cell"><label>1. Incident Name</label><div>' + icsEscape(sc ? sc.name : 'Airport Emergency Exercise') + '</div></div>';
          h += '<div class="ics-cell"><label>2. Date / Time</label><div>' + dateStr + ' · ' + timeStr + '</div></div>';
          h += '<div class="ics-cell"><label>3. Location</label><div>Kulhudhuffushi Island (VRBK) — crash site</div></div>';
          h += '<div class="ics-cell"><label>4. Reported By</label><div><input class="ics-input" data-ics="reportedBy" value="' + icsEscape(names.reportedBy || '') + '" placeholder="________________"></div></div>';
          h += '</div>';
          h += '<div class="ics-cell"><label>5. Incident Description</label><div class="ics-lines">';
          if (sc) {
            h += '<p>' + icsEscape(sc.name) + (sc.aircraft ? ' — ' + icsEscape(sc.aircraft) : '') +
              (sc.soulsOnBoard ? ', ' + sc.soulsOnBoard + ' souls on board' : '') + '.</p>';
            if (sc.description) h += '<p>' + icsEscape(sc.description) + '</p>';
          } else {
            h += '<p>_______________________________________________________</p>';
          }
          h += '</div></div>';
          var cas9 = getCasCounts();
          var st9 = getChecklistState();
          h += '<div class="ics-grid">';
          h += '<div class="ics-cell"><label>6. Casualties recorded</label><div>' + (cas9.total ? cas9.total + ' total (' + cas9.red + '/' + cas9.yellow + '/' + cas9.green + '/' + cas9.deceased + ')' : '—') + '</div></div>';
          h += '<div class="ics-cell"><label>7. Actions logged</label><div>' + events.length + ' timeline events</div></div>';
          h += '<div class="ics-cell"><label>8. Checklist progress</label><div>' + st9.length + ' / ' + (TTX_DATA.checklistItems || []).length + '</div></div>';
          h += '<div class="ics-cell"><label>9. Resources deployed</label><div>' + getDeployedTotal() + ' units</div></div>';
          h += '</div>';
          h += '<div class="ics-cell"><label>10. Attachments</label><div>✓ ICS 201 · ✓ ICS 202 · ✓ ICS 203 · ✓ ICS 204 · ✓ ICS 205 · ✓ ICS 206 · ✓ Timeline · ✓ After Action Report</div></div>';
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
        panel.innerHTML = '<p style="color:var(--muted);margin:0;">' + "Select a scenario above to see casualty estimates, resource requirements, and exercise injects." + '</p>';
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
      html += '<div class="stat" style="background:#0a1220;border:1px solid var(--line-soft);border-radius:9px;padding:12px;text-align:center;"><span class="num" style="font-size:20px;font-weight:700;color:#fff;">' + scenario.soulsOnBoard + '</span><span class="lbl" style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:4px;">' + "Souls on Board" + '</span></div>';
      html += '<div class="stat" style="background:#0a1220;border:1px solid var(--line-soft);border-radius:9px;padding:12px;text-align:center;"><span class="num" style="font-size:20px;font-weight:700;color:#fff;">' + scenario.fuelLoad + '</span><span class="lbl" style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:4px;">' + "Fuel Load" + '</span></div>';
      html += '<div class="stat" style="background:#0a1220;border:1px solid var(--line-soft);border-radius:9px;padding:12px;text-align:center;"><span class="num" style="font-size:20px;font-weight:700;color:' + (scenario.fireInvolved ? '#ef4444' : '#22c55e') + ';">' + (scenario.fireInvolved ? 'Yes' : 'No') + '</span><span class="lbl" style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:4px;">' + "Fire Involved" + '</span></div>';
      html += '</div>';

      html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">' + "Estimated Casualties" + '</h4>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-bottom:16px;">';
      html += '<div style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:18px;font-weight:700;color:#fca5a5;">' + scenario.casualties.red + '</span><span style="font-size:10px;color:#fca5a5;text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + "Red (Immediate)" + '</span></div>';
      html += '<div style="background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:18px;font-weight:700;color:#fcd34d;">' + scenario.casualties.yellow + '</span><span style="font-size:10px;color:#fcd34d;text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + "Yellow (Delayed)" + '</span></div>';
      html += '<div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:18px;font-weight:700;color:#86efac;">' + scenario.casualties.green + '</span><span style="font-size:10px;color:#86efac;text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + "Green (Minor)" + '</span></div>';
      html += '<div style="background:rgba(148,163,184,.1);border:1px solid rgba(148,163,184,.3);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:18px;font-weight:700;color:#94a3b8;">' + scenario.casualties.deceased + '</span><span style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + "Deceased" + '</span></div>';
      html += '</div>';

      html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">' + "Resource Requirements" + '</h4>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:16px;">';
      html += '<div style="background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:16px;font-weight:700;color:#fff;">' + scenario.resources.arff + '</span><span style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + "ARFF Vehicles" + '</span></div>';
      html += '<div style="background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:16px;font-weight:700;color:#fff;">' + scenario.resources.ambulances + '</span><span style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + "Ambulances" + '</span></div>';
      html += '<div style="background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:16px;font-weight:700;color:#fff;">' + scenario.resources.fireTrucks + '</span><span style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + "Fire Trucks" + '</span></div>';
      html += '<div style="background:var(--panel2);border:1px solid var(--line-soft);border-radius:8px;padding:10px;text-align:center;"><span style="font-size:16px;font-weight:700;color:#fff;">' + scenario.resources.buses + '</span><span style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:2px;">' + "Buses" + '</span></div>';
      html += '</div>';

      /* ---- Resource tracker: deployed vs available (persisted per scenario) ---- */
      html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">' + "Resource Tracker" + ' <span style="font-weight:400;text-transform:none;letter-spacing:0;">' + "— mark units as they arrive on scene" + '</span></h4>';
      html += '<div id="resourceTracker" class="rt-grid" data-scenario="' + scenario.id + '"></div>';

      /* ---- Casualty tracker: individual cards with triage + transport ---- */
      html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">' + "Casualty Tracker" + ' <span style="font-weight:400;text-transform:none;letter-spacing:0;">' + "— per-patient triage & transport status" + '</span></h4>';
      html += '<div class="ct-toolbar">';
      html += '<button class="reset-btn" type="button" id="ctAdd" title="Add a casualty card">' + "+ Add Casualty" + '</button>';
      html += '<button class="reset-btn" type="button" id="ctSeed" title="Create one card per estimated casualty in the scenario">' + "Generate from Estimates" + '</button>';
      html += '<button class="reset-btn" type="button" id="ctClear" title="Remove all casualty cards">' + "Clear" + '</button>';
      html += '<span class="ct-tally" id="ctTally"></span>';
      html += '</div>';
      html += '<div id="casualtyTracker" class="ct-grid" data-scenario="' + scenario.id + '"></div>';

      html += '<h4 style="margin:0 0 10px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">' + "Exercise Injects" + '</h4>';
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
          pushSnapshot('Before casualty clear');
          saveCasualties(scenario.id, []);
          renderCasualtyTracker(scenario);
        };
      };
      rebindToolbar();

      /* Tally line */
      if (tally) {
        if (!casualties.length) {
          tally.textContent = "No casualty cards yet";
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
        wrap.innerHTML = '<div class="ct-empty">' + "No casualty cards. Use <b>+ Add Casualty</b> or <b>Generate from Estimates</b> to start tracking patients." + '</div>';
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
        h += '<label class="ct-lbl">' + "Triage" + '</label>';
        h += '<select class="ct-sel ct-triage" aria-label="Triage status for C-' + (idx + 1) + '">';
        CT_TRIAGE.forEach(function (t) {
          h += '<option' + (t === c.triage ? ' selected' : '') + '>' + t + '</option>';
        });
        h += '</select>';
        h += '<label class="ct-lbl">' + "Transport" + '</label>';
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
      var RT_LABELS = { arff: 'ARFF Vehicles', ambulances: 'Ambulances', fireTrucks: 'Fire Trucks', buses: 'Buses' };
      RT_TYPES.forEach(function (rt) {
        var lbl = RT_LABELS[rt.key] || rt.key;
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
        h += '<div class="rt-status">' + (need === 0 ? "Not required" : (have >= need ? "✓ All deployed" : (need - have) + ' ' + "still available")) + '</div>';
        h += '</div>';
      });

      /* Overall summary line */
      var totalNeed = 0, totalHave = 0;
      RT_TYPES.forEach(function (rt) {
        totalNeed += Number(required[rt.key]) || 0;
        totalHave += Math.min(Number(deployed[rt.key]) || 0, Number(required[rt.key]) || 0);
      });
      h += '<div class="rt-summary' + (totalNeed > 0 && totalHave >= totalNeed ? ' rt-ok' : '') + '">' +
        totalHave + ' ' + "of" + ' ' + totalNeed + ' ' + "units deployed" +
        (totalNeed > 0 && totalHave >= totalNeed ? ' ' + "— resources complete ✓" : '') + '</div>';

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

    var addTimelineEvent = function (time, text, category, tplus) {
      snapshotTimeline();
      timelineEvents.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        time: time,
        text: text,
        category: category || 'info',
        tplus: tplus || null,
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
        container.innerHTML = '<p style="color:var(--muted);margin:0;font-size:13px;">' + "No events logged yet. Use the form above to add injects, decisions, or milestones." + '</p>';
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
        html += '<div style="flex:0 0 60px;font-size:12px;font-weight:700;color:' + catColor + ';font-variant-numeric:tabular-nums;">' + evt.time +
          (evt.tplus ? '<span class="tl-tplus" title="Exercise clock at release">T+ ' + evt.tplus.replace(/^00:/, '') + '</span>' : '') + '</div>';
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

    var timelineHTML = '<h3 style="margin:0 0 16px;font-size:16px;">' + "Exercise Timeline" + '</h3>';

    /* Exercise clock + inject player (hidden until a scenario is chosen) */
    timelineHTML += '<div id="clockMount"></div>';

    timelineHTML += '<div class="tl-form" style="display:grid;grid-template-columns:100px 1fr 120px auto;gap:8px;margin-bottom:16px;align-items:end;">';
    timelineHTML += '<div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">' + "Time" + '</label><input id="timelineTime" type="text" placeholder="09:30" style="width:100%;background:#0a1220;border:1px solid var(--line-soft);border-radius:6px;padding:6px 10px;color:var(--text);font:inherit;font-size:13px;"></div>';
    timelineHTML += '<div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">' + "Event / Inject" + '</label><input id="timelineText" type="text" placeholder="Describe the event..." style="width:100%;background:#0a1220;border:1px solid var(--line-soft);border-radius:6px;padding:6px 10px;color:var(--text);font:inherit;font-size:13px;"></div>';
    timelineHTML += '<div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">' + "Category" + '</label><select id="timelineCategory" style="width:100%;background:#0a1220;border:1px solid var(--line-soft);border-radius:6px;padding:6px 10px;color:var(--text);font:inherit;font-size:13px;"><option value="info">' + "Info" + '</option><option value="inject">' + "Inject" + '</option><option value="decision">' + "Decision" + '</option><option value="milestone">' + "Milestone" + '</option><option value="casualty">' + "Casualty" + '</option></select></div>';
    timelineHTML += '<button id="timelineAddBtn" class="reset-btn" style="padding:6px 16px;">' + "Add" + '</button>';
    timelineHTML += '</div>';

    timelineHTML += '<div id="timelineContainer" style="max-height:400px;overflow-y:auto;"></div>';

    timelineHTML += '<div class="tl-actions" style="margin-top:12px;display:flex;gap:8px;">';
    timelineHTML += '<button id="timelineUndoBtn" class="reset-btn" type="button" title="Undo last change (Ctrl+Z)" disabled>' + "↶ Undo" + '</button>';
    timelineHTML += '<button id="timelineRedoBtn" class="reset-btn" type="button" title="Redo (Ctrl+Y)" disabled>' + "↷ Redo" + '</button>';
    timelineHTML += '<button id="timelineClearBtn" class="reset-btn" type="button">' + "Clear All Events" + '</button>';
    timelineHTML += '<button id="timelineExportBtn" class="reset-btn" type="button">' + "Export for AAR" + '</button>';
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
        if (confirm('Clear all timeline events?')) {
          pushSnapshot('Before timeline clear');
          clearTimeline();
        }
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
          report += '[' + evt.time + ']' + (evt.tplus ? ' [T+' + evt.tplus + ']' : '') + ' [' + evt.category.toUpperCase() + '] ' + evt.text + '\n';
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

    /* ================= AFTER ACTION REPORT (modal) ================= */
    /* Shared print helper: fills #printRoot (shown only in @media print,
       overriding the full-plan print rules) then prints. */
    var printMarkup = function (html) {
      var root = document.getElementById('printRoot');
      if (root) root.innerHTML = html;
      document.body.classList.add('print-markup');
      window.print();
    };
    var clearPrintMarkup = function () {
      document.body.classList.remove('print-markup');
      var root = document.getElementById('printRoot');
      if (root) root.innerHTML = '';
    };
    window.addEventListener('afterprint', clearPrintMarkup);

    var AAR_NOTES_KEY = 'ttx-aar-notes';
    var AAR_RES_TYPES = [
      { key: 'arff', label: 'ARFF Vehicles' },
      { key: 'ambulances', label: 'Ambulances' },
      { key: 'fireTrucks', label: 'Fire Trucks' },
      { key: 'buses', label: 'Buses' }
    ];

    var aarScenario = function () {
      var sel = document.getElementById('scenarioSelect');
      if (sel && sel.value) return findScenario(sel.value);
      return null;
    };

    var collectAarData = function () {
      var scenario = aarScenario();

      var checklistState = pickJSON('ttx-checklist-state') || [];
      var checklist = TTX_DATA.checklistItems.map(function (item, idx) {
        return { text: item, done: checklistState[idx] === true };
      });
      var doneCount = checklist.filter(function (i) { return i.done; }).length;

      /* Resources: required (scenario definition) vs deployed (tracker) */
      var deployedAll = pickJSON('ttx-resource-deployed') || {};
      var deployed = (scenario && deployedAll[scenario.id]) ? deployedAll[scenario.id] : {};
      var required = (scenario && scenario.resources) ? scenario.resources : {};
      var resources = AAR_RES_TYPES.map(function (t2) {
        var need = Number(required[t2.key]) || 0;
        var have = Number(deployed[t2.key]) || 0;
        var status = need === 0 ? 'Not required'
          : (have >= need ? have + '/' + need + ' complete'
            : (have > 0 ? have + '/' + need + ' partial' : '0/' + need + ' missing'));
        return { name: t2.label, required: need, deployed: have, status: status };
      });

      /* Casualties: per-scenario cards with string triage + transport status */
      var casAll = pickJSON('ttx-casualties') || {};
      var cas = (scenario && Array.isArray(casAll[scenario.id])) ? casAll[scenario.id] : [];
      var counts = { red: 0, yellow: 0, green: 0, deceased: 0, transported: 0, total: cas.length };
      cas.forEach(function (c) {
        var tri = String(c.triage || '');
        if (tri.indexOf('Red') === 0) counts.red++;
        else if (tri.indexOf('Yellow') === 0) counts.yellow++;
        else if (tri.indexOf('Green') === 0) counts.green++;
        else if (tri.indexOf('Deceased') === 0) counts.deceased++;
        var tr = String(c.transport || '');
        if (tr === 'Loaded' || tr === 'En route' || tr === 'Arrived at hospital') counts.transported++;
      });

      var clock = pickJSON('ttx-clock');

      return {
        scenario: scenario,
        checklist: checklist,
        doneCount: doneCount,
        resources: resources,
        casualtyCounts: counts,
        clock: clock,
        timeline: timelineEvents
      };
    };

    var clockElapsedMs = function (cl) {
      if (!cl) return 0;
      var ms = cl.accumulated || 0;
      if (cl.running && cl.startedAt) ms += Date.now() - cl.startedAt;
      return ms;
    };

    var buildAarMarkdown = function (d, notes) {
      var L = [];
      L.push('# Kulhudhuffushi Airport (VRBK) — After Action Report');
      if (d.scenario) L.push('', '**Scenario:** ' + d.scenario.name);
      L.push('', '**Generated:** ' + new Date().toLocaleString(), '', '---', '');

      L.push('## 1. Scenario');
      if (d.scenario) {
        var s = d.scenario;
        if (s.aircraft) L.push('- **Aircraft:** ' + s.aircraft);
        if (s.soulsOnBoard) L.push('- **Souls on board:** ' + s.soulsOnBoard);
        if (s.location) L.push('- **Location:** ' + s.location);
        if (s.casualties) {
          var ec = s.casualties;
          L.push('- **Casualty estimates:** ' + (ec.red || 0) + ' red, ' + (ec.yellow || 0) +
                 ' yellow, ' + (ec.green || 0) + ' green, ' + (ec.deceased || 0) + ' deceased');
        }
        if (s.description) L.push('', s.description);
      } else {
        L.push('No scenario selected.');
      }

      L.push('', '## 2. Checklist Status (' + d.doneCount + '/' + d.checklist.length + ' completed)');
      d.checklist.forEach(function (i) { L.push('- [' + (i.done ? 'x' : ' ') + '] ' + i.text); });

      L.push('', '## 3. Resources');
      L.push('| Resource | Required | Deployed | Status |');
      L.push('|---|---|---|---|');
      d.resources.forEach(function (r) {
        L.push('| ' + r.name + ' | ' + r.required + ' | ' + r.deployed + ' | ' + r.status + ' |');
      });

      var cc = d.casualtyCounts;
      L.push('', '## 4. Casualties');
      L.push('- Red (Immediate): ' + cc.red);
      L.push('- Yellow (Delayed): ' + cc.yellow);
      L.push('- Green (Minor): ' + cc.green);
      L.push('- Deceased: ' + cc.deceased);
      L.push('- Transported: ' + cc.transported);
      L.push('- **Total: ' + cc.total + '**');

      L.push('', '## 5. Exercise Clock');
      if (d.clock && d.clock.startWall) {
        L.push('- Start wall time: ' + new Date(d.clock.startWall).toLocaleString());
        L.push('- Total elapsed: T+ ' + fmtTplus(clockElapsedMs(d.clock)));
        L.push('- Released injects: ' + (d.clock.released ? d.clock.released.length : 0));
      } else {
        L.push('Clock not started for this exercise.');
      }

      L.push('', '## 6. Exercise Timeline');
      if (!d.timeline.length) L.push('No events recorded.');
      else d.timeline.forEach(function (e) {
        L.push('- **[' + e.time + ']**' + (e.tplus ? ' (T+' + e.tplus + ')' : '') +
               ' `' + e.category + '` — ' + e.text);
      });

      L.push('', '## 7. Facilitator / Observer Notes', '');
      if (notes && notes.trim()) L.push(notes, '');
      else L.push('_No notes recorded._', '');

      L.push('## 8. Improvement Plan');
      L.push('| # | Issue / Observation | Owner | Target date | Status |');
      L.push('|---|---|---|---|---|');
      for (var i = 1; i <= 5; i++) L.push('| ' + i + ' |  |  |  |  |');
      L.push('');
      return L.join('\n');
    };

    var renderAarPreview = function () {
      var el = document.getElementById('aarContent');
      if (!el) return;
      var d = collectAarData();
      var notesEl = document.getElementById('aarNotes');
      var notes = notesEl ? notesEl.value : '';
      var h = '';

      /* 1 — Scenario */
      h += '<div class="aar-sec"><h3>1. Scenario</h3>';
      if (d.scenario) {
        h += '<div class="aar-grid">';
        h += '<div><span>Scenario</span><b>' + escapeHtml(d.scenario.name) + '</b></div>';
        h += '<div><span>Date</span><b>' + new Date().toLocaleDateString() + '</b></div>';
        if (d.scenario.aircraft) h += '<div><span>Aircraft</span><b>' + escapeHtml(d.scenario.aircraft) + '</b></div>';
        if (d.scenario.soulsOnBoard) h += '<div><span>Souls on board</span><b>' + d.scenario.soulsOnBoard + '</b></div>';
        if (d.scenario.location) h += '<div><span>Location</span><b>' + escapeHtml(d.scenario.location) + '</b></div>';
        h += '</div>';
        if (d.scenario.description) h += '<p class="aar-empty" style="font-style:normal;margin-top:8px;">' + escapeHtml(d.scenario.description) + '</p>';
      } else {
        h += '<p class="aar-empty">No scenario selected — pick a scenario to include its details.</p>';
      }
      h += '</div>';

      /* 2 — Checklist */
      h += '<div class="aar-sec"><h3>2. Checklist Status<span class="aar-count">' + d.doneCount + ' / ' + d.checklist.length + ' completed</span></h3><ul class="aar-list">';
      d.checklist.forEach(function (i) {
        h += '<li class="' + (i.done ? 'done' : '') + '"><span class="aar-box">' + (i.done ? '✓' : '') + '</span><span>' + escapeHtml(i.text) + '</span></li>';
      });
      h += '</ul></div>';

      /* 3 — Resources */
      h += '<div class="aar-sec"><h3>3. Resources</h3><table class="aar-tbl"><tr><th>Resource</th><th>Required</th><th>Deployed</th><th>Status</th></tr>';
      d.resources.forEach(function (r) {
        h += '<tr><td>' + escapeHtml(r.name) + '</td><td class="mono">' + r.required + '</td><td class="mono">' + r.deployed + '</td><td>' + escapeHtml(r.status) + '</td></tr>';
      });
      h += '</table></div>';

      /* 4 — Casualties */
      var cc = d.casualtyCounts;
      h += '<div class="aar-sec"><h3>4. Casualties</h3>';
      h += '<div class="aar-pills">';
      h += '<span class="aar-pill s-red">Red: ' + cc.red + '</span>';
      h += '<span class="aar-pill s-yellow">Yellow: ' + cc.yellow + '</span>';
      h += '<span class="aar-pill s-green">Green: ' + cc.green + '</span>';
      h += '<span class="aar-pill s-deceased">Deceased: ' + cc.deceased + '</span>';
      h += '<span class="aar-pill s-transported">Transported: ' + cc.transported + '</span>';
      h += '<span class="aar-pill s-total">Total: ' + cc.total + '</span>';
      h += '</div>';
      if (d.scenario && d.scenario.casualties) {
        var ec = d.scenario.casualties;
        h += '<div class="aar-grid">';
        h += '<div><span>Estimated red</span><b>' + (ec.red || 0) + '</b></div>';
        h += '<div><span>Estimated yellow</span><b>' + (ec.yellow || 0) + '</b></div>';
        h += '<div><span>Estimated green</span><b>' + (ec.green || 0) + '</b></div>';
        h += '<div><span>Estimated deceased</span><b>' + (ec.deceased || 0) + '</b></div>';
        h += '</div>';
      }
      h += '</div>';

      /* 5 — Exercise clock */
      h += '<div class="aar-sec"><h3>5. Exercise Clock</h3>';
      if (d.clock && d.clock.startWall) {
        h += '<div class="aar-grid">';
        h += '<div><span>Start wall time</span><b>' + new Date(d.clock.startWall).toLocaleString() + '</b></div>';
        h += '<div><span>Total elapsed</span><b>T+ ' + fmtTplus(clockElapsedMs(d.clock)) + '</b></div>';
        h += '<div><span>Released injects</span><b>' + (d.clock.released ? d.clock.released.length : 0) + '</b></div>';
        h += '</div>';
      } else {
        h += '<p class="aar-empty">Clock not started for this exercise.</p>';
      }
      h += '</div>';

      /* 6 — Timeline */
      h += '<div class="aar-sec"><h3>6. Exercise Timeline<span class="aar-count">' + d.timeline.length + ' events</span></h3>';
      if (!d.timeline.length) {
        h += '<p class="aar-empty">No events recorded.</p>';
      } else {
        h += '<table class="aar-tbl"><tr><th style="width:70px;">Time</th><th style="width:74px;">T+</th><th style="width:88px;">Category</th><th>Event</th></tr>';
        d.timeline.forEach(function (e) {
          h += '<tr><td class="mono">[' + escapeHtml(e.time) + ']</td><td class="mono">' + (e.tplus ? 'T+' + escapeHtml(e.tplus) : '—') + '</td>' +
               '<td><span class="aar-cat c-' + escapeHtml(e.category) + '">' + escapeHtml(e.category) + '</span></td>' +
               '<td>' + escapeHtml(e.text) + '</td></tr>';
        });
        h += '</table>';
      }
      h += '</div>';

      /* 7 — Notes */
      h += '<div class="aar-sec"><h3>7. Facilitator / Observer Notes</h3>';
      h += notes && notes.trim()
        ? '<p class="aar-notes-body">' + escapeHtml(notes) + '</p>'
        : '<p class="aar-empty">No notes recorded.</p>';
      h += '</div>';

      /* 8 — Improvement plan */
      h += '<div class="aar-sec"><h3>8. Improvement Plan</h3>';
      h += '<table class="aar-tbl"><tr><th>#</th><th>Issue / Observation</th><th>Owner</th><th>Target date</th><th>Status</th></tr>';
      for (var i = 1; i <= 5; i++) h += '<tr><td class="mono">' + i + '</td><td></td><td></td><td></td><td></td></tr>';
      h += '</table></div>';

      el.innerHTML = h;
    };

    var openAarModal = function () {
      var existing = document.getElementById('aarOverlay');
      if (existing) { existing.remove(); return; }

      var ov = document.createElement('div');
      ov.id = 'aarOverlay';
      ov.className = 'se-overlay';
      var html = '<div class="se-modal" style="max-width:860px;max-height:88vh;overflow-y:auto;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
      html += '<h3 style="margin:0;font-size:16px;">📋 After Action Report</h3>';
      html += '<button class="reset-btn" type="button" id="aarClose" style="padding:5px 12px;">✕ Close</button></div>';
      html += '<label class="aar-notes-label" for="aarNotes">Facilitator / Observer Notes (saved as you type)</label>';
      html += '<textarea class="se-input" id="aarNotes" rows="3" placeholder="Observations, strengths, weaknesses, opportunities…" style="line-height:1.5;resize:vertical;"></textarea>';
      html += '<div class="aar-toolbar">';
      html += '<button class="reset-btn" type="button" id="aarMdBtn">⬇ Download .md</button>';
      html += '<button class="reset-btn" type="button" id="aarCopyBtn">⧉ Copy Markdown</button>';
      html += '<button class="reset-btn" type="button" id="aarPrintBtn">🖨 Print / PDF</button>';
      html += '</div>';
      html += '<div class="aar-preview"><div id="aarContent"></div></div>';
      html += '</div>';
      ov.innerHTML = html;
      document.body.appendChild(ov);

      var notesEl = document.getElementById('aarNotes');
      try { notesEl.value = localStorage.getItem(AAR_NOTES_KEY) || ''; } catch (e) {}
      notesEl.addEventListener('input', function () {
        try { localStorage.setItem(AAR_NOTES_KEY, notesEl.value); } catch (e) {}
        renderAarPreview();
      });

      renderAarPreview();

      document.getElementById('aarClose').addEventListener('click', function () { ov.remove(); });
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });

      document.getElementById('aarMdBtn').addEventListener('click', function () {
        var md = buildAarMarkdown(collectAarData(), notesEl.value);
        var blob = new Blob([md], { type: 'text/markdown' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'AAR-' + (aarScenario() ? aarScenario().id + '-' : '') + new Date().toISOString().slice(0, 10) + '.md';
        a.click();
        URL.revokeObjectURL(url);
      });

      document.getElementById('aarCopyBtn').addEventListener('click', function (e) {
        var btn = e.currentTarget;
        var md = buildAarMarkdown(collectAarData(), notesEl.value);
        var done = function () {
          btn.textContent = '✓ Copied!';
          setTimeout(function () { btn.textContent = '⧉ Copy Markdown'; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(md).then(done, function () { prompt('Copy the Markdown:', md); });
        } else {
          prompt('Copy the Markdown:', md);
        }
      });

      document.getElementById('aarPrintBtn').addEventListener('click', function () {
        printMarkup(document.getElementById('aarContent').innerHTML);
      });
    };

    var aarBtn = document.createElement('button');
    aarBtn.className = 'reset-btn';
    aarBtn.type = 'button';
    aarBtn.textContent = '📋 After Action Report';
    aarBtn.title = 'Preview, print or download the AAR for the current exercise';
    aarBtn.style.marginTop = '12px';
    aarBtn.addEventListener('click', openAarModal);
    timelineSection.appendChild(aarBtn);

    /* ================= EXERCISE CLOCK & INJECT PLAYER ================= */
    var CLOCK_KEY = 'ttx-clock';
    var clockState = {
      scenarioId: null, startWall: null, accumulated: 0,
      running: false, startedAt: null,
      mode: 'manual', autoLog: true, released: []
    };
    try {
      var rawClock = JSON.parse(localStorage.getItem(CLOCK_KEY) || 'null');
      if (rawClock && typeof rawClock === 'object') {
        Object.keys(clockState).forEach(function (k) {
          if (rawClock[k] !== undefined) clockState[k] = rawClock[k];
        });
        if (clockState.running && !clockState.startedAt) clockState.startedAt = Date.now();
      }
    } catch (e) {}

    var saveClock = function () {
      try { localStorage.setItem(CLOCK_KEY, JSON.stringify(clockState)); } catch (e) {}
      flashSaved('clock');
    };

    /* Cue (latest released inject) must survive re-renders of the panel */
    var clockCue = { visible: false, text: '' };

    var resetClockState = function () {
      clockState.scenarioId = clockScenId();
      clockState.startWall = null;
      clockState.accumulated = 0;
      clockState.running = false;
      clockState.startedAt = null;
      clockState.released = [];
      clockCue.visible = false;
      clockCue.text = '';
    };

    var clockElapsed = function () {
      var ms = clockState.accumulated || 0;
      if (clockState.running && clockState.startedAt) ms += Date.now() - clockState.startedAt;
      return ms;
    };

    var fmtTplus = function (ms) {
      var s = Math.max(0, Math.floor(ms / 1000));
      var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      var pad = function (n) { return (n < 10 ? '0' : '') + n; };
      return pad(h) + ':' + pad(m) + ':' + pad(sec);
    };

    var clockScenId = function () {
      var sel = document.getElementById('scenarioSelect');
      return sel && sel.value ? sel.value : null;
    };

    var clockScenObj = function () {
      return findScenario(clockScenId());
    };

    /* Injects are strings like "09:05 — Aircraft crashes …".
       Schedule offsets are computed relative to the first parseable time. */
    var parseInjectSchedule = function (scenario) {
      var out = [];
      if (!scenario || !Array.isArray(scenario.injects)) return out;
      var base = null;
      scenario.injects.forEach(function (raw, idx) {
        var text = String(raw), offsetMin = null;
        var m = String(raw).match(/^\s*(\d{1,2}):(\d{2})\s*(?:—|-|–|:)?\s*(.*)$/);
        if (m) {
          var mins = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
          if (base === null) base = mins;
          offsetMin = mins - base;
          if (offsetMin < 0) offsetMin += 24 * 60; /* crosses midnight */
          if (m[3]) text = m[3];
        }
        if (offsetMin === null) offsetMin = idx * 5; /* no time in string → every 5 min */
        out.push({ idx: idx, text: text || String(raw), offsetMs: offsetMin * 60000 });
      });
      return out;
    };

    var clockAudioCtx = null;
    var beep = function () {
      try {
        if (!clockAudioCtx) clockAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (clockAudioCtx.state === 'suspended') clockAudioCtx.resume();
        [0, 0.24].forEach(function (t, i) {
          var o = clockAudioCtx.createOscillator();
          var g = clockAudioCtx.createGain();
          o.type = 'sine';
          o.frequency.value = i === 0 ? 880 : 660;
          g.gain.setValueAtTime(0.0001, clockAudioCtx.currentTime + t);
          g.gain.exponentialRampToValueAtTime(0.22, clockAudioCtx.currentTime + t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, clockAudioCtx.currentTime + t + 0.2);
          o.connect(g); g.connect(clockAudioCtx.destination);
          o.start(clockAudioCtx.currentTime + t);
          o.stop(clockAudioCtx.currentTime + t + 0.22);
        });
      } catch (e) {}
    };

    var renderCue = function () {
      var cue = document.getElementById('clockCue');
      var txt = document.getElementById('clockCueText');
      if (!cue || !txt) return;
      txt.textContent = clockCue.text;
      cue.style.display = clockCue.visible ? 'flex' : 'none';
    };

    var showCue = function (text) {
      clockCue.visible = true;
      clockCue.text = text;
      renderCue();
    };

    var releaseInject = function (idx) {
      var sc = clockScenObj();
      if (!sc) return;
      var sched = parseInjectSchedule(sc);
      var item = sched[idx];
      if (!item || clockState.released.indexOf(idx) !== -1) return;
      clockState.released.push(idx);
      saveClock();
      beep();
      showCue(item.text);
      if (clockState.autoLog) {
        var now = new Date();
        var wallDate = clockState.startWall ? new Date(clockState.startWall + clockElapsed()) : now;
        var wall = wallDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        var tplus = clockState.startWall ? fmtTplus(clockElapsed()) : null;
        addTimelineEvent(wall, item.text, 'inject', tplus);
      }
      renderClockPanel();
    };

    var renderClockPanel = function () {
      var mount = document.getElementById('clockMount');
      if (!mount) return;

      var scId = clockScenId();
      /* Clock state belongs to one scenario — reset when the user switches */
      if (scId && clockState.scenarioId && clockState.scenarioId !== scId) {
        resetClockState();
        saveClock();
      }
      if (scId) clockState.scenarioId = scId;

      var sc = clockScenObj();
      if (!sc) { mount.innerHTML = ''; return; }

      var sched = parseInjectSchedule(sc);
      var isRunning = clockState.running;
      var started = clockState.startWall !== null;

      var html = '<div class="clock-card">';
      html += '<div class="clock-head"><span class="clock-title">⏱ Exercise Clock</span><span id="clockStatus" class="clock-status">Not started</span></div>';
      html += '<div class="clock-main">';
      html += '<div class="clock-tplus" id="clockTplus">T+ 00:00:00</div>';
      html += '<div class="clock-wall" id="clockWall">Start wall time —</div>';
      html += '<div class="clock-btns">';
      html += '<button id="clockStartBtn" class="reset-btn" type="button">' + (isRunning ? '⏸ Pause' : (started ? '▶ Resume' : '▶ Start')) + '</button>';
      html += '<button id="clockResetBtn" class="reset-btn" type="button">↺ Reset</button>';
      html += '</div>';
      html += '<div class="clock-mode">';
      html += '<label><input type="radio" name="clockPace" value="manual" ' + (clockState.mode !== 'auto' ? 'checked' : '') + '> Manual pacing</label>';
      html += '<label><input type="radio" name="clockPace" value="auto" ' + (clockState.mode === 'auto' ? 'checked' : '') + '> Auto-release</label>';
      html += '<label><input type="checkbox" id="clockAutoLog" ' + (clockState.autoLog ? 'checked' : '') + '> Log injects to timeline</label>';
      html += '</div>';
      html += '</div>';

      html += '<div class="clock-next" id="clockNext"></div>';
      html += '<div class="clock-cue" id="clockCue" role="alert" style="display:none;"><span class="cue-bell">🔔</span><span id="clockCueText"></span><button type="button" id="clockCueClose" aria-label="Dismiss inject">✕</button></div>';

      /* Inject player list */
      html += '<h4 class="clock-inject-h">Exercise Injects</h4>';
      html += '<div class="inject-list">';
      var nextIdx = -1;
      for (var i = 0; i < sched.length; i++) {
        if (clockState.released.indexOf(sched[i].idx) === -1) { nextIdx = i; break; }
      }
      sched.forEach(function (item, i) {
        var released = clockState.released.indexOf(item.idx) !== -1;
        var cls = released ? 'done' : (i === nextIdx ? 'next' : 'future');
        html += '<div class="inject-row ' + cls + '" style="margin-bottom:6px;">';
        html += '<span class="inject-badge">' + (released ? '✓' : (i + 1)) + '</span>';
        html += '<span class="inject-time">T+' + fmtTplus(item.offsetMs).replace(/^00:/, '') + '</span>';
        html += '<span class="inject-text">' + escapeHtml(item.text) + '</span>';
        if (!released && i === nextIdx && clockState.mode !== 'auto') {
          html += '<button class="reset-btn inject-release" type="button" data-idx="' + item.idx + '">Release</button>';
        }
        html += '</div>';
      });
      html += '</div>';
      html += '</div>';

      mount.innerHTML = html;
      renderCue(); /* restore cue (showCue may run before re-renders) */

      /* Controls */
      var startBtn = document.getElementById('clockStartBtn');
      startBtn.addEventListener('click', function () {
        if (clockState.running) {
          clockState.accumulated = clockElapsed();
          clockState.running = false;
          clockState.startedAt = null;
        } else {
          if (clockState.startWall === null) clockState.startWall = Date.now();
          clockState.startedAt = Date.now();
          clockState.running = true;
        }
        saveClock();
        renderClockPanel();
      });

      document.getElementById('clockResetBtn').addEventListener('click', function () {
        if (!confirm('Reset the exercise clock? T+ time and released injects will be cleared (timeline entries already logged are kept).')) return;
        resetClockState();
        saveClock();
        renderClockPanel();
      });

      Array.prototype.forEach.call(mount.querySelectorAll('input[name="clockPace"]'), function (r) {
        r.addEventListener('change', function () {
          clockState.mode = r.value;
          saveClock();
          renderClockPanel();
        });
      });

      var autoLogEl = document.getElementById('clockAutoLog');
      if (autoLogEl) {
        autoLogEl.addEventListener('change', function () {
          clockState.autoLog = autoLogEl.checked;
          saveClock();
        });
      }

      Array.prototype.forEach.call(mount.querySelectorAll('.inject-release'), function (b) {
        b.addEventListener('click', function () {
          releaseInject(parseInt(b.getAttribute('data-idx'), 10));
        });
      });

      var cueClose = document.getElementById('clockCueClose');
      if (cueClose) {
        cueClose.addEventListener('click', function () {
          clockCue.visible = false;
          renderCue();
        });
      }

      updateClockLive();
    };

    var updateClockLive = function () {
      var tEl = document.getElementById('clockTplus');
      if (!tEl) return;
      var elapsed = clockElapsed();
      tEl.textContent = 'T+ ' + fmtTplus(elapsed);

      var wallEl = document.getElementById('clockWall');
      wallEl.textContent = clockState.startWall
        ? 'Wall time ' + new Date(clockState.startWall + elapsed).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : 'Wall time —';

      var statusEl = document.getElementById('clockStatus');
      statusEl.textContent = clockState.running ? '● Running' : (clockState.startWall ? '⏸ Paused' : 'Not started');
      statusEl.classList.toggle('running', clockState.running);

      var startBtn = document.getElementById('clockStartBtn');
      if (startBtn) startBtn.textContent = clockState.running ? '⏸ Pause' : (clockState.startWall ? '▶ Resume' : '▶ Start');

      /* Next-inject countdown */
      var nextEl = document.getElementById('clockNext');
      var sc = clockScenObj();
      var sched = parseInjectSchedule(sc);
      var next = null;
      for (var i = 0; i < sched.length; i++) {
        if (clockState.released.indexOf(sched[i].idx) === -1) { next = sched[i]; break; }
      }
      if (!next) {
        nextEl.innerHTML = '<b>All injects released ✓</b>';
      } else if (clockState.mode === 'auto') {
        var due = next.offsetMs - elapsed;
        if (due <= 0) {
          nextEl.innerHTML = '<b>Next inject due now!</b>';
        } else {
          nextEl.innerHTML = 'Next inject in <b>' + fmtTplus(due) + '</b> (auto)';
        }
      } else {
        nextEl.innerHTML = 'Next inject ready — press <b>Release</b> when the controller calls it';
      }
    };

    var checkAutoDue = function () {
      if (clockState.mode !== 'auto' || !clockState.running) return;
      var sc = clockScenObj();
      var sched = parseInjectSchedule(sc);
      var elapsed = clockElapsed();
      sched.forEach(function (item) {
        if (item.offsetMs <= elapsed && clockState.released.indexOf(item.idx) === -1) {
          releaseInject(item.idx);
        }
      });
    };

    setInterval(function () {
      if (!document.getElementById('clockTplus')) return;
      updateClockLive();
      checkAutoDue();
    }, 1000);


  } catch (err) {
    if (window.console) console.warn('Enhancement script skipped:', err);
  }

})();
