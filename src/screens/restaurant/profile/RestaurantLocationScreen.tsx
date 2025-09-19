import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useTheme, Card, TextInput, Button, Chip, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

import CommonView from '@/src/components/common/CommonView';
import { Typography, Label, Body, BodySmall, Heading4, Heading5, Caption } from '@/src/components/common/Typography';
import { ResponsiveContainer } from '@/src/components/common/ResponsiveContainer';

interface LocationData {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  deliveryRadius: number; // in kilometers
  isActive: boolean;
}

interface ErrorState {
  hasError: boolean;
  message: string;
  field?: string;
}

const RestaurantLocationScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { width: screenWidth } = Dimensions.get('window');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Dummy location data - replace with actual API call
  const [locationData, setLocationData] = useState<LocationData>({
    id: '1',
    name: 'Chez Marie Restaurant',
    address: 'Rue de la Paix, Quartier Bonanjo',
    city: 'Douala',
    region: 'Littoral',
    postalCode: '1234',
    country: 'Cameroon',
    latitude: 4.0511,
    longitude: 9.7679,
    isDefault: true,
    deliveryRadius: 5,
    isActive: true,
  });

  const [editedLocation, setEditedLocation] = useState<LocationData>(locationData);

  // Dummy nearby suggestions - replace with actual location service
  const [nearbySuggestions] = useState([
    { id: '1', name: 'Akwa Palace Hotel', address: 'Boulevard de la Liberté, Akwa', distance: 0.8 },
    { id: '2', name: 'Douala Grand Mall', address: 'Rue Joss, Akwa', distance: 1.2 },
    { id: '3', name: 'Port Autonome de Douala', address: 'Boulevard du Port, Bonaberi', distance: 2.1 },
  ]);

  const handleSaveLocation = async () => {
    try {
      setIsLoading(true);
      setError({ hasError: false, message: '' });

      // Validate required fields
      if (!editedLocation.address.trim()) {
        setError({ hasError: true, message: t('address_required'), field: 'address' });
        return;
      }

      if (!editedLocation.city.trim()) {
        setError({ hasError: true, message: t('city_required'), field: 'city' });
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setLocationData(editedLocation);
      setIsEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        t('success'),
        t('location_updated_successfully'),
        [{ text: t('ok'), style: 'default' }]
      );

    } catch (error) {
      setError({ hasError: true, message: t('failed_to_update_location') });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Simulate getting current location
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Dummy current location data
      const currentLocation = {
        ...editedLocation,
        address: 'Avenue Charles de Gaulle, Bonanjo',
        city: 'Douala',
        region: 'Littoral',
        latitude: 4.0483,
        longitude: 9.7671,
      };

      setEditedLocation(currentLocation);
      
      Alert.alert(
        t('location_detected'),
        t('current_location_updated'),
        [{ text: t('ok'), style: 'default' }]
      );

    } catch (error) {
      setError({ hasError: true, message: t('failed_to_get_location') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    Haptics.selectionAsync();
    setEditedLocation({
      ...editedLocation,
      address: suggestion.address,
      name: editedLocation.name, // Keep restaurant name
    });
  };

  const renderLocationForm = () => (
    <View>
      {/* Restaurant Name */}
      <View style={{ marginBottom: 16 }}>
        <Label color={colors.onSurface} style={{ marginBottom: 8 }}>
          {t('restaurant_name')}
        </Label>
        <TextInput
          value={editedLocation.name}
          onChangeText={(text) => setEditedLocation({ ...editedLocation, name: text })}
          mode="outlined"
          style={{ backgroundColor: colors.surface }}
          error={error.field === 'name'}
          disabled={!isEditing}
        />
      </View>

      {/* Address */}
      <View style={{ marginBottom: 16 }}>
        <Label color={colors.onSurface} style={{ marginBottom: 8 }}>
          {t('street_address')} *
        </Label>
        <TextInput
          value={editedLocation.address}
          onChangeText={(text) => setEditedLocation({ ...editedLocation, address: text })}
          mode="outlined"
          style={{ backgroundColor: colors.surface }}
          error={error.field === 'address'}
          disabled={!isEditing}
          multiline
          numberOfLines={2}
        />
      </View>

      {/* City and Region */}
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Label color={colors.onSurface} style={{ marginBottom: 8 }}>
            {t('city')} *
          </Label>
          <TextInput
            value={editedLocation.city}
            onChangeText={(text) => setEditedLocation({ ...editedLocation, city: text })}
            mode="outlined"
            style={{ backgroundColor: colors.surface }}
            error={error.field === 'city'}
            disabled={!isEditing}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Label color={colors.onSurface} style={{ marginBottom: 8 }}>
            {t('region')}
          </Label>
          <TextInput
            value={editedLocation.region}
            onChangeText={(text) => setEditedLocation({ ...editedLocation, region: text })}
            mode="outlined"
            style={{ backgroundColor: colors.surface }}
            disabled={!isEditing}
          />
        </View>
      </View>

      {/* Postal Code and Country */}
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Label color={colors.onSurface} style={{ marginBottom: 8 }}>
            {t('postal_code')}
          </Label>
          <TextInput
            value={editedLocation.postalCode}
            onChangeText={(text) => setEditedLocation({ ...editedLocation, postalCode: text })}
            mode="outlined"
            style={{ backgroundColor: colors.surface }}
            disabled={!isEditing}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Label color={colors.onSurface} style={{ marginBottom: 8 }}>
            {t('country')}
          </Label>
          <TextInput
            value={editedLocation.country}
            onChangeText={(text) => setEditedLocation({ ...editedLocation, country: text })}
            mode="outlined"
            style={{ backgroundColor: colors.surface }}
            disabled={!isEditing}
          />
        </View>
      </View>

      {/* Delivery Radius */}
      <View style={{ marginBottom: 16 }}>
        <Label color={colors.onSurface} style={{ marginBottom: 8 }}>
          {t('delivery_radius')} ({t('kilometers')})
        </Label>
        <TextInput
          value={editedLocation.deliveryRadius.toString()}
          onChangeText={(text) => setEditedLocation({ ...editedLocation, deliveryRadius: parseInt(text) || 0 })}
          mode="outlined"
          style={{ backgroundColor: colors.surface }}
          disabled={!isEditing}
          keyboardType="numeric"
        />
      </View>

      {/* Location Status */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Label color={colors.onSurface}>
          {t('location_active')}
        </Label>
        <Switch
          value={editedLocation.isActive}
          onValueChange={(value) => setEditedLocation({ ...editedLocation, isActive: value })}
          trackColor={{ false: '#767577', true: '#007aff' }}
          thumbColor={editedLocation.isActive ? '#ffffff' : '#f4f3f4'}
          disabled={!isEditing}
        />
      </View>
    </View>
  );

  const renderCurrentLocationButton = () => (
    <TouchableOpacity
      onPress={handleUseCurrentLocation}
      disabled={!isEditing || isLoading}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isEditing ? '#007aff20' : colors.surfaceVariant,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <MaterialCommunityIcons 
        name="crosshairs-gps" 
        size={20} 
        color={isEditing ? '#007aff' : colors.onSurfaceVariant} 
      />
      <Label 
        color={isEditing ? '#007aff' : colors.onSurfaceVariant}
        style={{ marginLeft: 8 }}
      >
        {isLoading ? t('getting_location') : t('use_current_location')}
      </Label>
    </TouchableOpacity>
  );

  const renderNearbySuggestions = () => (
    <View style={{ marginBottom: 16 }}>
      <Heading5 color={colors.onSurface} style={{ marginBottom: 12 }}>
        {t('nearby_landmarks')}
      </Heading5>
      {nearbySuggestions.map((suggestion) => (
        <TouchableOpacity
          key={suggestion.id}
          onPress={() => handleSelectSuggestion(suggestion)}
          disabled={!isEditing}
          style={{
            backgroundColor: isEditing ? colors.surface : colors.surfaceVariant,
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: colors.outline,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Label color={colors.onSurface}>
                {suggestion.name}
              </Label>
              <Caption color={colors.onSurfaceVariant} style={{ marginTop: 2 }}>
                {suggestion.address}
              </Caption>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="map-marker-distance" size={14} color={colors.onSurfaceVariant} />
              <Caption color={colors.onSurfaceVariant} style={{ marginLeft: 4 }}>
                {suggestion.distance} km
              </Caption>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (error.hasError && !error.field) {
    return (
      <CommonView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <MaterialCommunityIcons name="alert-circle" size={48} color="#FF4444" />
          <Heading4 color={colors.onSurface} align="center" style={{ marginTop: 16 }}>
            {t('something_went_wrong')}
          </Heading4>
          <Body color={colors.onSurfaceVariant} align="center" style={{ marginTop: 8 }}>
            {error.message}
          </Body>
          <TouchableOpacity
            onPress={() => {
              setError({ hasError: false, message: '' });
              navigation.goBack();
            }}
            style={{
              backgroundColor: '#007aff',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 16,
            }}
          >
            <Label color="white" weight="bold">{t('go_back')}</Label>
          </TouchableOpacity>
        </View>
      </CommonView>
    );
  }

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Removed custom header - using navigator header instead */}

        {/* Current Location Display */}
        {!isEditing && (
          <View style={{ padding: 16 }}>
            <Card style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Heading4 color={colors.onSurface}>
                      {locationData.name}
                    </Heading4>
                    <Body color={colors.onSurfaceVariant} style={{ marginTop: 4 }}>
                      {locationData.address}
                    </Body>
                    <Body color={colors.onSurfaceVariant}>
                      {locationData.city}, {locationData.region} {locationData.postalCode}
                    </Body>
                    <Body color={colors.onSurfaceVariant}>
                      {locationData.country}
                    </Body>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Chip
                      style={{ 
                        backgroundColor: locationData.isActive ? '#00C85120' : '#FF444420',
                        marginBottom: 8,
                      }}
                      textStyle={{ 
                        color: locationData.isActive ? '#00C851' : '#FF4444',
                        fontSize: 10,
                      }}
                      compact
                    >
                      {locationData.isActive ? t('active') : t('inactive')}
                    </Chip>
                  </View>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="map-marker-radius" size={16} color={colors.onSurfaceVariant} />
                    <Caption color={colors.onSurfaceVariant} style={{ marginLeft: 4 }}>
                      {t('delivery_radius')}: {locationData.deliveryRadius} km
                    </Caption>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="map-marker" size={16} color={colors.onSurfaceVariant} />
                    <Caption color={colors.onSurfaceVariant} style={{ marginLeft: 4 }}>
                      {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
                    </Caption>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Edit Form */}
        {isEditing && (
          <View style={{ padding: 16 }}>
            <Card style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
              <View style={{ padding: 16 }}>
                {renderCurrentLocationButton()}
                {renderLocationForm()}
                {renderNearbySuggestions()}
              </View>
            </Card>
          </View>
        )}

        {/* Error Message */}
        {error.hasError && error.field && (
          <View style={{ padding: 16, paddingTop: 0 }}>
            <View style={{
              backgroundColor: '#FF444420',
              padding: 12,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#FF4444" />
              <Body color="#FF4444" style={{ marginLeft: 8, flex: 1 }}>
                {error.message}
              </Body>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ padding: 16, paddingTop: 8 }}>
          {!isEditing ? (
            <Button
              mode="contained"
              onPress={() => {
                setIsEditing(true);
                setEditedLocation(locationData);
                Haptics.selectionAsync();
              }}
              style={{ backgroundColor: '#007aff', borderRadius: 8 }}
              labelStyle={{ color: 'white', fontWeight: 'bold' }}
            >
              {t('edit_location')}
            </Button>
          ) : (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                mode="outlined"
                onPress={() => {
                  setIsEditing(false);
                  setEditedLocation(locationData);
                  setError({ hasError: false, message: '' });
                  Haptics.selectionAsync();
                }}
                style={{ flex: 1, marginRight: 8, borderColor: colors.outline }}
                labelStyle={{ color: colors.onSurface }}
                disabled={isLoading}
              >
                {t('cancel')}
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveLocation}
                style={{ flex: 1, marginLeft: 8, backgroundColor: '#007aff', borderRadius: 8 }}
                labelStyle={{ color: 'white', fontWeight: 'bold' }}
                loading={isLoading}
                disabled={isLoading}
              >
                {t('save_location')}
              </Button>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </CommonView>
  );
};

export default RestaurantLocationScreen;