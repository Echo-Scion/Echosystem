import { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'alt' | 'translucent';
  style?: StyleProp<ViewStyle>;
};

type Variant = NonNullable<Props['variant']>;

export const ThemedCard = ({ children, variant = 'primary', style }: Props) => {
  const theme = useAppTheme();

  const backgroundMap: Record<Variant, string> = {
    primary: theme.colors.surface,
    alt: theme.colors.surfaceAlt,
    translucent: theme.colors.overlay,
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: backgroundMap[variant] ?? theme.colors.surface,
          borderColor: theme.colors.border,
          shadowColor: theme.shadows.soft.color,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
});
