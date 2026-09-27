const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { createRequire } = require('node:module');
const requireTest = createRequire(path.resolve(__dirname, '../../../firefox-extension/package.json'));
const { Builder, By, until, Select } = requireTest('selenium-webdriver');
const chrome = requireTest('selenium-webdriver/chrome');
const { startFixtureServer } = require('../../../firefox-extension/tests/selenium/helpers.cjs');

test('Chrome MV3 activation, layouts, editing, reload, settings and deactivation', { timeout: 90000 }, async () => {
  const fixture = await startFixtureServer();
  let driver;
  try {
    const options = new chrome.Options().addArguments('--headless=new', `--load-extension=${path.resolve(__dirname, '../../dist')}`);
    if (process.env.CHROME_BINARY) options.setChromeBinaryPath(process.env.CHROME_BINARY);
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await driver.manage().window().setRect({ width: 1280, height: 1000 });
    const extensionTarget = await driver.wait(async () => {
      const { targetInfos } = await driver.sendAndGetDevToolsCommand('Target.getTargets', {});
      return targetInfos.find(target => target.url.startsWith('chrome-extension://'));
    }, 10000);
    const id = new URL(extensionTarget.url).hostname;
    await driver.get(`chrome-extension://${id}/onboarding.html`);
    await driver.findElement(By.id('next')).click();
    await driver.findElement(By.id('next')).click();
    assert(await driver.findElement(By.id('finish')).isDisplayed());
    // Keep the test control page open while exercising real runtime messages.
    await driver.executeAsyncScript("const done=arguments[0];chrome.storage.local.set({enabledLanguages:['fa','ar','he','ru','el'],onboardingComplete:true}).then(done)");
    const control = await driver.getWindowHandle();
    await driver.switchTo().newWindow('tab');
    await driver.get(fixture.url);
    const target = await driver.getWindowHandle();
    assert.equal((await driver.findElements(By.css('.ghalamnama-keyboard-host'))).length, 0);
    await driver.switchTo().window(control);
    const tabId = await driver.executeAsyncScript("const url=arguments[0],done=arguments[1];chrome.tabs.query({}).then(tabs=>done(tabs.find(t=>t.url===url).id))", fixture.url);
    async function message(type) {
      return driver.executeAsyncScript('const type=arguments[0],tabId=arguments[1],done=arguments[2];chrome.runtime.sendMessage({type,tabId}).then(done)', type, tabId);
    }
    assert.equal((await message('activate-current-tab')).active, true);
    // A second activation must reuse the content script instead of duplicating it.
    assert.equal((await message('activate-current-tab')).active, true);
    await driver.switchTo().window(target);
    await driver.wait(until.elementLocated(By.css('[data-code="KeyQ"]')), 5000);
    assert.equal((await driver.findElements(By.css('.ghalamnama-keyboard-host'))).length, 1);
    const field = () => driver.findElement(By.id('text'));
    await (await field()).click();
    await driver.findElement(By.css('.ghalamnama-keyboard-toggle')).click();
    for (const [lang, expected] of [['fa','ض'],['ar','ض'],['he','/'],['ru','й'],['el',';']]) {
      await new Select(await driver.findElement(By.css('[data-action="language"]'))).selectByValue(lang);
      await driver.executeScript('arguments[0].value="";arguments[0].focus()', await field());
      await driver.findElement(By.css('[data-code="KeyQ"]')).click();
      assert.equal(await (await field()).getAttribute('value'), expected);
    }
    await new Select(await driver.findElement(By.css('[data-action="language"]'))).selectByValue('fa');
    await driver.executeScript('arguments[0].value="ab";arguments[0].focus();arguments[0].setSelectionRange(1,1)', await field());
    await driver.findElement(By.css('[data-code="KeyQ"]')).click();
    assert.equal(await (await field()).getAttribute('value'), 'aضb');
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.css('[data-code="KeyQ"]')), 5000);
    await (await field()).sendKeys('q');
    assert.equal(await (await field()).getAttribute('value'), 'ض');
    await driver.switchTo().window(control);
    await driver.sendAndGetDevToolsCommand('ServiceWorker.enable', {});
    await driver.sendAndGetDevToolsCommand('ServiceWorker.stopAllWorkers', {});
    assert.equal((await message('tab-status')).active, true);
    await driver.get(`chrome-extension://${id}/popup.html`);
    await driver.wait(until.elementIsVisible(await driver.findElement(By.id('open-settings'))), 5000);
    assert.equal(await driver.findElement(By.id('error')).isDisplayed(), false);
    await driver.get(`chrome-extension://${id}/options.html`);
    await new Select(await driver.findElement(By.id('typing-mode'))).selectByValue('os');
    await driver.findElement(By.id('save')).click();
    await driver.wait(until.elementIsVisible(await driver.findElement(By.id('saved'))), 5000);
    await driver.switchTo().window(target);
    await (await field()).sendKeys('q');
    assert.equal(await (await field()).getAttribute('value'), 'ضq');
    await driver.switchTo().window(control);
    assert.equal((await message('deactivate-current-tab')).active, false);
    await driver.switchTo().window(target);
    await driver.wait(async () => (await driver.findElements(By.css('.ghalamnama-keyboard-host'))).length === 0, 5000);
    await driver.navigate().refresh();
    assert.equal((await driver.findElements(By.css('.ghalamnama-keyboard-host'))).length, 0);
  } finally {
    if (driver) await driver.quit();
    await new Promise(resolve => fixture.server.close(resolve));
  }
});
