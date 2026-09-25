const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');
const { startFirefox } = require('../selenium/helpers.cjs');

const enabled = process.env.FACEBOOK_E2E === '1';
const registrationUrl = 'https://www.facebook.com/reg/?entry_point=login';
let driver;

before(async () => {
  if (!enabled) return;
  driver = await startFirefox({ matches: ['https://www.facebook.com/*'] });
});

after(async () => {
  if (driver) await driver.quit();
});

test('LIVE-FB/FLD-01: physical mapping works in Facebook registration given-name field', { skip: !enabled }, async () => {
  await driver.get(registrationUrl);
  const selector = "input[name='firstname'], input[autocomplete='given-name'], input[aria-label='First name']";
  await driver.wait(until.elementLocated(By.css('body')), 20000);
  let fields = await driver.findElements(By.css(selector));
  if (!fields.length) {
    // Facebook's current mobile-style registration variant renders the three
    // text fields without name/autocomplete attributes, in the same order as
    // its visible First name, Last name, and Mobile number or email labels.
    const bodyText = await driver.findElement(By.css('body')).getText();
    if (bodyText.includes('First name') && bodyText.includes('Last name')) {
      const textInputs = await driver.findElements(By.css("input[type='text']"));
      for (const candidate of textInputs) {
        if (await candidate.isDisplayed()) { fields = [candidate]; break; }
      }
    }
  }
  if (!fields.length) {
    const createAccount = await driver.findElements(By.css(
      "[data-testid='open-registration-form-button'], a[href*='/reg/'], a[href*='registration']"));
    if (createAccount.length) {
      await driver.executeScript('arguments[0].click()', createAccount[0]);
      fields = await driver.wait(async () => {
        const found = await driver.findElements(By.css(selector));
        return found.length ? found : false;
      }, 15000).catch(() => []);
    }
  }
  if (!fields.length) {
    const details = await driver.executeScript(`return {
      title: document.title,
      text: document.body.innerText.slice(0, 500),
      inputs: [...document.querySelectorAll('input')].map(input => ({
        name: input.name, type: input.type, autocomplete: input.autocomplete
      })).slice(0, 20)
    }`);
    assert.fail(`Facebook registration field unavailable. URL: ${await driver.getCurrentUrl()} Details: ${JSON.stringify(details)}`);
  }
  const input = fields[0];
  await driver.wait(until.elementIsVisible(input), 10000);
  await driver.executeScript('arguments[0].scrollIntoView({ block: "center" })', input);
  // Some Facebook variants place the animated label over the empty input,
  // which makes a WebDriver pointer click report interception. Programmatic
  // focus still triggers the same focus event consumed by the content script;
  // the actual key is sent through WebDriver as a physical keyboard event.
  await driver.executeScript('arguments[0].focus()', input);
  await driver.actions().sendKeys('q').perform();

  assert.equal(await input.getAttribute('value'), 'ض');
  assert.equal((await driver.findElements(By.css('.ghalamnama-keyboard-host'))).length, 1);
  assert.equal(await driver.findElement(By.css('.ghalamnama-keyboard-toggle')).isDisplayed(), true);
});
