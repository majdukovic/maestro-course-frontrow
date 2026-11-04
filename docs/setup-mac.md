# Setup on Mac

Written companion to lesson C03. Pinned versions: FrontRow v0.2.0, Maestro CLI 2.12.1.

## 1. Java 17+

```bash
java -version
```

If it's missing or older than 17: `brew install openjdk@17` and follow the `brew` caveats to put it on your PATH.

## 2. Maestro CLI

```bash
curl -fsSL "https://get.maestro.mobile.dev" | MAESTRO_VERSION=2.12.1 bash
maestro --version   # 2.12.1
```

Open a new terminal afterwards so `~/.maestro/bin` is on your PATH. If `maestro --version` shows another version, run `which -a maestro`: an older Homebrew install may come first.

## 3. iOS Simulator

1. Install Xcode from the App Store and open it once.
2. Xcode → Settings → Components: install an iOS Simulator runtime.
3. Start a simulator: `open -a Simulator`.
4. Install FrontRow (from release `app-v0.2.0`):

   ```bash
   unzip FrontRow.app.zip
   xcrun simctl install booted FrontRow.app
   ```

## 4. Android phone (USB)

1. `brew install --cask android-platform-tools`
2. On the phone: Settings → About phone → tap "Build number" 7 times, then Developer options → USB debugging on.
3. Connect it and accept the "Allow USB debugging?" prompt.
4. `adb devices` lists the phone as `device`.
5. Install FrontRow: `adb install -r FrontRow.apk`
6. Turn on Do Not Disturb so notifications don't cover the app during a run.

## 5. Check it all works

From the repo root:

```bash
maestro list-devices
maestro test lessons/C03/setup-check.yaml --device <device id>
```
