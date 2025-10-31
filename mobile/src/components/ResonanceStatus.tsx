import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useResonance } from '../state/themeStore';
import { useEcosystemStore } from '../state/ecosystemStore';
import { useAccessControl } from '../hooks/useAccessControl';

const formatPercentage = (value: number) => Math.round(value * 100);

export const ResonanceStatus = () => {
  const theme = useAppTheme();
  const resonance = useResonance();
  const lastLog = useEcosystemStore((state) => state.resonanceLog[0]);
  const { coins, gold, passType, redeemDailyGold } = useAccessControl();

  useEffect(() => {
    redeemDailyGold();
  }, [redeemDailyGold]);

  return (
    <LinearGradient
      colors={theme.gradients.aurora}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { borderColor: theme.colors.border }]}
    >
      <View style={styles.content}>
        <View>
          <Text
            style={{
              color: theme.colors.textMuted,
              fontFamily: 'Inter_500Medium',
              fontSize: 13,
              marginBottom: 4,
            }}
          >
            Resonance
          </Text>
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: 'CormorantGaramond_600SemiBold',
              fontSize: 28,
            }}
          >
            {formatPercentage(resonance)}%
          </Text>
          <Text
            style={{
              color: theme.colors.textMuted,
              fontFamily: 'Inter_500Medium',
              fontSize: 12,
              marginTop: 6,
            }}
          >
            Pass {passType.toUpperCase()} · Coins {coins.toFixed(2)} · Gold {gold}
          </Text>
          {lastLog && (
            <Text
              numberOfLines={2}
              style={{
                color: theme.colors.textMuted,
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                marginTop: 8,
              }}
            >
              {lastLog.note}
            </Text>
          )}
        </View>
        <View style={styles.orbWrapper}>
          <MotiView
            style={[styles.orbGlow, { backgroundColor: theme.colors.glow }]}
            animate={{
              scale: 1 + resonance * 0.2,
              opacity: 0.35 + resonance * 0.25,
            }}
            transition={{
              type: 'timing',
              duration: theme.transitions.duration,
              loop: true,
            }}
          />
          <MotiView
            style={[styles.orbCore, { backgroundColor: theme.colors.secondary }]}
            animate={{
              scale: 1 + resonance * 0.05,
            }}
            transition={{
              type: 'timing',
              duration: theme.transitions.duration / 2,
              loop: true,
            }}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  orbWrapper: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  orbCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
