const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const AdmZip = require('adm-zip');
const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const extensionRoot = path.resolve(__dirname, '../..');

function buildTestExtension(matches = ['http://127.0.0.1/*'], autoInject = true) {
  const manifest = JSON.parse(fs.readFileSync(path.join(extensionRoot, 'manifest.json'), 'utf8'));
  if (autoInject) {
    manifest.content_scripts = [{
      matches,
      css: ['keyboard.css'],
      js: ['content-script.js'],
      run_at: 'document_idle'
    }];
  }

  const zip = new AdmZip();
  for (const name of fs.readdirSync(extensionRoot)) {
    const file = path.join(extensionRoot, name);
    if (!fs.statSync(file).isFile() || name === 'manifest.json' || name === 'package.json' || name === 'package-lock.json') continue;
    zip.addLocalFile(file, '', name);
  }
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest)));
  const output = path.join(os.tmpdir(), `ghalamnama-selenium-${process.pid}.xpi`);
  zip.writeZip(output);
  return output;
}

async function startFixtureServer() {
  const fixtureRoot = path.join(extensionRoot, 'tests', 'fixtures');
  const server = http.createServer((request, response) => {
    const requested = request.url === '/' ? 'fields.html' : path.basename(request.url);
    const file = path.join(fixtureRoot, requested);
    if (!fs.existsSync(file)) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return { server, url: `http://127.0.0.1:${port}/fields.html` };
}

async function startFirefox({ matches, autoInject = true } = {}) {
  const options = new firefox.Options();
  if (process.env.HEADED !== '1') options.addArguments('-headless');
  const driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
  const extensionPath = buildTestExtension(matches, autoInject);
  try {
    const original = await driver.getWindowHandle();
    await driver.installAddon(extensionPath, true);
    // Installation opens onboarding in a new tab. Wait for it and close it so
    // WebDriver's selected tab is also Firefox's foreground tab.
    await driver.wait(async () => (await driver.getAllWindowHandles()).length > 1, 5000);
    for (const handle of await driver.getAllWindowHandles()) {
      if (handle === original) continue;
      await driver.switchTo().window(handle);
      await driver.close();
    }
    await driver.switchTo().window(original);
    await driver.manage().window().setRect({ width: 1280, height: 1000 });
    return driver;
  } catch (error) {
    await driver.quit();
    throw error;
  } finally {
    fs.rmSync(extensionPath, { force: true });
  }
}

module.exports = { startFirefox, startFixtureServer };
