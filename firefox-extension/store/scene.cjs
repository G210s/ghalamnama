// Writes the HTML for each store image; render.cjs screenshots them.
const layoutScene = ({ preset, caption, sub, url, heading, fields, body, dir }) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="scene.css"><link rel="stylesheet" href="../keyboard.css">
<script>window.GHALAMNAMA_PRESET=${JSON.stringify(preset)}</script><script src="shim.js"></script></head><body>
<header class="caption"><h1>${caption}</h1><p>${sub}</p></header>
<div class="window"><div class="bar"><i></i><i></i><i></i><span>${url}</span></div><main class="page"><h2>${heading}</h2>
${fields.map((f) => `<input class="field" dir="${dir}" value="${f}">`).join("")}
<textarea id="body" class="field" dir="${dir}">${body}</textarea></main></div>
<script src="../content-script.js"></script>
<script>setTimeout(() => {
  const body = document.getElementById("body");
  body.focus(); body.setSelectionRange(body.value.length, body.value.length);
  document.querySelector(".ghalamnama-keyboard-toggle").click();
  setTimeout(() => document.querySelector('[data-code="${preset.pressed}"]')?.classList.add("pressed"), 50);
}, 300)</script></body></html>`;

const withShim = (file) => {
  const html = require("node:fs").readFileSync(`${__dirname}/../${file}`, "utf8");
  return html.replace("<head>", '<head><base href="../../">').replace(/<script src="(\w+)\.js"><\/script>/, '<script src="store/shim.js"></script><script src="$1.js"></script>');
};

module.exports = {
  frames: { "popup.html": withShim("popup.html"), "options.html": withShim("options.html") },
  scenes: {
    "screenshot-1-persian.png": layoutScene({
      preset: { language: "fa", pressed: "KeyL" }, dir: "rtl",
      caption: "Type Persian on any website", sub: "Activate Ghalamnama on a tab, focus a text field, and type with the on-screen keyboard or your physical keys.",
      url: "mail.example.com/compose", heading: "New message", fields: ["سارا", "دیدار هفتهٔ آینده"],
      body: "سلام سارا،\nبرای دیدار هفتهٔ آینده، سه‌شنبه ساعت ده صبح مناسب است؟\nبا سپاس"
    }),
    "screenshot-2-arabic.png": layoutScene({
      preset: { language: "ar", pressed: "KeyJ" }, dir: "rtl",
      caption: "Arabic, Hebrew, Russian and Greek too", sub: "Switch layouts from the toolbar. Physical keys follow the selected language.",
      url: "forum.example.org/new-topic", heading: "Start a discussion", fields: ["أسئلة حول الخط العربي"],
      body: "مرحبًا بالجميع،\nأبحث عن خط عربي واضح للعناوين والنصوص الطويلة. ما اقتراحاتكم؟"
    }),
    "screenshot-3-greek.png": layoutScene({
      preset: { language: "el", pressed: "KeyA" }, dir: "ltr",
      caption: "Switch between languages in one click", sub: "Keep only the languages you use. Press Ctrl + Shift + Space to return to your system keyboard.",
      url: "notes.example.net", heading: "Travel notes", fields: ["Ταξίδι στην Αθήνα"],
      body: "Καλημέρα! Σήμερα επισκεφθήκαμε την Ακρόπολη και το Μουσείο."
    }),
    "screenshot-4-settings.png": `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="scene.css"><style>
      .frames { position: absolute; top: 132px; left: 56px; right: 56px; bottom: 32px; display: flex; gap: 32px; align-items: flex-start; }
      iframe { border: 1px solid #5d625e; border-radius: 12px; background: #171a19; }
      </style></head><body><header class="caption"><h1>Private, simple, and yours to configure</h1><p>Works only on tabs you activate. Nothing you type is stored or sent anywhere.</p></header>
      <div class="frames"><iframe src=".build/popup.html" width="282" height="560"></iframe><iframe src=".build/options.html" style="flex:1" height="592"></iframe></div></body></html>`,
    "promo-small-440x280.png": `<!doctype html><html><head><meta charset="utf-8"><style>
      html, body { margin: 0; width: 440px; height: 280px; overflow: hidden; }
      body { display: grid; grid-template-columns: 112px 1fr; gap: 22px; align-items: center; padding: 0 30px; box-sizing: border-box; background: #171a19; color: #f8f4ec; font-family: system-ui, sans-serif; }
      img { width: 112px; height: 112px; border-radius: 22px; }
      h1 { margin: 0; font-size: 30px; line-height: 1.1; } p { margin: 8px 0 14px; color: #c6ccc8; font-size: 16px; line-height: 1.35; }
      .tags { display: flex; gap: 6px; } .tags span { min-width: 30px; padding: 3px 6px; border: 1px solid #5d625e; border-radius: 6px; text-align: center; font-size: 15px; }
      </style></head><body><img src="../icons/icon-256.png" alt=""><div><h1>Ghalamnama</h1><p>A multilingual keyboard for any website</p>
      <div class="tags"><span>فا</span><span>ع</span><span>א</span><span>Я</span><span>Ω</span></div></div></body></html>`
  }
};
