import { useMemo } from 'react';
import { getTheme } from '../theme';
import { AppTheme } from '../theme/types';
import {
  useAppearance,
  useThemeMode,
  useThemeStore,
  useActiveTab,
} from '../state/themeStore';

export const useAppTheme = (): AppTheme => {
  const mode = useThemeMode();
  const appearance = useAppearance();
  return useMemo(() => getTheme(mode, appearance), [mode, appearance]);
};

export const useThemeActions = () => {
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const setMode = useThemeStore((state) => state.setMode);
  const gentlyShiftResonance = useThemeStore((state) => state.gentlyShiftResonance);
  const toggleAppearance = useThemeStore((state) => state.toggleAppearance);
  const setAppearance = useThemeStore((state) => state.setAppearance);
  const setActiveTab = useThemeStore((state) => state.setActiveTab);
  return {
    toggleMode,
    setMode,
    gentlyShiftResonance,
    toggleAppearance,
    setAppearance,
    setActiveTab,
  };
};

export const useActiveTabName = () => useActiveTab();
