const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(`${__dirname}/../content-script.js`, 'utf8');

function eventHub() {
  const listeners = new Set();
  return { listeners, addListener: fn => listeners.add(fn), removeListener: fn => listeners.delete(fn) };
}
class Element {
  constructor() { this.style = {}; this.children = []; this.dataset = {}; this.hidden = false; this.classList = { add() {}, remove() {} }; }
  append(...children) { this.children.push(...children); }
  appendChild(child) { this.append(child); }
  setAttribute() {}
  addEventListener() {}
  matches() { return false; }
  querySelector() { return new Element(); }
  querySelectorAll() { return []; }
  remove() { this.removed = true; }
}
function setup(values) {
  const onMessage = eventHub();
  const onChanged = eventHub();
  const root = new Element();
  const errors = [];
  const context = vm.createContext({
    Element, console: { warn: (...args) => errors.push(args) },
    document: { documentElement: root, activeElement: new Element(), createElement: () => new Element(), addEventListener() {}, removeEventListener() {} },
    window: { innerWidth: 900, innerHeight: 700, addEventListener() {}, removeEventListener() {}, setTimeout },
    browser: {
      storage: { local: { get: async () => ({ ...values }), set: async update => Object.assign(values, update) }, onChanged },
      runtime: { onMessage, sendMessage: async () => {} }
    }
  });
  const run = () => vm.runInContext(source, context);
  run();
  return { values, onMessage, onChanged, root, errors, run };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('restores visible control, saved language and clamped position without initialization errors', async () => {
  const app = setup({ language: 'ru', position: { left: -50, top: 800 } });
  await settle();
  const host = app.root.children[0];
  assert.equal(host.children[0].hidden, false);
  assert.match(host.children[0].textContent, /Русский/);
  assert.equal(host.style.left, '0px');
  assert.equal(host.style.top, '660px');
  assert.deepEqual(app.errors, []);
});
test('restores hidden preference and applies changed preferences on the same page', async () => {
  const app = setup({ hidden: true, language: 'fa' });
  await settle();
  const toggle = app.root.children[0].children[0];
  assert.equal(toggle.hidden, true);
  Object.assign(app.values, { hidden: false, language: 'el', keyboardMode: 'os' });
  for (const listener of app.onChanged.listeners) listener({ hidden: {}, language: {}, keyboardMode: {} }, 'local');
  await settle();
  assert.equal(toggle.hidden, false);
  assert.match(toggle.textContent, /Ελληνικά/);
  assert.deepEqual(app.errors, []);
});
test('deactivation removes stale message and storage listeners before reactivation', async () => {
  const app = setup({});
  await settle();
  const listener = [...app.onMessage.listeners][0];
  assert.equal(listener({ type: 'ping' }).ready, true);
  listener({ type: 'deactivate' });
  assert.equal(app.onMessage.listeners.size, 0);
  assert.equal(app.onChanged.listeners.size, 0);
  assert.equal(listener({ type: 'ping' }), undefined);
  app.run();
  await settle();
  assert.equal(app.onMessage.listeners.size, 1);
  assert.equal(app.root.children[1].children[0].hidden, false);
});
