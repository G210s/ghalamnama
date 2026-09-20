# Ghalamnama Firefox Extension

This WebExtension adds a multilingual on-screen keyboard to text inputs and textareas on demand. It is inactive by default and is activated only for the current tab from the Firefox extension popup.

The first time the popup opens, it asks the user which languages to support. After that, the popup only activates or deactivates the current tab. Use **Language settings** in the popup to add or remove languages later. Those choices are saved globally.

The keyboard currently supports Persian (ISIRI 9147), Arabic, Hebrew, Russian (JCUKEN), and Greek layouts. Use the language selector to choose the active layout. The enabled languages and active layout are remembered across pages; use **Settings (⚙)** in the toolbar or the popup's **Settings** link to manage them.

The on-screen rows follow a physical keyboard shape with number, Tab, Caps, Shift, Backspace, and Enter keys. When key mapping is enabled, typing on the physical keyboard produces characters from the selected layout; holding Shift uses that layout's Shift alternatives.

The keyboard icon can be dragged anywhere on the page. Use **Deactivate** beside the keyboard icon to turn the extension off for the current tab. Use **OS keyboard** mode to keep the extension active while letting the operating system keyboard type normally; switch back to **Ghalamnama** mode to resume remapping.

`contenteditable` surfaces (rich-text editors) are also supported with selection-safe insertion, though exotic editors may behave differently; text inputs and textareas remain the most reliable targets.

When the keyboard panel is open, physical key presses briefly highlight the matching virtual key. Disable this in **Settings** if you prefer a quiet panel.

Press **Ctrl+Shift+Space** (Mac: **Ctrl+Shift+Space**) to open/close the keyboard without visiting the popup; this works only on tabs where Ghalamnama is active and can be reconfigured in Firefox's extension shortcut manager (`about:addons` → gear icon → Manage Extension Shortcuts). If the floating icon was hidden, **Alt + Shift + K** reveals it again; that behavior can be disabled in Settings.

A dedicated **Settings** page manages enabled languages, the default language, the default typing mode, key highlighting, the reveal shortcut, and a full reset with confirmation. The **⚙** button in the keyboard toolbar links to it, as does **Settings** in the popup; language management now lives there instead of inside the keyboard.

The popup also includes links to report extension feedback, request a language or layout, and support the project. Feedback and language requests open a prefilled GitHub issue; financial support opens the Ghalamnama donation page.

## Test locally

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Select **Load Temporary Add-on**.
3. Choose `firefox-extension/manifest.json`.
4. Pin Ghalamnama to the Firefox toolbar.
5. Open the extension popup, choose the supported languages, and select **Activate on this tab**.
6. Focus a text field. The keyboard toggle appears in the lower-right corner.

Firefox does not inject extensions into privileged pages such as `about:*`, the Add-ons Manager, or the Firefox start page. Temporary extensions are removed when Firefox restarts. Firefox grants Ghalamnama website access at installation so it can restore the keyboard after a reload, but the extension injects the keyboard only into tabs you explicitly activate. Activation stays active when that tab reloads; opening the same website in a new tab still requires activation. Use **Deactivate on this tab** to remove the remembered activation.

## Package for distribution

From the repository root, create a ZIP containing the contents of `firefox-extension/` with `manifest.json` at the archive root, then submit it to Mozilla Add-ons for signing.
