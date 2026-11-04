# Maestro cheat sheet

## CLI

| Command | What it does |
|---|---|
| `maestro --version` | Show the CLI version |
| `maestro list-devices` | List simulators, emulators and phones |
| `maestro test <file or folder>` | Run flows |
| `maestro test <flow> --device <id>` | Run on one device |
| `maestro test <flow> --platform ios` | Pick the platform |
| `maestro test flows/ --format junit --output report.xml` | JUnit report |
| `maestro hierarchy` | Dump what Maestro sees on screen |
| `maestro studio` | Open Maestro Studio |

## Flow commands used in the course

```yaml
appId: app.frontrow.qa
---
- launchApp:
    clearState: true
    arguments:
      frontrowE2E: 'setup'      # signed in as demo, onboarding done
- tapOn:
    id: 'events.item.evt_001'
- assertVisible:
    id: 'eventDetail.buyButton'
- extendedWaitUntil:
    visible:
      id: 'screen.eventDetail'
    timeout: 10000
- scrollUntilVisible:
    element:
      id: 'ticketDetail.cancelButton'
    direction: DOWN
- inputText: 'demo@frontrow.app'
- openLink: 'frontrow://debug/seed/empty_state'
- runFlow: _setup.yaml
```

Text matching is a full-string regex: use `'.*valid email.*'` to match part of a text.

FrontRow test ids: [app/docs/TEST_IDS.md](../app/docs/TEST_IDS.md). Deep links and launch arguments: [app/docs/DEEPLINKS.md](../app/docs/DEEPLINKS.md).
