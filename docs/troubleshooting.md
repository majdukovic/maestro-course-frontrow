# Troubleshooting

| Symptom | Try |
|---|---|
| `maestro: command not found` | Open a new terminal; check `~/.maestro/bin` is on your PATH. |
| Wrong Maestro version | `which -a maestro`; remove or reorder older installs. The course uses 2.12.1. |
| `adb devices` shows `unauthorized` | Unlock the phone and accept the USB debugging prompt. |
| More than one device found | Pass `--device <id>` (see `maestro list-devices`). |
| iOS: "Open in FrontRow?" dialog | Expected for `openLink` in Release builds. Prefer launch arguments, e.g. `launchApp: { arguments: { frontrowE2E: 'setup' } }`. |
| A tap misses on Android | A notification banner may cover the screen. Turn on Do Not Disturb. |
| Install fails with "signatures do not match" | Uninstall the old app first: `adb uninstall app.frontrow.qa`. |
| Events list is empty | Check the app version is 0.2.0 (Profile → Settings → About). Older builds have expired demo data. |
