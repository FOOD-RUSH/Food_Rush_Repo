import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  onRetry,
  retryText,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  const displayTitle = title || t('oops_something_went_wrong');
  const displayMessage = message || t('something_went_wrong');
  const displayRetryText = retryText || t('retry');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <MaterialIcons name="error-outline" size={64} color={colors.error} />
        <Text style={[styles.title, { color: colors.onSurface }]}>
          {displayTitle}
        </Text>
        <Text style={[styles.message, { color: colors.onSurfaceVariant }]}>
          {displayMessage}
        </Text>

        {onRetry && (
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={onRetry}
          >
            <Text style={[styles.retryButtonText, { color: colors.onPrimary }]}>
              {displayRetryText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorDisplay;
