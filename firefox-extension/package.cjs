// Zip only the files the extension ships, for upload to addons.mozilla.org.
const path = require('node:path');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const manifest = require('./manifest.json');
const files = ['manifest.json', 'background.js', 'content-script.js', 'keyboard.css', 'popup.html', 'popup.css', 'popup.js', 'options.html', 'options.js', 'onboarding.html', 'onboarding.css', 'onboarding.js', 'icons'];
const output = path.join(__dirname, `ghalamnama-firefox-${manifest.version}.zip`);
fs.rmSync(output, { force: true });
execFileSync('zip', ['-q', '-r', '-X', output, ...files, '-x', '*.DS_Store'], { cwd: __dirname });
console.log(output);
