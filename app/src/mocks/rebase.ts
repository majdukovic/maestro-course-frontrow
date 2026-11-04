import { baseNow } from '../state/qa';
import type { AppNotification, Event, PaymentMethod, Review, Ticket } from '../api/types';

/**
 * The day the seed fixtures were authored against. Fixture timestamps stay
 * absolute in the JSON; at seed time every one is shifted by
 * `startOfDayUTC(baseNow()) - SEED_ANCHOR`, so "upcoming" fixtures stay
 * upcoming and "past" fixtures stay past on any real date.
 */
export const SEED_ANCHOR = '2026-05-12T00:00:00.000Z';

const DAY_MS = 24 * 60 * 60 * 1000;

export function seedShiftMs(at: Date = baseNow()): number {
  const startOfDay = Math.floor(at.getTime() / DAY_MS) * DAY_MS;
  return startOfDay - new Date(SEED_ANCHOR).getTime();
}

function shift(iso: string, ms: number): string {
  return new Date(new Date(iso).getTime() + ms).toISOString();
}

export function rebaseEvents(events: Event[], ms: number): Event[] {
  return events.map((e) => ({
    ...e,
    startsAt: shift(e.startsAt, ms),
    doorsAt: shift(e.doorsAt, ms),
    ...(e.lineup
      ? { lineup: e.lineup.map((slot) => ({ ...slot, startsAt: shift(slot.startsAt, ms) })) }
      : {}),
  }));
}

export function rebaseTickets(tickets: Ticket[], ms: number): Ticket[] {
  return tickets.map((t) => ({ ...t, purchasedAt: shift(t.purchasedAt, ms) }));
}

export function rebaseReviews(reviews: Review[], ms: number): Review[] {
  return reviews.map((r) => ({ ...r, createdAt: shift(r.createdAt, ms) }));
}

export function rebaseNotifications(items: AppNotification[], ms: number): AppNotification[] {
  return items.map((n) => ({
    ...n,
    createdAt: shift(n.createdAt, ms),
    readAt: n.readAt ? shift(n.readAt, ms) : null,
  }));
}

// Card expiry (expMonth/expYear) is deliberately not shifted — it stays
// absolute and the seed keeps it far in the future.
export function rebasePaymentMethods(items: PaymentMethod[], ms: number): PaymentMethod[] {
  return items.map((p) => ({ ...p, createdAt: shift(p.createdAt, ms) }));
}
