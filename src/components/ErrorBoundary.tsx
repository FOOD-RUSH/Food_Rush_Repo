import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiError } from '../services/shared/apiClient';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            We&apos;re sorry for the inconvenience. Please try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Error Display Component
interface ErrorDisplayProps {
  error: ApiError | Error | null;
  onRetry?: () => void;
  onLogin?: () => void;
  compact?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onLogin,
  compact = false,
}) => {
  if (!error) return null;

  const isAuthError =
    (error as ApiError)?.code === 'SESSION_EXPIRED' ||
    (error as ApiError)?.status === 401;
  const isNetworkError = (error as ApiError)?.code === 'NETWORK_ERROR';

  const getErrorIcon = () => {
    if (isNetworkError) return 'wifi-off';
    if (isAuthError) return 'lock-closed';
    return 'alert-circle';
  };

  const message =
    (error as ApiError)?.message || error.message || 'Something went wrong';

  return (
    <View style={[styles.errorDisplay, compact && styles.errorDisplayCompact]}>
      <Ionicons
        name={getErrorIcon()}
        size={compact ? 24 : 32}
        color="#FF6B6B"
        style={styles.errorIcon}
      />
      <Text style={[styles.errorText, compact && styles.errorTextCompact]}>
        {message}
      </Text>

      <View style={styles.buttonContainer}>
        {isAuthError && onLogin && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={onLogin}
          >
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>
        )}

        {onRetry && !isAuthError && (
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={onRetry}
          >
            <Text style={styles.secondaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Inline Error Display
interface InlineErrorProps {
  error: ApiError | Error | null;
  style?: any;
}

export const InlineError: React.FC<InlineErrorProps> = ({ error, style }) => {
  if (!error) return null;

  const message =
    (error as ApiError)?.message || error.message || 'Error occurred';

  return (
    <View style={[styles.inlineError, style]}>
      <Ionicons name="alert-circle" size={14} color="#FF6B6B" />
      <Text style={styles.inlineErrorText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorDisplay: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorDisplayCompact: {
    padding: 12,
    margin: 8,
  },
  errorIcon: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  errorTextCompact: {
    fontSize: 12,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  inlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FEB2B2',
    marginVertical: 4,
  },
  inlineErrorText: {
    color: '#C53030',
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
});

// Set display name for debugging
ErrorBoundary.displayName = 'ErrorBoundary';

// Default export
export default ErrorBoundary;
