# Releasing

How a FrontRow release is built. The maintainer reviews, tags, pushes and publishes; the steps below only build locally.

## Before you build

- `npm ci`, then `npm run lint`, `npm run typecheck` and `npm test` all pass.
- Version bumped in `app.json` (`version`, `ios.buildNumber`, `android.versionCode`), `package.json`, `ios/FrontRow/Info.plist` and `android/app/build.gradle`. Add a `CHANGELOG.md` entry.
- **Native showcase sources are in place.** `ios/FrontRow/FrontRowNativeDemo*` and `android/app/src/main/java/com/frontrow/nativedemo/*` are copies of `native-showcase/`, made by `plugins/with-native-showcase.js` during `npx expo prebuild`. They are committed, so a fresh clone builds as is. If you changed anything in `native-showcase/`, refresh the copies before building:

  ```bash
  cp native-showcase/ios/FrontRowNativeDemo* ios/FrontRow/
  cp native-showcase/android/com/frontrow/nativedemo/*.kt android/app/src/main/java/com/frontrow/nativedemo/
  ```

  (Running `npx expo prebuild` does the same, but it also regenerates other native files; review its diff.)

- iOS pods: `cd ios && LANG=en_US.UTF-8 pod install`.

## Android APK

```bash
cd android && ./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../dist/FrontRow.apk
```

Release builds are signed with the committed `android/app/debug.keystore`, so the certificate is the same in every release and `adb install -r` updates in place. minSdk 24, targetSdk 36.

## iOS Simulator app

```bash
cd ios
xcodebuild -workspace FrontRow.xcworkspace -scheme FrontRow -configuration Release \
  -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath build
ditto -c -k --keepParent build/Build/Products/Release-iphonesimulator/FrontRow.app ../dist/FrontRow.app.zip
```

The `.app` is universal (`arm64` + `x86_64`); check with `lipo -info`.

## Verify and checksum

```bash
xcrun simctl install booted ios/build/Build/Products/Release-iphonesimulator/FrontRow.app
maestro test --platform ios tests/maestro
adb install -r dist/FrontRow.apk
maestro test --platform android tests/maestro
shasum -a 256 dist/FrontRow.apk dist/FrontRow.app.zip > dist/SHA256SUMS.txt
```
