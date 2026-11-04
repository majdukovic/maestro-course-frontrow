import { useCallback, useState } from 'react';

/**
 * RefreshControl state for user-initiated pulls only. Binding `refreshing`
 * to React Query's `isRefetching` also shows the spinner for background
 * refetches (every invalidateQueries), and on iOS a spinner toggled while
 * its tab is off screen can get stuck animating, which hangs XCUITest
 * (Maestro "driver timed out during snapshot call").
 */
export function usePullToRefresh(refetch: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void refetch().finally(() => setRefreshing(false));
  }, [refetch]);
  return { refreshing, onRefresh };
}
