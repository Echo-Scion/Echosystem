import { act } from '@testing-library/react-native';
import { useEcosystemStore } from '../src/state/ecosystemStore';
import { useThemeStore } from '../src/state/themeStore';

describe('ecosystem store', () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: 'normal', resonance: 0.35 });
    act(() => {
      useEcosystemStore.getState().reset();
    });
  });

  it('adds a journal entry and logs resonance', () => {
    const initialLength = useEcosystemStore.getState().journalEntries.length;
    act(() => {
      useEcosystemStore.getState().addJournalEntry({
        title: 'Test Entry',
        body: 'Testing resonance logging.',
        mood: 'clear',
        linkedModules: ['quotes'],
      });
    });

    const { journalEntries, resonanceLog } = useEcosystemStore.getState();
    expect(journalEntries.length).toBe(initialLength + 1);
    expect(resonanceLog[0]?.module).toBe('journal');
  });

  it('toggles a task completion state', () => {
    const [task] = useEcosystemStore.getState().tasks;
    expect(task.completed).toBe(false);

    act(() => {
      useEcosystemStore.getState().toggleTask(task.id);
    });

    const updatedTask = useEcosystemStore
      .getState()
      .tasks.find((item) => item.id === task.id);
    expect(updatedTask?.completed).toBe(true);
    expect(updatedTask?.completedAt).toBeTruthy();
  });

  it('allows continuing as guest', () => {
    act(() => {
      useEcosystemStore.getState().continueAsGuest();
    });
    const auth = useEcosystemStore.getState().auth;
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.isGuest).toBe(true);
    expect(auth.passType).toBe('guest');
    expect(auth.coins).toBe(0);
    expect(auth.gold).toBe(0);
  });

  it('deducts coins when spending', () => {
    act(() => {
      useEcosystemStore.getState().signInWithEmail('demo@example.com');
      useEcosystemStore.getState().setPassType('gamer', { topUpCoins: 20 });
    });

    let success = false;
    act(() => {
      success = useEcosystemStore.getState().spendCoins(5);
    });

    expect(success).toBe(true);
    expect(useEcosystemStore.getState().auth.coins).toBe(15);
  });

  it('redeems daily gold only once per day', () => {
    act(() => {
      useEcosystemStore.getState().redeemDailyGold();
    });
    const afterFirst = useEcosystemStore.getState().auth.gold;
    expect(afterFirst).toBeGreaterThan(0);

    act(() => {
      useEcosystemStore.getState().redeemDailyGold();
    });

    expect(useEcosystemStore.getState().auth.gold).toBe(afterFirst);
  });

  it('converts gold into coins and buys a gamer pass', () => {
    act(() => {
      useEcosystemStore.getState().signInWithEmail('demo@example.com');
      useEcosystemStore.getState().setPassType('account', { topUpCoins: 0 });
      useEcosystemStore.getState().addGold(100);
      useEcosystemStore.getState().convertGoldToCoins(100);
      useEcosystemStore.getState().addCoins(200);
    });

    act(() => {
      const success = useEcosystemStore.getState().buyGamerPass();
      expect(success).toBe(true);
    });

    const auth = useEcosystemStore.getState().auth;
    expect(auth.passType).toBe('gamer');
    expect(auth.coins).toBeGreaterThanOrEqual(0);
  });
});
