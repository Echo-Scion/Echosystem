import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useAccessControl } from '../hooks/useAccessControl';

type BuyPassModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const BuyPassModal = ({ visible, onClose }: BuyPassModalProps) => {
  const theme = useAppTheme();
  const {
    gold,
    coins,
    convertGoldToCoins,
    goldToCoinRate,
    gamerPassPrice,
    flowPassPrice,
    buyGamerPass,
    buyFlowPass,
  } = useAccessControl();
  const [message, setMessage] = useState<string | null>(null);

  const handleConvert = () => {
    const convertible = Math.floor(gold / goldToCoinRate) * goldToCoinRate;
    if (convertible <= 0) {
      setMessage(`Need ${goldToCoinRate} gold to convert.`);
      return;
    }
    const coinsReceived = convertible / goldToCoinRate;
    const success = convertGoldToCoins(convertible);
    setMessage(success ? `Converted ${convertible} gold into ${coinsReceived} coins.` : 'Conversion failed.');
  };

  const handleBuyGamer = () => {
    const success = buyGamerPass();
    setMessage(success ? 'Gamer Pass activated.' : 'Not enough coins for Gamer Pass.');
    if (success) onClose();
  };

  const handleBuyFlow = () => {
    const success = buyFlowPass();
    setMessage(success ? 'Flow Pass activated.' : 'Not enough coins for Flow Pass.');
    if (success) onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}> 
          <Text style={[styles.title, { color: theme.colors.text }]}>Upgrade Pass</Text>
          <Text style={{ color: theme.colors.textMuted, fontFamily: 'Inter_400Regular' }}>
            Gold: {gold} · Coins: {coins.toFixed(2)}
          </Text>
          <Pressable style={[styles.button, { backgroundColor: theme.colors.surfaceAlt }]} onPress={handleConvert}>
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>Convert Gold → Coins ({goldToCoinRate}:1)</Text>
          </Pressable>
          <Pressable style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleBuyGamer}>
            <Text style={[styles.buttonText, { color: theme.colors.background }]}>Buy Gamer Pass (−{gamerPassPrice})</Text>
          </Pressable>
          <Pressable style={[styles.button, { backgroundColor: theme.colors.secondary }]} onPress={handleBuyFlow}>
            <Text style={[styles.buttonText, { color: theme.colors.background }]}>Buy Flow Pass (−{flowPassPrice})</Text>
          </Pressable>
          {message && (
            <Text style={{ color: theme.colors.textMuted, marginTop: 12 }}>{message}</Text>
          )}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.buttonText, { color: theme.colors.textMuted }]}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
  title: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 24,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
  },
  closeButton: {
    marginTop: 8,
    alignItems: 'center',
  },
});
