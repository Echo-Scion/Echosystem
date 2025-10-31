import { ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useAppTheme';
import { useAppearance } from '../state/themeStore';

type Props = {
  children: ReactNode;
};

export const AppProviders = ({ children }: Props) => {
  const theme = useAppTheme();
  const appearance = useAppearance();
  const statusBarStyle = appearance === 'light' ? 'dark' : 'light';

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <SafeAreaProvider>
        <StatusBar style={statusBarStyle} />
        {children}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
