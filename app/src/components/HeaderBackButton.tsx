import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ParamListBase } from '@react-navigation/native';
import type {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { testIds } from '../testIds';

type Props = { onPress: () => void; tintColor?: string };

export function HeaderBackButton({ onPress, tintColor }: Props) {
  return (
    <Pressable
      testID={testIds.header.backButton}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={12}
      onPress={onPress}
      style={styles.button}
    >
      <Ionicons name="chevron-back" size={26} color={tintColor} />
    </Pressable>
  );
}

/**
 * Shared stack screenOptions: every screen with somewhere to go back to
 * gets the same header back button with a stable testID
 * (header.backButton), on both platforms.
 */
export function stackScreenOptions({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}): NativeStackNavigationOptions {
  return {
    headerLeft: ({ canGoBack, tintColor }) =>
      canGoBack ? <HeaderBackButton onPress={navigation.goBack} tintColor={tintColor} /> : null,
  };
}

const styles = StyleSheet.create({
  button: { paddingRight: 8 },
});
