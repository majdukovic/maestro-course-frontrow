import { useColorScheme } from 'react-native';

import { palettes, type ThemeColors } from '../theme';
import { useSettingsStore, type Appearance } from '../state/settings';

/**
 * Resolves the active palette based on user preference and system
 * scheme. `system` (default) follows the device; `light` / `dark` are
 * explicit overrides. Components that want to render in the active
 * palette read this hook; static stylesheets continue to use the
 * `theme` import (light) and stay correct in light mode.
 */
export function useThemeColors(): ThemeColors {
  const appearance = useSettingsStore((s) => s.appearance);
  const sys = useColorScheme();
  return palettes[resolveScheme(appearance, sys)];
}

export function useResolvedAppearance(): 'light' | 'dark' {
  const appearance = useSettingsStore((s) => s.appearance);
  const sys = useColorScheme();
  return resolveScheme(appearance, sys);
}

/**
 * v0.2.0 is locked to light: "System" ignores the OS scheme so recordings
 * match whatever mode the device is in. Most screens still use the static
 * light stylesheet; a full dark palette lands with v0.3.0, which flips
 * this back on. The explicit "Dark" setting is unchanged.
 */
const FOLLOW_OS_APPEARANCE = false;

function resolveScheme(
  pref: Appearance,
  sys: 'light' | 'dark' | null | undefined,
): 'light' | 'dark' {
  if (pref === 'light') return 'light';
  if (pref === 'dark') return 'dark';
  return FOLLOW_OS_APPEARANCE && sys === 'dark' ? 'dark' : 'light';
}
