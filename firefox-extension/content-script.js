(function () {
  "use strict";

  const layouts = {
    fa: ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ", "ظ", "ط", "ز", "ر", "ذ", "د", "پ", "و", "ژ"],
    ar: ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د", "ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط", "ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ"]
  };
  const keyMaps = {
    fa: { q: "ض", w: "ص", e: "ث", r: "ق", t: "ف", y: "غ", u: "ع", i: "ه", o: "خ", p: "ح", "[": "ج", "]": "چ", a: "ش", s: "س", d: "ی", f: "ب", g: "ل", h: "ا", j: "ت", k: "ن", l: "م", ";": "ک", "'": "گ", z: "ظ", x: "ط", c: "ز", v: "ر", b: "ذ", n: "د", m: "پ", ",": "و", ".": "ژ", "/": "؟" },
    ar: { q: "ض", w: "ص", e: "ث", r: "ق", t: "ف", y: "غ", u: "ع", i: "ه", o: "خ", p: "ح", "[": "ج", "]": "د", a: "ش", s: "س", d: "ي", f: "ب", g: "ل", h: "ا", j: "ت", k: "ن", l: "م", ";": "ك", "'": "ط", z: "ئ", x: "ء", c: "ؤ", v: "ر", b: "لا", n: "ى", m: "ة", ",": "و", ".": "ز", "/": "ظ" }
  };
  const labels = { fa: { show: "⌨ فارسی", hide: "⌨ بستن", map: "تبدیل کلیدها", space: "فاصله", clear: "پاک‌کردن" }, ar: { show: "⌨ العربية", hide: "⌨ إغلاق", map: "تحويل المفاتيح", space: "مسافة", clear: "مسح" } };
  let activeField = null;
  let mappingEnabled = true;
  let panel;
  let toggle;

  function languageFor(field) {
    const lang = (field.lang || "").toLowerCase();
    return lang.startsWith("ar") ? "ar" : lang.startsWith("fa") ? "fa" : field.dir === "rtl" ? "fa" : "fa";
  }

  function setText(field, value) {
    const start = field.selectionStart ?? field.value.length;
    const end = field.selectionEnd ?? start;
    field.setRangeText(value, start, end, "end");
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.focus();
  }

  function backspace(field) {
    const start = field.selectionStart ?? 0;
    const end = field.selectionEnd ?? start;
    if (start !== end) return setText(field, "");
    if (start === 0) return;
    const previous = [...field.value].slice(0, start - 1).join("");
    field.setSelectionRange(previous.length, start);
    setText(field, "");
  }

  function fieldSelector(field) {
    return field && field.matches("textarea, input[type='text'], input[type='search'], input:not([type])");
  }

  function render() {
    if (!activeField) return;
    const lang = languageFor(activeField);
    const copy = labels[lang];
    const rows = [layouts[lang].slice(0, 11), layouts[lang].slice(11, 22), layouts[lang].slice(22)];
    panel.innerHTML = `<div class="ghalamnama-keyboard-modes"><button class="ghalamnama-keyboard-mode" data-action="map" aria-pressed="${mappingEnabled}">${copy.map}: ${mappingEnabled ? "ON" : "OFF"}</button></div><div>${rows.map((row) => `<div class="ghalamnama-keyboard-row">${row.map((value) => `<button class="ghalamnama-keyboard-key" data-value="${value}">${value}</button>`).join("")}</div>`).join("")}</div><div class="ghalamnama-keyboard-actions"><button data-action="backspace">⌫</button><button class="space" data-action="space">${copy.space}</button><button data-action="enter">↵</button><button data-action="clear">${copy.clear}</button></div>`;
    panel.querySelector("[data-action='map']").onclick = () => { mappingEnabled = !mappingEnabled; render(); };
    panel.querySelectorAll("[data-value]").forEach((button) => { button.onclick = () => setText(activeField, button.dataset.value); });
    panel.querySelector("[data-action='backspace']").onclick = () => backspace(activeField);
    panel.querySelector("[data-action='space']").onclick = () => setText(activeField, " ");
    panel.querySelector("[data-action='enter']").onclick = () => setText(activeField, "\n");
    panel.querySelector("[data-action='clear']").onclick = () => { activeField.value = ""; activeField.dispatchEvent(new Event("input", { bubbles: true })); activeField.focus(); };
  }

  function showFor(field) {
    activeField = field;
    toggle.hidden = false;
    toggle.textContent = panel.hidden ? labels[languageFor(field)].show : labels[languageFor(field)].hide;
    render();
  }

  function mapPhysicalKey(event) {
    if (!mappingEnabled || !activeField || activeField !== document.activeElement || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
    const lang = languageFor(activeField);
    const mapped = keyMaps[lang][event.key.toLowerCase()];
    if (!mapped) return;
    event.preventDefault();
    setText(activeField, mapped);
  }

  const host = document.createElement("div");
  host.className = "ghalamnama-keyboard-host";
  toggle = document.createElement("button");
  toggle.className = "ghalamnama-keyboard-toggle";
  toggle.type = "button";
  toggle.hidden = true;
  panel = document.createElement("div");
  panel.className = "ghalamnama-keyboard-panel";
  panel.hidden = true;
  host.append(toggle, panel);
  document.documentElement.appendChild(host);
  toggle.onclick = () => { panel.hidden = !panel.hidden; toggle.textContent = panel.hidden ? labels[languageFor(activeField)].show : labels[languageFor(activeField)].hide; if (!panel.hidden) render(); };
  document.addEventListener("focusin", (event) => { if (fieldSelector(event.target)) showFor(event.target); });
  document.addEventListener("keydown", mapPhysicalKey, true);
})();