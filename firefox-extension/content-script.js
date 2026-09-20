(function () {
  "use strict";

  if (window.__ghalamnamaKeyboardLoaded) return;
  window.__ghalamnamaKeyboardLoaded = true;

  const layouts = {
    fa: { name: "فارسی", dir: "rtl", numbers: ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰", "-", "="], numberShift: ["!", "٫", "٬", "﷼", "٪", "×", "،", "*", ")", "(", "ـ", "+"], rows: [["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ"], ["ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ"], ["ظ", "ط", "ز", "ر", "ذ", "د", "پ", "و", "ژ", "/"]], shifts: [["ْ", "ٌ", "ٍ", "ً", "ُ", "ِ", "َ", "ّ", "ٓ", "ٔ", "}", "{"], ["ؤ", "إ", "أ", "آ", "ة", "»", "«", ":", "؛", "ي", "ۀ"], ["ك", "ة", "ي", "ئ", "ؤ", "إ", "أ", ">", "<", "؟"]] },
    ar: { name: "العربية", dir: "rtl", numbers: ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠", "-", "="], numberShift: ["!", "@", "#", "$", "%", "^", "&", "*", ")", "(", "_", "+"], rows: [["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"], ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"], ["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ"]], shifts: [["َ", "ً", "ُ", "ٌ", "لإ", "إ", "‘", "÷", "×", "؛", "<", ">"], ["ِ", "ٍ", "]", "[", "لأ", "أ", "ـ", "،", "/", ":", "\""], ["~", "ْ", "}", "{", "لآ", "آ", "'", ",", ".", "؟"]] },
    he: { name: "עברית", dir: "rtl", numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="], numberShift: ["!", "@", "#", "$", "%", "^", "&", "*", ")", "(", "_", "+"], rows: [["/", "'", "ק", "ר", "א", "ט", "ו", "ן", "ם", "פ", "[", "]"], ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף", ","], ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ", "."]], shifts: [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}"], ["A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\""], ["Z", "X", "C", "V", "B", "N", "M", "<", ">", "?"]] },
    ru: { name: "Русский", dir: "ltr", numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="], numberShift: ["!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "_", "+"], rows: [["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"], ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"], ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "."]], shifts: [["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ"], ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э"], ["Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ","]] },
    el: { name: "Ελληνικά", dir: "ltr", numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="], numberShift: ["!", "@", "#", "$", "%", "^", "&", "*", ")", "(", "_", "+"], rows: [[";", "ς", "ε", "ρ", "τ", "υ", "θ", "ι", "ο", "π", "[", "]"], ["α", "σ", "δ", "φ", "γ", "η", "ξ", "κ", "λ", "΄", "¨"], ["ζ", "χ", "ψ", "ω", "β", "ν", "μ", ",", ".", "/"]], shifts: [[":", "Σ", "Ε", "Ρ", "Τ", "Υ", "Θ", "Ι", "Ο", "Π", "{", "}"], ["Α", "Σ", "Δ", "Φ", "Γ", "Η", "Ξ", "Κ", "Λ", "΄", "¨"], ["Ζ", "Χ", "Ψ", "Ω", "Β", "Ν", "Μ", "<", ">", "?"]] }
  };
  const languageKeys = Object.keys(layouts);
  const physicalRows = [
    ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal"],
    ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
    ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
    ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash"]
  ];
  const labels = { fa: { show: "⌨ فارسی", hide: "⌨ بستن", map: "تبدیل کلیدها", space: "فاصله", clear: "پاک‌کردن", hideIcon: "پنهان‌کردن", shift: "⇧ شیفت", language: "زبان", os: "صفحه‌کلید سیستم", ghalam: "صفحه‌کلید قلم‌نما", deactivate: "غیرفعال‌کردن" }, ar: { show: "⌨ العربية", hide: "⌨ إغلاق", map: "تحويل المفاتيح", space: "مسافة", clear: "مسح", hideIcon: "إخفاء", shift: "⇧ تحويل", language: "اللغة", os: "لوحة النظام", ghalam: "لوحة قلم‌نما", deactivate: "تعطيل" }, he: { show: "⌨ עברית", hide: "⌨ סגירה", map: "מיפוי מקשים", space: "רווח", clear: "נקה", hideIcon: "הסתרה", shift: "⇧ Shift", language: "שפה", os: "מקלדת מערכת", ghalam: "מקלדת גלאם-נאמא", deactivate: "השבתה" }, ru: { show: "⌨ Русский", hide: "⌨ Закрыть", map: "Раскладка", space: "Пробел", clear: "Очистить", hideIcon: "Скрыть", shift: "⇧ Shift", language: "Язык", os: "Системная клавиатура", ghalam: "Клавиатура Ghalamnama", deactivate: "Отключить" }, el: { show: "⌨ Ελληνικά", hide: "⌨ Κλείσιμο", map: "Αντιστοίχιση", space: "Κενό", clear: "Καθαρισμός", hideIcon: "Απόκρυψη", shift: "⇧ Shift", language: "Γλώσσα", os: "Πληκτρολόγιο συστήματος", ghalam: "Πληκτρολόγιο Ghalamnama", deactivate: "Απενεργοποίηση" } };
  let activeField = null;
  let mappingEnabled = true;
  let panel;
  let toggle;
  let hiddenByUser = false;
  let dragging = false;
  let moved = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let selectedLanguage = "fa";
  let enabledLanguages = [...languageKeys];
  let shiftEnabled = false;
  let keyboardMode = "ghalamnama";
  let revealShortcutEnabled = true;
  let keyHighlightEnabled = true;
  let capsLockEnabled = false;
  let deactivated = false;

  function storageGet(key, fallback) {
    return browser.storage.local.get(key).then((values) => values[key] ?? fallback);
  }

  function storageSet(values) {
    return browser.storage.local.set(values).catch(() => {});
  }

  function fieldSelector(field) {
    return field instanceof Element
      && !field.disabled
      && !field.readOnly
      && field.matches("textarea, input[type='text'], input[type='search'], input:not([type])");
  }

  function isContenteditable(field) {
    if (!(field instanceof Element)) return false;
    if (field.isContentEditable !== true) return false;
    return !field.closest("[contenteditable='false'], [aria-readonly='true']");
  }

  function isWritable(field) {
    return fieldSelector(field) || isContenteditable(field);
  }

  function readSelection(field) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (!field.contains(range.commonAncestorContainer)) return null;
    return { selection, range };
  }

  function insertContenteditable(field, value) {
    const found = readSelection(field);
    if (!found) {
      // No usable selection: append at the end as a conservative fallback.
      field.append(value);
    } else {
      const { range } = found;
      range.deleteContents();
      if (value === "\n") {
        range.insertNode(document.createElement("br"));
        range.collapse(false);
      } else {
        const node = document.createTextNode(value);
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
      }
      found.selection.removeAllRanges();
      found.selection.addRange(range);
    }
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.focus();
  }

  function backspaceContenteditable(field) {
    const found = readSelection(field);
    if (!found) return;
    const textNode = found.range.startContainer;
    if (found.range.collapsed && textNode.nodeType === Node.TEXT_NODE) {
      const offset = found.range.startOffset;
      if (offset === 0) return; // start of text node: leave structure untouched
      textNode.textContent = textNode.textContent.slice(0, offset - 1) + textNode.textContent.slice(offset);
      found.range.setStart(textNode, offset - 1);
      found.range.collapse(true);
      found.selection.removeAllRanges();
      found.selection.addRange(found.range);
    } else {
      found.range.deleteContents();
      found.selection.removeAllRanges();
    }
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.focus();
  }

  function setText(field, value) {
    if (!isWritable(field)) return;
    if (isContenteditable(field)) return insertContenteditable(field, value);
    const start = field.selectionStart ?? field.value.length;
    const end = field.selectionEnd ?? start;
    field.setRangeText(value, start, end, "end");
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.focus();
  }

  function backspace(field) {
    if (!isWritable(field)) return;
    if (isContenteditable(field)) return backspaceContenteditable(field);
    const start = field.selectionStart ?? 0;
    const end = field.selectionEnd ?? start;
    if (start !== end) return setText(field, "");
    if (start === 0) return;
    const previous = [...field.value].slice(0, start - 1).join("");
    field.setSelectionRange(previous.length, start);
    setText(field, "");
  }

  function render() {
    const layout = layouts[selectedLanguage];
    const copy = labels[selectedLanguage];
    panel.dir = layout.dir;
    const rows = [layout.numbers, ...layout.rows];
    const shiftedRows = [layout.numberShift, ...layout.shifts];
    panel.innerHTML = `<div class="ghalamnama-keyboard-toolbar"><label>Language <select data-action="language" aria-label="${copy.language}">${enabledLanguages.map((key) => `<option value="${key}"${key === selectedLanguage ? " selected" : ""}>${layouts[key].name}</option>`).join("")}</select></label><label>Physical typing <select data-action="keyboard-mode" aria-label="Physical typing mode"><option value="ghalamnama"${keyboardMode === "ghalamnama" ? " selected" : ""}>Ghalamnama layout</option><option value="os"${keyboardMode === "os" ? " selected" : ""}>System keyboard</option></select></label><button class="ghalamnama-keyboard-mode" data-action="manage" aria-label="Manage languages" title="Manage languages">⚙</button><button class="ghalamnama-keyboard-mode" data-action="deactivate">Turn off for this tab</button><button class="ghalamnama-keyboard-mode" data-action="hide">${copy.hideIcon}</button></div>${keyboardMode === "os" ? `<p class="ghalamnama-keyboard-os-message">Physical keys use your system keyboard. Click keys below to insert this layout.</p>` : ""}<div class="ghalamnama-keyboard-keys"></div><div class="ghalamnama-keyboard-actions"><button data-action="shift" aria-pressed="${shiftEnabled}" aria-label="Shift">${copy.shift}</button><button data-action="space" class="space">${copy.space}</button><button data-action="enter">↵ Enter</button></div>`;
    panel.querySelector("[data-action='keyboard-mode']").onchange = (event) => {
      keyboardMode = event.target.value === "os" ? "os" : "ghalamnama";
      storageSet({ keyboardMode });
      render();
    };
    panel.querySelector("[data-action='deactivate']").onclick = deactivate;
    const keyContainer = panel.querySelector(".ghalamnama-keyboard-keys");
    rows.forEach((row, rowIndex) => {
      const rowElement = document.createElement("div");
      rowElement.className = `ghalamnama-keyboard-row row-${rowIndex}`;
      const leadingKey = document.createElement("button");
      leadingKey.className = "ghalamnama-keyboard-key special";
      leadingKey.type = "button";
      leadingKey.textContent = ["Esc", "Tab", "Caps", "Shift"][rowIndex];
      leadingKey.setAttribute("aria-pressed", rowIndex === 2 ? String(capsLockEnabled) : "false");
      if (rowIndex === 0) leadingKey.onclick = () => closePanel();
      if (rowIndex === 1) leadingKey.onclick = () => setText(activeField, "\t");
      if (rowIndex === 2) leadingKey.onclick = () => { capsLockEnabled = !capsLockEnabled; render(); };
      if (rowIndex === 3) leadingKey.onclick = () => { shiftEnabled = !shiftEnabled; render(); };
      rowElement.appendChild(leadingKey);
      row.forEach((value, keyIndex) => {
        const button = document.createElement("button");
        button.className = "ghalamnama-keyboard-key";
        button.type = "button";
        button.dataset.code = physicalRows[rowIndex][keyIndex];
        button.textContent = shiftEnabled || capsLockEnabled ? (shiftedRows[rowIndex][keyIndex] ?? value) : value;
        button.addEventListener("pointerdown", (event) => event.preventDefault());
        button.onclick = () => setText(activeField, button.textContent);
        rowElement.appendChild(button);
      });
      const trailingKey = document.createElement("button");
      trailingKey.className = "ghalamnama-keyboard-key special trailing";
      trailingKey.type = "button";
      trailingKey.textContent = ["⌫", "\\", "↵", "Shift"][rowIndex];
      trailingKey.addEventListener("pointerdown", (event) => event.preventDefault());
      if (rowIndex === 0) trailingKey.onclick = () => backspace(activeField);
      if (rowIndex === 1) trailingKey.onclick = () => setText(activeField, "\\");
      if (rowIndex === 2) trailingKey.onclick = () => setText(activeField, "\n");
      if (rowIndex === 3) trailingKey.onclick = () => { shiftEnabled = !shiftEnabled; render(); };
      rowElement.appendChild(trailingKey);
      keyContainer.appendChild(rowElement);
    });
    panel.querySelector("[data-action='language']").onchange = (event) => {
      selectedLanguage = event.target.value;
      shiftEnabled = false;
      capsLockEnabled = false;
      storageSet({ language: selectedLanguage });
      render();
    };
    panel.querySelector("[data-action='manage']").onclick = () => {
      browser.runtime.sendMessage({ type: "open-options" }).catch(() => {});
    };
    panel.querySelector("[data-action='shift']").onclick = () => { shiftEnabled = !shiftEnabled; render(); };
    panel.querySelector("[data-action='hide']").onclick = hideIcon;
    panel.querySelector("[data-action='space']").onclick = () => setText(activeField, " ");
    panel.querySelector("[data-action='enter']").onclick = () => setText(activeField, "\n");
    panel.querySelectorAll(".ghalamnama-keyboard-toolbar button").forEach((button) =>
      button.addEventListener("pointerdown", (event) => event.preventDefault()));
  }

  function showFor(field) {
    activeField = field;
    if (hiddenByUser) return;
    toggle.hidden = false;
    toggle.textContent = panel.hidden ? labels[selectedLanguage].show : labels[selectedLanguage].hide;
    render();
  }

  function highlightPhysicalKey(code) {
    if (!keyHighlightEnabled) return;
    const element = keyElementFor(code);
    if (!element) return;
    element.classList.add("pressed");
    window.setTimeout(() => element.classList.remove("pressed"), 150);
  }

  function mapPhysicalKey(event) {
    highlightPhysicalKey(event.code);
    if (deactivated) return;
    if (revealShortcutEnabled && event.altKey && event.shiftKey && event.key.toLowerCase() === "k") {
      event.preventDefault();
      hiddenByUser = false;
      toggle.hidden = false;
      storageSet({ hidden: false });
      return;
    }
    if (keyboardMode === "os") return;
    if (event.key === "CapsLock") {
      capsLockEnabled = event.getModifierState?.("CapsLock") ?? !capsLockEnabled;
      if (!panel.hidden) render();
      return;
    }
    if (event.key === "Shift") {
      shiftEnabled = true;
      if (!panel.hidden) render();
      return;
    }
    if (!mappingEnabled || !activeField || activeField !== document.activeElement || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
    const layout = layouts[selectedLanguage];
    const allKeys = [layout.numbers, ...layout.rows];
    const allShiftedKeys = [layout.numberShift, ...layout.shifts];
    let mapped;
    physicalRows.some((row, rowIndex) => {
      const keyIndex = row.indexOf(event.code);
      if (keyIndex === -1) return false;
      mapped = event.shiftKey || shiftEnabled || capsLockEnabled ? (allShiftedKeys[rowIndex][keyIndex] ?? allKeys[rowIndex][keyIndex]) : allKeys[rowIndex][keyIndex];
      return true;
    });
    if (!mapped) return;
    event.preventDefault();
    setText(activeField, mapped);
  }

  function releaseShift(event) {
    if (event.key !== "Shift") return;
    shiftEnabled = false;
    if (!panel.hidden) render();
  }

  function deactivate() {
    if (deactivated) return;
    deactivated = true;
    document.removeEventListener("focusin", handleFocus);
    document.removeEventListener("keydown", mapPhysicalKey, true);
    document.removeEventListener("keyup", releaseShift, true);
    window.removeEventListener("blur", clearPressedKeys, true);
    window.removeEventListener("resize", positionPanel);
    browser.runtime.onMessage.removeListener(handleMessage);
    browser.storage.onChanged.removeListener(handleStorageChange);
    panel.hidden = true;
    toggle.hidden = true;
    host.remove();
    window.__ghalamnamaKeyboardLoaded = false;
    browser.runtime.sendMessage({ type: "deactivate" }).catch(() => {});
  }

  const host = document.createElement("div");
  host.className = "ghalamnama-keyboard-host";
  toggle = document.createElement("button");
  toggle.className = "ghalamnama-keyboard-toggle";
  toggle.type = "button";
  toggle.hidden = true;
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open Ghalamnama keyboard");
  panel = document.createElement("div");
  panel.className = "ghalamnama-keyboard-panel";
  panel.hidden = true;
  host.append(toggle, panel);
  document.documentElement.appendChild(host);
  function hideIcon() {
    hiddenByUser = true;
    panel.hidden = true;
    toggle.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    storageSet({ hidden: true });
  }

  function showIcon() {
    hiddenByUser = false;
    toggle.hidden = false;
    toggle.textContent = labels[selectedLanguage].show;
    toggle.setAttribute("aria-expanded", "false");
    storageSet({ hidden: false });
  }

  function closePanel() {
    panel.hidden = true;
    toggle.textContent = labels[selectedLanguage].show;
    toggle.setAttribute("aria-expanded", "false");
  }

  function positionPanel() {
    if (panel.hidden) return;
    const toggleRect = toggle.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const left = Math.max(8, Math.min(toggleRect.right - panelRect.width, window.innerWidth - panelRect.width - 8));
    const preferredTop = toggleRect.top - panelRect.height - 8;
    const top = Math.max(8, Math.min(preferredTop < 8 ? toggleRect.bottom + 8 : preferredTop, window.innerHeight - panelRect.height - 8));
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }

  toggle.onclick = () => {
    if (moved) return;
    panel.hidden = !panel.hidden;
    toggle.textContent = panel.hidden ? labels[selectedLanguage].show : labels[selectedLanguage].hide;
    toggle.setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) {
      render();
      positionPanel();
    }
  };
  toggle.addEventListener("pointerdown", (event) => {
    dragging = true;
    moved = false;
    const rect = host.getBoundingClientRect();
    dragOffsetX = event.clientX - rect.left;
    dragOffsetY = event.clientY - rect.top;
    toggle.setPointerCapture(event.pointerId);
  });
  toggle.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    moved = true;
    const left = Math.max(0, Math.min(window.innerWidth - toggle.offsetWidth, event.clientX - dragOffsetX));
    const top = Math.max(0, Math.min(window.innerHeight - toggle.offsetHeight, event.clientY - dragOffsetY));
    host.style.left = `${left}px`;
    host.style.top = `${top}px`;
    host.style.right = "auto";
    host.style.bottom = "auto";
  });
  toggle.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    if (moved) storageSet({ position: { left: host.offsetLeft, top: host.offsetTop } });
    window.setTimeout(() => { moved = false; }, 0);
  });
  function handleFocus(event) {
    if (!deactivated && isWritable(event.target)) showFor(event.target);
  }
  document.addEventListener("focusin", handleFocus);
  document.addEventListener("keydown", mapPhysicalKey, true);
  document.addEventListener("keyup", releaseShift, true);
  function handleMessage(message) {
    if (deactivated) return;
    if (message?.type === "ping") return { ready: true };
    if (message?.type === "settings" && Array.isArray(message.enabledLanguages)) {
      enabledLanguages = languageKeys.filter((key) => message.enabledLanguages.includes(key));
      if (!enabledLanguages.includes(selectedLanguage)) selectedLanguage = enabledLanguages[0] || "fa";
      render();
      storageGet("revealShortcut", true).then((value) => { revealShortcutEnabled = value !== false; });
      storageGet("keyHighlight", true).then((value) => { keyHighlightEnabled = value !== false; });
    }
    if (message?.type === "show-icon") showIcon();
    if (message?.type === "deactivate") deactivate();
    if (message?.type === "toggle-keyboard") {
      if (hiddenByUser) {
        showIcon();
      } else if (!activeField && panel.hidden) {
        // No writable field is focused yet; surface the control so the user can start.
        toggle.hidden = false;
      } else {
        panel.hidden = !panel.hidden;
        toggle.textContent = panel.hidden ? labels[selectedLanguage].show : labels[selectedLanguage].hide;
        toggle.setAttribute("aria-expanded", String(!panel.hidden));
        if (!panel.hidden) { render(); positionPanel(); }
      }
    }
  }
  async function restorePreferences() {
    const values = await browser.storage.local.get([
      "hidden", "position", "language", "enabledLanguages", "keyboardMode",
      "revealShortcut", "keyHighlight"
    ]);
    if (deactivated) return;
    enabledLanguages = languageKeys.filter((key) =>
      Array.isArray(values.enabledLanguages) && values.enabledLanguages.includes(key));
    if (!enabledLanguages.length) enabledLanguages = [...languageKeys];
    selectedLanguage = enabledLanguages.includes(values.language) ? values.language : enabledLanguages[0];
    keyboardMode = values.keyboardMode === "os" ? "os" : "ghalamnama";
    revealShortcutEnabled = values.revealShortcut !== false;
    keyHighlightEnabled = values.keyHighlight !== false;
    hiddenByUser = values.hidden === true;
    const position = values.position;
    if (position && Number.isFinite(position.left) && Number.isFinite(position.top)) {
      host.style.left = `${Math.max(0, Math.min(position.left, window.innerWidth - 40))}px`;
      host.style.top = `${Math.max(0, Math.min(position.top, window.innerHeight - 40))}px`;
      host.style.right = "auto";
      host.style.bottom = "auto";
    } else {
      host.style.left = "auto";
      host.style.top = "auto";
      host.style.right = "";
      host.style.bottom = "";
    }
    if (hiddenByUser) panel.hidden = true;
    toggle.hidden = hiddenByUser;
    toggle.textContent = panel.hidden ? labels[selectedLanguage].show : labels[selectedLanguage].hide;
    if (isWritable(document.activeElement)) activeField = document.activeElement;
    render();
  }

  function handleStorageChange(changes, area) {
    const preferences = ["hidden", "position", "language", "enabledLanguages", "keyboardMode", "revealShortcut", "keyHighlight"];
    if (area === "local" && preferences.some((key) => key in changes)) {
      restorePreferences().catch((error) => console.warn("Ghalamnama could not restore preferences.", error));
    }
  }
  browser.runtime.onMessage.addListener(handleMessage);
  browser.storage.onChanged.addListener(handleStorageChange);
  restorePreferences().catch((error) => console.warn("Ghalamnama could not restore preferences.", error));

  // Physical key highlighting: highlight the virtual key on keydown, clear on keyup/blur.
  function keyElementFor(code) {
    if (panel.hidden || keyboardMode === "os") return null;
    return panel.querySelector(`.ghalamnama-keyboard-key[data-code='${code}']`);
  }

  function clearPressedKeys() {
    panel.querySelectorAll(".ghalamnama-keyboard-key.pressed").forEach((element) => element.classList.remove("pressed"));
  }

  window.addEventListener("blur", clearPressedKeys, true);
  window.addEventListener("resize", positionPanel);
})();
