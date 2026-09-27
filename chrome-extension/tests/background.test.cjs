const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(`${__dirname}/../background.js`, 'utf8');
const event = () => ({ addListener(fn) { this.listener = fn; } });
const store = values => ({
  async get(key) { return key === null ? { ...values } : { [key]: values[key] }; },
  async set(update) { Object.assign(values, update); },
  async remove(keys) { for (const key of [keys].flat()) delete values[key]; }
});
function setup(session = {}, local = { enabledLanguages: ['fa'] }) {
  const injected = [], messages = [], created = [];
  const tabs = new Map([[1, { id: 1, url: 'https://example.test/' }], [2, { id: 2, url: 'chrome://extensions/' }]]);
  const chrome = {
    runtime: { id: 'test', onMessage: event(), onInstalled: event(), getURL: p => `chrome-extension://test/${p}`, openOptionsPage: async () => {} },
    storage: { session: store(session), local: store(local) },
    action: { setTitle: async () => {} },
    scripting: { insertCSS: async () => {}, removeCSS: async () => {}, executeScript: async details => { injected.push(details.target.tabId); } },
    tabs: { onRemoved: event(), onUpdated: event(), get: async id => tabs.get(id), query: async () => [tabs.get(1)], create: async data => created.push(data), sendMessage: async (id, message) => { messages.push(message); if (message.type === 'ping') throw Error('not ready'); } },
    commands: { onCommand: event() }
  };
  const context = vm.createContext({ chrome, console, URL });
  vm.runInContext(source, context);
  const send = (message, sender = { id: 'test' }) => new Promise(resolve => chrome.runtime.onMessage.listener(message, sender, resolve));
  const flush = () => vm.runInContext('pending', context);
  return { chrome, send, flush, session, local, injected, messages, tabs, created };
}
test('activation persists across worker restarts; reloading only restores activated tabs', async () => {
  const app = setup();
  assert.equal((await app.send({ type: 'activate-current-tab', tabId: 1 })).active, true);
  assert.deepEqual(app.injected, [1]);
  const restarted = setup(app.session, app.local);
  assert.equal((await restarted.send({ type: 'tab-status', tabId: 1 })).active, true);
  restarted.chrome.tabs.onUpdated.listener(1, { status: 'complete' });
  restarted.chrome.tabs.onUpdated.listener(2, { status: 'complete' });
  await restarted.flush();
  assert.deepEqual(restarted.injected, [1]);
  await restarted.send({ type: 'deactivate-current-tab', tabId: 1 });
  assert.equal((await restarted.send({ type: 'tab-status', tabId: 1 })).active, false);
});
test('protected pages and failed injections do not become active', async () => {
  const app = setup();
  assert.equal((await app.send({ type: 'activate-current-tab', tabId: 2 })).active, false);
  app.tabs.set(2, { id: 2, url: 'https://chromewebstore.google.com/detail/test' });
  assert.equal((await app.send({ type: 'activate-current-tab', tabId: 2 })).active, false);
  app.chrome.scripting.executeScript = async () => { throw Error('permission denied'); };
  assert.equal((await app.send({ type: 'activate-current-tab', tabId: 1 })).active, false);
  assert.deepEqual(app.session, {});
});
test('tab removal and full reset discard activation and preferences', async () => {
  const app = setup();
  await app.send({ type: 'activate-current-tab', tabId: 1 });
  app.chrome.tabs.onRemoved.listener(1);
  await app.flush();
  assert.deepEqual(app.session, {});
  await app.send({ type: 'activate-current-tab', tabId: 1 });
  await app.send({ type: 'reset-all' });
  assert.deepEqual(app.session, {});
  assert.deepEqual(app.local, {});
});
test('content scripts cannot activate other tabs or reset settings', async () => {
  const app = setup();
  await app.send({ type: 'activate-current-tab', tabId: 1 }, { id: 'test', tab: { id: 2 } });
  await app.send({ type: 'reset-all' }, { id: 'test', tab: { id: 2 } });
  assert.deepEqual(app.injected, []);
  assert.deepEqual(app.local, { enabledLanguages: ['fa'] });
});
test('onboarding opens only on installation; shortcuts toggle activation', async () => {
  const app = setup();
  app.chrome.runtime.onInstalled.listener({ reason: 'update' });
  app.chrome.runtime.onInstalled.listener({ reason: 'install' });
  assert.equal(app.created.length, 1);
  await app.chrome.commands.onCommand.listener('toggle-activation');
  assert.equal(app.session['activeTab:1'], true);
  await app.chrome.commands.onCommand.listener('toggle-typing-mode');
  assert.equal(app.messages.at(-1).type, 'toggle-typing-mode');
  await app.chrome.commands.onCommand.listener('toggle-activation');
  assert.deepEqual(app.session, {});
});
test('Chrome adapter replies to ping and removes its registered listener', () => {
  const hub = { addListener(fn) { this.fn = fn; }, removeListener(fn) { assert.equal(fn, this.fn); this.fn = null; } };
  const ctx = vm.createContext({ chrome: { runtime: { onMessage: hub } } });
  vm.runInContext(fs.readFileSync(`${__dirname}/../browser-adapter.js`, 'utf8') + '\nfunction ping() { return {ready:true}; } browser.runtime.onMessage.addListener(ping);', ctx);
  let reply;
  hub.fn({}, {}, value => reply = value);
  assert.equal(reply.ready, true);
  vm.runInContext('browser.runtime.onMessage.removeListener(ping)', ctx);
  assert.equal(hub.fn, null);
});
test('extension settings pages opened in tabs can control activation and reset', async () => {
  const app = setup();
  const sender = { id: 'test', tab: { id: 9 }, url: 'chrome-extension://test/options.html' };
  assert.equal((await app.send({ type: 'activate-current-tab', tabId: 1 }, sender)).active, true);
  assert.equal((await app.send({ type: 'reset-all' }, sender)).reset, true);
  assert.deepEqual(app.session, {});
});
