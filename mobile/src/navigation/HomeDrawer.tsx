import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme, useThemeActions, useActiveTabName } from '../hooks/useAppTheme';
import { MainTabs } from './MainTabs';
import { AccountInfoScreen } from '../screens/settings/AccountInfoScreen';
import { WeeklyReflectionScreen } from '../screens/settings/WeeklyReflectionScreen';
import { NotificationInputScreen } from '../screens/settings/NotificationInputScreen';
import { ThemeSettingsScreen } from '../screens/settings/ThemeSettingsScreen';
import { useAppearance, useIsLoreMode } from '../state/themeStore';
import { useEcosystemStore } from '../state/ecosystemStore';
import { useAccessControl } from '../hooks/useAccessControl';

export type HomeDrawerParamList = {
  HomeTabs: undefined;
  AccountInfo: undefined;
  WeeklyReflection: undefined;
  NotificationInput: undefined;
  ThemeSettings: undefined;
};

const Drawer = createDrawerNavigator<HomeDrawerParamList>();

const SettingsDrawerContent = (props: DrawerContentComponentProps) => {
  const theme = useAppTheme();
  const appearance = useAppearance();
  const isLoreMode = useIsLoreMode();
  const activeTab = useActiveTabName();
  const { toggleMode, toggleAppearance } = useThemeActions();
  const { logout, continueAsGuest, auth } = useEcosystemStore((state) => ({
    logout: state.logout,
    continueAsGuest: state.continueAsGuest,
    auth: state.auth,
  }));
  const { passType } = useAccessControl();

  const navigate = (route: keyof HomeDrawerParamList) => {
    props.navigation.navigate(route);
    props.navigation.closeDrawer();
  };

  const handleLogout = () => {
    logout();
    props.navigation.closeDrawer();
    const parent = props.navigation.getParent();
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'Auth' as never }],
    });
    parent?.dispatch(resetAction);
  };

  const handleGuest = () => {
    continueAsGuest();
    props.navigation.closeDrawer();
    props.navigation.navigate('HomeTabs');
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        padding: 24,
        backgroundColor: theme.colors.surface,
        flex: 1,
        gap: 24,
      }}
    >
      <View style={{ gap: 8 }}>
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: 'CormorantGaramond_600SemiBold',
            fontSize: 28,
          }}
        >
          Settings
        </Text>
        <Text
          style={{
            color: theme.colors.textMuted,
            fontFamily: 'Inter_400Regular',
          }}
        >
          Active: {activeTab} · Pass: {passType.toUpperCase()}
        </Text>
      </View>

      <View style={styles.group}>
        <DrawerLink label="Account Info" onPress={() => navigate('AccountInfo')} />
        <DrawerLink label="Weekly Reflection" onPress={() => navigate('WeeklyReflection')} />
        <DrawerLink
          label="Input by Notification"
          onPress={() => navigate('NotificationInput')}
        />
        <DrawerLink label="Theme" onPress={() => navigate('ThemeSettings')} />
      </View>

      <View style={styles.group}>
        <DrawerAction
          label={`Switch to ${appearance === 'dark' ? 'Light' : 'Dark'}`}
          onPress={toggleAppearance}
          tone="primary"
        />
        <DrawerAction
          label={`Toggle Lore Mode (${isLoreMode ? 'On' : 'Off'})`}
          onPress={toggleMode}
          tone="secondary"
        />
      </View>

      <View style={styles.group}>
        <DrawerAction
          label={auth.isGuest ? 'Switch to Signed Account' : 'Continue as Guest'}
          onPress={handleGuest}
          tone="ghost"
        />
        <DrawerAction label="Logout" onPress={handleLogout} tone="danger" />
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerLink = ({ label, onPress }: { label: string; onPress: () => void }) => {
  const theme = useAppTheme();
  return (
    <Pressable onPress={onPress} style={styles.linkRow}>
      <Text style={{ color: theme.colors.text, fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>
        {label}
      </Text>
    </Pressable>
  );
};

const DrawerAction = ({
  label,
  onPress,
  tone,
}: {
  label: string;
  onPress: () => void;
  tone: 'primary' | 'secondary' | 'danger' | 'ghost';
}) => {
  const theme = useAppTheme();
  const toneMap = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    danger: theme.colors.danger,
    ghost: theme.colors.surfaceAlt,
  } as const;

  const textColor = tone === 'ghost' ? theme.colors.text : theme.colors.background;

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 16,
        backgroundColor: toneMap[tone],
        paddingVertical: 12,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: textColor, fontFamily: 'Inter_600SemiBold' }}>{label}</Text>
    </Pressable>
  );
};

export const HomeDrawer = () => {
  const theme = useAppTheme();

  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerPosition: 'right',
        drawerStyle: {
          width: 300,
          backgroundColor: theme.colors.surface,
        },
      }}
      drawerContent={(props) => <SettingsDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeTabs" component={MainTabs} options={{ drawerLabel: () => null }} />
      <Drawer.Screen name="AccountInfo" component={AccountInfoScreen} />
      <Drawer.Screen name="WeeklyReflection" component={WeeklyReflectionScreen} />
      <Drawer.Screen name="NotificationInput" component={NotificationInputScreen} />
      <Drawer.Screen name="ThemeSettings" component={ThemeSettingsScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  linkRow: {
    paddingVertical: 12,
  },
});
