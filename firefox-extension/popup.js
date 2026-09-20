(function () {
  "use strict";

  const languages = ["fa", "ar", "he", "ru", "el"];
  const languageNames = { fa: "فارسی", ar: "العربية", he: "עברית", ru: "Русский", el: "Ελληνικά" };
  const intro = document.getElementById("intro");
  const error = document.getElementById("error");
  const status = document.getElementById("status");
  const activate = document.getElementById("activate");
  const deactivate = document.getElementById("deactivate");
  const settings = document.getElementById("settings");
  const openSettings = document.getElementById("open-settings");
  const saveLanguages = document.getElementById("save-languages");
  const showIcon = document.getElementById("show-icon");
  const languageSettings = document.getElementById("language-settings");
  const currentLanguageLabel = document.getElementById("current-language-label");
  const currentLanguage = document.getElementById("current-language");
  const checkboxes = [...document.querySelectorAll("input[type='checkbox']")];
  let currentKeyboardMode = "ghalamnama";

  function selectedLanguages() {
    return checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
  }

  function showError(message) {
    error.hidden = false;
    error.textContent = message;
  }

  async function currentTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  }

  async function initialize() {
    const values = await browser.storage.local.get(["enabledLanguages", "onboardingComplete", "hidden", "keyboardMode", "language"]);
    const enabled = Array.isArray(values.enabledLanguages) ? values.enabledLanguages : languages;
    currentKeyboardMode = values.keyboardMode === "os" ? "os" : "ghalamnama";
    checkboxes.forEach((checkbox) => { checkbox.checked = enabled.includes(checkbox.value); });
    if (values.onboardingComplete) {
      intro.textContent = `Current layout: ${languageNames[values.language] || languageNames[enabled[0]] || languageNames.fa}. Mode: ${currentKeyboardMode === "os" ? "System keyboard" : "Ghalamnama layout"}.`;
      languageSettings.hidden = true;
      settings.hidden = true;
      saveLanguages.hidden = true;
      openSettings.hidden = false;
      showIcon.hidden = true;
      status.hidden = false;
      currentLanguage.innerHTML = enabled.map((key) =>
        `<option value="${key}"${key === values.language ? " selected" : ""}>${languageNames[key]}</option>`).join("");
      currentLanguage.value = languages.includes(values.language) && enabled.includes(values.language)
        ? values.language : enabled[0];
      currentLanguageLabel.hidden = false;
      currentLanguage.hidden = false;
    }
    const tab = await currentTab();
    const response = await browser.runtime.sendMessage({ type: "tab-status", tabId: tab?.id });
    const active = Boolean(response?.active);
    showIcon.hidden = !active || !values.hidden;
    if (active) {
      status.textContent = "Active on this tab — stays active when this tab reloads.";
      activate.hidden = true;
      deactivate.hidden = false;
    } else {
      status.textContent = "Inactive on this tab";
      activate.hidden = false;
      deactivate.hidden = true;
    }
  }

  openSettings.onclick = () => {
    browser.runtime.openOptionsPage();
    window.close();
  };

  currentLanguage.onchange = async () => {
    await browser.storage.local.set({ language: currentLanguage.value });
    intro.textContent = `Current layout: ${languageNames[currentLanguage.value]}. Mode: ${currentKeyboardMode === "os" ? "System keyboard" : "Ghalamnama layout"}.`;
  };

  settings.onclick = () => {
    languageSettings.hidden = false;
    settings.hidden = true;
    saveLanguages.hidden = false;
    activate.hidden = true;
    deactivate.hidden = true;
  };

  saveLanguages.onclick = async () => {
    const selected = selectedLanguages();
    if (!selected.length) return showError("Select at least one language.");
    const tab = await currentTab();
    if (!tab?.id) return showError("This page cannot be activated.");
    await browser.storage.local.set({ enabledLanguages: selected });
    await browser.runtime.sendMessage({ type: "activate-current-tab", tabId: tab.id, enabledLanguages: selected });
    window.close();
  };

  showIcon.onclick = async () => {
    const tab = await currentTab();
    if (tab?.id) await browser.tabs.sendMessage(tab.id, { type: "show-icon" });
    window.close();
  };

  activate.onclick = async () => {
    const selected = selectedLanguages();
    if (!selected.length) return showError("Select at least one language.");
    const tab = await currentTab();
    if (!tab?.id) return showError("This page cannot be activated.");
    await browser.storage.local.set({ enabledLanguages: selected, onboardingComplete: true });
    const response = await browser.runtime.sendMessage({ type: "activate-current-tab", tabId: tab.id, enabledLanguages: selected });
    if (!response?.active) return showError("Ghalamnama cannot run on this page.");
    window.close();
  };

  deactivate.onclick = async () => {
    const tab = await currentTab();
    if (tab?.id) await browser.runtime.sendMessage({ type: "deactivate-current-tab", tabId: tab.id });
    window.close();
  };

  initialize().catch(() => showError("Unable to load Ghalamnama settings."));
})();
