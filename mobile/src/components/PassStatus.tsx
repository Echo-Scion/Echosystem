import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useAccessControl } from '../hooks/useAccessControl';

const passLabels: Record<string, string> = {
  guest: 'Guest Pass',
  account: 'Account',
  gamer: 'Gamer Pass',
  flow: 'Flow Pass',
};

export const PassStatus = () => {
  const theme = useAppTheme();
  const { passType } = useAccessControl();

  const backgroundColor =
    passType === 'flow'
      ? theme.colors.secondary
      : passType === 'gamer'
      ? theme.colors.primary
      : theme.colors.surfaceAlt;

  const textColor =
    passType === 'flow' || passType === 'gamer'
      ? theme.colors.background
      : passType === 'guest'
      ? theme.colors.textMuted
      : theme.colors.text;

  return (
    <View style={[styles.badge, { backgroundColor }]}> 
      <Text style={[styles.label, { color: textColor }]}>{passLabels[passType] ?? passType}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
  },
});
