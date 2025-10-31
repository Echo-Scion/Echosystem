import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ModuleHeader } from '../../components/ModuleHeader';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useEcosystemStore } from '../../state/ecosystemStore';

export const NotificationInputScreen = () => {
  const theme = useAppTheme();
  const addTask = useEcosystemStore((state) => state.addTask);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) return;
    addTask(message.trim());
    setMessage('');
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing(12), gap: theme.spacing(3) }}
      >
        <ModuleHeader
          title="Input by Notification"
          subtitle="Quickly capture ideas that arrive via reminders and prompts."
          trailing={null}
        />
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing(3),
            gap: theme.spacing(2),
          }}
        >
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 15,
            }}
          >
            Quick entry
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Describe the insight, task, or prayer."
            placeholderTextColor={theme.colors.textMuted}
            style={{
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surfaceAlt,
              padding: theme.spacing(2),
              color: theme.colors.text,
              fontFamily: 'Inter_500Medium',
            }}
          />
          <Pressable
            onPress={handleSubmit}
            style={{
              backgroundColor: theme.colors.secondary,
              paddingVertical: theme.spacing(1.5),
              borderRadius: theme.radii.md,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: theme.colors.background,
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              Capture
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};
