import { useMemo } from 'react';
import {
  useEcosystemStore,
  usePassType,
  useCoins,
  useGold,
  PassType,
  GOLD_TO_COIN_RATE,
  GAMER_PASS_PRICE,
  FLOW_PASS_PRICE,
} from '../state/ecosystemStore';
import { shouldSyncWithSupabase } from '../lib/supabase';

const BASE_AI_COST = 10;

export type AIActionResult =
  | { ok: true; cost: number }
  | { ok: false; reason: 'pass_required' | 'insufficient_funds' };

const hasCloudAccess = (passType: PassType) => shouldSyncWithSupabase(passType);
const hasAIPrivileges = (passType: PassType) => passType === 'gamer' || passType === 'flow';

export const useAccessControl = () => {
  const passType = usePassType();
  const coins = useCoins();
  const gold = useGold();
  const spendCoins = useEcosystemStore((state) => state.spendCoins);
  const addCoins = useEcosystemStore((state) => state.addCoins);
  const addGold = useEcosystemStore((state) => state.addGold);
  const convertGoldToCoins = useEcosystemStore((state) => state.convertGoldToCoins);
  const redeemDailyGold = useEcosystemStore((state) => state.redeemDailyGold);
  const buyGamerPass = useEcosystemStore((state) => state.buyGamerPass);
  const buyFlowPass = useEcosystemStore((state) => state.buyFlowPass);

  const aiCost = useMemo(() => {
    if (passType === 'flow') {
      return BASE_AI_COST * 0.5;
    }
    if (passType === 'gamer') {
      return BASE_AI_COST;
    }
    return 0;
  }, [passType]);

  const requiredCost = (baseCost: number = BASE_AI_COST) =>
    passType === 'flow' ? baseCost * 0.5 : baseCost;

  const canUseAI = (_feature?: string, baseCost: number = BASE_AI_COST) => {
    if (!hasAIPrivileges(passType)) return false;
    const cost = requiredCost(baseCost);
    return coins >= cost;
  };

  const requestAIAction = (key: string, baseCost: number = BASE_AI_COST): AIActionResult => {
    if (!hasAIPrivileges(passType)) {
      return { ok: false, reason: 'pass_required' };
    }
    const cost = requiredCost(baseCost);
    const success = spendCoins(cost);
    if (!success) {
      return { ok: false, reason: 'insufficient_funds' };
    }
    return { ok: true, cost };
  };

  const capabilities = useMemo(() => {
    const flow = passType === 'flow';
    const gamer = passType === 'gamer';
    const account = passType === 'account';
    return {
      passType,
      coins,
      gold,
      canSyncCloud: hasCloudAccess(passType),
      canTriggerAI: hasAIPrivileges(passType),
      flowAutoAI: flow,
      gamerManualAI: gamer,
      accountAccess: account || gamer || flow,
      micForNarration: flow,
      micForTasks: gamer || flow,
      sunVisualization: gamer || flow,
      fireflyVisualization: account || gamer || flow,
    };
  }, [passType, coins, gold]);

  return {
    ...capabilities,
    aiCost,
    baseAICost: BASE_AI_COST,
    canUseAI,
    requestAIAction,
    addCoins,
    addGold,
    convertGoldToCoins,
    redeemDailyGold,
    buyGamerPass,
    buyFlowPass,
    goldToCoinRate: GOLD_TO_COIN_RATE,
    gamerPassPrice: GAMER_PASS_PRICE,
    flowPassPrice: FLOW_PASS_PRICE,
  };
};
