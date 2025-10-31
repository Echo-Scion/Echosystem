import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ModuleHeader } from '../../components/ModuleHeader';
import { ResonanceStatus } from '../../components/ResonanceStatus';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedCard } from '../../components/ThemedCard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useEcosystemStore } from '../../state/ecosystemStore';
import { formatRelativeDate } from '../../utils/datetime';
import { useAccessControl } from '../../hooks/useAccessControl';

export const ResonaryScreen = () => {
  const theme = useAppTheme();
  const { habits, logHabitCheckIn } = useEcosystemStore((state) => ({
    habits: state.habits,
    logHabitCheckIn: state.logHabitCheckIn,
  }));
  const { sunVisualization, gamerManualAI, flowAutoAI, aiCost, requestAIAction, canUseAI } =
    useAccessControl();
  const [insight, setInsight] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const habitSignature = habits.map((habit) => habit.lastCompletedOn ?? '').join('|');
  const hasMounted = useRef(false);

  const handleReflect = () => {
    const result = requestAIAction('resonary-reflect');
    if (result.ok) {
      setInsight('Rhythm insight: your streak brightens Nextra focus. (Placeholder)');
      setStatus(`Coins -${result.cost}`);
    } else {
      setStatus(result.reason === 'insufficient_funds' ? 'Not enough coins' : 'Upgrade needed');
    }
  };

  useEffect(() => {
    if (!flowAutoAI) return;
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (!habitSignature) return;
    const result = requestAIAction('resonary-auto');
    if (result.ok) {
      setInsight('Flow insight: your cadence strengthens Nextra focus paths.');
      setStatus(`Coins -${result.cost}`);
    } else {
      setStatus(result.reason === 'insufficient_funds' ? 'Not enough coins' : 'Upgrade needed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowAutoAI, habitSignature]);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing(9), gap: theme.spacing(3) }}
      >
        <ModuleHeader
          title="Resonary"
          subtitle="Rhythms of becoming — keep luminous rituals steady and in tune."
        />
        <ResonanceStatus />

        <ThemedCard variant="primary">
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 15,
              marginBottom: theme.spacing(1.5),
            }}
          >
            Rhythm Insights
          </Text>
          {sunVisualization ? (
            <View style={styles.sunWrapper}>
              <LinearGradient
                colors={theme.gradients.resonance}
                style={styles.sunGlow}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={[styles.sunText, { color: theme.colors.text }]}>Sun flares intensify with your streaks.</Text>
            </View>
          ) : (
            <Text style={[styles.accessNote, { color: theme.colors.textMuted }]}>
              Unlock Gamer or Flow to reveal dynamic sun rhythms.
            </Text>
          )}
          {!flowAutoAI && (
          <Pressable
            onPress={handleReflect}
            disabled={!gamerManualAI || !canUseAI('habits')}
            style={[
              styles.reflectButton,
              {
                backgroundColor:
                  gamerManualAI && canUseAI('habits')
                    ? theme.colors.primary
                    : theme.colors.surfaceAlt,
              },
            ]}
          >
            <Text
              style={{
                color:
                  gamerManualAI && canUseAI('habits')
                    ? theme.colors.background
                    : theme.colors.textMuted,
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              Reflect on Rhythm {gamerManualAI ? `(−${aiCost})` : ''}
            </Text>
          </Pressable>
          )}
          {flowAutoAI && (
            <Text style={[styles.accessNote, { color: theme.colors.textMuted }]}>Flow insights refresh automatically at half cost.</Text>
          )}
          {status && (
            <Text style={[styles.statusText, { color: theme.colors.textMuted }]}>{status}</Text>
          )}
          {insight && (
            <Text style={[styles.insightText, { color: theme.colors.text }]}>{insight}</Text>
          )}
        </ThemedCard>

        <LinearGradient
          colors={theme.gradients.resonance}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.summaryCard, { borderColor: theme.colors.border }]}
        >
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: 'CormorantGaramond_600SemiBold',
              fontSize: 24,
              marginBottom: 6,
            }}
          >
            Ritual Pulse
          </Text>
          <Text
            style={{
              color: theme.colors.textMuted,
              fontFamily: 'Inter_400Regular',
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {habits.length} habits tuned to your purpose.
          </Text>
        </LinearGradient>

        <View style={{ gap: theme.spacing(2) }}>
          {habits.map((habit, index) => {
            const progress = Math.min(1, habit.streak / Math.max(1, habit.longestStreak));
            return (
              <MotiView
                key={habit.id}
                from={{ opacity: 0, translateY: 16 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 420, delay: index * 80, type: 'timing' }}
              >
                <ThemedCard variant={index % 2 === 0 ? 'alt' : 'primary'}>
                  <View style={styles.habitRow}>
                    <View style={styles.habitIcon}>
                      <Feather name="activity" size={18} color={theme.colors.secondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: theme.colors.text,
                          fontFamily: 'Inter_600SemiBold',
                          fontSize: 16,
                        }}
                      >
                        {habit.name}
                      </Text>
                      <Text
                        style={{
                          color: theme.colors.textMuted,
                          fontFamily: 'Inter_400Regular',
                          fontSize: 13,
                          marginTop: 4,
                        }}
                      >
                        {habit.description}
                      </Text>
                      <View style={styles.progressBarOuter}>
                        <MotiView
                          from={{ width: '0%' }}
                          animate={{ width: `${Math.round(progress * 100)}%` }}
                          transition={{ type: 'timing', duration: 700 }}
                          style={[styles.progressBarInner, { backgroundColor: theme.colors.primary }]}
                        />
                      </View>
                      <View style={styles.habitMeta}>
                        <Text
                          style={{
                            color: theme.colors.text,
                            fontFamily: 'Inter_500Medium',
                            fontSize: 12,
                          }}
                        >
                          Streak {habit.streak}
                        </Text>
                        <Text
                          style={{
                            color: theme.colors.textMuted,
                            fontFamily: 'Inter_400Regular',
                            fontSize: 12,
                          }}
                        >
                          Longest {habit.longestStreak}
                        </Text>
                        <Text
                          style={{
                            color: theme.colors.textMuted,
                            fontFamily: 'Inter_400Regular',
                            fontSize: 12,
                          }}
                        >
                          {habit.lastCompletedOn
                            ? formatRelativeDate(habit.lastCompletedOn)
                            : 'not yet logged'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => logHabitCheckIn(habit.id)}
                    style={[styles.checkInButton, { backgroundColor: theme.colors.secondary }]}
                  >
                    <Text
                      style={{
                        color: theme.colors.background,
                        fontFamily: 'Inter_600SemiBold',
                      }}
                    >
                      Log Check-in
                    </Text>
                  </Pressable>
                </ThemedCard>
              </MotiView>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
  },
  habitRow: {
    flexDirection: 'row',
    gap: 16,
  },
  habitIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 210, 111, 0.12)',
  },
  progressBarOuter: {
    marginTop: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderRadius: 4,
  },
  habitMeta: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  checkInButton: {
    marginTop: 18,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sunWrapper: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  sunGlow: {
    width: '100%',
    height: 80,
    borderRadius: 40,
    opacity: 0.8,
    marginBottom: 12,
  },
  sunText: {
    fontFamily: 'Inter_500Medium',
  },
  accessNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginBottom: 12,
  },
  reflectButton: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statusText: {
    marginTop: 10,
    fontFamily: 'Inter_500Medium',
  },
  insightText: {
    marginTop: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
});
