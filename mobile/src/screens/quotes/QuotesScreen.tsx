import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ModuleHeader } from '../../components/ModuleHeader';
import { ResonanceStatus } from '../../components/ResonanceStatus';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedCard } from '../../components/ThemedCard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useEcosystemStore } from '../../state/ecosystemStore';
import { formatRelativeDate } from '../../utils/datetime';
import { useAccessControl } from '../../hooks/useAccessControl';

export const VershineScreen = () => {
  const theme = useAppTheme();
  const { quotes, resonateWithQuote } = useEcosystemStore((state) => ({
    quotes: state.quotes,
    resonateWithQuote: state.resonateWithQuote,
  }));
  const { flowAutoAI, gamerManualAI, aiCost, requestAIAction, canUseAI } = useAccessControl();
  const [rewriteStatus, setRewriteStatus] = useState<string | null>(null);
  const [rewriteQuoteId, setRewriteQuoteId] = useState<string | null>(null);

  const leadQuoteId = quotes[0]?.id;

  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (!flowAutoAI || !leadQuoteId) return;
    if (!hasBootstrapped.current) {
      hasBootstrapped.current = true;
      return;
    }
    const target = quotes[0];
    const result = requestAIAction('vershine-auto');
    if (result.ok) {
      setRewriteStatus(`Flow shimmer updated "${target.author}" tone (auto, -${result.cost}).`);
      setRewriteQuoteId(target.id);
    } else {
      setRewriteStatus(result.reason === 'insufficient_funds' ? 'Not enough coins' : 'Upgrade needed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowAutoAI, leadQuoteId]);

  const handleRewrite = (quoteId: string) => {
    const result = requestAIAction('vershine-rewrite');
    if (result.ok) {
      setRewriteStatus(`Quote rewritten with luminous tone. Coins -${result.cost}`);
      setRewriteQuoteId(quoteId);
    } else {
      setRewriteStatus(result.reason === 'insufficient_funds' ? 'Not enough coins' : 'Upgrade required');
    }
  };

  const featured = quotes[0];
  const rest = quotes.slice(1);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing(9), gap: theme.spacing(3) }}
      >
        <ModuleHeader
          title="Vershine"
          subtitle="Light fragments of encouragement ready to resonate with your daily steps."
        />
        <ResonanceStatus />

        {featured ? (
          <LinearGradient
            colors={theme.gradients.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.featured, { borderColor: theme.colors.border }]}
          >
            <Text style={[styles.featuredLabel, { color: theme.colors.textMuted }]}>Today</Text>
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: 'CormorantGaramond_600SemiBold',
                fontSize: 26,
                lineHeight: 32,
              }}
            >
              “{featured.text}”
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontFamily: 'Inter_500Medium',
                marginTop: 12,
              }}
            >
              {featured.author}
            </Text>
            <Pressable
              onPress={() => resonateWithQuote(featured.id)}
              style={[styles.resonateButton, { borderColor: theme.colors.secondary }]}
            >
              <Feather name="activity" size={15} color={theme.colors.secondary} />
              <Text
                style={{
                  color: theme.colors.secondary,
                  fontFamily: 'Inter_600SemiBold',
                }}
              >
                Resonate
              </Text>
            </Pressable>
          </LinearGradient>
        ) : null}

        {rewriteStatus && (
          <ThemedCard variant="primary">
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: 'Inter_600SemiBold',
                marginBottom: theme.spacing(1),
              }}
            >
              Tone Craft
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontFamily: 'Inter_400Regular',
              }}
            >
              {rewriteStatus}
            </Text>
          </ThemedCard>
        )}

        <View style={{ gap: theme.spacing(2) }}>
          {rest.map((quote, index) => (
            <Fragment key={quote.id}>
              <MotiView
                from={{ opacity: 0, translateY: 16 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'timing',
                  duration: 420,
                  delay: index * 60,
                }}
              >
                <ThemedCard variant={index % 2 === 0 ? 'alt' : 'primary'}>
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontFamily: 'CormorantGaramond_600SemiBold',
                      fontSize: 20,
                      lineHeight: 26,
                      marginBottom: 12,
                    }}
                  >
                    “{quote.text}”
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontFamily: 'Inter_500Medium',
                      marginBottom: 12,
                    }}
                  >
                    {quote.author}
                  </Text>
                  <View style={styles.tagRow}>
                    {quote.tags.map((tag) => (
                      <View
                        key={tag}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 14,
                          backgroundColor: theme.colors.overlay,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.text,
                            fontFamily: 'Inter_500Medium',
                            fontSize: 12,
                          }}
                        >
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.cardFooter}>
                    <Pressable
                      onPress={() => resonateWithQuote(quote.id)}
                      style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
                    >
                      <Text
                        style={{
                          color: theme.colors.primary,
                          fontFamily: 'Inter_600SemiBold',
                        }}
                      >
                        Resonate
                      </Text>
                    </Pressable>
                    {quote.lastResonatedAt ? (
                      <Text
                        style={{
                          color: theme.colors.textMuted,
                          fontFamily: 'Inter_400Regular',
                          fontSize: 12,
                        }}
                      >
                        {formatRelativeDate(quote.lastResonatedAt)}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.cardFooter}>
                    {!flowAutoAI && (
                      <Pressable
                        onPress={() => handleRewrite(quote.id)}
                        disabled={!gamerManualAI || !canUseAI('quotes')}
                        style={[
                          styles.secondaryButton,
                          {
                            borderColor:
                              gamerManualAI && canUseAI('quotes')
                                ? theme.colors.secondary
                                : theme.colors.border,
                            backgroundColor:
                              gamerManualAI && canUseAI('quotes')
                                ? theme.colors.secondary
                                : theme.colors.surfaceAlt,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color:
                              gamerManualAI && canUseAI('quotes')
                                ? theme.colors.background
                                : theme.colors.textMuted,
                            fontFamily: 'Inter_600SemiBold',
                          }}
                        >
                          Rewrite Tone {gamerManualAI ? `(−${aiCost})` : ''}
                        </Text>
                      </Pressable>
                    )}
                    {rewriteQuoteId === quote.id && (
                      <Text
                        style={{
                          color: theme.colors.textMuted,
                          fontFamily: 'Inter_400Regular',
                          fontSize: 12,
                        }}
                      >
                        Tone shimmered by Flow/Gamer pass.
                      </Text>
                    )}
                  </View>
                </ThemedCard>
              </MotiView>
            </Fragment>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  featured: {
    borderRadius: 26,
    borderWidth: 1,
    padding: 24,
    gap: 12,
  },
  featuredLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resonateButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardFooter: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
});
