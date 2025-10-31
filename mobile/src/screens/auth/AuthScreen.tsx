import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useAppTheme, useThemeActions } from '../../hooks/useAppTheme';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useEcosystemStore } from '../../state/ecosystemStore';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

type AuthFormValues = z.infer<typeof schema>;

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export const AuthScreen = ({ navigation }: Props) => {
  const theme = useAppTheme();
  const { gentlyShiftResonance } = useThemeActions();
  const { signInWithEmail, continueAsGuest } = useEcosystemStore((state) => ({
    signInWithEmail: state.signInWithEmail,
    continueAsGuest: state.continueAsGuest,
  }));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const handleLogin = (values: AuthFormValues) => {
    signInWithEmail(values.email.toLowerCase());
    gentlyShiftResonance(0.03);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const handleGuest = () => {
    continueAsGuest();
    gentlyShiftResonance(0.02);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const handleSocial = (provider: 'google' | 'apple') => {
    gentlyShiftResonance(0.01);
    // Placeholder: integrate Expo AuthSession in future iterations.
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingBottom: theme.spacing(8), gap: theme.spacing(4) }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: theme.spacing(4) }}>
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: 'CormorantGaramond_600SemiBold',
              fontSize: theme.typography.display.fontSize,
              marginBottom: theme.spacing(1.5),
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              color: theme.colors.textMuted,
              fontFamily: 'Inter_400Regular',
              fontSize: theme.typography.body.fontSize,
              lineHeight: theme.typography.body.lineHeight,
            }}
          >
            Sign in to sync your resonance across devices, or continue the journey as a
            guest traveler.
          </Text>
        </View>

        <View style={{ gap: theme.spacing(2) }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
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
            )}
          />
          {errors.email && (
            <Text style={{ color: theme.colors.danger, fontFamily: 'Inter_500Medium' }}>
              {errors.email.message}
            </Text>
          )}
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                secureTextEntry
                placeholder="Password"
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
            )}
          />
          {errors.password && (
            <Text style={{ color: theme.colors.danger, fontFamily: 'Inter_500Medium' }}>
              {errors.password.message}
            </Text>
          )}
          <Pressable
            onPress={handleSubmit(handleLogin)}
            style={{
              backgroundColor: theme.colors.primary,
              paddingVertical: theme.spacing(1.75),
              borderRadius: theme.radii.lg,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: theme.colors.background,
                fontFamily: 'Inter_600SemiBold',
                fontSize: 16,
              }}
            >
              Log In
            </Text>
          </Pressable>
        </View>

        <View style={{ gap: theme.spacing(2) }}>
          <Pressable
            onPress={() => handleSocial('google')}
            style={{
              borderRadius: theme.radii.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingVertical: theme.spacing(1.5),
              alignItems: 'center',
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text style={{ color: theme.colors.text, fontFamily: 'Inter_600SemiBold' }}>
              Continue with Google
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleSocial('apple')}
            style={{
              borderRadius: theme.radii.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingVertical: theme.spacing(1.5),
              alignItems: 'center',
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text style={{ color: theme.colors.text, fontFamily: 'Inter_600SemiBold' }}>
              Continue with Apple
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={handleGuest} style={{ alignItems: 'center' }}>
          <Text
            style={{
              color: theme.colors.secondary,
              fontFamily: 'Inter_600SemiBold',
              textDecorationLine: 'underline',
            }}
          >
            Continue as Guest
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
};
