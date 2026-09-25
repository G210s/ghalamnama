const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');
const { startFirefox, startFixtureServer } = require('./helpers.cjs');

let driver;
let fixture;

before(async () => {
  fixture = await startFixtureServer();
  driver = await startFirefox();
});

after(async () => {
  if (driver) await driver.quit();
  if (fixture) await new Promise(resolve => fixture.server.close(resolve));
});

async function openFixture() {
  await driver.get(fixture.url);
  await driver.wait(until.elementLocated(By.css('[data-code="KeyQ"]')), 5000);
}

test('FLT-01 (partial): focusing a writable field reveals one control', async () => {
  await openFixture();
  await driver.findElement(By.id('text')).click();
  const toggles = await driver.findElements(By.css('.ghalamnama-keyboard-toggle'));
  assert.equal(toggles.length, 1);
  assert.equal(await toggles[0].isDisplayed(), true);
  assert.match(await toggles[0].getText(), /فارسی/);
});

test('PHY-01: a mapped physical key inserts the selected layout character', async () => {
  await openFixture();
  const input = await driver.findElement(By.id('text'));
  await input.click();
  await input.sendKeys('q');
  assert.equal(await input.getAttribute('value'), 'ض');
});

test('FLD-03 (partial): physical typing does not modify a read-only field or the prior field', async () => {
  await openFixture();
  const writable = await driver.findElement(By.id('text'));
  await writable.click();
  const toggle = await driver.findElement(By.css('.ghalamnama-keyboard-toggle'));
  await driver.executeScript('arguments[0].blur()', writable);
  await driver.executeScript('arguments[0].focus()', await driver.findElement(By.id('readonly')));
  assert.equal(await driver.findElement(By.id('readonly')).getAttribute('value'), '');
  // The existing control may remain visible, but typing must not affect the read-only field.
  await driver.actions().sendKeys('q').perform();
  assert.equal(await driver.findElement(By.id('readonly')).getAttribute('value'), '');
  assert.equal(await writable.getAttribute('value'), '');
  assert.equal(await toggle.isDisplayed(), true);
});

test('FLD-09: extension editing dispatches a bubbling input event', async () => {
  await openFixture();
  const input = await driver.findElement(By.id('counted'));
  await input.click();
  await input.sendKeys('q');
  assert.equal(await input.getAttribute('value'), 'ض');
  assert.equal(await driver.findElement(By.id('count')).getAttribute('value'), '1');
});

test('FLT-03: the floating control opens the panel and updates aria-expanded', async () => {
  await openFixture();
  const input = await driver.findElement(By.id('text'));
  await input.click();
  const toggle = await driver.findElement(By.css('.ghalamnama-keyboard-toggle'));
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await driver.findElement(By.css('.ghalamnama-keyboard-panel')).isDisplayed(), true);
});
