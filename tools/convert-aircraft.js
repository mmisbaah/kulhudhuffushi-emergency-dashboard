/* One-off: replace static aircraft table rows + detail cards with
   empty data-driven containers (populated at runtime from TTX_DATA). */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// 1) Static <tbody> rows -> empty tbody
const tbodyStart = html.indexOf('<tbody>');
const tbodyEnd = html.indexOf('</tbody>', tbodyStart);
if (tbodyStart === -1 || tbodyEnd === -1) { console.error('tbody not found'); process.exit(1); }
const tbodyNew = '<tbody id="acTableBody">\n          <!-- rows rendered from TTX_DATA.aircraftComparison -->\n        ';
html = html.slice(0, tbodyStart) + tbodyNew + html.slice(tbodyEnd);

// 2) Static .ac-grid contents -> empty grid
const gridStart = html.indexOf('<div class="ac-grid">');
const gridEnd = html.indexOf('<h3 class="sub" id="ac-diagrams">', gridStart);
if (gridStart === -1 || gridEnd === -1) { console.error('ac-grid not found'); process.exit(1); }
// back up to the start of the line holding the closing </div> before the h3
const closeIdx = html.lastIndexOf('</div>', gridEnd);
const lineStart = html.lastIndexOf('\n', closeIdx) + 1;
const gridNew = '<div class="ac-grid" id="acGrid">\r\n      <!-- cards rendered from TTX_DATA.aircraftDetails -->\r\n    ';
html = html.slice(0, gridStart) + gridNew + html.slice(lineStart);

fs.writeFileSync(file, html);
console.log('OK — tbody and ac-grid converted');
console.log('len', html.length);
