import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { isNetworkError, isAuthError, isServerError, isValidationError, ApiError } from '@/src/utils/errorHandler';

interface ErrorDisplayProps {
  error: ApiError | Error | any;
  onRetry?: () => void;
  onLogin?: () => void;
  style?: ViewStyle;
  showIcon?: boolean;
  compact?: boolean;
  testID?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onLogin,
  style,
  showIcon = true,
  compact = false,
  testID = 'error-display',
}) => {
  const { colors } = useTheme();

  // Safely extract error information
  const getErrorInfo = () => {
    if (!error) {
      return {
        message: 'An unknown error occurred',
        icon: 'alert-circle' as const,
        type: 'unknown' as const,
      };
    }

    // Handle different error types
    let message: string;
    let icon: keyof typeof Ionicons.glyphMap;
    let type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';

    if (isNetworkError(error)) {
      message = error?.message || 'Network connection failed';
      icon = 'wifi-off';
      type = 'network';
    } else if (isAuthError(error)) {
      message = error?.message || 'Authentication required';
      icon = 'lock-closed';
      type = 'auth';
    } else if (isValidationError(error)) {
      message = error?.message || 'Invalid data provided';
      icon = 'warning';
      type = 'validation';
    } else if (isServerError(error)) {
      message = error?.message || 'Server error occurred';
      icon = 'server';
      type = 'server';
    } else {
      message = error?.message || error?.toString() || 'Something went wrong';
      icon = 'alert-circle';
      type = 'unknown';
    }

    return { message, icon, type };
  };

  const { message, icon, type } = getErrorInfo();
  
  const showLoginButton = type === 'auth' && onLogin;
  const showRetryButton = onRetry && type !== 'auth';

  const styles = StyleSheet.create({
    container: {
      padding: compact ? 16 : 20,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: compact ? 120 : 200,
    },
    icon: {
      marginBottom: compact ? 8 : 16,
    },
    message: {
      fontSize: compact ? 14 : 16,
      color: colors.onSurface,
      textAlign: 'center',
      marginBottom: compact ? 12 : 20,
      lineHeight: compact ? 20 : 24,
      paddingHorizontal: 16,
    },
    buttonContainer: {
      flexDirection: compact ? 'row' : 'column',
      alignItems: 'center',
      gap: 8,
    },
    button: {
      marginHorizontal: compact ? 4 : 0,
      marginVertical: compact ? 0 : 4,
      minWidth: compact ? 80 : 120,
    },
  });

  // Don't render anything if no error
  if (!error) {
    return null;
  }

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="alert"
      accessibilityLabel={`Error: ${message}`}
    >
      {showIcon && (
        <Ionicons
          name={icon}
          size={compact ? 32 : 48}
          color={colors.error}
          style={styles.icon}
          testID={`${testID}-icon`}
        />
      )}
      
      <Text
        style={styles.message}
        numberOfLines={compact ? 2 : undefined}
        testID={`${testID}-message`}
      >
        {message}
      </Text>

      <View style={styles.buttonContainer}>
        {showLoginButton && (
          <Button
            mode="contained"
            onPress={onLogin}
            style={styles.button}
            testID={`${testID}-login-button`}
            accessibilityLabel="Log in to continue"
          >
            Log In
          </Button>
        )}

        {showRetryButton && (
          <Button
            mode={showLoginButton ? "outlined" : "contained"}
            onPress={onRetry}
            style={styles.button}
            testID={`${testID}-retry-button`}
            accessibilityLabel="Try again"
          >
            Try Again
          </Button>
        )}
      </View>
    </View>
  );
};

// Helper component for inline error display
export const InlineErrorDisplay: React.FC<{
  error: ApiError | Error | any;
  style?: ViewStyle;
  testID?: string;
}> = ({ error, style, testID = 'inline-error' }) => {
  const { colors } = useTheme();

  if (!error) return null;

  const message = error?.message || 'An error occurred';

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
          backgroundColor: colors.errorContainer,
          borderRadius: 4,
          marginVertical: 4,
        },
        style,
      ]}
      testID={testID}
    >
      <Ionicons
        name="alert-circle"
        size={16}
        color={colors.error}
        style={{ marginRight: 8 }}
      />
      <Text
        style={{
          color: colors.onErrorContainer,
          fontSize: 12,
          flex: 1,
        }}
        numberOfLines={2}
      >
        {message}
      </Text>
    </View>
  );
};

export default ErrorDisplay;
