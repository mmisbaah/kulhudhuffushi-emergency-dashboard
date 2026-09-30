const h = require('fs').readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
const i = h.indexOf('id="ac-diagrams"');
console.log(JSON.stringify(h.substring(i - 120, i + 30)));
