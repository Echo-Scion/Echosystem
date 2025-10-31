import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { ModuleHeader } from '../../components/ModuleHeader';
import { ResonanceStatus } from '../../components/ResonanceStatus';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedCard } from '../../components/ThemedCard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useEcosystemStore } from '../../state/ecosystemStore';
import { formatRelativeDate } from '../../utils/datetime';
import { useAccessControl } from '../../hooks/useAccessControl';
import { modeCopy } from '../../copy/modeCopy';

const taskSchema = z.object({
  title: z.string().min(2, 'Name the task'),
  scheduledFor: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export const NextraScreen = () => {
  const theme = useAppTheme();
  const { tasks, toggleTask, addTask } = useEcosystemStore((state) => ({
    tasks: state.tasks,
    toggleTask: state.toggleTask,
    addTask: state.addTask,
  }));
  const {
    gamerManualAI,
    flowAutoAI,
    micForTasks,
    aiCost,
    requestAIAction,
    accountAccess,
    canUseAI,
  } = useAccessControl();
  const [aiListStatus, setAiListStatus] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', scheduledFor: '' },
  });

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const onSubmit = ({ title, scheduledFor }: TaskFormValues) => {
    addTask(title, scheduledFor || undefined);
    reset({ title: '', scheduledFor: '' });
    if (flowAutoAI) {
      const result = requestAIAction('nextra-auto');
      if (result.ok) {
        setAiListStatus(`Flow generated support tasks automatically (−${result.cost}).`);
      } else {
        setAiListStatus(result.reason === 'insufficient_funds' ? 'Not enough coins' : 'Upgrade needed');
      }
    }
  };

  const handlePriority = () => {
    setAiListStatus('Priority score recalculated — align high resonance first.');
  };

  const handleMic = () => {
    if (!(gamerManualAI || flowAutoAI)) {
      setAiListStatus('Upgrade to Gamer/Flow to use voice capture.');
      return;
    }
    if (!canUseAI('tasks')) {
      setAiListStatus('Not enough coins for task transcription.');
      return;
    }
    const result = requestAIAction('nextra-mic');
    if (result.ok) {
      setAiListStatus(`Voice tasks transcribed (−${result.cost}).`);
    } else {
      setAiListStatus(result.reason === 'insufficient_funds' ? 'Not enough coins' : 'Upgrade needed');
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing(10), gap: theme.spacing(3) }}
      >
        <ModuleHeader
          title="Nextra"
          subtitle="Paths of intention — align focus, wishlist, and goals with your resonance."
        />
        <ResonanceStatus />

        <ThemedCard variant="alt">
          <Text style={[styles.formLabel, { color: theme.colors.text }]}>Focus Tools</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1) }}>
            <Pressable
              onPress={handlePriority}
              style={[styles.toolButton, { backgroundColor: theme.colors.secondary }]}
            >
              <Text style={[styles.toolButtonText, { color: theme.colors.background }]}>Priority Calculator</Text>
            </Pressable>
            <Pressable
              onPress={handleMic}
              disabled={!micForTasks || !canUseAI('tasks')}
              style={[
                styles.toolButton,
                {
                  backgroundColor:
                    micForTasks && canUseAI('tasks')
                      ? theme.colors.primary
                      : theme.colors.surfaceAlt,
                },
              ]}
            >
              <Text
                style={[
                  styles.toolButtonText,
                  {
                    color:
                      micForTasks && canUseAI('tasks')
                        ? theme.colors.background
                        : theme.colors.textMuted,
                  },
                ]}
              >
                Mic to Tasks {gamerManualAI || flowAutoAI ? `(−${aiCost})` : ''}
              </Text>
            </Pressable>
          </View>
          {!accountAccess && (
            <Text style={[styles.accessNote, { color: theme.colors.textMuted }]}>
              Upgrade to Account+ to sync goals with Resonary or Stellaread.
            </Text>
          )}
          {aiListStatus && (
            <Text
              style={{
                marginTop: theme.spacing(1.5),
                color: theme.colors.textMuted,
                fontFamily: 'Inter_400Regular',
              }}
            >
              {aiListStatus}
            </Text>
          )}
        </ThemedCard>

        <ThemedCard>
          <Text style={[styles.formLabel, { color: theme.colors.textMuted }]}>Plan</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Task focus"
                placeholderTextColor={theme.colors.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surfaceAlt,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
              />
            )}
          />
          {errors.title ? (
            <Text style={[styles.error, { color: theme.colors.danger }]}>
              {errors.title.message}
            </Text>
          ) : null}

          <Controller
            control={control}
            name="scheduledFor"
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value ?? ''}
                onChangeText={onChange}
                placeholder="When will you honor it? (optional)"
                placeholderTextColor={theme.colors.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surfaceAlt,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
              />
            )}
          />

          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={[
              styles.submit,
              {
                backgroundColor: theme.colors.secondary,
                shadowColor: theme.colors.secondary,
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
              {modeCopy.cta.addTask[theme.mode === 'lore' ? 'lore' : 'normal']}
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
            In Motion
          </Text>
          {activeTasks.map((task, index) => (
            <MotiView
              key={task.id}
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 420, delay: index * 80, type: 'timing' }}
            >
              <ThemedCard variant={index % 2 === 0 ? 'primary' : 'alt'}>
                <Pressable onPress={() => toggleTask(task.id)} style={styles.taskRow}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: theme.colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Feather name="circle" color={theme.colors.primary} size={18} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: theme.colors.text,
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 16,
                      }}
                    >
                      {task.title}
                    </Text>
                    {task.scheduledFor ? (
                      <Text
                        style={{
                          color: theme.colors.textMuted,
                          fontFamily: 'Inter_400Regular',
                          fontSize: 13,
                          marginTop: 4,
                        }}
                      >
                        {task.scheduledFor}
                      </Text>
                    ) : null}
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={theme.colors.textMuted}
                  />
                </Pressable>
                {accountAccess && (
                  <View style={styles.linkRow}>
                    <Text style={styles.linkLabel}>Link with Resonary</Text>
                    <Feather name="sun" size={14} color={theme.colors.secondary} />
                  </View>
                )}
              </ThemedCard>
            </MotiView>
          ))}

          <Text
            style={{
              color: theme.colors.textMuted,
              fontFamily: 'Inter_500Medium',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginTop: theme.spacing(3),
            }}
          >
            Completed Echoes
          </Text>
          {completedTasks.map((task) => (
            <ThemedCard key={task.id} variant="translucent">
              <View style={styles.completedRow}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: theme.colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Feather name="check" size={16} color={theme.colors.background} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontFamily: 'Inter_600SemiBold',
                      fontSize: 15,
                    }}
                  >
                    {task.title}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontFamily: 'Inter_400Regular',
                      fontSize: 12,
                    }}
                  >
                    Resonance +{Math.round(task.resonanceDelta * 100)}%
                  </Text>
                </View>
                {accountAccess && (
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontFamily: 'Inter_400Regular',
                      fontSize: 12,
                      marginRight: theme.spacing(1),
                    }}
                  >
                    Linked to Stellaread files
                  </Text>
                )}
                <Text
                  style={{
                    color: theme.colors.textMuted,
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                  }}
                >
                  {task.completedAt ? formatRelativeDate(task.completedAt) : 'today'}
                </Text>
              </View>
            </ThemedCard>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  formLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    marginBottom: 12,
  },
  error: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginBottom: 12,
  },
  submit: {
    marginTop: 8,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolButton: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toolButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  accessNote: {
    marginTop: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  linkLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
