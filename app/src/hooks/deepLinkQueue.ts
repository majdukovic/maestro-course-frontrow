import * as Linking from 'expo-linking';

type Consumer = (url: string) => void;

let consumer: Consumer | null = null;
let subscription: { remove: () => void } | null = null;
const pending: string[] = [];

function deliver(url: string | null) {
  if (!url) return;
  if (consumer) consumer(url);
  else pending.push(url);
}

/**
 * Start listening for deep links as early as possible (App module load),
 * before the persisted stores hydrate. URLs that arrive before a consumer
 * is attached — e.g. the cold-launch URL on iOS, which can be emitted as a
 * 'url' event before AppShell mounts — are queued instead of dropped.
 * Idempotent.
 */
export function startDeepLinkCapture(): void {
  if (subscription) return;
  subscription = Linking.addEventListener('url', ({ url }) => deliver(url));
  void Linking.getInitialURL().then(deliver);
}

/**
 * Attach the handler. Queued URLs are replayed in arrival order. Only
 * attach once every store the handler writes to has hydrated (AppShell
 * mounts behind the hydration gate, so mounting is that signal).
 */
export function setDeepLinkConsumer(fn: Consumer): () => void {
  startDeepLinkCapture();
  consumer = fn;
  while (consumer === fn && pending.length > 0) fn(pending.shift()!);
  return () => {
    if (consumer !== fn) return;
    consumer = null;
    subscription?.remove();
    subscription = null;
  };
}
