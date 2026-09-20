(function () {
  "use strict";

  const languages = ["fa", "ar", "he", "ru", "el"];
  const defaults = {
    enabledLanguages: [...languages],
    language: "fa",
    keyboardMode: "ghalamnama",
    keyHighlight: true,
    revealShortcut: true
  };

  const error = document.getElementById("error");
  const saved = document.getElementById("saved");
  const checkboxes = [...document.querySelectorAll("#language-settings input[type='checkbox']")];
  const defaultLanguage = document.getElementById("default-language");
  const typingMode = document.getElementById("typing-mode");
  const keyHighlight = document.getElementById("key-highlight");
  const revealShortcut = document.getElementById("reveal-shortcut");
  const save = document.getElementById("save");
  const reset = document.getElementById("reset");

  function showError(message) {
    saved.hidden = true;
    error.hidden = false;
    error.textContent = message;
  }

  function showSaved() {
    error.hidden = true;
    saved.hidden = false;
    window.setTimeout(() => { saved.hidden = true; }, 2000);
  }

  async function load() {
    const values = await browser.storage.local.get(Object.keys(defaults));
    const enabled = Array.isArray(values.enabledLanguages)
      ? languages.filter((key) => values.enabledLanguages.includes(key))
      : defaults.enabledLanguages;
    if (enabled.length === 0) enabled.push(...defaults.enabledLanguages);
    checkboxes.forEach((checkbox) => { checkbox.checked = enabled.includes(checkbox.value); });
    defaultLanguage.value = enabled.includes(values.language ?? "") ? values.language : enabled[0];
    typingMode.value = values.keyboardMode === "os" ? "os" : defaults.keyboardMode;
    keyHighlight.checked = values.keyHighlight !== false;
    revealShortcut.checked = values.revealShortcut !== false;
  }

  async function broadcastSettings() {
    const values = await browser.storage.local.get(["enabledLanguages"]);
    const tabs = await browser.tabs.query({});
    await Promise.all(tabs.map(async (tab) => {
      if (!tab.id) return;
      try {
        await browser.tabs.sendMessage(tab.id, { type: "settings", enabledLanguages: values.enabledLanguages });
      } catch (_) {}
    }));
  }

  save.onclick = async () => {
    const selected = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
    if (!selected.length) return showError("Select at least one language.");
    if (!selected.includes(defaultLanguage.value)) {
      return showError("The default language must be one of the enabled languages.");
    }
    await browser.storage.local.set({
      enabledLanguages: selected,
      language: defaultLanguage.value,
      keyboardMode: typingMode.value,
      keyHighlight: keyHighlight.checked,
      revealShortcut: revealShortcut.checked,
      onboardingComplete: true
    });
    await broadcastSettings();
    showSaved();
  };

  reset.onclick = async () => {
    if (!window.confirm("Reset all Ghalamnama settings to their defaults? This also forgets which tabs were activated.")) return;
    await browser.runtime.sendMessage({ type: "reset-all" });
    await load();
    showSaved();
  };

  load().catch(() => showError("Unable to load settings."));
})();
