# Test ID Conventions

Every interactive element in FrontRow has a `testID` (Maestro / Appium / Espresso / XCUITest hook) and an `accessibilityLabel` (real users with screen readers).

## Where they live

`src/testIds.ts` is the single source of truth. Never hard-code an ID at a call site — always reference it through the registry.

## Naming

`<screen-or-area>.<element>[.<id>]`

Examples:

- `screen.events`
- `eventDetail.buyButton`
- `events.item.evt_42` (parameterized via factory function)
- `debug.seedScenario.expired_tickets`

## Per-platform behaviour

- **iOS (XCUITest, Appium iOS)** — `testID` becomes `accessibilityIdentifier`.
- **Android (Espresso, Appium Android)** — `testID` becomes the view's `resource-id`.
- **Maestro** — uses `id:` matchers against either platform.

## Lint enforcement

The custom plugin [`eslint-plugin-frontrow`](../eslint-plugin-frontrow/) is wired into `eslint.config.js` and ships two rules:

- `frontrow/require-testid` — interactive components (`Button`, `Pressable`, `TouchableOpacity`, etc.) must declare a `testID`.
- `frontrow/require-a11y-label` — the same components must pair the `testID` with an `accessibilityLabel`.

Both run in `npm run lint`. The CI job fails on violations, so new code can't drift from the contract.

## Adding a new ID

1. Add the entry to [`src/testIds.ts`](../src/testIds.ts).
2. Reference it via `testIds.<area>.<element>` from the component.
3. Pair it with an `accessibilityLabel` describing the _purpose_ in human terms — the lint rule enforces this.

## Catalog

Every id in [`src/testIds.ts`](../src/testIds.ts), generated from the registry. `<param>` marks a builder argument. Ids are additive: existing strings are never renamed or removed.

Notes:

- `debug.trigger.<kind>` and `settings.notificationsToggle` sit on the whole row, which is the accessible switch (role `switch`, `checked` state). Tap the id to toggle; assert with `checked: true|false`. The inner Switch is `<id>.switch`.
- `header.backButton` is on every stack screen that can go back.
- `settings.about.version` reads as the bare version text, e.g. `0.2.0 (2)`.

| Registry key (`testIds.…`)                     | testID                               |
| ---------------------------------------------- | ------------------------------------ |
| `app.root`                                     | `app.root`                           |
| `app.offlineBanner`                            | `app.offlineBanner`                  |
| `app.errorBoundary`                            | `app.errorBoundary`                  |
| `app.errorBoundaryReload`                      | `app.errorBoundary.reload`           |
| `onboarding.screen`                            | `screen.onboarding`                  |
| `onboarding.skipButton`                        | `onboarding.skipButton`              |
| `onboarding.nextButton`                        | `onboarding.nextButton`              |
| `onboarding.getStartedButton`                  | `onboarding.getStartedButton`        |
| `onboarding.page(n)`                           | `onboarding.page.<n>`                |
| `onboarding.dot(n)`                            | `onboarding.dot.<n>`                 |
| `tab.events`                                   | `tab.events`                         |
| `tab.myTickets`                                | `tab.myTickets`                      |
| `tab.profile`                                  | `tab.profile`                        |
| `tab.debug`                                    | `tab.debug`                          |
| `events.screen`                                | `screen.events`                      |
| `events.list`                                  | `events.list`                        |
| `events.item(id)`                              | `events.item.<id>`                   |
| `events.searchInput`                           | `events.searchInput`                 |
| `events.filterButton`                          | `events.filterButton`                |
| `events.filterRow`                             | `events.filterRow`                   |
| `events.filterChip(slug)`                      | `events.filterChip.<slug>`           |
| `events.errorMessage`                          | `events.errorMessage`                |
| `events.retryButton`                           | `events.retryButton`                 |
| `events.loadingFooter`                         | `events.loadingFooter`               |
| `events.endOfList`                             | `events.endOfList`                   |
| `events.inboxButton`                           | `events.inboxButton`                 |
| `events.inboxBadge`                            | `events.inboxBadge`                  |
| `events.skeleton`                              | `events.skeleton`                    |
| `events.heroCard`                              | `events.heroCard`                    |
| `events.sortButton`                            | `events.sortButton`                  |
| `events.sortOption(id)`                        | `events.sortOption.<id>`             |
| `events.recentlyViewedStrip`                   | `events.recentlyViewedStrip`         |
| `events.recentlyViewedItem(id)`                | `events.recentlyViewedItem.<id>`     |
| `events.sortBackdrop`                          | `events.sortBackdrop`                |
| `events.sortSheet`                             | `events.sortSheet`                   |
| `inbox.screen`                                 | `screen.inbox`                       |
| `inbox.list`                                   | `inbox.list`                         |
| `inbox.item(id)`                               | `inbox.item.<id>`                    |
| `inbox.unreadDot(id)`                          | `inbox.unreadDot.<id>`               |
| `inbox.markAllReadButton`                      | `inbox.markAllReadButton`            |
| `inbox.emptyState`                             | `inbox.emptyState`                   |
| `myTickets.screen`                             | `screen.myTickets`                   |
| `myTickets.list`                               | `myTickets.list`                     |
| `myTickets.item(id)`                           | `myTickets.item.<id>`                |
| `myTickets.filterChip(slug)`                   | `myTickets.filterChip.<slug>`        |
| `myTickets.emptyState`                         | `myTickets.emptyState`               |
| `myTickets.swipeCancel(id)`                    | `myTickets.swipeCancel.<id>`         |
| `myTickets.status(id)`                         | `myTickets.status.<id>`              |
| `ticketDetail.screen`                          | `screen.ticketDetail`                |
| `ticketDetail.qrCode`                          | `ticketDetail.qrCode`                |
| `ticketDetail.qrPayload`                       | `ticketDetail.qrPayload`             |
| `ticketDetail.statusPill`                      | `ticketDetail.statusPill`            |
| `ticketDetail.cancelButton`                    | `ticketDetail.cancelButton`          |
| `ticketDetail.cancelConfirmDialog`             | `ticketDetail.cancelConfirmDialog`   |
| `ticketDetail.cancelConfirmYes`                | `ticketDetail.cancelConfirmYes`      |
| `ticketDetail.cancelConfirmNo`                 | `ticketDetail.cancelConfirmNo`       |
| `ticketDetail.transferButton`                  | `ticketDetail.transferButton`        |
| `ticketDetail.transferEmailInput`              | `ticketDetail.transferEmailInput`    |
| `ticketDetail.transferSubmitButton`            | `ticketDetail.transferSubmitButton`  |
| `ticketDetail.transferCancelButton`            | `ticketDetail.transferCancelButton`  |
| `ticketDetail.transferError`                   | `ticketDetail.transferError`         |
| `profile.screen`                               | `screen.profile`                     |
| `profile.avatar`                               | `profile.avatar`                     |
| `profile.signInButton`                         | `profile.signInButton`               |
| `profile.signOutButton`                        | `profile.signOutButton`              |
| `profile.editButton`                           | `profile.editButton`                 |
| `profile.followingButton`                      | `profile.followingButton`            |
| `profile.premiumButton`                        | `profile.premiumButton`              |
| `profile.settingsButton`                       | `profile.settingsButton`             |
| `editProfile.screen`                           | `screen.editProfile`                 |
| `editProfile.backButton`                       | `editProfile.backButton`             |
| `editProfile.displayNameInput`                 | `editProfile.displayNameInput`       |
| `editProfile.bioInput`                         | `editProfile.bioInput`               |
| `editProfile.bioCharCount`                     | `editProfile.bioCharCount`           |
| `editProfile.saveButton`                       | `editProfile.saveButton`             |
| `editProfile.discardConfirmDialog`             | `editProfile.discardConfirmDialog`   |
| `editProfile.discardConfirmYes`                | `editProfile.discardConfirmYes`      |
| `editProfile.discardConfirmNo`                 | `editProfile.discardConfirmNo`       |
| `editProfile.errorMessage`                     | `editProfile.errorMessage`           |
| `login.screen`                                 | `screen.login`                       |
| `login.emailInput`                             | `login.emailInput`                   |
| `login.passwordInput`                          | `login.passwordInput`                |
| `login.submitButton`                           | `login.submitButton`                 |
| `login.forgotPasswordLink`                     | `login.forgotPasswordLink`           |
| `forgotPassword.screen`                        | `screen.forgotPassword`              |
| `forgotPassword.emailInput`                    | `forgotPassword.emailInput`          |
| `forgotPassword.submitButton`                  | `forgotPassword.submitButton`        |
| `forgotPassword.confirmation`                  | `forgotPassword.confirmation`        |
| `otp.screen`                                   | `screen.otp`                         |
| `otp.codeInput`                                | `otp.codeInput`                      |
| `otp.submitButton`                             | `otp.submitButton`                   |
| `otp.resendButton`                             | `otp.resendButton`                   |
| `otp.resendCountdown`                          | `otp.resendCountdown`                |
| `otp.errorMessage`                             | `otp.errorMessage`                   |
| `resetPassword.screen`                         | `screen.resetPassword`               |
| `resetPassword.newPasswordInput`               | `resetPassword.newPasswordInput`     |
| `resetPassword.confirmPasswordInput`           | `resetPassword.confirmPasswordInput` |
| `resetPassword.submitButton`                   | `resetPassword.submitButton`         |
| `resetPassword.errorMessage`                   | `resetPassword.errorMessage`         |
| `resetPassword.successMessage`                 | `resetPassword.successMessage`       |
| `switchChild(id)`                              | `<id>.switch`                        |
| `header.backButton`                            | `header.backButton`                  |
| `debug.screen`                                 | `screen.debug`                       |
| `debug.seedScenarioButton(id)`                 | `debug.seedScenario.<id>`            |
| `debug.resetButton`                            | `debug.resetButton`                  |
| `debug.timeTravelInput`                        | `debug.timeTravelInput`              |
| `debug.fakePushButton`                         | `debug.fakePushButton`               |
| `debug.forceErrorToggle`                       | `debug.forceErrorToggle`             |
| `debug.crashButton`                            | `debug.crashButton`                  |
| `debug.replayOnboardingButton`                 | `debug.replayOnboardingButton`       |
| `debug.triggerToggle(kind)`                    | `debug.trigger.<kind>`               |
| `debug.clearTriggersButton`                    | `debug.clearTriggers`                |
| `debug.networkProfile(id)`                     | `debug.networkProfile.<id>`          |
| `debug.openNativeDemo`                         | `debug.openNativeDemo`               |
| `debug.clockFreeze`                            | `debug.clock.freeze`                 |
| `debug.clockReset`                             | `debug.clock.reset`                  |
| `debug.clockValue`                             | `debug.clock.value`                  |
| `debug.localeInput`                            | `debug.localeInput`                  |
| `debug.localeSet`                              | `debug.localeSet`                    |
| `debug.iapReset`                               | `debug.iap.reset`                    |
| `debug.timeOffset(ms)`                         | `debug.timeOffset.<ms>`              |
| `debug.forceError(mode)`                       | `debug.forceError.<mode>`            |
| `debug.iap(outcome)`                           | `debug.iap.<outcome>`                |
| `nativeDemo.screen`                            | `screen.nativeDemo`                  |
| `nativeDemo.title`                             | `nativeDemo.title`                   |
| `nativeDemo.body`                              | `nativeDemo.body`                    |
| `nativeDemo.counter`                           | `nativeDemo.counter`                 |
| `nativeDemo.incrementButton`                   | `nativeDemo.incrementButton`         |
| `nativeDemo.closeButton`                       | `nativeDemo.closeButton`             |
| `eventDetail.screen`                           | `screen.eventDetail`                 |
| `eventDetail.title`                            | `eventDetail.title`                  |
| `eventDetail.buyButton`                        | `eventDetail.buyButton`              |
| `eventDetail.favoriteButton`                   | `eventDetail.favoriteButton`         |
| `eventDetail.shareButton`                      | `eventDetail.shareButton`            |
| `eventDetail.reviewsButton`                    | `eventDetail.reviewsButton`          |
| `eventDetail.followArtistButton`               | `eventDetail.followArtistButton`     |
| `eventDetail.lineup`                           | `eventDetail.lineup`                 |
| `eventDetail.lineupItem(i)`                    | `eventDetail.lineupItem.<i>`         |
| `eventDetail.refundPolicy`                     | `eventDetail.refundPolicy`           |
| `following.screen`                             | `screen.following`                   |
| `following.list`                               | `following.list`                     |
| `following.item(id)`                           | `following.item.<id>`                |
| `following.unfollowButton(id)`                 | `following.unfollow.<id>`            |
| `following.emptyState`                         | `following.emptyState`               |
| `settings.screen`                              | `screen.settings`                    |
| `settings.notificationsToggle`                 | `settings.notificationsToggle`       |
| `settings.languageRow`                         | `settings.languageRow`               |
| `settings.languageScreen`                      | `screen.settings.language`           |
| `settings.aboutRow`                            | `settings.aboutRow`                  |
| `settings.aboutScreen`                         | `screen.settings.about`              |
| `settings.aboutVersion`                        | `settings.about.version`             |
| `settings.privacyRow`                          | `settings.privacyRow`                |
| `settings.termsRow`                            | `settings.termsRow`                  |
| `settings.paymentMethodsRow`                   | `settings.paymentMethodsRow`         |
| `settings.appearanceOption(id)`                | `settings.appearance.<id>`           |
| `settings.webview.screen`                      | `screen.webview`                     |
| `settings.webview.content`                     | `webview.content`                    |
| `settings.webview.errorMessage`                | `webview.errorMessage`               |
| `settings.language(code)`                      | `settings.language.<code>`           |
| `paymentMethods.screen`                        | `screen.paymentMethods`              |
| `paymentMethods.list`                          | `paymentMethods.list`                |
| `paymentMethods.item(id)`                      | `paymentMethods.item.<id>`           |
| `paymentMethods.defaultBadge(id)`              | `paymentMethods.defaultBadge.<id>`   |
| `paymentMethods.setDefaultButton(id)`          | `paymentMethods.setDefault.<id>`     |
| `paymentMethods.deleteButton(id)`              | `paymentMethods.delete.<id>`         |
| `paymentMethods.addButton`                     | `paymentMethods.addButton`           |
| `paymentMethods.emptyState`                    | `paymentMethods.emptyState`          |
| `addPaymentMethod.screen`                      | `screen.addPaymentMethod`            |
| `addPaymentMethod.cardholderInput`             | `addPaymentMethod.cardholderInput`   |
| `addPaymentMethod.numberInput`                 | `addPaymentMethod.numberInput`       |
| `addPaymentMethod.expMonthInput`               | `addPaymentMethod.expMonthInput`     |
| `addPaymentMethod.expYearInput`                | `addPaymentMethod.expYearInput`      |
| `addPaymentMethod.cvcInput`                    | `addPaymentMethod.cvcInput`          |
| `addPaymentMethod.submitButton`                | `addPaymentMethod.submitButton`      |
| `addPaymentMethod.errorMessage`                | `addPaymentMethod.errorMessage`      |
| `reviews.screen`                               | `screen.reviews`                     |
| `reviews.list`                                 | `reviews.list`                       |
| `reviews.item(id)`                             | `reviews.item.<id>`                  |
| `reviews.itemImage(id)`                        | `reviews.itemImage.<id>`             |
| `reviews.ratingInput`                          | `reviews.ratingInput`                |
| `reviews.textInput`                            | `reviews.textInput`                  |
| `reviews.charCount`                            | `reviews.charCount`                  |
| `reviews.submitButton`                         | `reviews.submitButton`               |
| `reviews.errorMessage`                         | `reviews.errorMessage`               |
| `reviews.pickImageButton`                      | `reviews.pickImageButton`            |
| `reviews.imagePreview`                         | `reviews.imagePreview`               |
| `reviews.removeImageButton`                    | `reviews.removeImageButton`          |
| `reviews.permissionDenied`                     | `reviews.permissionDenied`           |
| `buyTicket.screen`                             | `screen.buyTicket`                   |
| `buyTicket.quantityStepper`                    | `buyTicket.quantityStepper`          |
| `buyTicket.quantityDecrement`                  | `buyTicket.quantityDecrement`        |
| `buyTicket.quantityIncrement`                  | `buyTicket.quantityIncrement`        |
| `buyTicket.payButton`                          | `buyTicket.payButton`                |
| `buyTicket.promoInput`                         | `buyTicket.promoInput`               |
| `buyTicket.promoApplyButton`                   | `buyTicket.promoApplyButton`         |
| `buyTicket.promoSuccess`                       | `buyTicket.promoSuccess`             |
| `buyTicket.promoError`                         | `buyTicket.promoError`               |
| `buyTicket.promoRemoveButton`                  | `buyTicket.promoRemoveButton`        |
| `buyTicket.totalAmount`                        | `buyTicket.totalAmount`              |
| `buyTicket.tierOption(id)`                     | `buyTicket.tier.<id>`                |
| `premium.screen`                               | `screen.premium`                     |
| `premium.restore`                              | `premium.restore`                    |
| `premium.buy(id)`                              | `premium.buy.<id>`                   |
| `premium.receipt(id)`                          | `premium.receipt.<id>`               |
| `billing.sheet`                                | `billing.sheet`                      |
| `billing.sheetConfirm`                         | `billing.sheet.confirm`              |
| `billing.sheetCancel`                          | `billing.sheet.cancel`               |
| `toast.host`                                   | `toast.host`                         |
| `toast.message`                                | `toast.message`                      |
| `toast.item(kind, id)`                         | `toast.<kind>.<id>`                  |
| `capabilities.screen.haptic`                   | `screen.capability.haptic`           |
| `capabilities.screen.biometric`                | `screen.capability.biometric`        |
| `capabilities.screen.share`                    | `screen.capability.share`            |
| `capabilities.screen.calendar`                 | `screen.capability.calendar`         |
| `capabilities.screen.location`                 | `screen.capability.location`         |
| `capabilities.screen.camera`                   | `screen.capability.camera`           |
| `capabilities.screen.microphone`               | `screen.capability.microphone`       |
| `capabilities.screen.notifications`            | `screen.capability.notifications`    |
| `capabilities.haptic.impactLight`              | `haptic.impact.light`                |
| `capabilities.haptic.impactMedium`             | `haptic.impact.medium`               |
| `capabilities.haptic.impactHeavy`              | `haptic.impact.heavy`                |
| `capabilities.haptic.notificationSuccess`      | `haptic.notification.success`        |
| `capabilities.haptic.notificationWarning`      | `haptic.notification.warning`        |
| `capabilities.haptic.notificationError`        | `haptic.notification.error`          |
| `capabilities.haptic.selection`                | `haptic.selection`                   |
| `capabilities.biometric.probe`                 | `biometric.probe`                    |
| `capabilities.biometric.authenticate`          | `biometric.authenticate`             |
| `capabilities.share.open`                      | `share.open`                         |
| `capabilities.share.copy`                      | `share.copy`                         |
| `capabilities.calendar.requestPermission`      | `calendar.requestPermission`         |
| `capabilities.calendar.addEvent`               | `calendar.addEvent`                  |
| `capabilities.location.requestPermission`      | `location.requestPermission`         |
| `capabilities.location.getFix`                 | `location.getFix`                    |
| `capabilities.camera.takePhoto`                | `camera.takePhoto`                   |
| `capabilities.camera.pickPhoto`                | `camera.pickPhoto`                   |
| `capabilities.microphone.requestPermission`    | `microphone.requestPermission`       |
| `capabilities.microphone.stop`                 | `microphone.stop`                    |
| `capabilities.microphone.record`               | `microphone.record`                  |
| `capabilities.notifications.requestPermission` | `notifications.requestPermission`    |
| `capabilities.notifications.fireImmediate`     | `notifications.fireImmediate`        |
| `capabilities.notifications.fireDelayed`       | `notifications.fireDelayed`          |
