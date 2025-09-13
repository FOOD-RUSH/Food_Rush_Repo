import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  Easing,
  ColorValue,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

export const AnalyticsScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const {colors} = useTheme()
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.1)),
      }),
    ]).start();

    // Continuous pulse animation
    const startPulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]).start(() => startPulse());
    };
    startPulse();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [fadeAnim, slideAnim, scaleAnim, pulseAnim, rotateAnim]);

  useFocusEffect(
    useCallback(() => {
      // Reset or refresh your state/data here as needed
      // For demonstration, we'll reset selectedMetric and timeRange
      setSelectedMetric('revenue');
      setTimeRange('week');
      // Optionally, restart animations
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      scaleAnim.setValue(0.9);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.2)),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.1)),
        }),
      ]).start();
    }, [fadeAnim, slideAnim, scaleAnim])
  );

  const analyticsData = {
    revenue: {
      current: '$0',
      change: '0%',
      data: [0, 0, 0, 0, 0, 0, 0],
      color: ['#667eea', '#764ba2'],
      icon: 'cash-multiple',
    },
    orders: {
      current: '0',
      change: '0%',
      data: [0, 0, 0, 0, 0, 0, 0],
      color: ['#f093fb', '#f5576c'],
      icon: 'cart-outline',
    },
    customers: {
      current: '0',
      change: '0%',
      data: [0, 0, 0, 0, 0, 0, 0],
      color: ['#4facfe', '#00f2fe'],
      icon: 'account-group',
    },
    satisfaction: {
      current: '0',
      change: '0',
      data: [0, 0, 0, 0, 0, 0, 0],
      color: ['#43e97b', '#38f9d7'],
      icon: 'star',
    },
  };

  const renderAnimatedCard = (
    key: string,
    title: string,
    data: any,
    index: number,
    isLarge: boolean = false
  ) => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        {
          translateY: slideAnim.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 50 + index * 20],
          }),
        },
        { scale: scaleAnim },
      ],
    };

    return (
      <Animated.View
        style={[
          animatedStyle,
          {
            backgroundColor: colors.surfaceVariant,
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 8,
            width: isLarge ? '100%' : '48%',
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setSelectedMetric(key)}
          activeOpacity={0.9}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: colors.onBackground, fontSize: 14, fontWeight: '500' }}>
                {title}
              </Text>
              <Text style={{ 
                fontSize: isLarge ? 32 : 24, 
                fontWeight: 'bold', 
                color: colors.onBackground,
                marginTop: 4 
              }}>
                {data.current}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <MaterialCommunityIcons
                  name="trending-up"
                  size={16}
                  color="#34C759"
                />
                <Text style={{ color: '#34C759', fontSize: 14, fontWeight: '600', marginLeft: 4 }}>
                  {data.change}
                </Text>
              </View>
            </View>
            
            <Animated.View
              style={{
                transform: [{ scale: selectedMetric === key ? pulseAnim : 1 }],
              }}
            >
              <LinearGradient
                colors={data.color}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name={data.icon}
                  size={28}
                  color="white"
                />
              </LinearGradient>
            </Animated.View>
          </View>
          
          {/* Mini Chart */}
          <View style={{ marginTop: 16, height: 40 }}>
            <View style={{ flexDirection: 'row', alignItems: "flex-end", height: 40 }}>
              {data.data.map((value: number, i: number) => {
                const maxValue = Math.max(...data.data);
                const height = (value / maxValue) * 40;
                return (
                  <Animated.View
                    key={i}
                    style={{
                      flex: 1,
                      marginHorizontal: 1,
                      backgroundColor: data.color[0],
                      height,
                      borderRadius: 2,
                      opacity: 0.8,
                      transform: [
                        {
                          scaleY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                        },
                      ],
                    }}
                  />
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderDetailedChart = () => {
    const selectedData = analyticsData[selectedMetric as keyof typeof analyticsData];
    
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          backgroundColor: colors.surfaceVariant,
          borderRadius: 20,
          padding: 20,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.onBackground }}>
            {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} {t('trend')}
          </Text>
          <LinearGradient
            colors={selectedData.color as [ColorValue, ColorValue, ...ColorValue[]]}
            style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
          >
            <MaterialCommunityIcons name={selectedData.icon as any} size={20} color="white" />
          </LinearGradient>
        </View>
        
        {/* Advanced Chart Visualization */}
        <View style={{ height: 200, justifyContent: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: "flex-end", height: 150 }}>
            {selectedData.data.map((value: number, index: number) => {
              const maxValue = Math.max(...selectedData.data);
              const height = (value / maxValue) * 150;
              
              return (
                <View key={index} style={{ flex: 1, alignItems: 'center' }}>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scaleY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                        },
                      ],
                    }}
                  >
                    <LinearGradient
                      colors={[selectedData.color[0], selectedData.color[1] + '60']}
                      style={{
                        width: 24,
                        height,
                        borderRadius: 12,
                        marginHorizontal: 4,
                      }}
                    />
                  </Animated.View>
                  <Text style={{ 
                    color: '#8E8E93', 
                    fontSize: 12, 
                    marginTop: 8,
                    fontWeight: '500'
                  }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Animated.View>
    );
  };

  const navigateToDashboard = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to DashboardScreen within the Analytics stack
      if (navigation) {
        navigation.navigate('DashboardScreen');
      }
    });
  };

  return (
    <CommonView>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={true}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingTop: 20,
            paddingBottom: 30,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.onBackground }}>
                {t('analytics')}
              </Text>
              <Text style={{ color: '#8E8E93', marginTop: 4, fontSize: 16 }}>
                {t('real_time_insights')}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={navigateToDashboard}
              style={{
                backgroundColor: '#007AFF',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 25,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#007AFF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <MaterialCommunityIcons name="view-dashboard" size={20} color="white" />
              <Text style={{ color: 'white', marginLeft: 8, fontWeight: '600' }}>
                {t('dashboard')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Time Range Selector */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            flexDirection: 'row',
            marginBottom: 24,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 16,
            padding: 4,
          }}
        >
          {['week', 'month', 'year'].map((range, index) => (
            <TouchableOpacity
              key={range}
              onPress={() => setTimeRange(range)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: timeRange === range ? colors.surface : 'transparent',
                alignItems: 'center',
                shadowColor: timeRange === range ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: timeRange === range ? 0.1 : 0,
                shadowRadius: 4,
                elevation: timeRange === range ? 2 : 0,
              }}
            >
              <Text
                style={{
                  color: timeRange === range ? colors.primary :colors.onBackground,
                  fontWeight: timeRange === range ? '600' : '500',
                  fontSize: 16,
                }}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Metrics Cards */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          {renderAnimatedCard('revenue', t('revenue'), analyticsData.revenue, 0)}
          {renderAnimatedCard('orders', t('orders'), analyticsData.orders, 1)}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          {renderAnimatedCard('customers', t('customers'), analyticsData.customers, 2)}
          {renderAnimatedCard('satisfaction', t('rating'), analyticsData.satisfaction, 3)}
        </View>

        {/* Detailed Chart */}
        {renderDetailedChart()}

        {/* Performance Summary */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            backgroundColor: colors.surfaceVariant,
            borderRadius: 20,
            padding: 20,
            marginBottom: 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color:colors.onBackground, marginBottom: 16 }}>
            {t('performance_summary')}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: colors.onBackground, fontSize: 16 }}>{t('peak_hours')}</Text>
            <Text style={{ color:colors.onBackground, fontWeight: '600', fontSize: 16 }}>N/A</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: colors.onBackground, fontSize: 16 }}>{t('top_category')}</Text>
            <Text style={{ color:colors.onBackground, fontWeight: '600', fontSize: 16 }}>N/A</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: colors.onBackground, fontSize: 16 }}>{t('avg_order_value')}</Text>
            <Text style={{ color: '#34C759', fontWeight: '600', fontSize: 16 }}>$0.00</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.onBackground, fontSize: 16 }}>{t('growth_rate')}</Text>
            <Text style={{ color: '#34C759', fontWeight: '600', fontSize: 16 }}>0%</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
  )
}