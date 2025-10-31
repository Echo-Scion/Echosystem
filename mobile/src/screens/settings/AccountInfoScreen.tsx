import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { ModuleHeader } from '../../components/ModuleHeader';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useEcosystemStore } from '../../state/ecosystemStore';
import { useAccessControl } from '../../hooks/useAccessControl';
import { GoldCoinBalance } from '../../components/GoldCoinBalance';
import { PassStatus } from '../../components/PassStatus';
import { BuyPassModal } from '../../components/BuyPassModal';
import { ModeToggle } from '../../components/ModeToggle';

export const AccountInfoScreen = () => {
  const theme = useAppTheme();
  const auth = useEcosystemStore((state) => state.auth);
  const { addCoins } = useAccessControl();
  const [showBuyModal, setShowBuyModal] = useState(false);

  const handleGuestNotice = () => {
    if (auth.passType === 'guest') {
      Alert.alert('Offline Mode', 'Upgrade to Account to sync your progress.');
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing(12), gap: theme.spacing(3) }}
      >
        <ModuleHeader
          title="Account Info"
          subtitle="Manage your identity across the Echosystem."
          trailing={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <ModeToggle />
              <PassStatus />
            </View>
          }
        />

        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: theme.radii.lg,
            padding: theme.spacing(3),
            gap: theme.spacing(2),
          }}
        >
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: 'CormorantGaramond_600SemiBold',
              fontSize: 22,
            }}
          >
            Status
          </Text>
          <Text style={{ color: theme.colors.textMuted, fontFamily: 'Inter_500Medium' }}>
            {auth.isAuthenticated
              ? auth.isGuest
                ? 'Guest traveler'
                : `Signed in as ${auth.email ?? 'unknown'}`
              : 'Signed out'}
          </Text>
          <Text style={{ color: theme.colors.textMuted, fontFamily: 'Inter_400Regular' }}>
            Your cadence, coins, and pass tier live here. Upgrade to unlock automatic sync,
            AI reflections, and luminous visuals.
          </Text>
          <Text style={{ color: theme.colors.textMuted, fontFamily: 'Inter_400Regular' }}>
            Daily streak: {auth.streakCount}
          </Text>

          <GoldCoinBalance />

          <View style={{ flexDirection: 'row', gap: theme.spacing(2) }}>
            <Pressable
              onPress={() => {
                addGold(10);
                setShowBuyModal(true);
              }}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 16,
                backgroundColor: theme.colors.surfaceAlt,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: theme.colors.text, fontFamily: 'Inter_600SemiBold' }}>
                Convert & Upgrade
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                addCoins(25);
                handleGuestNotice();
              }}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 16,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: theme.colors.background, fontFamily: 'Inter_600SemiBold' }}>
                Add 25 Coins
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => setShowBuyModal(true)}
            style={{
              marginTop: theme.spacing(1),
              alignSelf: 'flex-start',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Text style={{ color: theme.colors.textMuted, fontFamily: 'Inter_500Medium' }}>
              Manage Passes
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <BuyPassModal visible={showBuyModal} onClose={() => setShowBuyModal(false)} />
    </ScreenContainer>
  );
};
