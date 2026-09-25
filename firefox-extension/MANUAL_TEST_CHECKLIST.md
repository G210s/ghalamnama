# Ghalamnama Firefox Extension — Manual Release Checklist

Use this checklist against the signed production package, not only a temporary add-on. Record the Firefox version, operating system, package version, tester, date, result (`Pass`, `Fail`, `Blocked`, or `N/A`), and evidence for every run.

## Test matrix and setup

Run the full checklist on the current Firefox release. Run the smoke subset (`[Smoke]`) on the oldest supported Firefox version (143), Firefox ESR if it is supported for the release, and at least one platform from each operating-system family offered to users (Windows, macOS, and Linux).

Prepare these pages:

- A plain HTTPS page containing text, search, password, email, number, disabled, and read-only inputs; a textarea; nested `contenteditable` elements; an `aria-readonly` editor; an iframe; a long scrolling section; fixed/sticky controls; and both RTL and LTR sections.
- Representative production sites with plain forms and rich-text editors.
- A page where a site handler observes `input` events and updates a character counter.
- A page with restrictive styling, high `z-index` elements, and a strict Content Security Policy.
- Firefox protected pages such as `about:addons`, `about:preferences`, the new-tab page, and a `view-source:` URL.

Before starting, create one clean Firefox profile and one profile containing ordinary extensions, custom zoom, and changed default fonts. Keep the Browser Console available for unexpected errors.

## 1. Package, installation, and upgrade

- [ ] **PKG-01 [Smoke]** Install the signed package from its intended distribution channel. Installation succeeds without corruption or signing warnings.
- [ ] **PKG-02 [Smoke]** Verify the displayed name, description, version, icon, author/support information, and extension ID are correct.
- [ ] **PKG-03 [Smoke]** Review the install permission prompt. It requests only storage and website access expected from the manifest and makes no data-collection claim inconsistent with the listing.
- [ ] **PKG-04** Confirm the extension works immediately after installation without restarting Firefox.
- [ ] **PKG-05** Restart Firefox. The installed extension remains present and enabled.
- [ ] **PKG-06** Disable and re-enable the extension from Add-ons Manager. It returns to a usable state without duplicate UI on pages.
- [ ] **PKG-07** Upgrade over the previous production version with populated preferences and active tabs. Preferences migrate or retain their documented values, and no duplicate injected controls appear.
- [ ] **PKG-08** Upgrade while a supported field and keyboard are open. After reload/restart, the extension reaches a consistent closed-panel state and remains usable.
- [ ] **PKG-09** Uninstall the extension, restart Firefox, and reinstall it. Treat the result as a clean installation unless Firefox explicitly restores extension storage.
- [ ] **PKG-10** Inspect the Browser Console during install, startup, activation, and uninstall. No uncaught extension errors appear.

## 2. First-run onboarding

- [ ] **ONB-01 [Smoke]** Open the popup in a clean profile. All five languages are offered: Persian, Arabic, Hebrew, Russian, and Greek.
- [ ] **ONB-02** Verify the first-run copy is readable and no steady-state-only controls are confusingly exposed.
- [ ] **ONB-03** Select one language, activate a normal page, reopen the popup, and confirm onboarding is complete and the chosen language is retained.
- [ ] **ONB-04** Select multiple languages and activate. Only those languages appear in the page keyboard selector.
- [ ] **ONB-05** Deselect every language and activate. Activation is prevented and “Select at least one language” is shown without losing the popup state.
- [ ] **ONB-06** Close the popup before completing onboarding, then reopen it. The extension remains in a valid first-run state.
- [ ] **ONB-07** Complete onboarding in one window and open the popup in another. The global onboarding/language state is consistent.
- [ ] **ONB-08** Attempt first activation on every protected-page type. A clear failure is shown, onboarding does not falsely imply successful activation, and the page is unchanged.

## 3. Popup states and actions

- [ ] **POP-01 [Smoke]** On an inactive normal tab, the popup says “Inactive on this tab,” shows Activate, and hides Deactivate.
- [ ] **POP-02 [Smoke]** On an active tab, the popup says it is active, shows Deactivate, and hides Activate.
- [ ] **POP-03** The popup displays the saved current layout and typing mode accurately.
- [ ] **POP-04** Change the current layout in the popup. The open page keyboard updates without a page reload.
- [ ] **POP-05** The current-layout selector contains only enabled languages and has a sensible fallback if the prior language was disabled.
- [ ] **POP-06** Open “Languages & settings.” Exactly one settings tab opens and the popup closes.
- [ ] **POP-07** When the floating icon is globally hidden and the current tab is active, “Show keyboard icon” appears and restores it.
- [ ] **POP-08** “Show keyboard icon” is absent on inactive tabs.
- [ ] **POP-09** Rapidly click Activate or Deactivate. The final state is consistent and there is only one injected keyboard host.
- [ ] **POP-10** Open the popup while the active tab closes or changes. It fails gracefully and does not affect the wrong tab.
- [ ] **POP-11** Resize the browser or use popup zoom/text scaling. No controls, status text, or language names are clipped.
- [ ] **POP-12** Navigate through the popup using Tab, Shift+Tab, arrows, Space, and Enter. Order and activation are logical and focus is visible.

## 4. Per-tab activation and browser lifecycle

- [ ] **ACT-01 [Smoke]** Activate a supported HTTPS page. Focusing a writable field reveals one floating control.
- [ ] **ACT-02** Activate an HTTP page and a local/test page allowed by Firefox permissions. Behavior matches the permission model.
- [ ] **ACT-03 [Smoke]** Reload an active tab. Activation is restored, preferences are retained, and only one control exists.
- [ ] **ACT-04** Navigate an active tab to another normal origin. Activation follows that tab as documented, with one fresh UI instance.
- [ ] **ACT-05** Navigate an active tab to a protected URL. No injection occurs and returning to a normal URL produces a consistent state.
- [ ] **ACT-06 [Smoke]** Open the same URL in a new tab. The new tab remains inactive until explicitly activated.
- [ ] **ACT-07** Activate two tabs, deactivate one, and confirm the other remains active.
- [ ] **ACT-08** Activate tabs in two Firefox windows. Status and actions remain scoped to the current tab.
- [ ] **ACT-09** Close an active tab. Its saved tab ID is removed and is not incorrectly applied to a later tab.
- [ ] **ACT-10** Restore a recently closed tab. Confirm behavior is consistent with the documented per-tab policy and no stale/duplicate UI appears.
- [ ] **ACT-11** Restart Firefox with active tabs configured for session restore. Restored completed tabs regain activation once; missing/stale tab IDs cause no error.
- [ ] **ACT-12** Put an active tab to sleep/discard it if supported, then restore it. Injection and state recover correctly.
- [ ] **ACT-13** Use Back/Forward navigation and same-document hash/history navigation. No duplicate host or event handling occurs.
- [ ] **ACT-14** Activate a slow-loading page and navigate away during activation. No keyboard leaks into the destination or console errors remain.
- [ ] **ACT-15** Deactivate from the popup. UI disappears, physical remapping stops immediately, and the popup reports inactive.
- [ ] **ACT-16** Deactivate from the keyboard toolbar. The result matches popup deactivation.
- [ ] **ACT-17** Deactivate and reactivate without navigating. A fresh functional UI is injected and old listeners do not double-insert characters.
- [ ] **ACT-18** Confirm activation alone does not automatically open the large keyboard panel.

## 5. Floating control and panel

- [ ] **FLT-01 [Smoke]** Focus each supported writable field. The floating control appears and names the current language.
- [ ] **FLT-02** Blur the field and focus another supported field. Virtual input targets the most recently focused field.
- [ ] **FLT-03** Click the floating control. The panel opens, `aria-expanded` changes to true, and clicking again closes it.
- [ ] **FLT-04** Press the virtual Esc key. The panel closes without deactivating the extension or changing field content.
- [ ] **FLT-05** Drag the floating control by mouse, touch/stylus pointer emulation, and trackpad. It follows the pointer without opening accidentally.
- [ ] **FLT-06** Drag to every viewport edge and corner. The control stays fully recoverable within the viewport.
- [ ] **FLT-07** Reload and navigate after dragging. The saved global position is restored and clamped for the current viewport.
- [ ] **FLT-08** Save a position in a large window, then use a much smaller window. The control and panel remain reachable.
- [ ] **FLT-09** Open the panel near each edge. The entire panel is clamped on screen with usable controls.
- [ ] **FLT-10** Resize the viewport with the panel open. It repositions without covering itself or becoming unreachable.
- [ ] **FLT-11** Scroll a long page with the panel open and closed. The fixed UI remains stable and does not alter page layout.
- [ ] **FLT-12** Test pages with high-z-index modals, sticky headers, transforms, and RTL direction. Extension UI remains readable and usable.
- [ ] **FLT-13** Click Hide. Both panel and floating control disappear while activation and physical-mode behavior match the documented hidden-state policy.
- [ ] **FLT-14 [Smoke]** With the icon hidden, press Alt+Shift+K. It reappears when the preference is enabled.
- [ ] **FLT-15** Disable the reveal shortcut, hide the icon, and press Alt+Shift+K. Nothing is revealed; recover it from the popup.
- [ ] **FLT-16** Hide in one active tab. Verify the intentionally global hidden preference is reflected in other active tabs and recoverable.

## 6. Field detection and editing behavior

- [ ] **FLD-01 [Smoke]** Test `input[type=text]`, `input[type=search]`, `input[type=email]`, input with no type, and `textarea`. Each accepts virtual and mapped physical input; verify email fields in modal dialogs such as Reddit's sign-in flow.
- [ ] **FLD-02** Verify password, URL, tel, number, date/time, checkbox, radio, range, file, button, and submit controls are not modified or falsely treated as supported text fields.
- [ ] **FLD-03** Disabled and `readonly` inputs do not reveal a usable typing surface and cannot be changed.
- [ ] **FLD-04** `contenteditable=false` and `aria-readonly=true` regions are not changed.
- [ ] **FLD-05 [Smoke]** In a textarea/input, insert at start, middle, and end; replace a forward and backward selection; and type into an empty field.
- [ ] **FLD-06** Backspace deletes a selected range, one previous Unicode character, and nothing at position zero.
- [ ] **FLD-07** Test backspace next to Persian/Arabic combining marks, Hebrew marks, emoji, surrogate pairs, and mixed-script text; record any grapheme-level limitation.
- [ ] **FLD-08** Space, Tab, Enter, and backslash produce exactly the documented value for inputs versus multiline fields, without unexpected page navigation.
- [ ] **FLD-09** Confirm every extension edit dispatches a bubbling `input` event and updates the prepared character counter/framework-bound value.
- [ ] **FLD-10** Verify focus and selection remain in the editor after clicking virtual keys repeatedly.
- [ ] **FLD-11** Use Undo/Redo after virtual insertion, replacement, backspace, and newline in plain fields and representative editors; record browser/editor limitations.
- [ ] **FLD-12 [Smoke]** In a basic `contenteditable`, insert at start/middle/end, replace a selection, insert a newline, and backspace.
- [ ] **FLD-13** Test nested formatting elements, selections crossing nodes, an empty editor, caret at a text-node boundary, and a selection outside the active editor.
- [ ] **FLD-14** Test representative rich-text editors used by target users. No DOM corruption, cursor jump, formatting loss, or duplicated text occurs.
- [ ] **FLD-15** Test fields inside same-origin and cross-origin iframes. Document supported behavior; the top page must remain stable when iframe injection is unavailable.
- [ ] **FLD-16** Replace/remove the active field dynamically after focus, then press virtual and physical keys. The extension fails safely and does not mutate an unrelated element.
- [ ] **FLD-17** Move focus between two fields while the panel is open. Text always enters the current field.
- [ ] **FLD-18** Submit a form after extension input. Inserted values are included exactly once.
- [ ] **FLD-19** Test autofill/autocomplete, form validation, and React/Vue-style controlled inputs on representative sites.
- [ ] **FLD-20** Confirm the extension never transforms existing text, whitespace, Unicode normalization, or direction marks silently.

## 7. Layout and virtual-key accuracy

Repeat **LAY-01–LAY-09** for Persian, Arabic, Hebrew, Russian, and Greek.

- [ ] **LAY-01 [Smoke]** Select the language. Its name, direction, floating label, and keyboard direction are correct.
- [ ] **LAY-02 [Smoke]** Click every unshifted number-row and letter-row key and compare output with the approved layout specification.
- [ ] **LAY-03 [Smoke]** Enable virtual Shift and click every key; compare all shifted output with the approved specification.
- [ ] **LAY-04** Toggle Caps and verify displayed/output characters match the implemented contract for that layout.
- [ ] **LAY-05** Toggle Shift using both left and right virtual Shift buttons. Their state and output remain synchronized.
- [ ] **LAY-06** Use Space, Enter, Tab, Backspace, Esc, and backslash; each performs its labeled action.
- [ ] **LAY-07** Switch away and back. Shift and Caps reset as intended and the saved language persists.
- [ ] **LAY-08** Inspect multi-character keys (for example Arabic ligatures). They insert exactly the shown string once.
- [ ] **LAY-09** Copy/paste the resulting text into a Unicode inspector or trusted editor and verify code points for visually similar characters.

Additional language-management cases:

- [ ] **LAY-10** Enable only one language. The selector contains one usable option and all labels remain valid.
- [ ] **LAY-11** Enable all languages and switch through them rapidly while typing. No stale layout key is inserted.
- [ ] **LAY-12** Remove the currently selected language in Settings. Every open keyboard falls back to an enabled language.
- [ ] **LAY-13** Confirm RTL layouts do not reverse physical keyboard row mapping or corrupt surrounding LTR text; repeat for LTR layouts in RTL content.

## 8. Physical keyboard and typing modes

Repeat mapping accuracy cases for every enabled language and at least one ANSI and one ISO physical keyboard where available.

- [ ] **PHY-01 [Smoke]** In Ghalamnama mode, press every mapped physical number and letter key; output matches the virtual unshifted layout.
- [ ] **PHY-02 [Smoke]** Hold physical Shift and repeat every mapped key; output matches the shifted layout.
- [ ] **PHY-03** Press and release Shift without typing. Shift state does not stick; losing window focus also clears visual pressed state.
- [ ] **PHY-04** Toggle physical Caps Lock and verify output/display follows the extension’s Caps contract. Restore the OS Caps state afterward.
- [ ] **PHY-05** Key repeat works predictably when holding a mapped key and does not duplicate beyond normal repeat behavior.
- [ ] **PHY-06** Ctrl-, Meta/Cmd-, and Alt-modified keys retain browser/site shortcuts and are not remapped.
- [ ] **PHY-07** During IME composition (`event.isComposing`), the extension does not intercept or corrupt composition.
- [ ] **PHY-08** Unmapped keys—arrows, Home/End, Page Up/Down, Delete, Backspace, Enter, Tab, Escape, function keys, and media keys—retain normal browser/editor behavior unless explicitly provided as virtual actions.
- [ ] **PHY-09** When no supported field is focused, physical typing is never captured or inserted elsewhere.
- [ ] **PHY-10 [Smoke]** Switch to OS mode. Physical typing is untouched while virtual keys still insert the selected Ghalamnama layout.
- [ ] **PHY-11** Switch back to Ghalamnama mode. Remapping resumes immediately without reload.
- [ ] **PHY-12** Change mode in one active tab. Other active tabs update to the intentionally global preference.
- [ ] **PHY-13** With key highlighting enabled and the panel open, each mapped key visibly highlights the matching virtual key and clears promptly.
- [ ] **PHY-14** Disable key highlighting. No pressed visual is shown, while remapping still works.
- [ ] **PHY-15** In OS mode or while the panel is closed, no stale virtual-key highlight appears.
- [ ] **PHY-16** Test common site shortcuts and browser commands, including find, copy/paste, select all, undo/redo, reload, address bar, and DevTools.

## 9. Commands and shortcut conflicts

- [ ] **CMD-00 [Smoke]** On a supported inactive tab, Alt+Shift+G (Mac: Control+Shift+G) activates Ghalamnama; pressing it again deactivates that tab. On a protected page it is a safe no-op.
- [ ] **CMD-01 [Smoke]** On an active tab with a focused supported field, Ctrl+Shift+Space opens and closes the keyboard.
- [ ] **CMD-02** On an active tab with no supported field focused, the command reveals the floating control without inserting text.
- [ ] **CMD-03** If the floating control is hidden, the command restores it according to current behavior.
- [ ] **CMD-04** On an inactive or protected tab, the command is a safe no-op.
- [ ] **CMD-05** Customize the command in Firefox’s Manage Extension Shortcuts UI. The new shortcut works and the old one stops invoking it.
- [ ] **CMD-06** Remove or create a conflict for the shortcut. Firefox and the extension fail gracefully with no stuck modifier state.
- [ ] **CMD-07** Test both default shortcut paths on Windows, macOS, and Linux, paying special attention to OS/browser-reserved combinations.
- [ ] **CMD-08** Confirm Alt+Shift+K does not insert a mapped character or trigger a site action when used to reveal the hidden control.

## 10. Settings, synchronization, and reset

- [ ] **SET-01 [Smoke]** Open Settings from the popup, keyboard gear button, and Firefox Add-ons Manager. All paths reach one functional page.
- [ ] **SET-02** Initial values match stored enabled languages, default language, typing mode, key highlighting, and reveal-shortcut preference.
- [ ] **SET-03** Attempt to save zero languages. Save is rejected with an accessible error and previous settings remain intact.
- [ ] **SET-04** Disable the selected default language and save. Save is rejected until an enabled default is selected.
- [ ] **SET-05 [Smoke]** Save every valid setting combination. “Settings saved” appears, disappears after its timeout, and values survive closing/reopening Settings and restarting Firefox.
- [ ] **SET-06** Keep multiple active page keyboards open while saving settings. Language lists, selected language, mode, highlighting, and reveal behavior update without reload.
- [ ] **SET-07** Open two Settings tabs, save conflicting changes in sequence, and verify last-save behavior is consistent and all contexts converge.
- [ ] **SET-08** Click Reset and cancel the confirmation. Nothing changes.
- [ ] **SET-09 [Smoke]** Confirm Reset. All active tabs deactivate, injected UI disappears, activation memory is cleared, and defaults reload in Settings.
- [ ] **SET-10** After Reset, open the popup. First-run state is restored and browser-action status/title is correct.
- [ ] **SET-11** Reset while active tabs are loading, discarded, or being closed. Reset completes without uncaught errors or partial state.
- [ ] **SET-12** Corrupt individual stored values through extension debugging (unknown language, empty/invalid arrays, invalid mode, malformed position, non-boolean flags). UI falls back safely and remains resettable.

## 11. Support and external links

- [ ] **LNK-01** “Report an issue or share feedback” invokes the configured mail handler with recipient `support@ghalamnama.online` and the intended subject.
- [ ] **LNK-02** With no mail handler configured, clicking feedback fails in a browser-controlled, understandable way and does not break the popup.
- [ ] **LNK-03** “Request a language or layout” opens the correct GitHub issue URL in a new tab with its prefilled title.
- [ ] **LNK-04** “Support Ghalamnama” opens the correct HTTPS donation page in a new tab.
- [ ] **LNK-05** External pages cannot access the extension popup/opener context; links use the intended isolation behavior.
- [ ] **LNK-06** Test external links offline and with blocked navigation. The popup and extension remain usable.

## 12. Accessibility, localization, and visual resilience

- [ ] **A11Y-01 [Smoke]** Complete onboarding, activation, popup actions, settings, panel open/close, language/mode selection, and deactivation using only the keyboard.
- [ ] **A11Y-02** Inspect the accessibility tree with Firefox Accessibility tools. Controls have roles, names, states, and relationships; status/error messages are exposed appropriately.
- [ ] **A11Y-03** Focus indicators are visible on every popup, settings, floating, toolbar, selector, and virtual-key control.
- [ ] **A11Y-04** Focus is not trapped. Opening/closing the page keyboard does not unexpectedly move focus away from the editor.
- [ ] **A11Y-05** `aria-expanded`, `aria-pressed`, disabled/read-only treatment, and status announcements reflect visible state.
- [ ] **A11Y-06** Test at Firefox zoom 80%, 100%, 200%, and 400%, plus OS text scaling. Content remains usable without two-dimensional scrolling where avoidable.
- [ ] **A11Y-07** Test narrow and short windows, portrait-like dimensions, and full screen. All essential controls remain reachable.
- [ ] **A11Y-08** Test Windows High Contrast/forced colors, Firefox dark/light themes, and increased contrast. States are not conveyed by color alone.
- [ ] **A11Y-09** Enable reduced motion. No essential information depends on animation and motion is minimized.
- [ ] **A11Y-10** Use a screen reader on at least one platform to traverse popup/settings and operate the floating control and representative virtual keys.
- [ ] **A11Y-11** Verify mixed English, Persian, Arabic, Hebrew, Russian, and Greek labels render with correct glyphs and no tofu, clipping, or bidi confusion.
- [ ] **A11Y-12** Check color contrast for text, focus rings, buttons, selected/pressed states, errors, and status messages.
- [ ] **A11Y-13** Confirm the extension does not inject announcements or focus changes merely when a field receives focus.

## 13. Privacy, permissions, and security

- [ ] **SEC-01 [Smoke]** With the Network Monitor open, use every extension feature. No user text, page content, preferences, or telemetry is transmitted.
- [ ] **SEC-02** Use the extension in a field containing sensitive dummy data. Text remains local and is not logged to the Browser Console.
- [ ] **SEC-03** Inspect local extension storage. It contains only documented preferences and tab IDs, never typed field contents or browsing history.
- [ ] **SEC-04** Verify website access matches the store disclosure and that protected Firefox pages remain inaccessible.
- [ ] **SEC-05** Type HTML/script-like strings through virtual and physical mappings. They are inserted as text, not interpreted as extension UI markup.
- [ ] **SEC-06** Use hostile page CSS and JavaScript that observes/mutates the DOM. Page code cannot call privileged extension APIs through injected elements.
- [ ] **SEC-07** Verify strict-CSP pages still work because the extension loads packaged scripts/styles and does not require remote code.
- [ ] **SEC-08** Inspect the packaged archive for source maps, secrets, development files, unexpected remote URLs, and executable code not required by the product.
- [ ] **SEC-09** Verify external links are HTTPS where applicable and no tab-nabbing/opener vulnerability is exposed.
- [ ] **SEC-10** Confirm reset and uninstall remove or render inaccessible all extension-owned state as Firefox’s lifecycle promises.

## 14. Reliability and performance

- [ ] **PERF-01 [Smoke]** Compare a representative page before and after activation. No visible page-load regression, layout shift, or input lag is introduced.
- [ ] **PERF-02** Type rapidly for several minutes with physical mapping and virtual clicks. No missed/double characters, increasing lag, or stuck Shift state occurs.
- [ ] **PERF-03** Activate/deactivate the same tab 20 times. Only one host/listener set exists and each physical key inserts once.
- [ ] **PERF-04** Reload an active tab 20 times and use Back/Forward repeatedly. Memory and listener behavior remain stable.
- [ ] **PERF-05** Keep 20+ tabs open with several active. Popup opening, startup restoration, and settings broadcasts remain responsive.
- [ ] **PERF-06** Leave an active tab open overnight/suspended, then resume typing. State is consistent and the control responds.
- [ ] **PERF-07** Use offline mode. All core keyboard, settings, activation, and persistence functions continue working.
- [ ] **PERF-08** Simulate storage/API failures where Firefox debugging permits. Errors are contained, user data on the page is untouched, and recovery/reset remains possible.
- [ ] **PERF-09** Watch CPU and memory with the panel closed and no field focused. The extension performs no continuous polling or runaway work.
- [ ] **PERF-10** Check Browser Console after the full suite. No recurring warnings, unhandled promise rejections, or detached-listener errors remain.

## 15. Release acceptance

- [ ] **REL-01** Every `[Smoke]` case passes on every required release-matrix environment.
- [ ] **REL-02** Every non-smoke case is Pass or has an explicitly accepted issue with owner, severity, and release rationale.
- [ ] **REL-03** Layout output has been independently spot-checked by a fluent user or against an approved specification for each supported language.
- [ ] **REL-04** Store listing, privacy disclosure, screenshots, support links, minimum Firefox version, and README match the shipped package.
- [ ] **REL-05** The exact signed artifact tested is the artifact released; archive checksum and version are recorded.
- [ ] **REL-06** A rollback package/process and a support contact are ready before rollout.
- [ ] **REL-07** Post-release sanity-check installation, activation, typing, settings, and links from the live distribution channel.

## Suggested evidence record

For failures, capture: test ID, environment, exact URL/editor, starting preferences, reproduction steps, expected result, actual result, screenshot/video, Browser Console output, whether typed data was at risk, and whether the failure survives restart or a clean profile.
