import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useAccessControl } from '../hooks/useAccessControl';

export const GoldCoinBalance = () => {
  const theme = useAppTheme();
  const { coins, gold } = useAccessControl();

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <Text style={[styles.label, { color: theme.colors.textMuted }]}>Balance</Text>
      <View style={styles.row}>
        <Text style={[styles.value, { color: theme.colors.secondary }]}>Gold {gold}</Text>
        <Text style={[styles.value, { color: theme.colors.primary }]}>Coins {coins.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  value: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});
