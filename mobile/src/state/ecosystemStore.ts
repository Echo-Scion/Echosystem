import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import uuid from 'react-native-uuid';
import { asyncStoragePersist, setStorageNamespace } from '../utils/persist';
import { useThemeStore } from './themeStore';

const GOLD_DAILY_REWARD = 5;
const GOLD_TO_COINS_RATE = 10; // 10 gold -> 1 coin
const GAMER_PASS_COST = 120;
const FLOW_PASS_COST = 220;

const namespaceForPass = (pass: PassType) => (pass === 'guest' ? 'guest' : 'account');

setStorageNamespace(namespaceForPass('guest'));

export const GOLD_TO_COIN_RATE = GOLD_TO_COINS_RATE;
export const GAMER_PASS_PRICE = GAMER_PASS_COST;
export const FLOW_PASS_PRICE = FLOW_PASS_COST;

export type JournalMood = 'clear' | 'charged' | 'drifting';

export type JournalEntry = {
  id: string;
  title: string;
  mood: JournalMood;
  body: string;
  resonanceDelta: number;
  createdAt: string;
  linkedModules: Array<'quotes' | 'tasks' | 'habits' | 'faith' | 'creation'>;
};

export type Quote = {
  id: string;
  text: string;
  author: string;
  tags: string[];
  resonanceDelta: number;
  lastResonatedAt?: string;
};

export type Task = {
  id: string;
  title: string;
  resonanceDelta: number;
  completed: boolean;
  scheduledFor?: string;
  linkedHabitId?: string;
  completedAt?: string;
};

export type Habit = {
  id: string;
  name: string;
  description: string;
  cadence: 'daily' | 'weekly';
  streak: number;
  longestStreak: number;
  lastCompletedOn?: string;
  resonanceDelta: number;
};

export type FaithPractice = {
  id: string;
  title: string;
  description: string;
  lastCompletedOn?: string;
  resonanceDelta: number;
};

export type CreativeWork = {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  progress: number;
  resonanceDelta: number;
};

export type ResonanceLog = {
  id: string;
  delta: number;
  module: string;
  note: string;
  createdAt: string;
};

export type PassType = 'guest' | 'account' | 'gamer' | 'flow';

export type AuthState = {
  isAuthenticated: boolean;
  isGuest: boolean;
  passType: PassType;
  coins: number;
  gold: number;
  lastLogin?: string;
  streakCount: number;
  passExpiresAt?: string;
  email?: string;
};

const makeId = () => String(uuid.v4());

const signedOutAuth: AuthState = {
  isAuthenticated: false,
  isGuest: false,
  passType: 'guest',
  coins: 0,
  gold: 0,
  streakCount: 0,
};

type EcosystemState = {
  onboarded: boolean;
  auth: AuthState;
  journalEntries: JournalEntry[];
  quotes: Quote[];
  tasks: Task[];
  habits: Habit[];
  faithPractices: FaithPractice[];
  creativeWorks: CreativeWork[];
  resonanceLog: ResonanceLog[];
};

type EcosystemActions = {
  setOnboarded: (value: boolean) => void;
  signInWithEmail: (email: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
  setPassType: (passType: PassType, options?: { topUpCoins?: number }) => void;
  addCoins: (amount: number) => void;
  addGold: (amount: number) => void;
  convertGoldToCoins: (goldAmount: number) => boolean;
  redeemDailyGold: () => void;
  buyGamerPass: () => boolean;
  buyFlowPass: () => boolean;
  spendCoins: (amount: number) => boolean;
  addJournalEntry: (
    payload: Omit<JournalEntry, 'id' | 'createdAt' | 'resonanceDelta'> & {
      resonanceDelta?: number;
    },
  ) => void;
  addTask: (title: string, scheduledFor?: string) => void;
  resonateWithQuote: (id: string) => void;
  toggleTask: (id: string) => void;
  logHabitCheckIn: (id: string) => void;
  acknowledgeFaithPractice: (id: string) => void;
  advanceCreativeWork: (id: string, progress?: number) => void;
  reset: () => void;
};

const initialState: EcosystemState = {
  onboarded: false,
  auth: { ...signedOutAuth },
  journalEntries: [
    {
      id: makeId(),
      title: 'Dawn Resonance',
      mood: 'clear',
      body: 'Woke before sunrise. Breath felt like low tide. Intention: listen, not rush.',
      resonanceDelta: 0.05,
      createdAt: new Date().toISOString(),
      linkedModules: ['habits', 'quotes'],
    },
  ],
  quotes: [
    {
      id: makeId(),
      text: 'The quieter you become, the more you are able to hear.',
      author: 'Rumi',
      tags: ['presence', 'clarity'],
      resonanceDelta: 0.04,
    },
    {
      id: makeId(),
      text: 'Discipline is the bridge between goals and accomplishment.',
      author: 'Jim Rohn',
      tags: ['habits', 'tasks'],
      resonanceDelta: 0.03,
    },
  ],
  tasks: [
    {
      id: makeId(),
      title: 'Write resonance reflection',
      resonanceDelta: 0.03,
      completed: false,
    },
    {
      id: makeId(),
      title: 'Evening gratitude entry',
      resonanceDelta: 0.02,
      completed: false,
      linkedHabitId: 'habit-evening-gratitude',
    },
  ],
  habits: [
    {
      id: 'habit-dawn-breath',
      name: 'Dawn Breath',
      description: 'Three minutes of intentional breathing before screens.',
      cadence: 'daily',
      streak: 4,
      longestStreak: 12,
      lastCompletedOn: new Date().toISOString(),
      resonanceDelta: 0.02,
    },
    {
      id: 'habit-evening-gratitude',
      name: 'Evening Gratitude',
      description: 'Log three luminous moments before rest.',
      cadence: 'daily',
      streak: 2,
      longestStreak: 10,
      resonanceDelta: 0.025,
    },
  ],
  faithPractices: [
    {
      id: makeId(),
      title: 'Morning Psalm',
      description: 'Recite a psalm and note one guiding line.',
      resonanceDelta: 0.03,
    },
  ],
  creativeWorks: [
    {
      id: makeId(),
      title: 'The Myth of Returning Home',
      author: 'Aria Suleiman',
      excerpt:
        'We return not to the place, but to the echo that first called us to move.',
      progress: 0.4,
      resonanceDelta: 0.05,
    },
  ],
  resonanceLog: [],
};

const logResonance = (delta: number, module: string, note: string): ResonanceLog => ({
  id: makeId(),
  delta,
  module,
  note,
  createdAt: new Date().toISOString(),
});

const pulseResonance = (delta: number, module: string, note: string) => {
  const { gentlyShiftResonance } = useThemeStore.getState();
  gentlyShiftResonance(delta);
  return logResonance(delta, module, note);
};

export const useEcosystemStore = create<EcosystemState & EcosystemActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setOnboarded: (value) => set({ onboarded: value }),
      signInWithEmail: (email) => {
        setStorageNamespace(namespaceForPass('account'));
        set((state) => {
          const entry = pulseResonance(0.04, 'account', `Signed in as ${email}`);
          return {
            auth: {
              ...state.auth,
              isAuthenticated: true,
              isGuest: false,
              email,
              passType: 'account',
              coins: state.auth.passType === 'account' ? state.auth.coins : 0,
              gold: state.auth.gold,
              streakCount: state.auth.streakCount,
              lastLogin: new Date().toISOString(),
            },
            onboarded: true,
            resonanceLog: [entry, ...state.resonanceLog],
          };
        });
      },
      continueAsGuest: () => {
        setStorageNamespace(namespaceForPass('guest'));
        set((state) => {
          const entry = pulseResonance(0.02, 'account', 'Continuing as guest');
          return {
            auth: {
              ...signedOutAuth,
              isAuthenticated: true,
              isGuest: true,
              passType: 'guest',
            },
            onboarded: true,
            resonanceLog: [entry, ...state.resonanceLog],
          };
        });
      },
      logout: () => {
        setStorageNamespace(namespaceForPass('guest'));
        set((state) => {
          const entry = pulseResonance(-0.02, 'account', 'Signed out');
          return {
            auth: { ...signedOutAuth },
            resonanceLog: [entry, ...state.resonanceLog],
          };
        });
      },
      setPassType: (passType, options) => {
        setStorageNamespace(namespaceForPass(passType));
        set((state) => {
          const baseCoins =
            options?.topUpCoins !== undefined
              ? Math.max(options.topUpCoins, 0)
              : state.auth.coins;
          return {
            auth: {
              ...state.auth,
              passType,
              isGuest: passType === 'guest',
              coins: passType === 'guest' ? 0 : baseCoins,
              gold: passType === 'guest' ? 0 : state.auth.gold,
            },
          };
        });
      },
      addCoins: (amount) => {
        if (amount <= 0) return;
        set((state) => ({
          auth: {
            ...state.auth,
            coins: Number((state.auth.coins + amount).toFixed(2)),
          },
        }));
      },
      addGold: (amount) => {
        if (amount <= 0) return;
        set((state) => ({
          auth: {
            ...state.auth,
            gold: state.auth.gold + Math.round(amount),
          },
        }));
      },
      convertGoldToCoins: (goldAmount) => {
        const amount = Math.floor(goldAmount);
        if (amount <= 0) return false;
        const { auth } = get();
        if (auth.gold < amount) return false;
        const coinsEarned = Number((amount / GOLD_TO_COINS_RATE).toFixed(2));
        set({
          auth: {
            ...auth,
            gold: auth.gold - amount,
            coins: Number((auth.coins + coinsEarned).toFixed(2)),
          },
        });
        return true;
      },
      redeemDailyGold: () => {
        const today = new Date().toISOString().slice(0, 10);
        const { auth } = get();
        if (auth.lastLogin && auth.lastLogin.slice(0, 10) === today) {
          return;
        }
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        const streak = auth.lastLogin && auth.lastLogin.slice(0, 10) === yesterday ? auth.streakCount + 1 : 1;
        set({
          auth: {
            ...auth,
            gold: auth.gold + GOLD_DAILY_REWARD,
            lastLogin: new Date().toISOString(),
            streakCount: streak,
          },
        });
      },
      buyGamerPass: () => {
        const { auth } = get();
        if (auth.coins < GAMER_PASS_COST) return false;
        set({
          auth: {
            ...auth,
            coins: Number((auth.coins - GAMER_PASS_COST).toFixed(2)),
            passType: 'gamer',
            isGuest: false,
            passExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        });
        setStorageNamespace(namespaceForPass('gamer'));
        return true;
      },
      buyFlowPass: () => {
        const { auth } = get();
        if (auth.coins < FLOW_PASS_COST) return false;
        set({
          auth: {
            ...auth,
            coins: Number((auth.coins - FLOW_PASS_COST).toFixed(2)),
            passType: 'flow',
            isGuest: false,
            passExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        });
        setStorageNamespace(namespaceForPass('flow'));
        return true;
      },
      spendCoins: (amount) => {
        const cost = Math.max(0, amount);
        const { auth } = get();
        if (cost === 0) return true;
        if (auth.coins < cost) {
          return false;
        }
        set({
          auth: {
            ...auth,
            coins: Number((auth.coins - cost).toFixed(2)),
          },
        });
        return true;
      },
      addJournalEntry: ({ resonanceDelta = 0.03, ...payload }) => {
        const entry: JournalEntry = {
          id: makeId(),
          createdAt: new Date().toISOString(),
          resonanceDelta,
          ...payload,
        };
        set((state) => ({
          journalEntries: [entry, ...state.journalEntries],
          quotes:
            state.auth.passType === 'guest'
              ? state.quotes
              : [
                  {
                    id: makeId(),
                    text:
                      payload.body.length > 140
                        ? `${payload.body.slice(0, 140)}…`
                        : payload.body,
                    author: payload.title || 'Luminote',
                    tags: ['luminote', payload.mood],
                    resonanceDelta: Math.max(0.02, resonanceDelta / 2),
                    lastResonatedAt: new Date().toISOString(),
                  },
                  ...state.quotes,
                ],
          resonanceLog: [
            pulseResonance(resonanceDelta, 'journal', `Entry: ${payload.title}`),
            ...state.resonanceLog,
          ],
        }));
      },
      addTask: (title, scheduledFor) => {
        const delta = 0.025;
        const task: Task = {
          id: makeId(),
          title,
          scheduledFor,
          completed: false,
          completedAt: undefined,
          resonanceDelta: delta,
        };
        set((state) => ({
          tasks: [task, ...state.tasks],
          resonanceLog: [
            pulseResonance(delta / 3, 'tasks', `Planned: ${title}`),
            ...state.resonanceLog,
          ],
        }));
      },
      resonateWithQuote: (id) => {
        const { quotes } = get();
        const quote = quotes.find((item) => item.id === id);
        if (!quote) return;

        const delta = quote.resonanceDelta ?? 0.02;
        set((state) => ({
          quotes: state.quotes.map((item) =>
            item.id === id ? { ...item, lastResonatedAt: new Date().toISOString() } : item,
          ),
          resonanceLog: [
            pulseResonance(delta, 'quotes', `Quote: ${quote.text.slice(0, 32)}…`),
            ...state.resonanceLog,
          ],
        }));
      },
      toggleTask: (id) => {
        set((state) => {
          const task = state.tasks.find((item) => item.id === id);
          if (!task) return state;
          const updated = !task.completed;
          const timestamp = updated ? new Date().toISOString() : undefined;
          const delta = updated ? task.resonanceDelta : -task.resonanceDelta / 2;
          const resonanceEntry = pulseResonance(
            delta,
            'tasks',
            `${updated ? 'Completed' : 'Reopened'}: ${task.title}`,
          );
          return {
            tasks: state.tasks.map((item) =>
              item.id === id
                ? { ...item, completed: updated, completedAt: timestamp }
                : item,
            ),
            resonanceLog: [resonanceEntry, ...state.resonanceLog],
          };
        });
      },
      logHabitCheckIn: (id) => {
        set((state) => {
          const habit = state.habits.find((item) => item.id === id);
          if (!habit) return state;
          const updatedStreak = habit.lastCompletedOn
            ? habit.streak + 1
            : Math.max(1, habit.streak + 1);
          const delta = habit.resonanceDelta;
          const resonanceEntry = pulseResonance(
            delta,
            'habits',
            `Habit check-in: ${habit.name}`,
          );
          return {
            habits: state.habits.map((item) =>
              item.id === id
                ? {
                    ...item,
                    streak: updatedStreak,
                    longestStreak: Math.max(updatedStreak, item.longestStreak),
                    lastCompletedOn: new Date().toISOString(),
                  }
                : item,
            ),
            resonanceLog: [resonanceEntry, ...state.resonanceLog],
          };
        });
      },
      acknowledgeFaithPractice: (id) => {
        set((state) => {
          const practice = state.faithPractices.find((item) => item.id === id);
          if (!practice) return state;
          const delta = practice.resonanceDelta;
          const resonanceEntry = pulseResonance(
            delta,
            'faith',
            `Faith practice: ${practice.title}`,
          );
          const updatedQuotes =
            state.auth.passType === 'guest'
              ? state.quotes
              : [
                  {
                    id: makeId(),
                    text: practice.description,
                    author: practice.title,
                    tags: ['ekklesion', 'prayer'],
                    resonanceDelta: Math.max(0.02, delta / 2),
                    lastResonatedAt: new Date().toISOString(),
                  },
                  ...state.quotes,
                ];
          return {
            faithPractices: state.faithPractices.map((item) =>
              item.id === id
                ? { ...item, lastCompletedOn: new Date().toISOString() }
                : item,
            ),
            quotes: updatedQuotes,
            resonanceLog: [resonanceEntry, ...state.resonanceLog],
          };
        });
      },
      advanceCreativeWork: (id, progress = 0.1) => {
        set((state) => {
          const work = state.creativeWorks.find((item) => item.id === id);
          if (!work) return state;
          const newProgress = Math.min(1, work.progress + progress);
          const delta = work.resonanceDelta * progress;
          const resonanceEntry = pulseResonance(
            delta,
            'creation',
            `Creative reading: ${work.title}`,
          );
          return {
            creativeWorks: state.creativeWorks.map((item) =>
              item.id === id ? { ...item, progress: newProgress } : item,
            ),
            resonanceLog: [resonanceEntry, ...state.resonanceLog],
          };
        });
      },
      reset: () => {
        setStorageNamespace(namespaceForPass('guest'));
        set({ ...initialState });
      },
    }),
    {
      name: 'echosystem-state',
      version: 3,
      storage: asyncStoragePersist,
    },
  ),
);

export const useOnboardingComplete = () => useEcosystemStore((state) => state.onboarded);
export const useAuthState = () => useEcosystemStore((state) => state.auth);
export const usePassType = () => useEcosystemStore((state) => state.auth.passType);
export const useCoins = () => useEcosystemStore((state) => state.auth.coins);
export const useGold = () => useEcosystemStore((state) => state.auth.gold);
