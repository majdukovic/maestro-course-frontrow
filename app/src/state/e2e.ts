import { mockState, resetMockState } from '../mocks/state';
import { useAuthStore } from './auth';
import { useQaStore } from './qa';
import { useSettingsStore } from './settings';

/**
 * Sign a seed user in without the login UI: mint a mock session token and
 * store it with the user (password stripped to match the API contract).
 */
export async function signInSeedUser(userId: string): Promise<void> {
  const seedUser = mockState.users.find((u) => u.id === userId);
  if (!seedUser) return;
  const token = `e2e_${seedUser.id}_${Date.now()}`;
  mockState.sessions.set(token, seedUser.id);
  const { password: _pw, ...user } = seedUser;
  await useAuthStore.getState().setSession(token, user);
}

/**
 * Fast-boot for E2E (frontrow://e2e/setup, launch arg frontrowE2E=setup):
 * clean mock state, no triggers or scenario, demo user signed in,
 * onboarding marked done.
 */
export async function runE2ESetup(): Promise<void> {
  resetMockState();
  useQaStore.getState().clearTriggers();
  await Promise.all([
    useQaStore.getState().setScenario(null),
    signInSeedUser('usr_demo'),
    useSettingsStore.getState().finishOnboarding(),
  ]);
}
