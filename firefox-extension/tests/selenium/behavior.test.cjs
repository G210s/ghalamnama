const { before, after, beforeEach, afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const { By, Key, until, Select } = require('selenium-webdriver');
const { startFirefox, startFixtureServer } = require('./helpers.cjs');

let driver;
let fixture;
const css = selector => driver.findElement(By.css(selector));
const field = id => driver.findElement(By.id(id));
const value = async id => (await field(id)).getAttribute('value');
const hostCount = async () => (await driver.findElements(By.css('.ghalamnama-keyboard-host'))).length;

before(async () => { fixture = await startFixtureServer(); });
after(async () => { if (fixture) await new Promise(resolve => fixture.server.close(resolve)); });
beforeEach(async () => {
  driver = await startFirefox();
  await driver.get(fixture.url);
  // The host is appended before asynchronous preference restoration finishes.
  await driver.wait(until.elementLocated(By.css('[data-code="KeyQ"]')), 5000);
});
afterEach(async () => {
  if (driver) { await driver.quit(); driver = null; }
});

async function openPanel(id = 'text') {
  await (await field(id)).click();
  await (await css('.ghalamnama-keyboard-toggle')).click();
}
async function key(code) {
  await (await css(`[data-code="${code}"]`)).click();
}
async function select(action, selected) {
  await new Select(await css(`[data-action="${action}"]`)).selectByValue(selected);
  await driver.wait(async () => (await css(`[data-action="${action}"]`)).getAttribute('value').then(v => v === selected), 5000);
}

test('FLD-05/FLD-10 (partial): virtual insertion preserves a middle caret', async () => {
  await openPanel();
  await driver.executeScript("const f = arguments[0]; f.value = 'ab'; f.focus(); f.setSelectionRange(1, 1)", await field('text'));
  await key('KeyQ');
  assert.equal(await value('text'), 'aضb');
  assert.equal(await driver.executeScript('return document.activeElement.id'), 'text');
});

test('FLD-05 (partial): virtual insertion replaces a backward selection', async () => {
  await openPanel();
  await driver.executeScript("const f = arguments[0]; f.value = 'abcd'; f.focus(); f.setSelectionRange(1, 3, 'backward')", await field('text'));
  await key('KeyQ');
  assert.equal(await value('text'), 'aضd');
});

test('FLD-06 (partial): virtual backspace deletes a selection and is safe at zero', async () => {
  await openPanel();
  await driver.executeScript("const f = arguments[0]; f.value = 'abcd'; f.focus(); f.setSelectionRange(1, 3)", await field('text'));
  await (await css('.row-0 .trailing')).click();
  assert.equal(await value('text'), 'ad');
  await driver.executeScript('arguments[0].setSelectionRange(0, 0)', await field('text'));
  await (await css('.row-0 .trailing')).click();
  assert.equal(await value('text'), 'ad');
});

test('FLD-09: virtual insertion bubbles exactly one input event', async () => {
  await openPanel('counted');
  await driver.executeScript("window.inputEvents = []; document.addEventListener('input', e => window.inputEvents.push(e.target.id))");
  await key('KeyQ');
  assert.equal(await value('counted'), 'ض');
  assert.deepEqual(await driver.executeScript('return window.inputEvents'), ['counted']);
  assert.equal(await value('count'), '1');
});

test('FLD-12 (partial): virtual typing inserts into contenteditable', async () => {
  await openPanel('editor');
  await key('KeyQ');
  assert.equal(await (await field('editor')).getText(), 'ض');
});

test('FLD-17: virtual typing follows focus between two fields', async () => {
  await openPanel();
  await key('KeyQ');
  await (await field('email')).click();
  await key('KeyW');
  assert.equal(await value('text'), 'ض');
  assert.equal(await value('email'), 'ص');
});

test('FLT-03/FLT-04: virtual Escape closes panel without changing text or removing host', async () => {
  await openPanel();
  await key('KeyQ');
  await (await css('.row-0 .special:not(.trailing)')).click();
  assert.equal(await (await css('.ghalamnama-keyboard-panel')).isDisplayed(), false);
  assert.equal(await (await css('.ghalamnama-keyboard-toggle')).getAttribute('aria-expanded'), 'false');
  assert.equal(await value('text'), 'ض');
  assert.equal(await hostCount(), 1);
});

for (const [language, expected, direction] of [
  ['fa', 'ض', 'rtl'], ['ar', 'ض', 'rtl'], ['he', '/', 'rtl'],
  ['ru', 'й', 'ltr'], ['el', ';', 'ltr']
]) {
  test(`LAY-01/LAY-02 (sample ${language}): direction and virtual KeyQ output`, async () => {
    await openPanel();
    await select('language', language);
    await (await field('text')).click();
    await key('KeyQ');
    assert.equal(await value('text'), expected);
    assert.equal(await (await css('.ghalamnama-keyboard-panel')).getAttribute('dir'), direction);
  });
}

test('PHY-02/PHY-03 (sample): physical Shift maps once and clears after release', async () => {
  await (await field('text')).click();
  await driver.actions().keyDown(Key.SHIFT).sendKeys('q').keyUp(Key.SHIFT).sendKeys('q').perform();
  assert.equal(await value('text'), '\u0652ض');
});

test('PHY-10/PHY-11: OS mode bypasses physical mapping but retains virtual typing', async () => {
  await openPanel();
  await select('keyboard-mode', 'os');
  await (await field('text')).sendKeys('q');
  await key('KeyQ');
  assert.equal(await value('text'), 'qض');
  await select('keyboard-mode', 'ghalamnama');
  await (await field('text')).sendKeys('q');
  assert.equal(await value('text'), 'qضض');
});

test('ACT-16 (partial): toolbar deactivation removes UI and stops physical remapping', async () => {
  await openPanel();
  await (await css('[data-action="deactivate"]')).click();
  await driver.wait(async () => await hostCount() === 0, 5000);
  await (await field('text')).sendKeys('q');
  assert.equal(await value('text'), 'q');
});

test('LAY-07 (partial): selected layout survives reload with one injected host', async () => {
  await openPanel();
  await select('language', 'ru');
  await driver.navigate().refresh();
  await driver.wait(until.elementLocated(By.css('[data-code="KeyQ"]')), 5000);
  await (await field('text')).sendKeys('q');
  assert.equal(await value('text'), 'й');
  assert.equal(await hostCount(), 1);
});
