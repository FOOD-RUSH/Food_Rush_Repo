import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  StatusBar, 
  Dimensions, 
  Switch,
  Alert 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import CommonView from '@/src/components/common/CommonView';

const { width, height } = Dimensions.get('window');

interface SettingOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'toggle' | 'action' | 'navigation';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

const MenuSettingsScreen = () => {
  const navigation = useNavigation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const itemAnimations = useRef(Array(8).fill(0).map(() => new Animated.Value(0))).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  // Settings state
  const [settings, setSettings] = useState({
    autoAcceptOrders: false,
    showOutOfStock: true,
    enablePromotions: true,
    notifyLowStock: true,
    publicMenu: true,
    allowPreOrders: false,
    showNutritionInfo: false,
    enableRatings: true,
  });

  useEffect(() => {
    // Start entrance animations
    const entranceSequence = Animated.sequence([
      // Header animation
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Main content animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Settings items stagger animation
      Animated.stagger(100, 
        itemAnimations.map(anim => 
          Animated.spring(anim, {
            toValue: 1,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
    ]);

    entranceSequence.start(() => {
      startContinuousAnimations();
    });
  }, []);

  const startContinuousAnimations = () => {
    // Floating animation for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleBack = () => {
    // Exit animation before navigating back
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const floatingInterpolate = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const settingsOptions: SettingOption[] = [
    {
      id: 'autoAcceptOrders',
      title: 'Auto Accept Orders',
      description: 'Automatically accept incoming orders',
      icon: 'check-circle',
      type: 'toggle',
      value: settings.autoAcceptOrders,
      onToggle: () => handleToggleSetting('autoAcceptOrders'),
    },
    {
      id: 'showOutOfStock',
      title: 'Show Out of Stock Items',
      description: 'Display unavailable items in menu',
      icon: 'eye',
      type: 'toggle',
      value: settings.showOutOfStock,
      onToggle: () => handleToggleSetting('showOutOfStock'),
    },
    {
      id: 'enablePromotions',
      title: 'Enable Promotions',
      description: 'Allow promotional pricing and offers',
      icon: 'tag',
      type: 'toggle',
      value: settings.enablePromotions,
      onToggle: () => handleToggleSetting('enablePromotions'),
    },
    {
      id: 'notifyLowStock',
      title: 'Low Stock Notifications',
      description: 'Get notified when items are running low',
      icon: 'bell',
      type: 'toggle',
      value: settings.notifyLowStock,
      onToggle: () => handleToggleSetting('notifyLowStock'),
    },
    {
      id: 'publicMenu',
      title: 'Public Menu',
      description: 'Make menu visible to customers',
      icon: 'earth',
      type: 'toggle',
      value: settings.publicMenu,
      onToggle: () => handleToggleSetting('publicMenu'),
    },
    {
      id: 'allowPreOrders',
      title: 'Allow Pre-Orders',
      description: 'Accept orders for future delivery',
      icon: 'clock',
      type: 'toggle',
      value: settings.allowPreOrders,
      onToggle: () => handleToggleSetting('allowPreOrders'),
    },
    {
      id: 'showNutritionInfo',
      title: 'Show Nutrition Info',
      description: 'Display nutritional information',
      icon: 'leaf',
      type: 'toggle',
      value: settings.showNutritionInfo,
      onToggle: () => handleToggleSetting('showNutritionInfo'),
    },
    {
      id: 'enableRatings',
      title: 'Enable Item Ratings',
      description: 'Allow customers to rate menu items',
      icon: 'star',
      type: 'toggle',
      value: settings.enableRatings,
      onToggle: () => handleToggleSetting('enableRatings'),
    },
  ];

  const actionOptions: SettingOption[] = [
    {
      id: 'backup',
      title: 'Backup Menu Data',
      description: 'Export your menu data for backup',
      icon: 'cloud-upload',
      type: 'action',
      onPress: () => Alert.alert('Backup', 'Menu backup feature coming soon!'),
    },
    {
      id: 'import',
      title: 'Import Menu',
      description: 'Import menu from another source',
      icon: 'cloud-download',
      type: 'action',
      onPress: () => Alert.alert('Import', 'Menu import feature coming soon!'),
    },
    {
      id: 'reset',
      title: 'Reset Settings',
      description: 'Reset all settings to default',
      icon: 'refresh',
      type: 'action',
      onPress: () => {
        Alert.alert(
          'Reset Settings',
          'Are you sure you want to reset all settings to default?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Reset', 
              style: 'destructive',
              onPress: () => {
                setSettings({
                  autoAcceptOrders: false,
                  showOutOfStock: true,
                  enablePromotions: true,
                  notifyLowStock: true,
                  publicMenu: true,
                  allowPreOrders: false,
                  showNutritionInfo: false,
                  enableRatings: true,
                });
                Alert.alert('Success', 'Settings have been reset to default.');
              }
            }
          ]
        );
      },
    },
  ];

  const renderSettingItem = (option: SettingOption, index: number) => (
    <Animated.View
      key={option.id}
      style={{
        opacity: itemAnimations[index],
        transform: [
          {
            translateX: itemAnimations[index]?.interpolate({
              inputRange: [0, 1],
              outputRange: [100 * (index % 2 === 0 ? 1 : -1), 0],
            }) || 0
          },
          {
            scale: itemAnimations[index]?.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
            }) || 1
          }
        ],
        marginBottom: 16,
      }}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 50,
            height: 50,
            backgroundColor: 'rgba(79, 172, 254, 0.2)',
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}>
            <MaterialCommunityIcons 
              name={option.icon as any} 
              size={24} 
              color="#4facfe" 
            />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: '#ffffff',
              marginBottom: 4,
            }}>
              {option.title}
            </Text>
            <Text style={{ 
              fontSize: 12, 
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 16,
            }}>
              {option.description}
            </Text>
          </View>

          {option.type === 'toggle' && (
            <Switch
              value={option.value}
              onValueChange={option.onToggle}
              trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#4facfe' }}
              thumbColor={option.value ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'}
              ios_backgroundColor="rgba(255, 255, 255, 0.2)"
            />
          )}

          {option.type === 'action' && (
            <TouchableOpacity
              onPress={option.onPress}
              style={{
                backgroundColor: 'rgba(79, 172, 254, 0.2)',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: 'rgba(79, 172, 254, 0.4)',
              }}
            >
              <Text style={{ 
                color: '#4facfe', 
                fontSize: 12, 
                fontWeight: '600' 
              }}>
                Execute
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={{ flex: 1 }}
      >
        <CommonView style={{ flex: 1, backgroundColor: 'transparent' }}>
          {/* Decorative floating elements */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 100,
              right: 30,
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transform: [{ translateY: floatingInterpolate }],
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 150,
              left: 20,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              transform: [{ translateY: floatingInterpolate }],
            }}
          />

          {/* Custom Header */}
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 20,
              paddingBottom: 20,
              transform: [{ translateY: headerSlideAnim }],
            }}
          >
            <TouchableOpacity
              onPress={handleBack}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>
                Menu Settings
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>
                Configure your menu preferences
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(79, 172, 254, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => Alert.alert('Help', 'Settings help coming soon!')}
            >
              <MaterialCommunityIcons name="help-circle" size={20} color="#4facfe" />
            </TouchableOpacity>
          </Animated.View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* General Settings Section */}
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '700', 
              color: '#ffffff', 
              marginBottom: 16,
              paddingLeft: 4,
            }}>
              General Settings
            </Text>
            
            {settingsOptions.map((option, index) => renderSettingItem(option, index))}

            {/* Actions Section */}
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '700', 
              color: '#ffffff', 
              marginBottom: 16,
              marginTop: 24,
              paddingLeft: 4,
            }}>
              Menu Actions
            </Text>
            
            {actionOptions.map((option, index) => 
              renderSettingItem(option, settingsOptions.length + index)
            )}

            {/* Save Settings Button */}
            <Animated.View
              style={{
                marginTop: 30,
                opacity: fadeAnim,
              }}
            >
              <TouchableOpacity
                onPress={() => Alert.alert('Success', 'Settings saved successfully!')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#11998e', '#38ef7d']}
                  style={{
                    paddingVertical: 18,
                    borderRadius: 15,
                    alignItems: 'center',
                    shadowColor: '#11998e',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="content-save" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={{ 
                      color: '#ffffff', 
                      fontWeight: '700', 
                      fontSize: 16 
                    }}>
                      Save Settings
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </CommonView>
      </LinearGradient>
    </>
  );
};

export default MenuSettingsScreen;