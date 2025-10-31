import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { MotiView } from 'moti';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, Pressable, View, StyleSheet } from 'react-native';
import { z } from 'zod';
import { ModuleHeader } from '../../components/ModuleHeader';
import { ResonanceStatus } from '../../components/ResonanceStatus';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedCard } from '../../components/ThemedCard';
import { useAppTheme } from '../../hooks/useAppTheme';
import {
  useEcosystemStore,
  JournalMood,
  JournalEntry,
} from '../../state/ecosystemStore';
import { formatRelativeDate } from '../../utils/datetime';
import { useAccessControl } from '../../hooks/useAccessControl';
import { modeCopy } from '../../copy/modeCopy';

const journalSchema = z.object({
  title: z.string().min(1, 'Give the entry a title'),
  body: z.string().min(3, 'Let resonance breathe with a few words'),
  mood: z.enum(['clear', 'charged', 'drifting']),
});

type JournalFormValues = z.infer<typeof journalSchema>;

const moodOptions: Array<{
  value: JournalMood;
  label: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
}> = [
  {
    value: 'clear',
    label: 'Clear Skies',
    description: 'Steady, luminous focus',
    icon: 'sun',
  },
  {
    value: 'charged',
    label: 'Charged Storm',
    description: 'Emotions seeking form',
    icon: 'cloud-lightning',
  },
  {
    value: 'drifting',
    label: 'Drifting Tide',
    description: 'Curious, exploring threads',
    icon: 'wind',
  },
];

const moodToModules: Record<JournalMood, JournalEntry['linkedModules']> = {
  clear: ['quotes', 'tasks'],
  charged: ['habits', 'faith'],
  drifting: ['creation', 'quotes'],
};

const moduleDisplayNames: Record<JournalEntry['linkedModules'][number], string> = {
  quotes: 'Vershine',
  tasks: 'Nextra',
  habits: 'Resonary',
  faith: 'Ekklesion',
  creation: 'Stellaread',
};

export const LuminoteScreen = () => {
  const theme = useAppTheme();
  const { journalEntries, addJournalEntry } = useEcosystemStore((state) => ({
    journalEntries: state.journalEntries,
    addJournalEntry: state.addJournalEntry,
  }));
  const { flowAutoAI, gamerManualAI, micForNarration, aiCost, requestAIAction, canUseAI } =
    useAccessControl();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const leadEntryId = journalEntries[0]?.id;
  const hasBootstrapped = useRef(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: '',
      body: '',
      mood: 'clear',
    },
  });

  const selectedMood = watch('mood');

  const onSubmit = (values: JournalFormValues) => {
    addJournalEntry({
      ...values,
      linkedModules: moodToModules[values.mood],
    });
    reset({ title: '', body: '', mood: values.mood });
    if (flowAutoAI) {
      setAiStatus('Flow hum listening...');
    }
  };

  const handleManualReflection = () => {
    const result = requestAIAction('luminote-reflection');
    if (result.ok) {
      setAiInsight('AI summary: Your intentions ripple toward harmony. (Placeholder output)');
      setAiStatus(`Coins -${result.cost}`);
    } else {
      setAiStatus(result.reason === 'insufficient_funds' ? 'Not enough coins' : 'Upgrade needed');
    }
  };

  const handleMicCapture = () => {
    setAiInsight('Flow mic captured a vocal reflection. (Placeholder transcription)');
    setAiStatus('Flow mic active');
  };

  useEffect(() => {
    if (!flowAutoAI || !leadEntryId) return;
    if (!hasBootstrapped.current) {
      hasBootstrapped.current = true;
      return;
    }
    const result = requestAIAction('luminote-auto-sync');
    if (result.ok) {
      setAiInsight(
        'Flow auto-listening summarized your freshest entry into Vershine. (Placeholder)',
      );
      setAiStatus(`Coins -${result.cost}`);
    } else {
      setAiStatus(result.reason === 'insufficient_funds' ? 'Not enough coins' : 'Upgrade needed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowAutoAI, leadEntryId]);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing(10), gap: theme.spacing(3) }}
      >
        <ModuleHeader
          title="Luminote"
          subtitle="Etchings of the heart — capture resonance threads that guide the ecosystem."
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
            Flow Controls
          </Text>
          <View style={{ flexDirection: 'row', gap: theme.spacing(2) }}>
            {micForNarration ? (
              <Pressable
                onPress={handleMicCapture}
                style={[styles.flowButton, { backgroundColor: theme.colors.secondary }]}
              >
                <Feather name="mic" size={16} color={theme.colors.background} />
                <Text style={[styles.flowButtonText, { color: theme.colors.background }]}>Mic</Text>
              </Pressable>
            ) : (
              <View style={[styles.flowButton, styles.flowButtonDisabled]}>
                <Feather name="mic-off" size={16} color={theme.colors.textMuted} />
                <Text style={[styles.flowButtonText, { color: theme.colors.textMuted }]}>Mic</Text>
              </View>
            )}
            {flowAutoAI ? null : (
              <Pressable
                onPress={handleManualReflection}
                disabled={!gamerManualAI || !canUseAI('reflect')}
                style={[
                  styles.flowButton,
                  {
                    backgroundColor: gamerManualAI
                      ? theme.colors.primary
                      : theme.colors.surfaceAlt,
                  },
                ]}
              >
                <Feather
                  name="sparkles"
                  size={16}
                  color={gamerManualAI ? theme.colors.background : theme.colors.textMuted}
                />
                <Text
                  style={[
                    styles.flowButtonText,
                    { color: gamerManualAI ? theme.colors.background : theme.colors.textMuted },
                  ]}
                >
                  {modeCopy.cta.reflect[theme.mode === 'lore' ? 'lore' : 'normal']} (−{aiCost})
                </Text>
              </Pressable>
            )}
          </View>
          <Text
            style={{
              marginTop: theme.spacing(1.5),
              color: theme.colors.textMuted,
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
            }}
          >
            {flowAutoAI
              ? 'Flow Pass active: reflections trigger automatically at half cost.'
              : gamerManualAI
              ? 'Gamer Pass: launch AI reflections when you choose.'
              : 'Upgrade to Gamer or Flow Pass to unlock AI reflections and mic input.'}
          </Text>
          {aiStatus && (
            <Text
              style={{
                color: theme.colors.secondary,
                fontFamily: 'Inter_600SemiBold',
                marginTop: theme.spacing(1),
              }}
            >
              {aiStatus}
            </Text>
          )}
          {aiInsight && (
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: 'Inter_500Medium',
                marginTop: theme.spacing(2),
                lineHeight: 20,
              }}
            >
              {aiInsight}
            </Text>
          )}
        </ThemedCard>

        <ThemedCard>
          <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>New Entry</Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Entry title"
                placeholderTextColor={theme.colors.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surfaceAlt,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
              />
            )}
          />
          {errors.title && (
            <Text style={[styles.error, { color: theme.colors.danger }]}>
              {errors.title.message}
            </Text>
          )}

          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="What did you notice, feel, or learn?"
                placeholderTextColor={theme.colors.textMuted}
                multiline
                style={[
                  styles.textArea,
                  {
                    backgroundColor: theme.colors.surfaceAlt,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
              />
            )}
          />
          {errors.body && (
            <Text style={[styles.error, { color: theme.colors.danger }]}>
              {errors.body.message}
            </Text>
          )}

          <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>Mood</Text>
          <Controller
            control={control}
            name="mood"
            render={({ field: { value, onChange } }) => (
              <View style={styles.moodRow}>
                {moodOptions.map((option) => {
                  const active = value === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => onChange(option.value)}
                      style={[
                        styles.moodChip,
                        {
                          borderColor: active
                            ? theme.colors.secondary
                            : theme.colors.border,
                          backgroundColor: active
                            ? theme.colors.overlay
                            : theme.colors.surfaceAlt,
                        },
                      ]}
                    >
                      <Feather
                        name={option.icon}
                        size={18}
                        color={active ? theme.colors.secondary : theme.colors.textMuted}
                      />
                      <View style={styles.moodChipText}>
                        <Text
                          style={{
                            color: active ? theme.colors.text : theme.colors.textMuted,
                            fontFamily: 'Inter_600SemiBold',
                            fontSize: 13,
                          }}
                        >
                          {option.label}
                        </Text>
                        <Text
                          style={{
                            color: theme.colors.textMuted,
                            fontFamily: 'Inter_400Regular',
                            fontSize: 12,
                          }}
                        >
                          {option.description}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />

          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={[
              styles.submit,
              {
                backgroundColor: theme.colors.primary,
                shadowColor: theme.colors.glow,
              },
            ]}
          >
            <Text
              style={{
                color: theme.colors.background,
                fontFamily: 'Inter_600SemiBold',
                fontSize: 15,
              }}
            >
              Capture Entry
            </Text>
          </Pressable>
        </ThemedCard>

        <View style={{ gap: theme.spacing(2) }}>
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: 'CormorantGaramond_600SemiBold',
              fontSize: theme.typography.heading.fontSize,
            }}
          >
            Recent Resonances
          </Text>

          {journalEntries.map((entry, index) => (
            <MotiView
              key={entry.id}
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 80, type: 'timing', duration: 480 }}
            >
              <ThemedCard variant={index % 2 === 0 ? 'alt' : 'primary'}>
                <View style={styles.entryHeader}>
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontFamily: 'CormorantGaramond_600SemiBold',
                      fontSize: 20,
                    }}
                  >
                    {entry.title}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontFamily: 'Inter_400Regular',
                      fontSize: 12,
                    }}
                  >
                    {formatRelativeDate(entry.createdAt)}
                  </Text>
                </View>
                <Text
                  style={{
                    color: theme.colors.textMuted,
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14,
                    lineHeight: 20,
                    marginBottom: 12,
                  }}
                >
                  {entry.body}
                </Text>
                <View style={styles.moodFooter}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: theme.colors.secondary,
                      }}
                    />
                    <Text
                      style={{
                        color: theme.colors.text,
                        fontFamily: 'Inter_500Medium',
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {entry.mood}
                    </Text>
                  </View>
                  <View style={styles.linkedModules}>
                    {entry.linkedModules.map((module) => (
                      <View
                        key={module}
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 12,
                          backgroundColor: theme.colors.overlay,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.text,
                            fontFamily: 'Inter_400Regular',
                            fontSize: 11,
                            textTransform: 'uppercase',
                          }}
                        >
                          {moduleDisplayNames[module] ?? module}
                        </Text>
                      </View>
                    ))}
                  </View>
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
  sectionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  textArea: {
    minHeight: 120,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    textAlignVertical: 'top',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: 12,
  },
  error: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  moodChip: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moodChipText: {
    flex: 1,
  },
  submit: {
    marginTop: 8,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  linkedModules: {
    flexDirection: 'row',
    gap: 8,
  },
  flowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  flowButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  flowButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
