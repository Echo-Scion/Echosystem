import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ModuleHeader } from '../../components/ModuleHeader';
import { ResonanceStatus } from '../../components/ResonanceStatus';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedCard } from '../../components/ThemedCard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useEcosystemStore } from '../../state/ecosystemStore';
import { formatRelativeDate } from '../../utils/datetime';
import { useAccessControl } from '../../hooks/useAccessControl';

export const EkklesionScreen = () => {
  const theme = useAppTheme();
  const { faithPractices, acknowledgeFaithPractice } = useEcosystemStore((state) => ({
    faithPractices: state.faithPractices,
    acknowledgeFaithPractice: state.acknowledgeFaithPractice,
  }));
  const { fireflyVisualization, accountAccess } = useAccessControl();

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing(9), gap: theme.spacing(3) }}
      >
        <ModuleHeader
          title="Ekklesion"
          subtitle="Chorus of faith — hold sacred reflections, prayers, and devotion streaks."
        />
        <ResonanceStatus />

        <ThemedCard variant="alt">
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 15,
              marginBottom: theme.spacing(1),
            }}
          >
            Firefly Map
          </Text>
          {fireflyVisualization ? (
            <LinearGradient
              colors={theme.gradients.resonance}
              style={{
                height: 120,
                borderRadius: theme.radii.lg,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: theme.colors.text,
                  fontFamily: 'Inter_500Medium',
                }}
              >
                Fireflies shimmer with live prayers.
              </Text>
            </LinearGradient>
          ) : (
            <Text
              style={{
                color: theme.colors.textMuted,
                fontFamily: 'Inter_400Regular',
              }}
            >
              Unlock Account or Pass mode to see the firefly constellation animate in real-time.
            </Text>
          )}
        </ThemedCard>

        <LinearGradient
          colors={[theme.colors.surfaceAlt, theme.colors.overlay]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.glowCard, { borderColor: theme.colors.border }]}
        >
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: 'CormorantGaramond_600SemiBold',
              fontSize: 24,
            }}
          >
            Gentle Devotion
          </Text>
          <Text
            style={{
              color: theme.colors.textMuted,
              fontFamily: 'Inter_400Regular',
              fontSize: 14,
              marginTop: 12,
            }}
          >
            Align your rituals with gratitude, scripture, and mindful silence.
          </Text>
        </LinearGradient>

        <View style={{ gap: theme.spacing(2) }}>
          {faithPractices.map((practice, index) => (
            <MotiView
              key={practice.id}
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 420, delay: index * 90 }}
            >
              <ThemedCard variant={index % 2 === 0 ? 'primary' : 'alt'}>
                <View style={styles.practiceHeader}>
                  <View style={styles.practiceIcon}>
                    <Feather name="sunrise" size={18} color={theme.colors.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: theme.colors.text,
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 16,
                      }}
                    >
                      {practice.title}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.textMuted,
                        fontFamily: 'Inter_400Regular',
                        fontSize: 13,
                        marginTop: 6,
                      }}
                    >
                      {practice.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.practiceFooter}>
                  <View>
                    <Text
                      style={{
                        color: theme.colors.textMuted,
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                      }}
                    >
                      {practice.lastCompletedOn
                        ? `Last echoed ${formatRelativeDate(practice.lastCompletedOn)}`
                        : 'Awaiting resonance'}
                    </Text>
                    {accountAccess && (
                      <Text
                        style={{
                          color: theme.colors.text,
                          fontFamily: 'Inter_500Medium',
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        Synced to Vershine encouragement feed.
                      </Text>
                    )}
                  </View>
                  <Pressable
                    onPress={() => acknowledgeFaithPractice(practice.id)}
                    style={[styles.practiceButton, { backgroundColor: theme.colors.primary }]}
                  >
                    <Text
                      style={{
                        color: theme.colors.background,
                        fontFamily: 'Inter_600SemiBold',
                      }}
                    >
                      Mark complete
                    </Text>
                  </Pressable>
                </View>
              </ThemedCard>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  glowCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
  },
  practiceHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  practiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 210, 111, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceFooter: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  practiceButton: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
