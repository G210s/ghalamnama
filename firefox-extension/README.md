# Ghalamnama Firefox Extension

This WebExtension adds a multilingual on-screen keyboard to text, search, and email inputs and textareas on demand. It is inactive by default and is activated only for the current tab from the Firefox extension popup or activation shortcut.

The first time the popup opens, it asks the user which languages to support. After that, the popup only activates or deactivates the current tab. Use **Language settings** in the popup to add or remove languages later. Those choices are saved globally.

On a fresh installation, Firefox opens a three-step welcome guide covering language selection, per-tab activation, the typing-mode shortcut, and the extension's no-telemetry privacy behavior. Updates do not reopen the guide.

The keyboard currently supports Persian (ISIRI 9147), Arabic, Hebrew, Russian (JCUKEN), and Greek layouts. Use the language selector to choose the active layout. The enabled languages and active layout are remembered across pages; use **Settings (⚙)** in the toolbar or the popup's **Settings** link to manage them.

The on-screen rows follow a physical keyboard shape with number, Tab, Caps, Shift, Backspace, and Enter keys. When key mapping is enabled, typing on the physical keyboard produces characters from the selected layout; holding Shift uses that layout's Shift alternatives.

The keyboard icon can be dragged anywhere on the page. Use **Deactivate** beside the keyboard icon to turn the extension off for the current tab. Use **OS keyboard** mode to keep the extension active while letting the operating system keyboard type normally; switch back to **Ghalamnama** mode to resume remapping.

`contenteditable` surfaces (rich-text editors) are also supported with selection-safe insertion, though exotic editors may behave differently; text inputs and textareas remain the most reliable targets.

When the keyboard panel is open, physical key presses briefly highlight the matching virtual key. Disable this in **Settings** if you prefer a quiet panel.

Press **Alt+Shift+G** (Mac: **Control+Shift+G**) to activate or deactivate Ghalamnama on the current tab. Press **Ctrl+Shift+Space** (Mac: **Ctrl+Shift+Space**) to switch physical typing between the Ghalamnama layout and the system keyboard. Shortcuts can be changed in Firefox's extension shortcut manager (`about:addons` → gear icon → Manage Extension Shortcuts). The separate open/close command has no default shortcut but can be assigned there. If the floating icon was hidden, **Alt + Shift + K** reveals it again; that behavior can be disabled in Settings.

A dedicated **Settings** page manages enabled languages, the default language, the default typing mode, key highlighting, the reveal shortcut, and a full reset with confirmation. The **⚙** button in the keyboard toolbar links to it, as does **Settings** in the popup; language management now lives there instead of inside the keyboard.

The popup also includes links to report extension feedback, request a language or layout, and support the project. Feedback opens the user's mail service with a message addressed to `support@ghalamnama.online`; language requests open a prefilled GitHub issue; financial support opens the Ghalamnama donation page.

## Test locally

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Select **Load Temporary Add-on**.
3. Choose `firefox-extension/manifest.json`.
4. Pin Ghalamnama to the Firefox toolbar.
5. Open the extension popup, choose the supported languages, and select **Activate on this tab**.
6. Focus a text field. The keyboard toggle appears in the lower-right corner.

Firefox does not inject extensions into privileged pages such as `about:*`, the Add-ons Manager, or the Firefox start page. Temporary extensions are removed when Firefox restarts. Firefox grants Ghalamnama website access at installation so it can restore the keyboard after a reload, but the extension injects the keyboard only into tabs you explicitly activate. Activation stays active when that tab reloads and is cleared when Firefox restarts; opening the same website in a new tab still requires activation. Use **Deactivate on this tab** to remove the remembered activation.

## Package for distribution

```sh
npm --prefix firefox-extension run lint      # Mozilla's add-on linter
npm --prefix firefox-extension run package   # creates ghalamnama-firefox-<version>.zip
```

The package contains only runtime files (no tests, docs or `node_modules`). Upload it to Mozilla Add-ons for signing. Store listing text, permission justifications and images are in [STORE_SUBMISSION.md](STORE_SUBMISSION.md); regenerate the images with `node firefox-extension/store/render.cjs`.
