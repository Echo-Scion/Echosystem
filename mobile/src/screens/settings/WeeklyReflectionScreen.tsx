import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ModuleHeader } from '../../components/ModuleHeader';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ThemedCard } from '../../components/ThemedCard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useEcosystemStore } from '../../state/ecosystemStore';

export const WeeklyReflectionScreen = () => {
  const theme = useAppTheme();
  const [reflection, setReflection] = useState('');
  const addJournalEntry = useEcosystemStore((state) => state.addJournalEntry);

  const handleSave = () => {
    if (!reflection.trim()) return;
    addJournalEntry({
      title: 'Weekly Reflection',
      body: reflection,
      mood: 'clear',
      linkedModules: ['quotes', 'tasks', 'creation'],
      resonanceDelta: 0.04,
    });
    setReflection('');
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: theme.spacing(12),
          gap: theme.spacing(3),
        }}
      >
        <ModuleHeader
          title="Weekly Reflection"
          subtitle="Capture the rhythms and revelations of your week."
          trailing={null}
        />
        <ThemedCard variant="alt">
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 15,
              marginBottom: theme.spacing(2),
            }}
          >
            Reflection Notes
          </Text>
          <TextInput
            value={reflection}
            onChangeText={setReflection}
            multiline
            placeholder="What resonated? What will you carry forward?"
            placeholderTextColor={theme.colors.textMuted}
            style={{
              minHeight: 160,
              borderRadius: theme.radii.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              padding: theme.spacing(2),
              textAlignVertical: 'top',
              color: theme.colors.text,
              fontFamily: 'Inter_400Regular',
            }}
          />
        </ThemedCard>
        <Pressable
          onPress={handleSave}
          style={{
            backgroundColor: theme.colors.primary,
            paddingVertical: theme.spacing(1.75),
            borderRadius: theme.radii.lg,
            alignItems: 'center',
            shadowColor: theme.colors.glow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.32,
            shadowRadius: 14,
            elevation: 4,
          }}
        >
          <Text
            style={{
              color: theme.colors.background,
              fontFamily: 'Inter_600SemiBold',
            }}
          >
            Archive Reflection
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
};
