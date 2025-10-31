import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme, useThemeActions } from '../hooks/useAppTheme';
import { useThemeMode, useResonance } from '../state/themeStore';

export const ModeToggle = () => {
  const theme = useAppTheme();
  const { toggleMode } = useThemeActions();
  const mode = useThemeMode();
  const resonance = useResonance();

  return (
    <Pressable onPress={toggleMode} accessibilityRole="button">
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surfaceAlt,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.indicator,
            {
              backgroundColor: theme.colors.primary,
              transform: [
                { translateX: mode === 'lore' ? 24 : 0 },
                { scale: 0.98 + resonance * 0.05 },
              ],
            },
          ]}
        />
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
              fontFamily: 'Inter_600SemiBold',
            },
          ]}
        >
          {mode === 'lore' ? 'Lore' : 'Normal'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    gap: 8,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
  },
});
