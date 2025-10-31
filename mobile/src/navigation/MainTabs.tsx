import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppTheme, useThemeActions } from '../hooks/useAppTheme';
import { ResonantTabBar } from './ResonantTabBar';
import { LuminoteScreen } from '../screens/journal/JournalScreen';
import { VershineScreen } from '../screens/quotes/QuotesScreen';
import { NextraScreen } from '../screens/tasks/TasksScreen';
import { ResonaryScreen } from '../screens/habits/HabitsScreen';
import { EkklesionScreen } from '../screens/faith/FaithScreen';
import { StellareadScreen } from '../screens/creation/CreationScreen';

export type MainTabsParamList = {
  Luminote: undefined;
  Vershine: undefined;
  Nextra: undefined;
  Resonary: undefined;
  Ekklesion: undefined;
  Stellaread: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs = () => {
  const theme = useAppTheme();
  const { setActiveTab } = useThemeActions();

  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: theme.colors.background }}
      tabBar={(props) => <ResonantTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Luminote"
        component={LuminoteScreen}
        listeners={{ focus: () => setActiveTab('Luminote') }}
      />
      <Tab.Screen
        name="Vershine"
        component={VershineScreen}
        listeners={{ focus: () => setActiveTab('Vershine') }}
      />
      <Tab.Screen
        name="Nextra"
        component={NextraScreen}
        listeners={{ focus: () => setActiveTab('Nextra') }}
      />
      <Tab.Screen
        name="Resonary"
        component={ResonaryScreen}
        listeners={{ focus: () => setActiveTab('Resonary') }}
      />
      <Tab.Screen
        name="Ekklesion"
        component={EkklesionScreen}
        listeners={{ focus: () => setActiveTab('Ekklesion') }}
      />
      <Tab.Screen
        name="Stellaread"
        component={StellareadScreen}
        listeners={{ focus: () => setActiveTab('Stellaread') }}
      />
    </Tab.Navigator>
  );
};
