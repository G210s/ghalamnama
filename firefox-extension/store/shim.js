// Stand-in for the extension APIs so store scenes render the real UI outside a browser extension.
(function () {
  const values = Object.assign({ onboardingComplete: true, enabledLanguages: ["fa", "ar", "he", "ru", "el"], language: "fa", keyboardMode: "ghalamnama" }, window.GHALAMNAMA_PRESET || {});
  const hub = () => ({ addListener() {}, removeListener() {} });
  window.browser = {
    storage: {
      local: {
        async get(keys) { return Object.fromEntries([keys].flat().map((key) => [key, values[key]])); },
        async set(update) { Object.assign(values, update); },
        async remove() {}
      },
      onChanged: hub()
    },
    runtime: { onMessage: hub(), async sendMessage(message) { return message.type === "tab-status" ? { active: true } : {}; }, openOptionsPage() {} },
    tabs: { async query() { return [{ id: 1 }]; }, async sendMessage() {} }
  };
})();
