# Exports the selected globe-key icon: SVG sources, a 1024px master and every extension icon size.
# Usage (from the repo root): python3 assets/brand/export_icons.py
import os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from icons import svg

CHROME = os.environ.get("CHROME_BINARY", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
ICONS = os.path.join(here, "..", "..", "firefox-extension", "icons")
TOOLBAR_MAX = 38  # toolbar sizes use the simplified drawing

def render(markup, size, out):
    page = out + ".html"
    with open(page, "w") as f:
        f.write(f'<style>html,body{{margin:0;background:transparent}}svg{{width:{size}px;height:{size}px;display:block}}</style>{markup}')
    subprocess.run([CHROME, "--headless", "--hide-scrollbars", "--force-device-scale-factor=1", "--default-background-color=00000000",
                    f"--window-size={size},{size}", f"--screenshot={out}", f"file://{page}"], check=True, capture_output=True)
    os.remove(page)

for name, small in (("ghalamnama-icon.svg", False), ("ghalamnama-icon-small.svg", True)):
    with open(os.path.join(here, name), "w") as f:
        f.write(svg("globe-key", small) + "\n")
render(svg("globe-key"), 1024, os.path.join(here, "ghalamnama-icon-master.png"))
for size in (16, 19, 24, 32, 38, 48, 64, 96, 128, 256):
    render(svg("globe-key", size <= TOOLBAR_MAX), size, os.path.join(ICONS, f"icon-{size}.png"))
    print(f"icon-{size}.png")
