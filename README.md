# Maestro course: FrontRow exercises

Code and exercises for the [QA Patrol Maestro course](https://qapatrol.com/maestro): mobile UI test automation with [Maestro](https://maestro.dev), from your first flow to CI, on iOS and Android from one Mac.

The app you test is [FrontRow](https://github.com/majdukovic/frontrow), an open-source concert-ticketing app built for testing. It has no backend, so every run starts from the same data.

## Pinned versions

| | Version |
|---|---|
| FrontRow app | **v0.2.0** ([release `app-v0.2.0`](../../releases/tag/app-v0.2.0)) |
| Maestro CLI | **2.12.1** |

The same pins are in [`tracks.json`](tracks.json). Other versions may work, but the lessons are recorded and tested with these.

## What you need (Mac)

- **macOS on Apple Silicon** for the iOS Simulator app. (The `.app` also runs on Intel Macs.)
- **Java 17 or newer**: check with `java -version`.
- **Maestro CLI 2.12.1**:

  ```bash
  curl -fsSL "https://get.maestro.mobile.dev" | MAESTRO_VERSION=2.12.1 bash
  maestro --version
  ```

- **Xcode** with an **iOS Simulator** runtime (Xcode → Settings → Components).
- **adb** (Android platform-tools) for an Android phone or emulator: `brew install --cask android-platform-tools`, then `adb devices`.

Step-by-step setup: [docs/setup-mac.md](docs/setup-mac.md). Windows + Android: [docs/windows-setup.md](docs/windows-setup.md).

## Install the app (no build needed)

Download from [release `app-v0.2.0`](../../releases/tag/app-v0.2.0) and check the files:

```bash
shasum -a 256 -c SHA256SUMS.txt
```

**iOS Simulator**

```bash
unzip FrontRow.app.zip
open -a Simulator
xcrun simctl install booted FrontRow.app
```

**Android phone or emulator** (USB debugging on, phone listed by `adb devices`)

```bash
adb install -r FrontRow.apk
```

## Run your first flow

```bash
git clone https://github.com/majdukovic/maestro-course-frontrow.git
cd maestro-course-frontrow
maestro test lessons/C03/setup-check.yaml
```

It opens FrontRow, waits for the Events screen and checks the first event is there. If you have more than one device connected, add `--device <id>` (see `maestro list-devices`).

In Maestro Studio, open the `flows/` folder as your workspace: the flows you write in the lessons go there.

## Lessons

To start any lesson from its exact starting point:

```bash
git checkout mc/C04-start
```

| Lesson | Start tag | Solution tag |
|---|---|---|
| [C01 Welcome and FrontRow tour](lessons/C01) | mc/C01-start | mc/C01-end |
| [C02 How Maestro sees your app](lessons/C02) | mc/C02-start | mc/C02-end |
| [C03 Setup on Mac: Studio, CLI, devices](lessons/C03) | mc/C03-start | mc/C03-end |
| [C04 First flow in Maestro Studio](lessons/C04) | mc/C04-start | mc/C04-end |
| [C05 Selectors and interactions](lessons/C05) | mc/C05-start | mc/C05-end |
| [C06 Assertions, waits, flakiness](lessons/C06) | mc/C06-start | mc/C06-end |
| [C07 Reusable flows, env, deep-link setup](lessons/C07) | mc/C07-start | mc/C07-end |
| [C08 App state, permissions, alerts](lessons/C08) | mc/C08-start | mc/C08-end |
| [C09 Suites, reports, debugging](lessons/C09) | mc/C09-start | mc/C09-end |
| [C10 Let your AI agent write a test (MCP)](lessons/C10) | mc/C10-start | mc/C10-end |
| [C11 CI with GitHub Actions](lessons/C11) | mc/C11-start | mc/C11-end |
| [C12 Capstone: ticket transfer + wrap-up](lessons/C12) | mc/C12-start | mc/C12-end |

Tags are added as each lesson is published and are never moved. The `solutions` branch has every published lesson solved.

## Repo layout

| Path | What it is |
|---|---|
| `app/` | FrontRow v0.2.0 source, imported from [majdukovic/frontrow](https://github.com/majdukovic/frontrow) (not needed unless you build the app yourself) |
| `flows/` | Your Maestro Studio workspace |
| `lessons/` | One folder per lesson |
| `docs/` | Setup guides, troubleshooting, cheat sheet |

## Help

Something not working? See [docs/troubleshooting.md](docs/troubleshooting.md), then open an issue in this repo.

## License

Code in this repo is MIT (see [LICENSE](LICENSE); FrontRow keeps its own MIT notice in [`app/LICENSE`](app/LICENSE)).
Course videos, narration and explanations are not part of this repo and remain © QA Patrol, all rights reserved.
