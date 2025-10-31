import { Pressable, ScrollView, Text, View } from 'react-native';
import { ModuleHeader } from '../../components/ModuleHeader';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useAppTheme, useThemeActions } from '../../hooks/useAppTheme';
import { useAppearance, useIsLoreMode } from '../../state/themeStore';

export const ThemeSettingsScreen = () => {
  const theme = useAppTheme();
  const appearance = useAppearance();
  const isLoreMode = useIsLoreMode();
  const { toggleAppearance, toggleMode } = useThemeActions();

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing(12), gap: theme.spacing(3) }}
      >
        <ModuleHeader
          title="Theme Settings"
          subtitle="Choose between daybreak and nightfall palettes."
          trailing={null}
        />
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: theme.radii.lg,
            padding: theme.spacing(3),
            gap: theme.spacing(3),
          }}
        >
          <View style={{ gap: theme.spacing(1) }}>
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: 'Inter_600SemiBold',
                fontSize: 15,
              }}
            >
              Display Mode
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontFamily: 'Inter_400Regular',
              }}
            >
              {appearance === 'dark' ? 'Dark Aurora' : 'Light Dawn'}
            </Text>
            <Pressable
              onPress={toggleAppearance}
              style={{
                marginTop: theme.spacing(1.5),
                backgroundColor: theme.colors.primary,
                paddingVertical: theme.spacing(1.25),
                borderRadius: theme.radii.md,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: theme.colors.background,
                  fontFamily: 'Inter_600SemiBold',
                }}
              >
                Switch to {appearance === 'dark' ? 'Light' : 'Dark'}
              </Text>
            </Pressable>
          </View>
          <View style={{ gap: theme.spacing(1) }}>
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: 'Inter_600SemiBold',
                fontSize: 15,
              }}
            >
              Lore Mode
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontFamily: 'Inter_400Regular',
              }}
            >
              {isLoreMode
                ? 'Faint resonant visuals are active.'
                : 'Functional minimalist palette is active.'}
            </Text>
            <Pressable
              onPress={toggleMode}
              style={{
                marginTop: theme.spacing(1.5),
                backgroundColor: theme.colors.secondary,
                paddingVertical: theme.spacing(1.25),
                borderRadius: theme.radii.md,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: theme.colors.background,
                  fontFamily: 'Inter_600SemiBold',
                }}
              >
                Toggle Lore Mode
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};
