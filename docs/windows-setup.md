# Setup on Windows (Android only)

The iOS Simulator needs a Mac. On Windows you can do every lesson on an Android phone or emulator.

1. **Java 17+**: install a JDK (for example Eclipse Temurin 17) and check `java -version`.
2. **Maestro CLI 2.12.1**: download `maestro.zip` from the [cli-2.12.1 release](https://github.com/mobile-dev-inc/maestro/releases/tag/cli-2.12.1), unzip it, and add its `bin` folder to your PATH. Check `maestro --version`.
3. **adb**: install Android SDK platform-tools (or Android Studio) and check `adb devices`.
4. **Device**: a phone with USB debugging on, or an emulator from Android Studio's Device Manager (API 34 recommended).
5. **App**: `adb install -r FrontRow.apk` (from release `app-v0.2.0`).
6. **Check**: `maestro test lessons/C03/setup-check.yaml`
