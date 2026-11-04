import type { ImageSourcePropType } from 'react-native';

/**
 * Seed event images are bundled so the feed renders identically offline
 * and between runs. Keyed by the seed `imageUrl` (unchanged in
 * events.json), so scenario copies like many_events resolve too; any
 * other URL still loads remotely.
 */
const BUNDLED: Record<string, ImageSourcePropType> = {
  'https://picsum.photos/seed/evt_001/800/600': require('../../assets/events/evt_001.jpg'),
  'https://picsum.photos/seed/evt_002/800/600': require('../../assets/events/evt_002.jpg'),
  'https://picsum.photos/seed/evt_003/800/600': require('../../assets/events/evt_003.jpg'),
  'https://picsum.photos/seed/evt_004/800/600': require('../../assets/events/evt_004.jpg'),
  'https://picsum.photos/seed/evt_005/800/600': require('../../assets/events/evt_005.jpg'),
  'https://picsum.photos/seed/evt_006/800/600': require('../../assets/events/evt_006.jpg'),
};

export function eventImageSource(imageUrl: string): ImageSourcePropType {
  return BUNDLED[imageUrl] ?? { uri: imageUrl };
}
