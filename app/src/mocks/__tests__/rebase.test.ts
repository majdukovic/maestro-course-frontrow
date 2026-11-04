import { listEvents } from '../../api/services/events';
import { scenarios } from '../seed/scenarios/registry';
import { mockState, resetMockState } from '../state';
import { seedShiftMs, SEED_ANCHOR } from '../rebase';
import { useQaStore } from '../../state/qa';

/**
 * Seed data is authored against SEED_ANCHOR and rebased onto today at
 * seed time. Whatever the real date, the feed must look the same.
 */

const DATES = ['2026-05-12T09:00:00.000Z', '2026-11-03T18:00:00.000Z', '2028-11-03T23:59:00.000Z'];

afterEach(() => {
  jest.useRealTimers();
  useQaStore.setState({
    timeOffsetMs: 0,
    clockFrozenAt: null,
    forceError: 'none',
    networkDelayMs: 0,
  });
  resetMockState();
});

async function feedAt(iso: string) {
  jest.useFakeTimers({ now: new Date(iso), doNotFake: ['setTimeout', 'nextTick', 'setImmediate'] });
  resetMockState();
  const page = await listEvents();
  const all = await listEvents({ includePast: true });
  return {
    upcoming: page.items.map((e) => e.id),
    past: all.items.filter((e) => !page.items.includes(e)).map((e) => e.id),
  };
}

describe('seed rebasing', () => {
  it('is a no-op on the anchor day', () => {
    expect(seedShiftMs(new Date(SEED_ANCHOR))).toBe(0);
    expect(seedShiftMs(new Date('2026-05-12T23:59:59.000Z'))).toBe(0);
  });

  it('gives the same feed contents and order on any date', async () => {
    const results = [];
    for (const d of DATES) results.push(await feedAt(d));
    expect(results[0]!.upcoming).toEqual(['evt_004', 'evt_001', 'evt_002', 'evt_003', 'evt_005']);
    expect(results[0]!.past).toEqual(['evt_006']);
    expect(results[1]).toEqual(results[0]);
    expect(results[2]).toEqual(results[0]);
  });

  it('keeps lineup slots, doors and ticket dates in step with their event', () => {
    jest.useFakeTimers({
      now: new Date(DATES[2]!),
      doNotFake: ['setTimeout', 'nextTick', 'setImmediate'],
    });
    resetMockState();
    const evt = mockState.events.find((e) => e.id === 'evt_003')!;
    const start = new Date(evt.startsAt).getTime();
    expect(start - new Date(evt.doorsAt).getTime()).toBe(2 * 3600_000);
    expect(new Date(evt.lineup![0]!.startsAt).getTime() - start).toBe(3600_000);
    const tkt = mockState.tickets.find((t) => t.id === 'tkt_001')!;
    const e1 = mockState.events.find((e) => e.id === 'evt_001')!;
    expect(new Date(e1.startsAt).getTime() - new Date(tkt.purchasedAt).getTime()).toBe(
      new Date('2026-06-12T20:00:00.000Z').getTime() -
        new Date('2026-04-01T12:00:00.000Z').getTime(),
    );
  });

  it('many_events inherits rebased dates', async () => {
    jest.useFakeTimers({
      now: new Date(DATES[2]!),
      doNotFake: ['setTimeout', 'nextTick', 'setImmediate'],
    });
    scenarios.many_events.apply();
    const page = await listEvents({}, 0, 100);
    expect(page.total).toBe(21); // 25 minus past evt_006 and its 3 copies
  });

  it('frozen clock pins the rebased dates regardless of wall time', () => {
    useQaStore.setState({ clockFrozenAt: '2026-11-06T18:30:00.000Z' });
    jest.useFakeTimers({
      now: new Date(DATES[0]!),
      doNotFake: ['setTimeout', 'nextTick', 'setImmediate'],
    });
    resetMockState();
    const a = mockState.events[0]!.startsAt;
    jest.setSystemTime(new Date(DATES[2]!));
    resetMockState();
    expect(mockState.events[0]!.startsAt).toBe(a);
  });

  it('seed card expiry stays at least 3 years ahead', () => {
    const pm = mockState.paymentMethods[0]!;
    const expiry = new Date(Date.UTC(pm.expYear, pm.expMonth, 1));
    const threeYears = new Date();
    threeYears.setUTCFullYear(threeYears.getUTCFullYear() + 3);
    expect(expiry.getTime()).toBeGreaterThan(threeYears.getTime());
  });

  it('tickets keep their active/past split', () => {
    expect(mockState.tickets.map((t) => t.status)).toEqual(['active', 'used']);
  });
});
