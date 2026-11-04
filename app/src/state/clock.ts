import { resetMockState } from '../mocks/state';
import { useQaStore } from './qa';

/**
 * Default "demo" freeze time: Friday 15 May 2026, 19:30 in the device's
 * local zone. A fixed date (not "this Friday") so screens render the same
 * date strings on every run, on every day.
 */
export function defaultFreezeTime(): string {
  return new Date(2026, 4, 15, 19, 30, 0, 0).toISOString();
}

/**
 * Freeze the app clock at `iso`, or return to live time with `null`.
 * Mock data is re-seeded so rebased dates line up with the new clock;
 * like a scenario change, this drops in-session mutations.
 */
export async function setAppClock(iso: string | null): Promise<void> {
  await useQaStore.getState().setClockFrozenAt(iso);
  resetMockState();
}
