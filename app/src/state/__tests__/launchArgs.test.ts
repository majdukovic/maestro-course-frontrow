import { applyLaunchArgs, readLaunchArgs } from '../launchArgs';
import { useAuthStore } from '../auth';
import { useQaStore } from '../qa';
import { useSettingsStore } from '../settings';
import { mockState, resetMockState } from '../../mocks/state';

beforeEach(async () => {
  resetMockState();
  mockState.sessions.clear();
  await useAuthStore.getState().clear();
  await useQaStore.getState().reset();
});

describe('launch arguments', () => {
  it('reads nothing when the native module is not linked', () => {
    expect(readLaunchArgs()).toEqual({});
  });

  it('frontrowE2E=setup signs in demo and finishes onboarding', async () => {
    await useSettingsStore.getState().startOnboarding();
    await applyLaunchArgs({ frontrowE2E: 'setup' });
    expect(useAuthStore.getState().user?.id).toBe('usr_demo');
    expect(mockState.sessions.get(useAuthStore.getState().token!)).toBe('usr_demo');
    expect(useSettingsStore.getState().onboardingPending).toBe(false);
  });

  it('applies scenario, sign-in, clock, network and triggers together', async () => {
    await applyLaunchArgs({
      frontrowClock: '2026-05-15T17:30:00.000Z',
      frontrowScenario: 'refund_pending',
      frontrowSignedIn: 'friend',
      frontrowNetwork: 'slow3g',
      frontrowTrigger: 'paymentTimeout, camera,bogus',
    });
    const qa = useQaStore.getState();
    expect(qa.clockFrozenAt).toBe('2026-05-15T17:30:00.000Z');
    expect(qa.scenario).toBe('refund_pending');
    expect(mockState.tickets[0]!.status).toBe('refund_pending');
    expect(useAuthStore.getState().user?.id).toBe('usr_friend');
    expect(qa.networkProfile).toBe('slow3g');
    expect(qa.triggers.paymentTimeout).toBe(true);
    expect(qa.triggers.camera).toBe(true);
  });

  it('signedIn=none signs out; unknown values are ignored', async () => {
    await applyLaunchArgs({ frontrowSignedIn: 'demo' });
    await applyLaunchArgs({
      frontrowSignedIn: 'none',
      frontrowScenario: 'nope',
      frontrowNetwork: '5g',
    });
    expect(useAuthStore.getState().token).toBeNull();
    expect(useQaStore.getState().scenario).toBeNull();
    expect(useQaStore.getState().networkProfile).toBe('online');
  });
});
