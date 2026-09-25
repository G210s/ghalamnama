const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(`${__dirname}/../background.js`, 'utf8');
const settle = () => new Promise(resolve => setImmediate(resolve));
const plain = value => JSON.parse(JSON.stringify(value));

function eventHub() {
  const listeners = new Set();
  return { listeners, addListener: listener => listeners.add(listener) };
}

function setup(tab) {
  const commands = eventHub();
  const onInstalled = eventHub();
  const onMessage = eventHub();
  const onRemoved = eventHub();
  const onUpdated = eventHub();
  const values = { enabledLanguages: ['fa'] };
  const sent = [];
  const inserted = [];
  const titles = [];
  const browser = {
    commands: { onCommand: commands },
    runtime: {
      onInstalled,
      onMessage,
      getURL: path => `moz-extension://test/${path}`,
      openOptionsPage: async () => {}
    },
    storage: { local: {
      async get(keys) {
        if (typeof keys === 'string') return { [keys]: values[keys] };
        return { ...values };
      },
      async set(update) { Object.assign(values, update); },
      async remove(keys) { for (const key of keys) delete values[key]; }
    } },
    tabs: {
      onRemoved,
      onUpdated,
      async query(query) { return query.active ? [tab] : []; },
      async get() { return tab; },
      async sendMessage(tabId, message) {
        sent.push({ tabId, message });
        if (message.type === 'ping') throw new Error('not injected');
      },
      async insertCSS(tabId, details) { inserted.push({ kind: 'css', tabId, details }); },
      async executeScript(tabId, details) { inserted.push({ kind: 'script', tabId, details }); },
      async create() {}
    },
    browserAction: { async setTitle(details) { titles.push(details); } }
  };
  vm.runInNewContext(source, { browser, console });
  return { commands, values, sent, inserted, titles };
}

async function issue(app, command) {
  const listener = [...app.commands.listeners][0];
  await listener(command);
  await settle();
}

test('activation shortcut activates and then deactivates only the current tab', async () => {
  const app = setup({ id: 42, url: 'https://example.test/', status: 'complete' });
  await settle();

  await issue(app, 'toggle-activation');
  assert.deepEqual(app.inserted.map(item => item.kind), ['css', 'script']);
  assert.deepEqual(plain(app.values.enabledTabIds), [42]);
  assert.deepEqual(plain(app.titles.at(-1)), { tabId: 42, title: 'Deactivate Ghalamnama on this tab' });

  await issue(app, 'toggle-activation');
  assert.deepEqual(plain(app.sent.at(-1)), { tabId: 42, message: { type: 'deactivate' } });
  assert.deepEqual(plain(app.values.enabledTabIds), []);
  assert.deepEqual(plain(app.titles.at(-1)), { tabId: 42, title: 'Activate Ghalamnama on this tab' });
});

test('activation shortcut is a safe no-op on protected Firefox pages', async () => {
  const app = setup({ id: 7, url: 'about:addons', status: 'complete' });
  await settle();
  await issue(app, 'toggle-activation');
  assert.deepEqual(app.inserted, []);
  assert.deepEqual(app.sent, []);
  assert.equal(app.values.enabledTabIds, undefined);
});
