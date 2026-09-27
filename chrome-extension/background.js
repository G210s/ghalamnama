'use strict';

// Session storage survives worker suspension, but never reactivates reused tab IDs
// after a browser restart. Serialize events to avoid activation/removal races.
let pending = Promise.resolve();
function enqueue(task) {
  const result = pending.then(task);
  pending = result.catch(error => console.warn('Ghalamnama:', error));
  return result;
}
const keyFor = tabId => `activeTab:${tabId}`;
async function isActive(tabId) {
  return (await chrome.storage.session.get(keyFor(tabId)))[keyFor(tabId)] === true;
}
function allowed(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) &&
      parsed.hostname !== 'chromewebstore.google.com' &&
      !(parsed.hostname === 'chrome.google.com' && parsed.pathname.startsWith('/webstore'));
  } catch (_) { return false; }
}
async function setTitle(tabId, active) {
  await chrome.action.setTitle({ tabId, title: `${active ? 'Deactivate' : 'Activate'} Ghalamnama on this tab` }).catch(() => {});
}
async function activate(tabId, enabledLanguages) {
  const tab = await chrome.tabs.get(tabId);
  if (!allowed(tab.url)) return { active: false };
  if (Array.isArray(enabledLanguages) && enabledLanguages.length) {
    await chrome.storage.local.set({ enabledLanguages });
  }
  try {
    let ready = false;
    try { ready = (await chrome.tabs.sendMessage(tabId, { type: 'ping' }))?.ready === true; } catch (_) {}
    if (ready) {
      await chrome.tabs.sendMessage(tabId, { type: 'settings', enabledLanguages });
    } else {
      await chrome.scripting.insertCSS({ target: { tabId }, files: ['keyboard.css'] });
      await chrome.scripting.executeScript({ target: { tabId }, files: ['content-script.js'] });
    }
    await chrome.storage.session.set({ [keyFor(tabId)]: true });
    await setTitle(tabId, true);
    return { active: true };
  } catch (error) {
    await chrome.storage.session.remove(keyFor(tabId));
    await setTitle(tabId, false);
    console.warn('Ghalamnama could not activate this page.', error);
    return { active: false };
  }
}
async function deactivate(tabId, notify = true) {
  // Remove remembered activation before telling the content script to tear down.
  await chrome.storage.session.remove(keyFor(tabId));
  if (notify) {
    try { await chrome.tabs.sendMessage(tabId, { type: 'deactivate' }); } catch (_) {}
  }
  await chrome.scripting.removeCSS({ target: { tabId }, files: ['keyboard.css'] }).catch(() => {});
  await setTitle(tabId, false);
  return { active: false };
}
async function handleMessage(message, sender) {
  // A content script can only deactivate its own tab or open settings.
  const fromExtensionPage = sender.url?.startsWith(chrome.runtime.getURL('')) === true;
  if (sender.tab && !fromExtensionPage) {
    if (message.type === 'deactivate') return deactivate(sender.tab.id, false);
    if (message.type === 'open-options') { await chrome.runtime.openOptionsPage(); return {}; }
    return {};
  }
  const tabId = message.tabId;
  if (message.type === 'tab-status') return { active: Number.isInteger(tabId) && await isActive(tabId) };
  if (message.type === 'activate-current-tab' && Number.isInteger(tabId)) return activate(tabId, message.enabledLanguages);
  if (message.type === 'deactivate-current-tab' && Number.isInteger(tabId)) return deactivate(tabId);
  if (message.type === 'reset-all') {
    const state = await chrome.storage.session.get(null);
    for (const key of Object.keys(state)) {
      if (key.startsWith('activeTab:')) await deactivate(Number(key.slice(10)));
    }
    await chrome.storage.local.remove(['enabledLanguages', 'language', 'keyboardMode', 'keyHighlight', 'revealShortcut', 'enabledTabIds', 'position', 'hidden', 'onboardingComplete']);
    return { reset: true };
  }
  if (message.type === 'open-options') await chrome.runtime.openOptionsPage();
  return {};
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id || !message || typeof message.type !== 'string') return false;
  enqueue(() => handleMessage(message, sender)).then(respond, error => {
    console.warn('Ghalamnama message failed.', error);
    respond({ active: false, error: 'Unable to complete this action.' });
  });
  return true;
});
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') }).catch(() => {});
});
chrome.tabs.onRemoved.addListener(tabId => { enqueue(() => chrome.storage.session.remove(keyFor(tabId))); });
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== 'complete') return;
  enqueue(async () => {
    if (await isActive(tabId)) {
      const { enabledLanguages } = await chrome.storage.local.get('enabledLanguages');
      await activate(tabId, enabledLanguages);
    }
  });
});
chrome.commands.onCommand.addListener(command => enqueue(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  const active = await isActive(tab.id);
  if (command === 'toggle-activation') {
    if (active) await deactivate(tab.id);
    else {
      const { enabledLanguages } = await chrome.storage.local.get('enabledLanguages');
      await activate(tab.id, enabledLanguages);
    }
  } else if (active && ['toggle-keyboard', 'toggle-typing-mode'].includes(command)) {
    await chrome.tabs.sendMessage(tab.id, { type: command }).catch(() => {});
  }
}));
