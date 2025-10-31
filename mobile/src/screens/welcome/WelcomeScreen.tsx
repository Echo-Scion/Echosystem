import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { MotiView } from 'moti';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ModeToggle } from '../../components/ModeToggle';
import { useAppTheme, useThemeActions } from '../../hooks/useAppTheme';
import { useResonance } from '../../state/themeStore';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useEcosystemStore } from '../../state/ecosystemStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen = ({ navigation }: Props) => {
  const theme = useAppTheme();
  const resonance = useResonance();
  const { gentlyShiftResonance } = useThemeActions();
  const setOnboarded = useEcosystemStore((state) => state.setOnboarded);

  const handleGetStarted = () => {
    gentlyShiftResonance(0.02);
    setOnboarded(true);
    navigation.navigate('Auth');
  };

  const handleLearnMore = async () => {
    gentlyShiftResonance(0.01);
    await Linking.openURL('https://example.com/echosystem');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.overlay]}
        style={styles.backdrop}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.topBar}>
        <ModeToggle />
      </View>
      <View style={styles.centerpiece}>
        <MotiView
          style={[styles.orbHalo, { borderColor: theme.colors.glow }]}
          animate={{
            scale: 1 + resonance * 0.2,
            opacity: 0.5 + resonance * 0.3,
          }}
          transition={{ loop: true, duration: theme.transitions.duration }}
        />
        <MotiView
          style={[styles.orb, { backgroundColor: theme.colors.secondary }]}
          animate={{
            scale: 1 + resonance * 0.1,
          }}
          transition={{ loop: true, duration: theme.transitions.duration / 2 }}
        />
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: 'CormorantGaramond_600SemiBold',
            fontSize: 42,
            marginTop: 24,
          }}
        >
          Echosystem
        </Text>
        <Text
          style={{
            color: theme.colors.textMuted,
            fontFamily: 'Inter_400Regular',
            fontSize: 15,
            textAlign: 'center',
            marginTop: 12,
            paddingHorizontal: 32,
            lineHeight: 22,
          }}
        >
          A calm digital ecosystem of journaling, quotes, habits, tasks, faith, and
          creation — all humming together toward clarity.
        </Text>
      </View>
      <View style={styles.ctaRow}>
        <Pressable
          onPress={handleGetStarted}
          style={[styles.primaryCta, { backgroundColor: theme.colors.primary }]}
        >
          <Text
            style={{
              color: theme.colors.background,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 16,
            }}
          >
            Get Started
          </Text>
        </Pressable>
        <Pressable
          onPress={handleLearnMore}
          style={[
            styles.secondaryCta,
            {
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Text
            style={{
              color: theme.colors.primary,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 16,
            }}
          >
            Learn More
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 64,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 32,
  },
  centerpiece: {
    alignItems: 'center',
    gap: 12,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  orbHalo: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryCta: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    minWidth: 140,
    alignItems: 'center',
  },
  secondaryCta: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    minWidth: 140,
    alignItems: 'center',
  },
});
