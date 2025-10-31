import { NavigationContainer, Theme as NavigationTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import * as Linking from 'expo-linking';
import { useAppTheme } from '../hooks/useAppTheme';
import { useAuthState, useOnboardingComplete } from '../state/ecosystemStore';
import { WelcomeScreen } from '../screens/welcome/WelcomeScreen';
import { AuthScreen } from '../screens/auth/AuthScreen';
import { HomeDrawer } from './HomeDrawer';

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Home: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Welcome: 'welcome',
      Auth: 'auth',
      Home: '',
    },
  },
};

export const RootNavigator = () => {
  const theme = useAppTheme();
  const onboarded = useOnboardingComplete();
  const auth = useAuthState();

  const navigationTheme: NavigationTheme = useMemo(
    () => ({
      dark: true,
      colors: {
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.secondary,
      },
    }),
    [theme],
  );

  const initialRoute = !onboarded ? 'Welcome' : auth.isAuthenticated ? 'Home' : 'Auth';

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <RootStack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <RootStack.Screen name="Welcome" component={WelcomeScreen} />
        <RootStack.Screen name="Auth" component={AuthScreen} />
        <RootStack.Screen name="Home" component={HomeDrawer} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
