import { NativeModules } from 'react-native';
import { LaunchArguments } from 'react-native-launch-arguments';

import { scenarios, type ScenarioId } from '../mocks/seed/scenarios/registry';
import { setAppClock } from './clock';
import { runE2ESetup, signInSeedUser } from './e2e';
import { useAuthStore } from './auth';
import {
  NETWORK_PROFILES,
  TRIGGER_NAMES,
  useQaStore,
  type FailureTrigger,
  type NetworkProfile,
} from './qa';
import { useSettingsStore } from './settings';

/**
 * Launch arguments recognised at startup (Maestro `launchApp.arguments`,
 * Android intent extras, iOS `-key value` process args). Each mirrors a
 * deep link but needs no openLink, so iOS never shows "Open in FrontRow?".
 */
export type FrontRowLaunchArgs = {
  frontrowE2E?: string; // 'setup'
  frontrowScenario?: string; // scenario id
  frontrowSignedIn?: string; // 'demo' | 'friend' | 'none'
  frontrowOnboarding?: string; // 'show' | 'hide'
  frontrowClock?: string; // ISO-8601 | 'live'
  frontrowNetwork?: string; // network profile id
  frontrowTrigger?: string; // trigger kind(s), comma-separated
};

const SIGN_IN_USERS: Record<string, string> = { demo: 'usr_demo', friend: 'usr_friend' };

export function readLaunchArgs(): FrontRowLaunchArgs {
  // Not linked (Jest, web): behave as if no arguments were passed.
  if (!NativeModules.LaunchArguments) return {};
  try {
    const raw = LaunchArguments.value<Record<string, unknown>>();
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (k.startsWith('frontrow') && v != null) out[k] = String(v);
    }
    return out as FrontRowLaunchArgs;
  } catch {
    return {};
  }
}

/**
 * Apply launch arguments. Called once, after every persisted store has
 * hydrated and before the first screen renders. Order matters: the clock
 * re-seeds mock data, so it goes first; sign-in goes after anything that
 * resets sessions.
 */
export async function applyLaunchArgs(args: FrontRowLaunchArgs = readLaunchArgs()): Promise<void> {
  if (args.frontrowClock) {
    const iso = args.frontrowClock === 'live' ? null : args.frontrowClock;
    if (iso == null || !Number.isNaN(new Date(iso).getTime())) await setAppClock(iso);
  }
  if (args.frontrowE2E === 'setup') await runE2ESetup();
  if (args.frontrowScenario) {
    const scenario = scenarios[args.frontrowScenario as ScenarioId];
    if (scenario) {
      scenario.apply();
      await useQaStore.getState().setScenario(scenario.id);
    }
  }
  if (args.frontrowSignedIn) {
    const userId = SIGN_IN_USERS[args.frontrowSignedIn];
    if (userId) await signInSeedUser(userId);
    else if (args.frontrowSignedIn === 'none') await useAuthStore.getState().clear();
  }
  if (args.frontrowOnboarding === 'show') await useSettingsStore.getState().startOnboarding();
  else if (args.frontrowOnboarding === 'hide') await useSettingsStore.getState().finishOnboarding();
  const network = NETWORK_PROFILES.find((p) => p.id === args.frontrowNetwork);
  if (network) await useQaStore.getState().setNetworkProfile(network.id as NetworkProfile);
  if (args.frontrowTrigger) {
    for (const kind of args.frontrowTrigger.split(',').map((k) => k.trim())) {
      if ((TRIGGER_NAMES as readonly string[]).includes(kind)) {
        useQaStore.getState().setTrigger(kind as FailureTrigger, true);
      }
    }
  }
}
