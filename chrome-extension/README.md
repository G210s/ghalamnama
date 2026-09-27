# Ghalamnama for Chrome

The Chrome Manifest V3 edition of Ghalamnama's multilingual keyboard. It shares the Firefox extension's keyboard, popup, onboarding and settings, including Persian, Arabic, Hebrew, Russian and Greek layouts, physical key mapping, on-screen typing, editable text fields and rich-text editing.

## Install locally

Requires Node.js to build and Chrome 120 or newer to run.

1. From the repository root, run `npm --prefix chrome-extension run build`.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select `chrome-extension/dist`.
4. Complete the welcome guide and pin Ghalamnama from Chrome's extensions menu.
5. Open a regular website, click Ghalamnama, choose **Activate on this tab**, and focus a text field.

The build is not published to the Chrome Web Store. This local installation does not receive automatic updates; rebuild and click **Reload** in `chrome://extensions` after changing the source.

## Behavior and permissions

- Inactive until you activate a tab. Reloading or navigating that tab restores the keyboard on supported pages. Other tabs remain inactive.
- Activation survives service-worker suspension. Closing a tab, restarting Chrome or reloading the extension clears its activation; language and keyboard preferences remain saved.
- Chrome internal pages, other extensions and the Chrome Web Store cannot be edited. Local files are not supported by this build.
- `storage` saves preferences and session activation. `scripting` injects the keyboard. HTTP/HTTPS website access lets an activated tab restore the keyboard after reload/navigation. `activeTab` supports toolbar and shortcut actions.
- Typed text is not stored or transmitted. The extension contains no telemetry or remotely loaded code. Feedback/support links open external services only when selected.

## Shortcuts

- **Alt+Shift+G** (Mac: **Control+Shift+G**): activate/deactivate the current tab.
- **Ctrl+Shift+Space** (Mac: **Control+Shift+Space**): switch physical typing mode.
- Assign an optional open/close shortcut or change conflicting bindings at `chrome://extensions/shortcuts`.

## Development

`firefox-extension/` remains the shared UI/keyboard source. `build.cjs` copies an explicit asset list, adapts Chrome messaging through `browser-adapter.js`, generates a V3 manifest and includes the Chrome-specific `background.js` service worker. Do not edit generated `dist/` files. Firefox's runtime files are not changed by the build.

```sh
npm --prefix chrome-extension test
npm --prefix firefox-extension run test:unit
# Browser tests reuse the existing Firefox test dependencies:
npm --prefix firefox-extension ci
CHROME_BINARY="/path/to/Chrome for Testing" npm --prefix chrome-extension run test:browser
npm --prefix chrome-extension run package
```

Browser tests require a current Chrome for Testing build with `--load-extension` support. They use an isolated browser profile and a local fixture server. Standard branded Chrome does not support that automation flag; use the normal Load unpacked UI for manual testing. Packaging requires the `zip` command and creates `ghalamnama-chrome-<version>.zip`, containing only runtime files.

The automated checks cover worker restart state, per-tab activation, protected pages, cleanup/reset, message isolation, onboarding navigation, five layouts, caret insertion, physical typing, reload restoration and saved typing-mode changes. Manually check the toolbar popup, operating-system shortcuts, drag positioning, and your usual websites before publishing.

Implementation references: [Chrome service-worker migration](https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers), [script injection](https://developer.chrome.com/docs/extensions/reference/api/scripting), and [message responses](https://developer.chrome.com/docs/extensions/develop/concepts/messaging).
