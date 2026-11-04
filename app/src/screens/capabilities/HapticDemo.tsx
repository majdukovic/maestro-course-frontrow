import { ScrollView, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../../theme';
import { Section } from '../../components/Section';
import { Row } from '../../components/Row';
import { testIds } from '../../testIds';

export function HapticDemo() {
  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingVertical: theme.spacing.md }}
      testID={testIds.capabilities.screen.haptic}
    >
      <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}>
        <Text style={styles.heading} accessibilityRole="header">
          Haptics
        </Text>
        <Text style={styles.body}>
          Tap each row to feel the corresponding haptic. iOS and modern Android only.
        </Text>
      </View>

      <Section title="Impact">
        <Row
          testID={testIds.capabilities.haptic.impactLight}
          label="Light"
          onPress={() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <Row
          testID={testIds.capabilities.haptic.impactMedium}
          label="Medium"
          onPress={() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        />
        <Row
          testID={testIds.capabilities.haptic.impactHeavy}
          label="Heavy"
          onPress={() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
        />
      </Section>

      <Section title="Notification">
        <Row
          testID={testIds.capabilities.haptic.notificationSuccess}
          label="Success"
          onPress={() => void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
        />
        <Row
          testID={testIds.capabilities.haptic.notificationWarning}
          label="Warning"
          onPress={() => void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)}
        />
        <Row
          testID={testIds.capabilities.haptic.notificationError}
          label="Error"
          onPress={() => void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)}
        />
      </Section>

      <Section title="Selection">
        <Row
          testID={testIds.capabilities.haptic.selection}
          label="Selection change"
          onPress={() => void Haptics.selectionAsync()}
        />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.text },
  body: { fontSize: theme.typography.body, color: theme.colors.muted, marginTop: theme.spacing.xs },
});
