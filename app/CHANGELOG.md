# Changelog

## 0.2.0

Course-ready release: deterministic data, stable ids and fast state setup. No existing testID, deep link, seed id or user changes; everything below is additive.

### Fixed

- **Seed dates no longer rot (P0-1).** Seed timestamps are rebased onto today's date at seed time (anchor `2026-05-12`), so a fresh install shows the same 5 upcoming events and 1 past event on any date. Covers events, doors and lineup slots, tickets, reviews, notifications and payment methods. Card expiry stays absolute (12/2030).
- **iOS cold-launch deep links (P0-5).** URLs that arrive before the app's stores hydrate are queued and applied afterwards. `debug/failure-trigger.yaml` is no longer `android-only`.
- **Switch ids on iOS (P0-4).** `debug.trigger.<kind>` and `settings.notificationsToggle` are now on the whole row, which is the accessible switch (role `switch`, `checked` state). Tapping the id toggles it.
- **iOS test-driver hang after a purchase.** A toast left on screen across a tab switch hung XCUITest's UI snapshot (Maestro "driver timed out during snapshot call"). Toasts now clear when the active tab changes; closing the Buy sheet keeps them.
- **Purchase errors visible on iOS.** On iOS the Buy screen is a modal sheet that covered the error toast. The error now also shows inside the Buy screen (`buyTicket.errorMessage`).
- **Event Detail hero** keeps its 16:9 height with bundled images, so the Buy button stays on screen.
- **Pull-to-refresh** shows its spinner only for a user pull, not for background refetches.
- **Flows:** `detail-cancel` scrolls to the cancel button; `transfer` matches error text with a regex; `edit-profile` no longer calls `hideKeyboard`; the onboarding flows use the `frontrowOnboarding` launch argument instead of `openLink`.
- **iOS builds from a fresh clone.** The native-demo sources are committed; see `docs/RELEASING.md`.

### Added

- **Frozen app clock (P0-2):** `frontrow://debug/clock/<ISO>` and `/debug/clock/reset`; Debug → App clock rows `debug.clock.freeze` / `debug.clock.reset`.
- **Header back button (P0-6):** `header.backButton` on every stack screen with a back affordance. Flows no longer tap coordinates.
- **Launch arguments (P1-1):** `frontrowE2E`, `frontrowScenario`, `frontrowSignedIn`, `frontrowOnboarding`, `frontrowClock`, `frontrowNetwork`, `frontrowTrigger` via Maestro `launchApp.arguments`. New dependency: `react-native-launch-arguments@4.1.1`.
- **Network deep link (P1-2):** `frontrow://debug/network/<profileId>` and `/debug/network/reset`.
- **Version on About (P1-3):** `settings.about.version`, e.g. `0.2.0 (2)`.
- **Offline Privacy and Terms pages (P1-5):** bundled HTML with a heading, an anchor link and a button.

### Changed

- **Locked to light mode (P1-4).** Appearance = System stays light whatever the OS is set to, so recordings match on any device. The full dark palette is planned for 0.3.0.
- **Avatars are built-in initials.** Seed users and artists no longer load photos from pravatar.cc.
- **Event images are bundled.** The six seed images ship with the app instead of loading from picsum.photos, so the feed is identical offline and between runs.
- **All testIDs come from `src/testIds.ts` (P0-7).** Same string values. The Debug force-error "None" chip gains `debug.forceError.none`.
- **Docs (P0-3, P1-6):** README "First five minutes" corrected (no onboarding on fresh install, password `demo1234`), course link added. `docs/TEST_IDS.md` lists every id.
- Version 0.2.0, build 2 (iOS `CFBundleVersion` 2, Android `versionCode` 2).
