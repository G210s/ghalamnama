# Ghalamnama Firefox Extension

This WebExtension adds a Persian and Arabic on-screen keyboard to text inputs and textareas on web pages.

## Test locally

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Select **Load Temporary Add-on**.
3. Choose `firefox-extension/manifest.json`.
4. Open a page with a text field and focus it. The keyboard toggle appears in the lower-right corner.

Firefox does not inject extensions into privileged pages such as `about:*`, the Add-ons Manager, or the Firefox start page. Temporary extensions are removed when Firefox restarts.

## Package for distribution

From the repository root, create a ZIP containing the contents of `firefox-extension/` with `manifest.json` at the archive root, then submit it to Mozilla Add-ons for signing.