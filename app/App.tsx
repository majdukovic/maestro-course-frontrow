import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';

import { RootNavigator } from './src/navigation/RootNavigator';
import { linking } from './src/navigation/linking';
import { i18n } from './src/i18n';
import { queryClient } from './src/hooks/queryClient';
import { useAuthStore } from './src/state/auth';
import { useQaStore } from './src/state/qa';
import { useBillingStore } from './src/state/billing';
import { useSettingsStore } from './src/state/settings';
import { useRecentlyViewedStore } from './src/state/recentlyViewed';
import { useDeepLinkScenario } from './src/hooks/useDeepLinkScenario';
import { startDeepLinkCapture } from './src/hooks/deepLinkQueue';
import { useThemeColors, useResolvedAppearance } from './src/hooks/useAppearance';
import { ToastHost } from './src/components/ToastHost';
import { useToastsStore } from './src/state/toasts';
import { OfflineBanner } from './src/components/OfflineBanner';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { theme } from './src/theme';
import { resetMockState } from './src/mocks/state';
import { applyLaunchArgs } from './src/state/launchArgs';

// Capture deep links from the first JS tick so a URL delivered while the
// stores are still hydrating is queued rather than lost.
startDeepLinkCapture();

function AppShell() {
  useDeepLinkScenario();
  useQaInvalidation();
  const onboardingPending = useSettingsStore((s) => s.onboardingPending);
  const colors = useThemeColors();
  const scheme = useResolvedAppearance();
  const activeTab = useRef<string | undefined>(undefined);

  // Build the navigation theme from our active palette so headers, the
  // root background, and the status bar all match the user's choice.
  const navTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const themedNavTheme = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer
      linking={linking}
      theme={themedNavTheme}
      // Toasts belong to the tab that raised them: clear them when the
      // active tab changes. A toast left over a tab switch also hangs
      // XCUITest's UI snapshot on iOS (Maestro "driver timed out during
      // snapshot call").
      onStateChange={(state) => {
        const tab = state?.routes[state.index]?.name;
        if (tab !== activeTab.current) {
          activeTab.current = tab;
          useToastsStore.getState().clear();
        }
      }}
    >
      <OfflineBanner />
      {onboardingPending ? <OnboardingScreen /> : <RootNavigator />}
      <ToastHost />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

/**
 * Whenever a QA toggle that affects API responses changes (force-error,
 * network delay, scenario), invalidate every React Query cache so the next
 * read picks up the new behavior. This makes debug-menu changes feel instant
 * and keeps tests deterministic.
 */
function useQaInvalidation() {
  const qc = useQueryClient();
  const forceError = useQaStore((s) => s.forceError);
  const networkDelayMs = useQaStore((s) => s.networkDelayMs);
  const scenario = useQaStore((s) => s.scenario);
  useEffect(() => {
    void qc.invalidateQueries();
  }, [qc, forceError, networkDelayMs, scenario]);
}

export default function App() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateQa = useQaStore((s) => s.hydrate);
  const hydrateBilling = useBillingStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const hydrateRecent = useRecentlyViewedStore((s) => s.hydrate);

  const authHydrated = useAuthStore((s) => s.hydrated);
  const qaHydrated = useQaStore((s) => s.hydrated);
  const billingHydrated = useBillingStore((s) => s.hydrated);
  const settingsHydrated = useSettingsStore((s) => s.hydrated);
  const recentHydrated = useRecentlyViewedStore((s) => s.hydrated);
  const allHydrated =
    authHydrated && qaHydrated && billingHydrated && settingsHydrated && recentHydrated;

  // Launch arguments apply once, after hydration and before the first
  // screen renders, so they win over persisted state.
  const [launchArgsApplied, setLaunchArgsApplied] = useState(false);
  useEffect(() => {
    if (!allHydrated || launchArgsApplied) return;
    void applyLaunchArgs()
      .catch(() => undefined)
      .finally(() => setLaunchArgsApplied(true));
  }, [allHydrated, launchArgsApplied]);

  useEffect(() => {
    void hydrateAuth();
    // A frozen clock persists across launches; re-seed so rebased mock
    // dates line up with it rather than with wall-clock time.
    void hydrateQa().then(() => {
      if (useQaStore.getState().clockFrozenAt) resetMockState();
    });
    void hydrateBilling();
    void hydrateSettings();
    void hydrateRecent();
  }, [hydrateAuth, hydrateQa, hydrateBilling, hydrateSettings, hydrateRecent]);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            {allHydrated && launchArgsApplied ? <AppShell /> : <HydrationGate />}
          </ErrorBoundary>
        </QueryClientProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}

function HydrationGate() {
  return (
    <View style={styles.gate} testID="app.hydrating">
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
