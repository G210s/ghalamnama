const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const shared = path.join(root, '../firefox-extension');
const output = path.join(root, 'dist');
fs.mkdirSync(output, { recursive: true });
const manifest = JSON.parse(fs.readFileSync(path.join(shared, 'manifest.json')));
delete manifest.browser_specific_settings;
manifest.manifest_version = 3;
manifest.minimum_chrome_version = '120';
manifest.permissions = ['storage', 'scripting', 'activeTab'];
manifest.host_permissions = ['http://*/*', 'https://*/*'];
manifest.action = manifest.browser_action;
delete manifest.browser_action;
manifest.background = { service_worker: 'background.js' };
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const adapter = fs.readFileSync(path.join(root, 'browser-adapter.js'), 'utf8');
const assets = ['content-script.js', 'keyboard.css', 'popup.html', 'popup.css', 'popup.js', 'options.html', 'options.js', 'onboarding.html', 'onboarding.css', 'onboarding.js'];
for (const name of assets) {
  let source = fs.readFileSync(path.join(shared, name), 'utf8');
  if (name.endsWith('.html')) source = source.replaceAll('Firefox', 'Chrome');
  if (name.endsWith('.js')) source = `// Generated from firefox-extension/${name}; edit the shared source.\n(function () {\n${adapter}\n${source}\n})();\n`;
  fs.writeFileSync(path.join(output, name), source);
}
fs.cpSync(path.join(shared, 'icons'), path.join(output, 'icons'), { recursive: true });
fs.copyFileSync(path.join(root, 'background.js'), path.join(output, 'background.js'));
console.log(`Built Chrome extension: ${output}`);
