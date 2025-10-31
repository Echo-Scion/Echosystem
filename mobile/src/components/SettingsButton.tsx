import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

export const SettingsButton = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <Pressable onPress={handlePress} accessibilityLabel="Open settings drawer">
      <View
        style={[
          styles.button,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surfaceAlt,
          },
        ]}
      >
        <Feather name="settings" size={16} color={theme.colors.text} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
