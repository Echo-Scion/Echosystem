import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

type ScreenContainerProps = {
  children: ReactNode;
  spacing?: number;
};

export const ScreenContainer = ({ children, spacing = 3 }: ScreenContainerProps) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingHorizontal: theme.spacing(spacing),
          paddingTop: theme.spacing(3),
          paddingBottom: theme.spacing(2),
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
