# Store submission guide

Copy-paste material for publishing Ghalamnama to the Chrome Web Store and addons.mozilla.org (AMO). Both stores ship the same keyboard; only the manifest and background script differ.

## Before each submission

1. Bump `version` in `firefox-extension/manifest.json` (Chrome copies it at build time) and `chrome-extension/package.json`.
2. Run the checks:
   ```sh
   npm --prefix firefox-extension test
   npm --prefix firefox-extension run lint
   CHROME_BINARY="/path/to/Chrome for Testing" npm --prefix chrome-extension run test:browser
   ```
3. Build the packages:
   ```sh
   npm --prefix firefox-extension run package   # firefox-extension/ghalamnama-firefox-<version>.zip
   npm --prefix chrome-extension run package    # chrome-extension/ghalamnama-chrome-<version>.zip
   ```
4. Deploy the website first, so that https://ghalamnama.online/extension-privacy is live before a reviewer opens it.

## Shared listing text

**Name:** Ghalamnama Multilingual Keyboard

**Summary** (132 characters max for Chrome, 250 for AMO):
> Type Persian, Arabic, Hebrew, Russian and Greek in any text field, with an on-screen keyboard and physical key mapping. Per tab.

**Description:**
> Ghalamnama adds a multilingual keyboard to the text fields of any website, without changing your operating-system keyboard.
>
> • Five layouts: Persian (فارسی), Arabic (العربية), Hebrew (עברית), Russian (Русский) and Greek (Ελληνικά)
> • On-screen keyboard: click keys to type, including Shift and Caps variants
> • Physical key mapping: your normal keyboard types the selected layout
> • Works in plain text fields, search boxes, email fields and rich-text editors
> • Per-tab: nothing runs until you activate a tab; it stays on through reloads of that tab
> • Keyboard shortcuts: Alt+Shift+G activates the tab (Ctrl+Shift+G on Mac); Ctrl+Shift+Space switches between Ghalamnama and your system keyboard
> • Choose which languages appear, pick a default, drag or hide the floating button
>
> Privacy: Ghalamnama does not collect or transmit anything. What you type never leaves the page, there are no analytics, and the extension makes no network requests. Privacy policy: https://ghalamnama.online/extension-privacy
>
> Source code: https://github.com/G210s/ghalamnama

**Support:** support@ghalamnama.online · **Website:** https://ghalamnama.online/ · **Privacy policy:** https://ghalamnama.online/extension-privacy

## Images

Rendered from the real extension UI by `store/render.cjs` into `store/images/`:

| File | Size | Use |
| --- | --- | --- |
| `screenshot-1-persian.png` | 1280×800 | Chrome + AMO screenshot |
| `screenshot-2-arabic.png` | 1280×800 | Chrome + AMO screenshot |
| `screenshot-3-greek.png` | 1280×800 | Chrome + AMO screenshot |
| `screenshot-4-settings.png` | 1280×800 | Chrome + AMO screenshot |
| `promo-small-440x280.png` | 440×280 | Chrome small promo tile (required) |
| `../icons/icon-128.png` | 128×128 | Chrome store icon |

## Chrome Web Store

**Category:** Tools (under Productivity). **Language:** English.

**Single purpose:**
> Let users type Persian, Arabic, Hebrew, Russian and Greek in web page text fields using an on-screen keyboard and physical key remapping, on tabs they choose to activate.

**Permission justifications:**

| Permission | Justification |
| --- | --- |
| `storage` | Saves the user's keyboard preferences (enabled languages, default language, typing mode, button position) on the device, and remembers which tabs are activated in session storage, which clears when the browser closes. |
| `activeTab` | Lets the user activate the keyboard on the current tab from the toolbar button or keyboard shortcut. |
| `scripting` | Injects the keyboard's script and stylesheet into a tab only when the user activates it, and removes the stylesheet when they deactivate it. |
| Host permissions (`http://*/*`, `https://*/*`) | The keyboard must work in text fields on whichever site the user is writing on, and must re-inject automatically when an activated tab reloads or navigates. `activeTab` alone is lost on reload, so the user would have to reactivate after every page load. The script is injected only into tabs the user has explicitly activated. |

**Remote code:** No, I am not using remote code. All JavaScript ships in the package.

**Data usage:** tick none of the data categories. The extension reads keystrokes and focused text fields only to insert characters locally; nothing is stored or transmitted, so no data is "collected" under the Chrome Web Store definition. Tick all three certifications (no selling, no unrelated use, no creditworthiness use).

**Privacy policy URL:** https://ghalamnama.online/extension-privacy

**Visibility:** Public. Expect a longer review because of the broad host permissions.

## addons.mozilla.org

**Categories:** Language Support; Other. **Tags:** keyboard, persian, farsi, arabic, hebrew, russian, greek.

**License:** pick one on the listing. The repository has no LICENSE file yet, so choose "All Rights Reserved" or add a license first.

**Source code upload:** not needed. The package contains unminified, hand-written source with no build step.

**Notes to reviewer:**
> Ghalamnama is an on-screen and physical-key-mapped keyboard for Persian, Arabic, Hebrew, Russian and Greek.
>
> `<all_urls>`: the keyboard is injected with `tabs.executeScript` only into tabs the user activates (toolbar popup → "Activate on this tab", or Alt+Shift+G). Host access is needed to re-inject into the same tab after it reloads or navigates. It is never injected into tabs the user did not activate. Activated tab IDs are kept in `storage.session`, so they do not carry over a browser restart.
>
> The content script listens to keydown only to map physical keys to the selected layout. Nothing is logged, stored or sent; the extension makes no network requests. `data_collection_permissions` is "none".
>
> To test: install, finish the welcome page, open any https page with a text field (for example https://www.wikipedia.org), click the toolbar icon → "Activate on this tab", focus the search box, click the ⌨ button, and click keys or type on the physical keyboard.

**Privacy policy:** optional on AMO, since nothing is collected. Linking https://ghalamnama.online/extension-privacy is still recommended.
