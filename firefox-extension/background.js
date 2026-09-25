(function () {
  "use strict";

  const enabledTabs = new Set();

  async function persistEnabledTabs() {
    await browser.storage.local.set({ enabledTabIds: [...enabledTabs] });
  }

  function isProtectedUrl(url) {
    return !url || /^(about|moz-extension|chrome|resource|view-source):/i.test(url);
  }

  async function contentScriptIsReady(tabId) {
    try {
      const response = await browser.tabs.sendMessage(tabId, { type: "ping" });
      return response?.ready === true;
    } catch (_) {
      return false;
    }
  }

  async function activate(tab, enabledLanguages) {
    if (!tab.id || isProtectedUrl(tab.url)) return;
    try {
      if (Array.isArray(enabledLanguages) && enabledLanguages.length) {
        await browser.storage.local.set({ enabledLanguages });
      }
      if (await contentScriptIsReady(tab.id)) {
        await browser.tabs.sendMessage(tab.id, { type: "settings", enabledLanguages });
        enabledTabs.add(tab.id);
        await persistEnabledTabs();
        return;
      }
      await browser.tabs.insertCSS(tab.id, { file: "keyboard.css" });
      await browser.tabs.executeScript(tab.id, { file: "content-script.js" });
      enabledTabs.add(tab.id);
      await persistEnabledTabs();
      await browser.browserAction.setTitle({ tabId: tab.id, title: "Deactivate Ghalamnama on this tab" });
    } catch (error) {
      enabledTabs.delete(tab.id);
      await persistEnabledTabs().catch(() => {});
      console.warn("Ghalamnama could not be activated on this tab.", error);
    }
  }

  function deactivate(tabId) {
    enabledTabs.delete(tabId);
    persistEnabledTabs().catch(() => {});
    browser.browserAction.setTitle({ tabId, title: "Activate Ghalamnama on this tab" }).catch(() => {});
  }

  async function resetAll() {
    const tabIds = [...enabledTabs];
    await Promise.all(tabIds.map(async (tabId) => {
      try { await browser.tabs.sendMessage(tabId, { type: "deactivate" }); } catch (_) {}
    }));
    enabledTabs.clear();
    await browser.storage.local.remove([
      "enabledLanguages", "language", "keyboardMode", "keyHighlight",
      "revealShortcut", "enabledTabIds", "position", "hidden", "onboardingComplete"
    ]);
    await persistEnabledTabs();
    await Promise.all(tabIds.map((tabId) =>
      browser.browserAction.setTitle({ tabId, title: "Activate Ghalamnama on this tab" }).catch(() => {})
    ));
  }

  async function toggleKeyboardOnActiveTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab?.id || !enabledTabs.has(tab.id)) return;
    try {
      await browser.tabs.sendMessage(tab.id, { type: "toggle-keyboard" });
    } catch (_) {}
  }

  async function toggleActivationOnActiveTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab?.id || isProtectedUrl(tab.url)) return;
    if (enabledTabs.has(tab.id)) {
      try { await browser.tabs.sendMessage(tab.id, { type: "deactivate" }); } catch (_) {}
      deactivate(tab.id);
      return;
    }
    const values = await browser.storage.local.get("enabledLanguages");
    await activate(tab, values.enabledLanguages);
  }

  async function toggleTypingModeOnActiveTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab?.id || !enabledTabs.has(tab.id)) return;
    try {
      await browser.tabs.sendMessage(tab.id, { type: "toggle-typing-mode" });
    } catch (_) {}
  }

  browser.commands.onCommand.addListener(async (command) => {
    if (command === "toggle-activation") await toggleActivationOnActiveTab();
    if (command === "toggle-keyboard") await toggleKeyboardOnActiveTab();
    if (command === "toggle-typing-mode") await toggleTypingModeOnActiveTab();
  });

  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason !== "install") return;
    browser.tabs.create({ url: browser.runtime.getURL("onboarding.html") }).catch(() => {});
  });

  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message?.type === "tab-status" && message.tabId) {
      return { active: enabledTabs.has(message.tabId) };
    }
    if (message?.type === "activate-current-tab" && message.tabId) {
      const tab = await browser.tabs.get(message.tabId);
      await activate(tab, message.enabledLanguages);
      return { active: enabledTabs.has(tab.id) };
    }
    if (message?.type === "deactivate-current-tab" && message.tabId) {
      try { await browser.tabs.sendMessage(message.tabId, { type: "deactivate" }); } catch (_) {}
      deactivate(message.tabId);
      return { active: false };
    }
    if (message?.type === "reset-all") {
      await resetAll();
      return { reset: true };
    }
  });

  browser.runtime.onMessage.addListener((message, sender) => {
    if (message?.type === "deactivate" && sender.tab?.id) deactivate(sender.tab.id);
    if (message?.type === "open-options") browser.runtime.openOptionsPage().catch(() => {});
  });

  browser.tabs.onRemoved.addListener((tabId) => {
    enabledTabs.delete(tabId);
    persistEnabledTabs().catch(() => {});
  });

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && enabledTabs.has(tabId)) {
      const values = await browser.storage.local.get("enabledLanguages");
      await activate(tab, values.enabledLanguages);
    }
  });

  browser.storage.local.get(["enabledTabIds", "enabledLanguages"]).then(async (values) => {
    const savedTabIds = Array.isArray(values.enabledTabIds) ? values.enabledTabIds : [];
    const tabs = await browser.tabs.query({});
    for (const tab of tabs) {
      if (savedTabIds.includes(tab.id) && tab.status === "complete") {
        enabledTabs.add(tab.id);
        await activate(tab, values.enabledLanguages);
      }
    }
  }).catch(() => {});
})();
