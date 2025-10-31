import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ModuleHeader } from '../../components/ModuleHeader';
import { ResonanceStatus } from '../../components/ResonanceStatus';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedCard } from '../../components/ThemedCard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useEcosystemStore } from '../../state/ecosystemStore';
import { useAccessControl } from '../../hooks/useAccessControl';

export const StellareadScreen = () => {
  const theme = useAppTheme();
  const { creativeWorks, advanceCreativeWork } = useEcosystemStore((state) => ({
    creativeWorks: state.creativeWorks,
    advanceCreativeWork: state.advanceCreativeWork,
  }));
  const { accountAccess } = useAccessControl();

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing(9), gap: theme.spacing(3) }}
      >
        <ModuleHeader
          title="Stellaread"
          subtitle="Scrolls of creation — weave reading rituals with luminous excerpts."
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
            Import Options
          </Text>
          <Text
            style={{
              color: theme.colors.textMuted,
              fontFamily: 'Inter_400Regular',
            }}
          >
            Local file import and categorization grids are available for every traveler.
          </Text>
          {accountAccess ? (
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: 'Inter_500Medium',
                marginTop: theme.spacing(1),
              }}
            >
              Cloud sync and URL / video imports unlocked. Link scrolls with Nextra tasks seamlessly.
            </Text>
          ) : (
            <Text
              style={{
                color: theme.colors.textMuted,
                fontFamily: 'Inter_400Regular',
                marginTop: theme.spacing(1),
              }}
            >
              Upgrade to Account or Pass to enable cloud sync, URL/video ingestion, and task-linking.
            </Text>
          )}
        </ThemedCard>

        <View style={{ gap: theme.spacing(2) }}>
          {creativeWorks.map((work, index) => (
            <MotiView
              key={work.id}
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 420, delay: index * 80, type: 'timing' }}
            >
              <ThemedCard variant={index % 2 === 0 ? 'alt' : 'primary'}>
                <View style={styles.header}>
                  <View style={styles.iconPill}>
                    <Feather name="book-open" size={18} color={theme.colors.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: theme.colors.text,
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 16,
                      }}
                    >
                      {work.title}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.textMuted,
                        fontFamily: 'Inter_400Regular',
                        fontSize: 13,
                        marginTop: 4,
                      }}
                    >
                      {work.author}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: theme.colors.textMuted,
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14,
                    lineHeight: 20,
                    marginTop: 12,
                  }}
                >
                  “{work.excerpt}”
                </Text>
                <View style={styles.progressShell}>
                  <MotiView
                    from={{ width: '0%' }}
                    animate={{ width: `${Math.round(work.progress * 100)}%` }}
                    transition={{ type: 'timing', duration: 650 }}
                    style={[styles.progressFill, { backgroundColor: theme.colors.secondary }]}
                  />
                </View>
                <View style={styles.footer}>
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontFamily: 'Inter_600SemiBold',
                      fontSize: 13,
                    }}
                  >
                    {Math.round(work.progress * 100)}% complete
                  </Text>
                  <Pressable
                    onPress={() => advanceCreativeWork(work.id, 0.1)}
                    style={[styles.advanceBtn, { backgroundColor: theme.colors.primary }]}
                  >
                    <Text
                      style={{
                        color: theme.colors.background,
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 13,
                      }}
                    >
                      Advance 10%
                    </Text>
                  </Pressable>
                </View>
                {accountAccess && (
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontFamily: 'Inter_400Regular',
                      fontSize: 12,
                      marginTop: 10,
                    }}
                  >
                    Linked to Nextra goals for integrated focus.
                  </Text>
                )}
              </ThemedCard>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 16,
  },
  iconPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(163, 148, 247, 0.18)',
  },
  progressShell: {
    marginTop: 18,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  advanceBtn: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
