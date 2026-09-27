// Renders store screenshots and the promo tile with headless Chrome. Usage: node store/render.cjs
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { frames, scenes } = require("./scene.cjs");
const chrome = process.env.CHROME_BINARY || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const build = path.join(__dirname, ".build");
const output = path.join(__dirname, "images");
fs.mkdirSync(build, { recursive: true });
fs.mkdirSync(output, { recursive: true });
for (const [name, html] of Object.entries(frames)) fs.writeFileSync(path.join(build, name), html);
for (const [name, html] of Object.entries(scenes)) {
  const [width, height] = name.startsWith("promo") ? [440, 280] : [1280, 800];
  const page = path.join(__dirname, `${name}.html`);
  fs.writeFileSync(page, html);
  execFileSync(chrome, ["--headless", "--hide-scrollbars", "--force-device-scale-factor=1", "--virtual-time-budget=3000",
    `--window-size=${width},${height}`, `--screenshot=${path.join(output, name)}`, `file://${page}`], { stdio: "ignore" });
  fs.rmSync(page);
  console.log(path.join(output, name));
}
fs.rmSync(build, { recursive: true });
