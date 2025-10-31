import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppearanceMode, ThemeMode } from '../theme/types';
import { asyncStoragePersist } from '../utils/persist';

export type HomeModuleKey =
  | 'Luminote'
  | 'Vershine'
  | 'Nextra'
  | 'Resonary'
  | 'Ekklesion'
  | 'Stellaread';

type ThemeState = {
  mode: ThemeMode;
  appearance: AppearanceMode;
  resonance: number;
  activeTab: HomeModuleKey;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setAppearance: (appearance: AppearanceMode) => void;
  toggleAppearance: () => void;
  setResonance: (value: number) => void;
  gentlyShiftResonance: (delta: number) => void;
  setActiveTab: (tab: HomeModuleKey) => void;
};

const RESONANCE_MIN = 0.1;
const RESONANCE_MAX = 1;

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'normal',
      appearance: 'dark',
      resonance: 0.35,
      activeTab: 'Luminote',
      setMode: (mode) => set({ mode }),
      toggleMode: () => {
        const next: ThemeMode = get().mode === 'normal' ? 'lore' : 'normal';
        set({ mode: next });
      },
      setAppearance: (appearance) => set({ appearance }),
      toggleAppearance: () => {
        const next: AppearanceMode = get().appearance === 'dark' ? 'light' : 'dark';
        set({ appearance: next });
      },
      setResonance: (value) => {
        const clamped = Math.min(RESONANCE_MAX, Math.max(RESONANCE_MIN, value));
        set({ resonance: clamped });
      },
      gentlyShiftResonance: (delta) => {
        const { resonance } = get();
        const clamped = Math.min(
          RESONANCE_MAX,
          Math.max(RESONANCE_MIN, resonance + delta),
        );
        set({ resonance: Number(clamped.toFixed(2)) });
      },
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'echosystem-theme',
      version: 2,
      storage: asyncStoragePersist,
    },
  ),
);

export const useThemeMode = () => useThemeStore((state) => state.mode);
export const useAppearance = () => useThemeStore((state) => state.appearance);
export const useResonance = () => useThemeStore((state) => state.resonance);
export const useActiveTab = () => useThemeStore((state) => state.activeTab);
export const useIsLoreMode = () => useThemeStore((state) => state.mode === 'lore');
