# App Behavior When Location is Not Activated

## Current Flow and Issues

### What Happens Now:
1. **App starts** → `useLocation` hook requests permission
2. **Permission denied/location off** → `hasLocationPermission = false`
3. **Restaurant list loads** → Shows "No restaurants found" 
4. **Location header** → Shows "Add Location" with tap prompt
5. **User experience** → Confusing, no clear guidance

## Enhanced Location Handling Components

### 1. Location Permission Screen
```typescript
// screens/LocationPermissionScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  AppState,
} from 'react-native';
import { useLocation } from '../hooks/useLocation';

interface LocationPermissionScreenProps {
  onLocationEnabled: () => void;
  onSkipForNow: () => void;
}

export const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  onLocationEnabled,
  onSkipForNow,
}) => {
  const { hasLocationPermission, requestLocationPermission, getCurrentLocation } = useLocation();
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  // Listen for app state changes to detect when user returns from settings
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && hasLocationPermission === false) {
        // Re-check permission when app becomes active
        checkLocationStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [hasLocationPermission]);

  const checkLocationStatus = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      const location = await getCurrentLocation();
      if (location) {
        onLocationEnabled();
      }
    }
  };

  const handleEnableLocation = async () => {
    setIsRequestingLocation(true);

    try {
      const hasPermission = await requestLocationPermission();
      
      if (hasPermission) {
        const location = await getCurrentLocation();
        if (location) {
          onLocationEnabled();
        } else {
          // Permission granted but GPS is off
          showLocationServicesAlert();
        }
      } else {
        // Permission denied
        showPermissionDeniedAlert();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to enable location. Please try again.');
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const showLocationServicesAlert = () => {
    Alert.alert(
      'Location Services Disabled',
      'Your location services are turned off. Please enable them in your device settings to find restaurants near you.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => Linking.openSettings() 
        },
      ]
    );
  };

  const showPermissionDeniedAlert = () => {
    Alert.alert(
      'Location Permission Required',
      'We need location access to show you nearby restaurants and calculate delivery times. You can enable this in your device settings.',
      [
        { text: 'Skip for Now', onPress: onSkipForNow, style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => Linking.openSettings() 
        },
      ]
    );
  };

  const handleManualAddress = () => {
    onSkipForNow(); // This will navigate to manual address entry
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📍</Text>
        </View>
        
        <Text style={styles.title}>Enable Location</Text>
        <Text style={styles.description}>
          We need your location to show nearby restaurants and calculate accurate delivery times for your area in Yaoundé.
        </Text>

        <View style={styles.benefitsList}>
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>🍽️</Text>
            <Text style={styles.benefitText}>Find restaurants near you</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>⏰</Text>
            <Text style={styles.benefitText}>Get accurate delivery times</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>🚚</Text>
            <Text style={styles.benefitText}>Calculate delivery fees</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleEnableLocation}
          disabled={isRequestingLocation}
        >
          <Text style={styles.primaryButtonText}>
            {isRequestingLocation ? 'Checking Location...' : 'Enable Location'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleManualAddress}
        >
          <Text style={styles.secondaryButtonText}>
            Enter Address Manually
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSkipForNow}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  benefitsList: {
    alignSelf: 'stretch',
    marginBottom: 40,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipText: {
    color: '#999',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
```

### 2. Manual Address Entry Screen
```typescript
// screens/ManualAddressScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocation } from '../hooks/useLocation';

interface ManualAddressScreenProps {
  onAddressAdded: () => void;
  onBack: () => void;
}

export const ManualAddressScreen: React.FC<ManualAddressScreenProps> = ({
  onAddressAdded,
  onBack,
}) => {
  const [label, setLabel] = useState('Home');
  const [streetAddress, setStreetAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { geocodeAndCreateAddress } = useLocation();

  // Common neighborhoods in Yaoundé for suggestions
  const commonNeighborhoods = [
    'Bastos', 'Melen', 'Nlongkak', 'Emana', 'Essos', 'Djoungolo',
    'Mokolo', 'Briqueterie', 'Tsinga', 'Ekounou', 'Biyem-Assi',
    'Nkolbisson', 'Mimboman', 'Soa', 'Obala'
  ];

  const handleSaveAddress = async () => {
    if (!streetAddress.trim()) {
      Alert.alert('Error', 'Please enter a street address');
      return;
    }

    if (!neighborhood.trim()) {
      Alert.alert('Error', 'Please enter a neighborhood/quarter');
      return;
    }

    setIsLoading(true);

    try {
      // Combine address components for geocoding
      const fullAddress = `${streetAddress}, ${neighborhood}, Yaoundé, Cameroon`;
      
      const newAddress = await geocodeAndCreateAddress(
        fullAddress,
        label,
        landmark || undefined
      );

      if (newAddress) {
        Alert.alert(
          'Success',
          'Your address has been saved successfully!',
          [{ text: 'OK', onPress: onAddressAdded }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not save this address. Please check the details and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Address Manually</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address Label</Text>
            <TextInput
              style={styles.input}
              value={label}
              onChangeText={setLabel}
              placeholder="e.g., Home, Office, Friend's Place"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={styles.input}
              value={streetAddress}
              onChangeText={setStreetAddress}
              placeholder="e.g., Avenue Kennedy, Rue 1.234"
              placeholderTextColor="#999"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Neighborhood/Quarter *</Text>
            <TextInput
              style={styles.input}
              value={neighborhood}
              onChangeText={setNeighborhood}
              placeholder="e.g., Bastos, Melen, Nlongkak"
              placeholderTextColor="#999"
            />
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.suggestions}
            >
              {commonNeighborhoods.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={styles.suggestionChip}
                  onPress={() => setNeighborhood(area)}
                >
                  <Text style={styles.suggestionText}>{area}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Landmark (Optional)</Text>
            <TextInput
              style={styles.input}
              value={landmark}
              onChangeText={setLandmark}
              placeholder="e.g., Near Total Station, Behind Hilton Hotel"
              placeholderTextColor="#999"
              multiline
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📍 Delivery Area</Text>
            <Text style={styles.infoText}>
              We currently deliver within Yaoundé city limits. Make sure your address is within our coverage area.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveAddress}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving Address...' : 'Save Address'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    minHeight: 50,
  },
  suggestions: {
    marginTop: 8,
  },
  suggestionChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  suggestionText: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### 3. App-Level Location Flow Manager
```typescript
// components/LocationFlowManager.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { LocationPermissionScreen } from '../screens/LocationPermissionScreen';
import { ManualAddressScreen } from '../screens/ManualAddressScreen';
import { useLocation } from '../hooks/useLocation';
import { useAddressStore } from '../store/addressStore';

interface LocationFlowManagerProps {
  children: React.ReactNode;
}

export const LocationFlowManager: React.FC<LocationFlowManagerProps> = ({ children }) => {
  const [flowState, setFlowState] = useState<'checking' | 'needsLocation' | 'manualEntry' | 'ready'>('checking');
  const { hasLocationPermission, currentLocation } = useLocation();
  const { addresses, selectedAddress } = useAddressStore();

  useEffect(() => {
    checkLocationStatus();
  }, [hasLocationPermission, currentLocation, addresses, selectedAddress]);

  const checkLocationStatus = () => {
    // If user has addresses saved, they can use the app
    if (addresses.length > 0) {
      setFlowState('ready');
      return;
    }

    // If location permission is granted and we have current location
    if (hasLocationPermission && currentLocation) {
      setFlowState('ready');
      return;
    }

    // If permission is explicitly denied or null (first time)
    if (hasLocationPermission === false || hasLocationPermission === null) {
      setFlowState('needsLocation');
      return;
    }

    // Still checking
    setFlowState('checking');
  };

  const handleLocationEnabled = () => {
    setFlowState('ready');
  };

  const handleSkipForNow = () => {
    setFlowState('manualEntry');
  };

  const handleAddressAdded = () => {
    setFlowState('ready');
  };

  const handleBackToPermission = () => {
    setFlowState('needsLocation');
  };

  // Show different screens based on state
  switch (flowState) {
    case 'checking':
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* You can add a loading spinner here */}
        </View>
      );

    case 'needsLocation':
      return (
        <LocationPermissionScreen
          onLocationEnabled={handleLocationEnabled}
          onSkipForNow={handleSkipForNow}
        />
      );

    case 'manualEntry':
      return (
        <ManualAddressScreen
          onAddressAdded={handleAddressAdded}
          onBack={handleBackToPermission}
        />
      );

    case 'ready':
    default:
      return <>{children}</>;
  }
};
```

### 4. Updated App.tsx Integration
```typescript
// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LocationFlowManager } from './components/LocationFlowManager';
import { useAddressStore } from './store/addressStore';
import { MainNavigator } from './navigation/MainNavigator';

export default function App() {
  const { loadAddresses } = useAddressStore();

  useEffect(() => {
    // Load persisted addresses when app starts
    loadAddresses();
  }, []);

  return (
    <NavigationContainer>
      <LocationFlowManager>
        <MainNavigator />
      </LocationFlowManager>
    </NavigationContainer>
  );
}
```

## Complete User Flow When Location is Disabled:

### 🔄 **App Launch Flow:**
1. **App starts** → `LocationFlowManager` checks status
2. **No saved addresses + No location** → Shows `LocationPermissionScreen`
3. **User sees benefits** → Clear explanation of why location is needed
4. **User can choose:**
   - Enable Location → Permission request → Success/Settings redirect
   - Manual Entry → Address form with Yaoundé neighborhoods
   - Skip → Limited app experience

### ⚠️ **Graceful Degradation:**
- **No location/addresses:** Shows location setup screens
- **Permission denied:** Redirects to device settings
- **GPS off:** Specific message about location services
- **Manual addresses:** Full app functionality without GPS
- **App state changes:** Re-checks when returning from settings

### 🎯 **User Benefits:**
- **Clear communication** about why location is needed
- **Multiple options** (GPS, manual, or skip)
- **Cameroon-specific** neighborhood suggestions
- **Persistent storage** - once set up, no need to repeat
- **Fallback options** - app works even without GPS

This approach ensures users are never stuck and always have a path forward!