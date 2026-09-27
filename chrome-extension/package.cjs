const path = require('node:path');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const manifest = require('./dist/manifest.json');
const output = path.join(__dirname, `ghalamnama-chrome-${manifest.version}.zip`);
fs.rmSync(output, { force: true });
execFileSync('zip', ['-q', '-r', output, '.'], { cwd: path.join(__dirname, 'dist') });
console.log(output);
