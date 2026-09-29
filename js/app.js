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

    var pinLayer = document.getElementById('pinLayer');
    var legend   = document.getElementById('legend');
    var NS = 'http://www.w3.org/2000/svg';

    var makePin = function (loc) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'pin');
      g.setAttribute('data-cat', loc.cat);
      g.setAttribute('data-id', loc.id);
      g.setAttribute('transform', 'translate(' + loc.x + ',' + loc.y + ')');

      var catColor = CATS[loc.cat].color;

      var title = document.createElementNS(NS, 'title');
      title.textContent = loc.id + '. ' + loc.name;
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
      });

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
