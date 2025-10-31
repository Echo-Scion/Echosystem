import { AppTheme, ThemeMode, AppearanceMode } from './types';

const NAVY = '#0C0F18';
const VIOLET = '#A394F7';
const AMBER = '#FFD26F';
const DEEP_SPACE = '#05070D';
const ORCHID = '#C4BAFF';
const AURORA = '#5F8CFF';
const MIST = '#EEF2FF';
const spacingScale = (factor = 1) => 8 * factor;

const typography = {
  display: { fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
  title: { fontSize: 28, lineHeight: 34, letterSpacing: -0.3 },
  heading: { fontSize: 20, lineHeight: 26, letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 22, letterSpacing: 0.2 },
  small: { fontSize: 13, lineHeight: 18, letterSpacing: 0.2 },
  micro: { fontSize: 11, lineHeight: 14, letterSpacing: 0.4 },
};

const shared = {
  typography,
  spacing: spacingScale,
  radii: {
    xs: 6,
    sm: 10,
    md: 18,
    lg: 24,
    xl: 32,
  },
  transitions: {
    duration: 1200,
    easing: 'ease-in-out',
  },
};

const palettes = {
  normal: {
    dark: {
      background: NAVY,
      surface: '#111524',
      surfaceAlt: '#161B2D',
      overlay: 'rgba(10, 12, 20, 0.82)',
      primary: VIOLET,
      secondary: AMBER,
      accent: '#59C9A5',
      success: '#6AD29A',
      caution: '#FFB86C',
      danger: '#FF6F6F',
      text: '#F2F4FF',
      textMuted: '#8F96B8',
      border: '#20263C',
      glow: '#A394F7',
      gradients: {
        aurora: [NAVY, '#141A2E', '#262E54'],
        resonance: ['rgba(163, 148, 247, 0.36)', 'rgba(255, 210, 111, 0.22)'],
        card: ['#131829', '#111524'],
      },
    },
    light: {
      background: '#F5F5FF',
      surface: '#FFFFFF',
      surfaceAlt: '#EEF0FF',
      overlay: 'rgba(245, 245, 255, 0.82)',
      primary: '#6050FF',
      secondary: '#FFBC5B',
      accent: '#3AAE88',
      success: '#49C193',
      caution: '#FFB86C',
      danger: '#FF6F6F',
      text: '#0C0F18',
      textMuted: '#3E4361',
      border: '#D7DAF5',
      glow: '#8D82FF',
      gradients: {
        aurora: ['#F8F8FF', '#E8ECFF', '#D2D9FF'],
        resonance: ['rgba(141, 130, 255, 0.35)', 'rgba(255, 188, 91, 0.28)'],
        card: ['#FFFFFF', '#EEF0FF'],
      },
    },
  },
  lore: {
    dark: {
      background: DEEP_SPACE,
      surface: '#0E1220',
      surfaceAlt: '#141932',
      overlay: 'rgba(5, 8, 16, 0.74)',
      primary: ORCHID,
      secondary: AMBER,
      accent: '#7CE3FF',
      success: '#7CE3FF',
      caution: '#FFC860',
      danger: '#FF8A8A',
      text: '#F7F7FF',
      textMuted: '#C4C8FF',
      border: '#262C45',
      glow: '#FFD26F',
      gradients: {
        aurora: ['#1C2238', '#282E52', '#3C4C7A'],
        resonance: ['rgba(255, 210, 111, 0.55)', 'rgba(124, 227, 255, 0.28)'],
        card: ['rgba(16, 21, 42, 0.83)', 'rgba(10, 15, 30, 0.92)'],
      },
    },
    light: {
      background: '#FFF9EB',
      surface: '#FFF4D6',
      surfaceAlt: '#FDEDD0',
      overlay: 'rgba(255, 244, 214, 0.82)',
      primary: '#CABDFF',
      secondary: '#FFCF73',
      accent: '#6BD5EB',
      success: '#6BD5EB',
      caution: '#F7A94C',
      danger: '#FF7A7A',
      text: '#2C1E33',
      textMuted: '#5B4A63',
      border: '#E8D7B2',
      glow: '#FFCF73',
      gradients: {
        aurora: ['#FFF0D5', '#FFE5C0', '#F8D7B6'],
        resonance: ['rgba(255, 207, 115, 0.6)', 'rgba(203, 189, 255, 0.32)'],
        card: ['rgba(255, 244, 214, 0.95)', 'rgba(249, 229, 194, 0.88)'],
      },
    },
  },
} as const;

const shadowSets = {
  dark: {
    soft: {
      color: '#000000',
      offset: { width: 0, height: 4 },
      opacity: 0.2,
      radius: 12,
      elevation: 6,
    },
    medium: {
      color: '#000000',
      offset: { width: 0, height: 8 },
      opacity: 0.26,
      radius: 18,
      elevation: 12,
    },
    intense: {
      color: '#000000',
      offset: { width: 0, height: 16 },
      opacity: 0.35,
      radius: 28,
      elevation: 20,
    },
  },
  darkLore: {
    soft: {
      color: '#FFE9C0',
      offset: { width: 0, height: 4 },
      opacity: 0.35,
      radius: 18,
      elevation: 8,
    },
    medium: {
      color: '#B99BFF',
      offset: { width: 0, height: 10 },
      opacity: 0.4,
      radius: 28,
      elevation: 16,
    },
    intense: {
      color: '#FFD26F',
      offset: { width: 0, height: 18 },
      opacity: 0.5,
      radius: 40,
      elevation: 24,
    },
  },
  light: {
    soft: {
      color: '#D8DCFF',
      offset: { width: 0, height: 4 },
      opacity: 0.45,
      radius: 12,
      elevation: 4,
    },
    medium: {
      color: '#C4CAFF',
      offset: { width: 0, height: 8 },
      opacity: 0.35,
      radius: 18,
      elevation: 6,
    },
    intense: {
      color: '#B3B8FF',
      offset: { width: 0, height: 12 },
      opacity: 0.28,
      radius: 26,
      elevation: 8,
    },
  },
  lightLore: {
    soft: {
      color: '#FFE8C0',
      offset: { width: 0, height: 4 },
      opacity: 0.4,
      radius: 16,
      elevation: 4,
    },
    medium: {
      color: '#E7CFFF',
      offset: { width: 0, height: 8 },
      opacity: 0.35,
      radius: 24,
      elevation: 6,
    },
    intense: {
      color: '#FFC970',
      offset: { width: 0, height: 12 },
      opacity: 0.32,
      radius: 32,
      elevation: 8,
    },
  },
} as const;

const pickShadows = (mode: ThemeMode, appearance: AppearanceMode) => {
  if (appearance === 'dark') {
    return mode === 'lore' ? shadowSets.darkLore : shadowSets.dark;
  }
  return mode === 'lore' ? shadowSets.lightLore : shadowSets.light;
};

export const getTheme = (mode: ThemeMode, appearance: AppearanceMode): AppTheme => {
  const palette = palettes[mode][appearance];
  return {
    mode,
    appearance,
    colors: {
      background: palette.background,
      surface: palette.surface,
      surfaceAlt: palette.surfaceAlt,
      overlay: palette.overlay,
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      success: palette.success,
      caution: palette.caution,
      danger: palette.danger,
      text: palette.text,
      textMuted: palette.textMuted,
      border: palette.border,
      glow: palette.glow,
    },
    gradients: palette.gradients,
    shadows: pickShadows(mode, appearance),
    ...shared,
  };
};

export const modes: ThemeMode[] = ['normal', 'lore'];
