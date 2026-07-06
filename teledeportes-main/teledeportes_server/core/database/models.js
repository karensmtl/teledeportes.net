const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../../data/models');

function scan(dir) {
    const out = [];
    if (!fs.existsSync(dir)) return out;
    fs.readdirSync(dir).forEach(item => {
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) {
            out.push(...scan(full));
        } else if (item.endsWith('.js') && item !== 'index.js') {
            out.push(require(full));
        }
    });
    return out;
}

module.exports = scan(modelsDir);
