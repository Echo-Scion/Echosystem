export type ThemeMode = 'normal' | 'lore';
export type AppearanceMode = 'dark' | 'light';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  overlay: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  caution: string;
  danger: string;
  text: string;
  textMuted: string;
  border: string;
  glow: string;
};

export type TypographyScale = {
  display: { fontSize: number; lineHeight: number; letterSpacing: number };
  title: { fontSize: number; lineHeight: number; letterSpacing: number };
  heading: { fontSize: number; lineHeight: number; letterSpacing: number };
  body: { fontSize: number; lineHeight: number; letterSpacing: number };
  small: { fontSize: number; lineHeight: number; letterSpacing: number };
  micro: { fontSize: number; lineHeight: number; letterSpacing: number };
};

export type ThemeGradients = {
  aurora: string[];
  resonance: string[];
  card: string[];
};

export type ThemeShadow = {
  color: string;
  offset: { width: number; height: number };
  opacity: number;
  radius: number;
  elevation: number;
};

export type ThemeShadows = {
  soft: ThemeShadow;
  medium: ThemeShadow;
  intense: ThemeShadow;
};

export type AppTheme = {
  mode: ThemeMode;
  appearance: AppearanceMode;
  colors: ThemeColors;
  typography: TypographyScale;
  spacing: (factor?: number) => number;
  radii: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  gradients: ThemeGradients;
  shadows: ThemeShadows;
  transitions: {
    duration: number;
    easing: string;
  };
};
