# Extension UX review — 2026-09-20

Review scope: current working-tree source and product plan. Automated tests use a mocked browser/DOM; visual behavior and real rich-text editors still need Firefox validation.

## Persistence fixes made

- Saved preferences previously failed during initialization: `hidden` and `position` were referenced outside their promise callback scope. Restore now reads one preference snapshot and applies it together.
- Preferences changed in settings or another active tab now update open pages through `storage.onChanged`.
- Deactivation now removes document, runtime-message, storage, and blur listeners. Previously a removed content script still answered readiness checks, preventing a fresh activation.
- Hidden controls now have an explicit CSS hiding rule; the toggle's `display: block` could override browser hiding behavior.
- Popup now names the saved language and only offers icon recovery for an active tab.
- OS mode keeps the virtual keyboard and toolbar controls available, matching the settings description. The reveal shortcut also works in OS mode.

## Applied interaction fixes

- Reset is now owned by the background page: it deactivates every live tab, clears all advertised preferences, and resets browser-action titles.
- Esc closes the panel, Tab inserts a tab character, and Caps changes the virtual and physical layout state. The destructive Clear button is removed.
- Virtual-key pointer interactions keep the page editor focused. Disabled, read-only, and `aria-readonly` fields are excluded before input is changed.
- The page keyboard exposes labeled language and physical-typing selectors; the popup has an enabled-language default selector.
- Deactivation is a labeled toolbar action. The ambiguous floating × button is removed.
- The open panel is independently positioned and clamped on opening and window resize. Keyboard controls expose focus rings and the floating control reports `aria-expanded`.

There is no control labeled “Remember” or saved webpage/site rule in this source. Existing activation is per tab; language, mode, visibility, and position are global preferences. Reopening a URL in a new tab does not activate it automatically. This review preserves the product plan's explicit-activation policy.

## Recommended priorities

| Priority | Finding | User-friendly change |
| --- | --- | --- |
| P1 | “Remember” scope is unclear. | Explain “Stays active when this tab reloads.” If durable page activation is wanted, add a separate opt-in “Always enable on this site” control, show its hostname, and provide a remove action. Update the product policy before introducing this behavior. |
| P1 | Reset removes stored tab IDs but leaves the background's active-tab Set and injected UI running; hidden/onboarding values also survive. | Make reset a background-owned operation that deactivates live tabs and resets every advertised preference. |
| P1 | Esc, Tab, and Caps buttons have no handlers. | Implement their behavior or remove/disable them with an explanation; avoid presenting decorative keys as working controls. |
| P1 | Clicking virtual keys can move focus/selection away from the editor. Rich-text insertion directly mutates DOM; backspace has Unicode/selection edge cases. | Preserve editor selection across pointer interactions; test emoji, selection replacement, undo, and representative editors before promising broad compatibility. |
| P1 | Read-only text fields pass writable-field detection. | Reject disabled/read-only fields and revalidate the target before insertion or remapping. |
| P2 | Current mode is communicated largely through a button naming the mode to switch to. | Show a labeled current-mode selector: “Type with Ghalamnama” / “Use system keyboard”, plus one sentence explaining physical typing. Keep keyboard visibility separate. |
| P2 | Language changes require opening the page keyboard or settings. | Add an enabled-language selector directly in the popup, with a clear statement that the choice applies globally. |
| P2 | A small × beside the floating control deactivates the extension rather than closing the keyboard. | Use a labeled secondary “Turn off for this tab” action; reserve × for closing the panel. |
| P2 | The dragged control is bounded, but the large panel can extend above or left of the viewport. | Position the panel independently, clamp its entire rectangle on opening/resizing, and test narrow windows and zoom. |
| P2 | “Clear” deletes an entire text field immediately and behaves differently in rich text. | Remove it from the primary keyboard row or provide a consistent undoable action. |
| P2 | Focus indication is limited; open/closed state lacks `aria-expanded`. | Add visible focus to every control, accessible state labels, and keyboard-only navigation checks without stealing editor focus. |
| P3 | Enabled language lists and labels are duplicated across contexts. | Centralize metadata and preference defaults to prevent drift and support localization. |

## Validation

Run `node --test firefox-extension/tests/preferences.test.cjs` from the repository root.

In Firefox, reload the temporary add-on and refresh the test page to discard old injected listeners. Activate a tab, select a language/mode, refresh, and verify restoration. Then hide/reveal the control, deactivate/reactivate without navigating, change settings with the page open, and test virtual typing in OS mode. Test actual input/textarea/contenteditable focus and selection separately; mocked tests cannot establish browser editing compatibility.

Storage synchronization follows Mozilla's documented [storage.onChanged API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/onChanged).
