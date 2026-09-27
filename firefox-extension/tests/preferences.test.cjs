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
  constructor() { this.style = {}; this.children = []; this.dataset = {}; this.hidden = false; this.isContentEditable = false; this.classList = { add() {}, remove() {} }; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  appendChild(child) { this.append(child); }
  setAttribute() {}
  addEventListener() {}
  matches() { return false; }
  closest() { return null; }
  contains() { return true; }
  dispatchEvent() {}
  focus() {}
  querySelector() { return new Element(); }
  querySelectorAll() { return []; }
  remove() { this.removed = true; }
}
function setup(values) {
  const onMessage = eventHub();
  const onChanged = eventHub();
  const root = new Element();
  const errors = [];
  const documentListeners = new Map();
  const commands = [];
  const selection = { rangeCount: 1, getRangeAt: () => ({ commonAncestorContainer: new Element() }) };
  const document = {
    documentElement: root,
    activeElement: new Element(),
    createElement: () => new Element(),
    addEventListener(type, listener) { documentListeners.set(type, listener); },
    removeEventListener(type) { documentListeners.delete(type); },
    execCommand(command, _ui, value) { commands.push({ command, value }); return true; }
  };
  const context = vm.createContext({
    Element, console: { warn: (...args) => errors.push(args) },
    document,
    window: { innerWidth: 900, innerHeight: 700, addEventListener() {}, removeEventListener() {}, setTimeout, getSelection: () => selection },
    browser: {
      storage: { local: { get: async () => ({ ...values }), set: async update => Object.assign(values, update) }, onChanged },
      runtime: { onMessage, sendMessage: async () => {} }
    }
  });
  const run = () => vm.runInContext(source, context);
  run();
  return { values, onMessage, onChanged, root, errors, run, document, documentListeners, commands };
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

test('finds and edits a contenteditable inside a retargeted shadow DOM event', async () => {
  const app = setup({ language: 'fa' });
  await settle();
  const editor = new Element();
  editor.isContentEditable = true;
  const shadowHost = new Element();
  shadowHost.shadowRoot = { activeElement: editor };
  app.document.activeElement = shadowHost;
  const composedPath = () => [editor, shadowHost, app.document];

  app.documentListeners.get('focusin')({ target: shadowHost, composedPath });
  let prevented = false;
  app.documentListeners.get('keydown')({
    target: shadowHost, composedPath, code: 'KeyQ', key: 'q',
    shiftKey: false, altKey: false, ctrlKey: false, metaKey: false,
    isComposing: false, preventDefault() { prevented = true; }
  });

  assert.equal(prevented, true);
  assert.deepEqual(app.commands, [{ command: 'insertText', value: 'ض' }]);
  assert.equal(app.root.children[0].children[0].hidden, false);
});

test('message toggles between Ghalamnama and system keyboard modes', async () => {
  const app = setup({ keyboardMode: 'ghalamnama' });
  await settle();
  const listener = [...app.onMessage.listeners][0];

  assert.equal(listener({ type: 'toggle-typing-mode' }).keyboardMode, 'os');
  assert.equal(app.values.keyboardMode, 'os');
  assert.equal(listener({ type: 'toggle-typing-mode' }).keyboardMode, 'ghalamnama');
  assert.equal(app.values.keyboardMode, 'ghalamnama');
});

test('maps physical typing in an email field such as the Reddit sign-in modal', async () => {
  const app = setup({ language: 'fa' });
  await settle();
  const email = new Element();
  email.matches = selector => selector.includes("input[type='email']");
  app.document.activeElement = email;
  const composedPath = () => [email, app.document];
  app.documentListeners.get('focusin')({ target: email, composedPath });
  let prevented = false;

  app.documentListeners.get('keydown')({
    target: email, composedPath, code: 'KeyQ', key: 'q',
    shiftKey: false, altKey: false, ctrlKey: false, metaKey: false,
    isComposing: false, preventDefault() { prevented = true; }
  });

  assert.equal(prevented, true);
  assert.deepEqual(app.commands, [{ command: 'insertText', value: 'ض' }]);
});
