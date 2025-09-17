import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';

const { width, height } = Dimensions.get('window');

interface AnimatedBgShapeProps {
  style?: any;
  delay: number;
  color1: string;
  color2: string;
  size: number;
  top: number;
  left: number;
}

const AnimatedBgShape: React.FC<AnimatedBgShapeProps> = ({
  style,
  delay,
  color1,
  color2,
  size,
  top,
  left,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 4000 + delay,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 4000 + delay,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: 0.25,
          transform: [{ translateY }, { scale: scaleAnim }],
          zIndex: 0,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[color1, color2]}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: size / 2,
        }}
        start={[0, 0]}
        end={[1, 1]}
      />
    </Animated.View>
  );
};

interface FloatingInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
  multiline?: boolean;
  numberOfLines?: number;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const labelStyle = {
    position: 'absolute' as const,
    left: 50,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [multiline ? 20 : 16, -8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#764ba2'],
    }),
    backgroundColor: 'white',
    paddingHorizontal: 4,
    zIndex: 1,
  };

  return (
    <Animated.View
      style={[
        styles.floatingInputContainer,
        isFocused && styles.focusedInput,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <View style={styles.inputRow}>
        <Ionicons
          name={icon}
          size={20}
          color={isFocused ? '#764ba2' : '#aaa'}
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.floatingInput,
            multiline && styles.multilineInput,
            { height: multiline ? numberOfLines * 20 + 28 : 48 },
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? '' : placeholder}
          placeholderTextColor="#aaa"
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </Animated.View>
  );
};

type ProfileEditScreenProps =
  RestaurantProfileStackScreenProps<'ProfileEditProfile'>;

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({
  navigation,
  route,
}) => {
  // Get initial values from route params or use defaults
  const initialProfile = route.params?.userProfile || {
    name: 'Restaurant Owner',
    email: 'owner@restaurant.com',
    phone: '+1 234 567 8900',
    restaurantName: 'The Great Eatery',
    address: '123 Food Street, City',
    bio: '',
    website: '',
    cuisine: 'Italian, American',
  };

  const [profile, setProfile] = useState(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const successModalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateField = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!profile.name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return false;
    }
    if (!profile.email.trim() || !profile.email.includes('@')) {
      Alert.alert('Validation Error', 'Valid email is required');
      return false;
    }
    if (!profile.phone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return false;
    }
    if (!profile.restaurantName.trim()) {
      Alert.alert('Validation Error', 'Restaurant name is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showSuccessAnimation();
    }, 2000);
  };

  const showSuccessAnimation = () => {
    setShowSuccessModal(true);
    Animated.spring(successModalAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(successModalAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccessModal(false);
          navigation.goBack();
        });
      }, 1500);
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated background shapes */}
      <AnimatedBgShape
        color1="#43e97b"
        color2="#38f9d7"
        size={200}
        top={-80}
        left={-60}
        delay={0}
      />
      <AnimatedBgShape
        color1="#667eea"
        color2="#764ba2"
        size={150}
        top={100}
        left={width - 120}
        delay={1000}
      />
      <AnimatedBgShape
        color1="#fa709a"
        color2="#fee140"
        size={120}
        top={height - 250}
        left={-40}
        delay={2000}
      />
      <AnimatedBgShape
        color1="#43cea2"
        color2="#185a9d"
        size={100}
        top={height - 180}
        left={width - 80}
        delay={3000}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleCancel}
              >
                <Ionicons name="arrow-back" size={24} color="#764ba2" />
              </TouchableOpacity>
              <Text style={styles.title}>Edit Profile</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Profile Picture Section */}
            <View style={styles.profilePictureSection}>
              <View style={styles.profilePictureContainer}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.profilePicture}
                >
                  <Text style={styles.profileInitials}>
                    {profile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </Text>
                </LinearGradient>
                <TouchableOpacity style={styles.editPictureButton}>
                  <Ionicons name="camera" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <Text style={styles.changePictureText}>
                Tap to change picture
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <FloatingInput
                label="Full Name"
                value={profile.name}
                onChangeText={(text) => updateField('name', text)}
                icon="person"
                placeholder="Enter your full name"
              />

              <FloatingInput
                label="Email Address"
                value={profile.email}
                onChangeText={(text) => updateField('email', text)}
                icon="mail"
                placeholder="Enter your email"
                keyboardType="email-address"
              />

              <FloatingInput
                label="Phone Number"
                value={profile.phone}
                onChangeText={(text) => updateField('phone', text)}
                icon="call"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <FloatingInput
                label="Restaurant Name"
                value={profile.restaurantName}
                onChangeText={(text) => updateField('restaurantName', text)}
                icon="restaurant"
                placeholder="Enter restaurant name"
              />

              <FloatingInput
                label="Address"
                value={profile.address}
                onChangeText={(text) => updateField('address', text)}
                icon="location"
                placeholder="Enter restaurant address"
                multiline
                numberOfLines={2}
              />

              <FloatingInput
                label="Website"
                value={profile.website ?? ''}
                onChangeText={(text) => updateField('website', text)}
                icon="globe"
                placeholder="Enter website URL"
                keyboardType="url"
              />

              <FloatingInput
                label="Cuisine Type"
                value={profile.cuisine ?? ''}
                onChangeText={(text) => updateField('cuisine', text)}
                icon="restaurant"
                placeholder="e.g., Italian, American, Asian"
              />

              <FloatingInput
                label="Bio"
                value={profile.bio ?? ''}
                onChangeText={(text) => updateField('bio', text)}
                icon="document-text"
                placeholder="Tell us about your restaurant..."
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.saveButtonGradient}
                  start={[0, 0]}
                  end={[1, 1]}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={20} color="white" />
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.successModal,
              {
                transform: [
                  { scale: successModalAnim },
                  {
                    translateY: successModalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
                opacity: successModalAnim,
              },
            ]}
          >
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              style={styles.successIconContainer}
            >
              <Ionicons name="checkmark" size={40} color="white" />
            </LinearGradient>
            <Text style={styles.successTitle}>Profile Updated!</Text>
            <Text style={styles.successMessage}>
              Your profile has been successfully updated.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#764ba2',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d1d1f',
  },
  placeholder: {
    width: 44,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#764ba2',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  editPictureButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#764ba2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  changePictureText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  floatingInputContainer: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    ...Platform.select({
      ios: {
        shadowColor: '#764ba2',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  focusedInput: {
    borderColor: '#764ba2',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  floatingInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 14,
  },
  multilineInput: {
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 2,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#764ba2',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  saveButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModal: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 25,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ProfileEditScreen;