import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { ModeToggle } from './ModeToggle';
import { SettingsButton } from './SettingsButton';

type Props = {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
};

export const ModuleHeader = ({ title, subtitle, trailing }: Props) => {
  const theme = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.textBlock}>
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: 'CormorantGaramond_600SemiBold',
            fontSize: theme.typography.title.fontSize,
            marginBottom: 6,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              color: theme.colors.textMuted,
              fontFamily: 'Inter_400Regular',
              fontSize: theme.typography.body.fontSize,
              lineHeight: theme.typography.body.lineHeight,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.trailing}>
        {trailing ?? (
          <View style={styles.trailingRow}>
            <ModeToggle />
            <SettingsButton />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  textBlock: {
    flex: 1,
    marginRight: 16,
  },
  trailing: {
    alignItems: 'flex-end',
  },
  trailingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
