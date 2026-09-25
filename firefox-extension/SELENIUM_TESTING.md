# Selenium tests

The Selenium suite runs the real content script inside Firefox against local,
deterministic fixture pages. A generated test-only XPI adds a localhost content
script declaration; the production `manifest.json` is not changed.

## Run

Install Firefox and a current Node.js release, then run:

```sh
cd firefox-extension
npm install
npm run test:selenium
```

Selenium Manager downloads or locates a compatible GeckoDriver when necessary.
Tests are headless by default. To watch Firefox:

```sh
HEADED=1 npm run test:selenium
```

Run the existing unit suite separately with `npm run test:unit`, or run both
unit and Selenium tests with `npm test`.

The test names retain IDs from `MANUAL_TEST_CHECKLIST.md`, making it possible to
track which release requirements have automated coverage. Signed-XPI installs,
browser toolbar interactions, OS accessibility, and production-site checks
remain in the manual release suite.

## Current coverage and limits

The suite contains 21 browser tests. The expanded behavior suite uses a fresh
Firefox profile for each test, waits for the keyboard to finish rendering, and
closes the installation onboarding tab before interacting with the fixture.
Virtual keys are clicked through WebDriver; scripts only prepare selections or
observe events. No production code is changed to make assertions pass.

| Checklist IDs | Automated scenarios |
| --- | --- |
| FLT-01, FLT-03, FLT-04 | Single control, panel opening, ARIA state, virtual Escape |
| FLD-03 | Read-only input and previously focused input remain unchanged |
| FLD-05, FLD-06, FLD-10 | Middle caret, backward selection replacement, selected-range backspace, zero-position backspace, retained focus |
| FLD-09 | Physical edit counter update; virtual edit emits exactly one bubbling input event |
| FLD-12, FLD-17 | Basic contenteditable insertion and changing the active field |
| LAY-01, LAY-02 | Direction and one independently specified sample key for each of five languages |
| PHY-01, PHY-02, PHY-03 | Sample physical mapping, shifted mapping, release clearing |
| PHY-10, PHY-11 | System mode preserves physical input and virtual typing; remapping resumes |
| ACT-16 | Toolbar removes UI and stops remapping |
| LAY-07 | Saved language survives reload with one host |

These are scenario-level checks, not complete passes for every referenced
checklist item. In particular, layout samples do not validate every key.
The temporary manifest automatically injects on localhost, so these tests do
not prove production per-tab activation, popup behavior, activation restoration,
or signed-package installation. The ACT-16 case verifies the page behavior only.
Keep the corresponding manual checks until dedicated integration tests exist.

The activation command handler is unit-tested for normal and protected tabs.
Firefox WebDriver sends keys to page content but does not invoke browser-level
WebExtension commands, so the actual Alt+Shift+G shortcut remains a manual
`CMD-00` smoke check.

## Facebook registration smoke test

An opt-in test opens Facebook's live registration page and verifies that a
physical `KeyQ` event produces the Persian `ض` character in its given-name
field. It also checks that exactly one keyboard host and a visible toggle are
present:

```sh
npm run test:live:facebook
```

This test is intentionally excluded from `npm test`. It requires internet
access and Facebook may change the page, redirect by region, show a consent
flow, or temporarily block automated browsers. A failure to find the field is
reported separately from an incorrect extension result. The test enters one
dummy character and never submits the registration form.
