/* =====================================================
   APP — All interactive logic for the dashboard.
   Depends on: data.js (TTX_DATA)
   ===================================================== */

(function () {
  'use strict';

  try {

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
      pin.style.cursor = 'grabbing';
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
      draggedPin.style.cursor = '';
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
      dot.style.transformOrigin = 'center';
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

  } catch (err) {
    if (window.console) console.warn('Enhancement script skipped:', err);
  }

})();
