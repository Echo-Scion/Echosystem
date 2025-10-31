import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useMemo } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather as FeatherIcon } from '@expo/vector-icons';
import {
  BookOpen,
  ChatTeardropText,
  HandsPraying,
  ListChecks,
  Sparkle,
  StarFour,
} from 'phosphor-react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useResonance, useThemeMode } from '../state/themeStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TAB_LABELS: Record<string, string> = {
  Luminote: 'Luminote',
  Vershine: 'Vershine',
  Nextra: 'Nextra',
  Resonary: 'Resonary',
  Ekklesion: 'Ekklesion',
  Stellaread: 'Stellaread',
};

type IconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const IconMap: Record<string, (props: IconProps) => JSX.Element> = {
  Luminote: ({ focused, color, size }) => (
    <View style={styles.iconWrap}>
      <BookOpen size={size} color={color} weight={focused ? 'duotone' : 'regular'} />
    </View>
  ),
  Vershine: ({ focused, color, size }) => (
    <View style={styles.iconWrap}>
      <ChatTeardropText
        size={size}
        color={color}
        weight={focused ? 'duotone' : 'regular'}
      />
    </View>
  ),
  Nextra: ({ focused, color, size }) => (
    <View style={styles.iconWrap}>
      <ListChecks size={size} color={color} weight={focused ? 'duotone' : 'regular'} />
    </View>
  ),
  Resonary: ({ focused, color, size }) => (
    <View style={styles.iconWrap}>
      <StarFour size={size} color={color} weight={focused ? 'duotone' : 'regular'} />
    </View>
  ),
  Ekklesion: ({ focused, color, size }) => (
    <View style={styles.iconWrap}>
      <HandsPraying size={size} color={color} weight={focused ? 'duotone' : 'regular'} />
    </View>
  ),
  Stellaread: ({ focused, color, size }) => (
    <View style={styles.iconWrap}>
      <Sparkle size={size} color={color} weight={focused ? 'duotone' : 'regular'} />
    </View>
  ),
};

const FeatherFallback: Record<string, string> = {
  Luminote: 'book-open',
  Vershine: 'message-square',
  Nextra: 'check-square',
  Resonary: 'refresh-cw',
  Ekklesion: 'sunrise',
  Stellaread: 'pen-tool',
};

export const ResonantTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const theme = useAppTheme();
  const mode = useThemeMode();
  const resonance = useResonance();

  const tabWidth = useMemo(
    () => SCREEN_WIDTH / state.routes.length,
    [state.routes.length],
  );

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <LinearGradient
        colors={
          mode === 'lore'
            ? theme.gradients.card
            : [theme.colors.surface, theme.colors.surfaceAlt]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { backgroundColor: theme.colors.surface }]}
      />
      <View style={styles.inner}>
        <MotiView
          pointerEvents="none"
          style={[
            styles.orbWrapper,
            {
              width: tabWidth,
            },
          ]}
          animate={{
            translateX: state.index * tabWidth,
          }}
          transition={{
            type: 'timing',
            duration: theme.transitions.duration / 2,
            easing: theme.transitions.easing,
          }}
        >
          <View style={styles.orbAnchor}>
            <LinearGradient
              colors={theme.gradients.resonance}
              style={[
                styles.orb,
                {
                  opacity: 0.35 + resonance * 0.4,
                  borderColor: theme.colors.glow,
                },
              ]}
            >
              <View
                style={[
                  styles.orbCore,
                  {
                    backgroundColor: theme.colors.glow,
                    opacity: 0.5 + resonance * 0.4,
                  },
                ]}
              />
            </LinearGradient>
          </View>
        </MotiView>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : TAB_LABELS[route.name] ?? route.name;

          const iconRenderer = IconMap[route.name];
          const activeColor = theme.colors.secondary;
          const inactiveColor = theme.colors.textMuted;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tab, { width: tabWidth }]}
            >
              <View style={styles.iconContainer}>
                {iconRenderer ? (
                  iconRenderer({
                    focused: isFocused,
                    color: isFocused ? activeColor : inactiveColor,
                    size: 24,
                  })
                ) : (
                  <FeatherIcon
                    name={(FeatherFallback[route.name] ?? 'circle') as any}
                    size={24}
                    color={isFocused ? activeColor : inactiveColor}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? activeColor : inactiveColor,
                    fontFamily:
                      mode === 'lore'
                        ? 'CormorantGaramond_500Medium'
                        : 'Inter_500Medium',
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.96,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 48,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
  },
  orbWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  orbAnchor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: 52,
    height: 28,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbCore: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
