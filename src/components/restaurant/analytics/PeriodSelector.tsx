import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { Typography, Label } from '@/src/components/common/Typography';

export type AnalyticsPeriodOption = 'today' | 'yesterday' | '7days' | '30days';

interface PeriodOption {
  key: AnalyticsPeriodOption;
  label: string;
}

interface PeriodSelectorProps {
  selectedPeriod: AnalyticsPeriodOption;
  onPeriodChange: (period: AnalyticsPeriodOption) => void;
  periods: PeriodOption[];
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  periods,
}) => {
  const { colors } = useTheme();

  const handlePeriodPress = async (period: AnalyticsPeriodOption) => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
    }
    onPeriodChange(period);
  };

  if (!periods || periods.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
    >
      {periods.map((period) => (
        <TouchableOpacity
          key={period.key}
          onPress={() => handlePeriodPress(period.key)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor:
              selectedPeriod === period.key ? '#007aff' : colors.surfaceVariant,
            borderRadius: 20,
            marginRight: 8,
          }}
          accessibilityRole="button"
          accessibilityLabel={`Select ${period.label} period`}
          accessibilityState={{ selected: selectedPeriod === period.key }}
        >
          <Label
            color={
              selectedPeriod === period.key ? 'white' : colors.onSurfaceVariant
            }
            weight="semibold"
          >
            {period.label}
          </Label>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default PeriodSelector;
