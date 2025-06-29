import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Otp() {
  const router = useRouter();
  const { confirmSignUp, resendSignUp, user } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const codeDigitsArray = new Array(6).fill(0);

  const ref = useRef<TextInput>(null);

  const handleOnPress = () => {
    ref?.current?.focus();
  };

  const handleOnBlur = () => {
    ref?.current?.blur();
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await confirmSignUp(code);
      Alert.alert('Success', 'Your email has been verified successfully!');
      router.push('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendSignUp();
      Alert.alert('Success', 'A new OTP has been sent to your email.');
    } catch (error: any) {
      Alert.alert('Resend Failed', error.message || 'An error occurred');
    } finally {
      setResendLoading(false);
    }
  };

  const goToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={goToLogin} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={60}
              color="#3B82F6"
            />
          </View>

          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We have sent a 6-digit OTP to your email address. Please check your
            inbox.
          </Text>

          <Pressable style={styles.inputContainer} onPress={handleOnPress}>
            <View style={styles.inputBoxes}>
              {codeDigitsArray.map((_, index) => {
                const digit = code[index] || '';
                const isCurrentDigit = index === code.length;
                return (
                  <View
                    key={index}
                    style={[
                      styles.codeBox,
                      isCurrentDigit && styles.codeBoxFocused,
                    ]}
                  >
                    <Text style={styles.codeDigit}>{digit}</Text>
                  </View>
                );
              })}
            </View>
            <TextInput
              ref={ref}
              style={styles.input}
              value={code}
              onChangeText={setCode}
              onSubmitEditing={handleOnBlur}
              keyboardType="number-pad"
              returnKeyType="done"
              textContentType="oneTimeCode"
              maxLength={6}
            />
          </Pressable>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (loading || code.length !== 6) && styles.buttonDisabled,
            ]}
            onPress={handleVerify}
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <Text style={styles.primaryButtonText}>Verifying...</Text>
            ) : (
              <Text style={styles.primaryButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn&apos;t receive the code?{' '}
            </Text>
            <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
              <Text style={styles.resendLink}>
                {resendLoading ? 'Sending...' : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    maxWidth: '90%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
    margin: 10,
  },
  input: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  inputBoxes: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  codeBox: {
    width: 50,
    height: 60,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeBoxFocused: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  codeDigit: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 4,
  },
});
