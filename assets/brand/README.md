# Ghalamnama keyboard icon

Design: a keyboard whose highlighted key is the globe "switch language" key, in ink green (#101312) and paper (#f8f4ec) on a lime rounded tile (#c9ed95) matching the homepage palette. The globe is the key every on-screen keyboard uses to change languages, so the icon stays accurate however many languages the extension supports. It deliberately avoids any single script.

Files:

- `ghalamnama-icon.svg`: the detailed icon, used at 48px and larger.
- `ghalamnama-icon-small.svg`: a simplified drawing with fewer, chunkier keys for toolbar sizes (16–38px), where the detailed grid blurs.
- `ghalamnama-icon-master.png`: a 1024px render of the detailed icon.
- `icons.py`: source for the icon and the other concepts considered; `concepts/` has their comparison sheets.

Regenerate every extension icon (renders with headless Chrome; set `CHROME_BINARY` if Chrome is elsewhere):

```sh
python3 assets/brand/export_icons.py      # writes firefox-extension/icons/icon-{16..256}.png
node firefox-extension/store/render.cjs   # refreshes store images that include the icon
npm --prefix firefox-extension run package
npm --prefix chrome-extension run package # the Chrome build copies the same icons
```

Both extension manifests declare installation/management icons and default toolbar icons.
