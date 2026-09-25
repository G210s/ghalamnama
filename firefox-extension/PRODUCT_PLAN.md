# Ghalamnama Extension Product Plan

## 1. Product Definition

Ghalamnama is a browser-native multilingual writing tool. It lets a user type Persian, Arabic, Hebrew, Russian, or Greek in webpage fields without changing the operating-system keyboard configuration.

The everyday flow is:

1. Activate Ghalamnama for the current tab from the Firefox extension popup.
2. Focus a writable field on the page.
3. Use the floating control to open the keyboard when needed.
4. Select a language and typing mode.
5. Type with either the physical keyboard or the on-screen keyboard.
6. Deactivate the tab when finished.

The popup is a control center. The injected webpage UI is the typing surface.

## 2. Current Architecture Assessment

### Existing components

| Component | Current responsibility |
| --- | --- |
| `manifest.json` | Manifest V2 metadata, Firefox ID, storage and `<all_urls>` permissions, browser-action popup, background script. |
| `background.js` | Tracks active tab IDs, injects CSS/content script, restores active tabs after reload, handles popup/content-script messages, updates browser-action titles. |
| `popup.html` / `popup.js` / `popup.css` | First-run language selection, current-tab activation/deactivation, global language settings, and showing a hidden floating icon. |
| `content-script.js` | Defines all five layouts and labels, creates the floating control and keyboard, inserts text, handles physical-key remapping, language/mode/visibility state, drag position, and content-script messages. |
| `keyboard.css` | Isolated fixed-position webpage UI styling, responsive keyboard sizing, panel, toggle, and deactivate control. |

### Current interaction model

- The extension is inactive until the user activates the current tab from the popup.
- Activation injects the content script and keyboard CSS into that tab.
- The floating control becomes available when a supported text field receives focus, unless the user hid it.
- Clicking the control opens or closes the keyboard panel.
- The panel currently combines language selection, inline language management, keyboard mode, settings, hide, and deactivation.
- Physical remapping is enabled by default in Ghalamnama mode. OS mode leaves physical typing to the operating system while keeping the injected UI available.
- The keyboard uses physical rows and existing layout definitions for Persian, Arabic, Hebrew, Russian JCUKEN, and Greek.

### Current persistence and ownership

| Data | Current storage | Intended ownership in the redesign |
| --- | --- | --- |
| Active tab IDs | Global `storage.local`, background `Set` | Per-tab runtime state, with reload restoration only. |
| Enabled languages | Global `storage.local` | Global user preference. |
| Selected language | Global `storage.local` | Global default, optionally overridden per site later. |
| Typing mode | Global `storage.local` | Global default, optionally overridden per site later. |
| Floating control hidden state | Global `storage.local` | Global UI preference unless a per-site override is introduced. |
| Floating control position | Global `storage.local` | Global viewport preference; validate on every page size. |
| Onboarding completion | Global `storage.local` | Global account-free setup state. |
| Keyboard open/closed | In-memory content-script state | Per-tab temporary UI state; do not persist by default. |
| Shift state and active field | In-memory content-script state | Per-tab temporary interaction state. |

## 3. UX State Model

The redesign must keep three independent concepts visible and separate.

```text
Extension activation
  OFF: no injected UI or remapping on this tab
  ON: injected UI is available on this tab

Keyboard visibility, only when Extension = ON
  CLOSED: floating control is visible when appropriate
  OPEN: keyboard panel is visible

Typing mode, only when Extension = ON
  Ghalamnama: physical keys are remapped through the selected layout
  OS: physical keys behave normally; on-screen keyboard remains available
```

### State ownership

- **Global:** enabled languages, default language, default typing mode, onboarding completion, appearance/accessibility defaults, shortcut preferences.
- **Per-tab:** extension activation, current keyboard visibility, active field, pressed modifier state, highlighted key, temporary errors.
- **Per-site, optional later:** preferred language and preferred typing mode for a normalized hostname. Site preferences must never activate a tab automatically.
- **Layout data:** static code-owned definitions. Do not duplicate mappings in popup, settings, or CSS.

### State transition rules

```text
OFF --Activate from popup or shortcut--> ON / Keyboard CLOSED
ON / CLOSED --Open floating control--> ON / OPEN
ON / OPEN --Close floating control--> ON / CLOSED
ON --Switch typing mode--> ON / same visibility
ON --Deactivate from popup or page control--> OFF
ON --Page reload--> ON / CLOSED, with preferences restored
ON --Tab close--> remove runtime activation state
```

Activation must not imply that the keyboard is open. Typing mode must not imply that the extension is active or inactive.

## 4. Feature Inventory and Requirements

### Activation and tab lifecycle

- **ACT-01:** Activate Ghalamnama for the current tab from the popup or activation shortcut.
- **ACT-02:** Deactivate only the current tab from the popup or floating control.
- **ACT-03:** Show an explicit active/inactive status in the popup.
- **ACT-04:** Restore active injection after a page reload when the tab remains active.
- **ACT-05:** Fail clearly on Firefox-protected pages and leave the page unchanged.
- **ACT-06:** Keep tab switching and navigation from leaking activation or stale UI between tabs.

### Popup control center

- **POP-01:** Show `Inactive on this tab` with `Activate` when the current tab is off.
- **POP-02:** Show `Active on this tab` with `Deactivate` when the current tab is on.
- **POP-03:** Show the selected language and provide a direct language-selection path.
- **POP-04:** Provide a clear Ghalamnama/OS typing-mode selector with explanatory copy.
- **POP-05:** Link to dedicated settings for enabled languages and advanced preferences.
- **POP-06:** Keep popup controls compact; do not turn the popup into the typing surface.

### Onboarding

- **ONB-01:** On first use, ask which supported languages to enable.
- **ONB-02:** Explain the supported typing methods in product language, mapped to actual capabilities.
- **ONB-03:** Finish with a short ready state that points the user to toolbar activation.
- **ONB-04:** Do not expose the full settings architecture during onboarding.
- **ONB-05:** Require at least one enabled language and preserve choices globally.

### Floating control

- **FLOAT-01:** Show a small, draggable control only while the tab is active.
- **FLOAT-02:** Display the active language in a compact, readable form.
- **FLOAT-03:** Provide an obvious open/closed state without implying activation state.
- **FLOAT-04:** Show a subtle, non-color-only indicator when Ghalamnama remapping is active.
- **FLOAT-05:** Keep deactivation available without making it the primary visual action.
- **FLOAT-06:** Preserve drag behavior, keyboard focus, accessible name, and viewport clamping.
- **FLOAT-07:** Respect the user's hidden state and provide a recoverable way to show the control.

### Keyboard surface

- **KEY-01:** Preserve all existing layout mappings and shifted mappings.
- **KEY-02:** Present a recognizable desktop keyboard shape with number row, Tab, Caps Lock, Shift, Backspace, Enter, and Space.
- **KEY-03:** Keep modifier and special-key behavior consistent with the existing implementation.
- **KEY-04:** Add visible pressed/focus/disabled states and keyboard-accessible buttons.
- **KEY-05:** Keep the panel usable on long, fixed, sticky, RTL, and LTR pages.
- **KEY-06:** Support compact mode only after full mode remains stable; compact mode must share the same layout and input logic.
- **KEY-07:** Add a special-character area only from characters already supported by the relevant layout definitions.
- **KEY-08:** Never silently normalize or transform inserted text.
- **KEY-09:** Respect reduced-motion preferences and avoid trapping focus in the page.

### Language management

- **LANG-01:** Provide a one-interaction language switcher in the open keyboard.
- **LANG-02:** Show only enabled languages in the quick selector.
- **LANG-03:** Provide a `Manage languages` path to settings.
- **LANG-04:** Preserve the selected language when navigating or reloading according to the preference policy.
- **LANG-05:** Keep language display names and direction metadata centralized with layout definitions.

### Typing modes and physical input

- **MODE-01:** Ghalamnama mode maps physical `KeyboardEvent.code` values through the selected layout.
- **MODE-02:** OS mode leaves physical keyboard events alone while retaining the webpage keyboard UI.
- **MODE-03:** Explain both modes in the popup and keyboard UI without relying on implementation jargon.
- **MODE-04:** Preserve Shift behavior for number and character rows.
- **MODE-05:** Highlight the corresponding virtual key on physical keydown when feasible, and clear it on keyup/blur.
- **MODE-06:** Do not interfere with Ctrl, Meta, Alt, composition, browser shortcuts, or site shortcuts unless the existing mapping contract explicitly requires it.
- **MODE-07:** Preserve editing behavior for insertion, selection replacement, backspace, enter, space, and input events.

### Writable-field behavior

- **FIELD-01:** Support text inputs and textareas already handled by the extension.
- **FIELD-02:** Add safe support for `contenteditable` elements after verifying selection/range insertion behavior.
- **FIELD-03:** Detect rich-text surfaces conservatively; do not mutate unsupported page editors.
- **FIELD-04:** On focus, make the floating control available but do not automatically open a large keyboard.
- **FIELD-05:** Track the active writable field without stealing focus from the page.

### Settings

- **SET-01:** Add a dedicated options/settings page rather than expanding the popup indefinitely.
- **SET-02:** Organize settings into Languages, Typing, Appearance, Behavior, Shortcuts, and Advanced sections only where supported.
- **SET-03:** Manage enabled languages and default language globally.
- **SET-04:** Manage default typing mode globally.
- **SET-05:** Provide keyboard size and floating-control visibility only if the implementation supports them reliably.
- **SET-06:** Provide explicit reset settings with confirmation.
- **SET-07:** Keep unsupported ideas out of the UI; a setting is not a promise until its behavior exists.

### Shortcuts

- **SHORT-01:** Use `Alt + Shift + G` (`Control + Shift + G` on macOS) to activate or deactivate the current tab, and `Ctrl + Shift + Space` to switch physical typing between the Ghalamnama layout and the system keyboard; leave keyboard open/close available as an unassigned Firefox command.
- **SHORT-02:** Evaluate next/previous enabled-language commands separately.
- **SHORT-03:** Make shortcuts configurable only through the WebExtension command mechanism and document browser limitations.
- **SHORT-04:** Preserve the current reveal-hidden-control shortcut only if it remains discoverable and conflict-free.

### Site preferences

- **SITE-01:** Design storage around normalized hostnames and versioned preference records.
- **SITE-02:** Support optional preferred language per site.
- **SITE-03:** Support optional preferred typing mode per site.
- **SITE-04:** Apply site preferences only after the user activates the extension on that tab.
- **SITE-05:** Provide a clear reset/remove path and never silently create aggressive automation.

## 5. Proposed Screen and Component Structure

### Popup

1. Header: Ghalamnama and current-tab status.
2. Primary action: Activate or Deactivate.
3. Language row: selected language and chevron.
4. Typing mode row: Ghalamnama or OS with short explanation.
5. Secondary links: Languages & layouts, Settings.
6. First-run route: onboarding steps replace the steady-state control center until complete.

### Onboarding

1. Open a dedicated welcome guide once after a fresh installation.
2. Select enabled languages.
3. Explain toolbar pinning, per-tab activation, and the typing-mode shortcut.
4. Select the initial typing method, state the no-telemetry privacy promise, and complete setup.

### Injected page UI

1. Floating control: language glyph/name, open/closed state, remapping indicator.
2. Keyboard panel: language selector, mode selector, desktop rows, special keys, optional compact/full presentation.
3. Non-blocking notices: unsupported page, missing active field, or settings errors.

### Settings page

- Languages and layouts
- Typing defaults and key highlighting
- Appearance and keyboard size
- Behavior and field activation policy
- Commands/shortcuts
- Advanced reset and future layout extension point

## 6. Implementation Sequence

### Phase 0: Contract and safety baseline

- Extract the layout definitions, language labels, and physical-key rows into a shared code-owned module or a clearly reusable content-script module.
- Define a versioned storage schema and migration helper.
- Add a small testable input-mapping layer for unmodified, shifted, ignored, and unsupported events.
- Record current behavior for activation, remapping, Shift, insertion, backspace, enter, and reload restoration before UI changes.

### Phase 1: Separate the state model

- Keep background activation state per tab.
- Make keyboard visibility temporary per tab.
- Define global defaults for language and typing mode.
- Add explicit messages for activation status, language changes, typing-mode changes, and open/close requests.
- Ensure deactivation removes the injected UI and stops listeners cleanly.

### Phase 2: Popup and onboarding

- Replace the current mixed first-run/steady-state popup with the control-center structure.
- Implement the three-step onboarding flow using currently supported languages and modes.
- Preserve the existing current-tab activation contract and protected-page error path.
- Add direct language and mode controls without making the popup a keyboard.

### Phase 3: Floating control and keyboard redesign

- Redesign the floating control around language, open/closed, remapping, drag, and deactivation affordances.
- Rebuild the keyboard rows from existing mappings, including desktop proportions and explicit special keys.
- Add accessible names, focus styles, pressed states, and responsive sizing.
- Add the in-keyboard quick language selector and move language management to settings.

### Phase 4: Dedicated settings

- Add an options page and an options entry in the manifest/browser UI.
- Implement only settings backed by real behavior: enabled languages, defaults, visibility, size if supported, key highlighting, and reset.
- Add storage migration and cross-context synchronization so popup, settings, and content scripts converge on one state.

### Phase 5: Interaction reliability

- Extend field detection to contenteditable with selection-safe insertion.
- Add physical-key highlighting and cleanup on keyup, blur, and navigation.
- Add command shortcuts after testing Firefox conflicts.
- Verify event propagation against browser shortcuts and representative rich-text editors.

### Phase 6: Optional enhancements

- Add compact keyboard mode using the same mapping/input model.
- Add a layout-supported special-character tray.
- Add versioned per-site language and typing-mode preferences, with explicit user controls.
- Consider custom layouts only after the static layout contract and settings architecture are stable.

## 7. Validation Plan

### Automated checks

- Layout integrity: every virtual key maps to the intended physical code and shifted value.
- Mapping behavior: normal, Shift, Caps/virtual Shift, ignored modifier combinations, composition, and unsupported codes.
- Text editing: insertion, replacement selection, Unicode-safe backspace, newline, space, and input events.
- Storage migration: missing values, invalid values, old schema, and reset behavior.
- State transitions: activate, deactivate, reload, tab removal, mode switching, open/close, and settings updates.

### Manual browser matrix

- `input`, `textarea`, and `contenteditable`.
- Persian, Arabic, Hebrew, Russian, and Greek layouts.
- LTR and RTL pages, long scrolling pages, fixed/sticky page controls.
- Physical typing with Shift, Backspace, Enter, Tab, and number row.
- OS mode and Ghalamnama mode.
- Popup activation/deactivation, page reload, navigation, tab switching, and protected pages.
- Settings persistence, onboarding completion, hidden-control recovery, drag position, and viewport resizing.
- Representative rich-text editors before declaring `contenteditable` support reliable.

### Accessibility checks

- Full keyboard navigation through popup, settings, floating control, selector, and key buttons.
- Visible focus indicators and meaningful accessible names.
- Directionality correct for labels and inserted text.
- No color-only state communication.
- Sufficient contrast, readable labels, reduced-motion behavior, and no unexpected focus theft.

## 8. Risks and Decisions

| Risk | Decision or mitigation |
| --- | --- |
| Global storage currently controls some per-tab-looking UI state | Define ownership before UI work and migrate values explicitly. |
| `contenteditable` insertion is not equivalent to `setRangeText` | Treat it as a separate implementation with focused tests; support conservatively. |
| Firefox command shortcuts can conflict with browser or site shortcuts | Use the WebExtension command API, test defaults, and expose only reliable commands. |
| Injected CSS/DOM may conflict with hostile or highly styled pages | Preserve the isolated host, reset styles, maximum z-index, viewport bounds, and test sticky/RTL pages. |
| Persisting tab IDs is runtime-specific | Reconcile saved IDs with live tabs and remove stale IDs; do not present it as durable site activation. |
| Current content script contains all UI, labels, and mappings | Refactor incrementally; avoid duplicating layout data across new popup/settings files. |
| Inline language settings currently allow the keyboard to mutate global language preferences | Move that management flow to settings and keep the keyboard selector fast and read-only except for language selection. |
| Existing `Alt + Shift + K` behavior reveals a hidden icon | Preserve only as a documented recovery command or replace it with a discoverable settings action. |

## 9. Deliberately Deferred Features

- Transliteration and candidate suggestions.
- AI or automatic language detection.
- Automatic activation or automatic keyboard opening on field focus.
- Silent Unicode normalization.
- Custom layout authoring.
- Full site-preference automation before the global state migration is stable.
- Compact keyboard and special-character tray until the full keyboard redesign has reliable input behavior.

These features remain possible because layouts, storage, messaging, and UI state are planned as separate concerns, but they are not required for the first coherent redesign.

## 10. Definition Of Done

The redesign is ready for release when:

- A user can distinguish tab activation, keyboard visibility, and typing mode from the popup and webpage UI without documentation.
- Existing five-language mappings and editing behavior remain intact.
- Popup, settings, and injected UI use one consistent preference model.
- Activation/deactivation and reload behavior are reliable across normal tabs and protected pages.
- Physical keyboard remapping and OS mode are both understandable and testable.
- The floating control is draggable, recoverable, accessible, and unobtrusive.
- Focused automated checks and the manual browser matrix pass, with known limitations documented.
