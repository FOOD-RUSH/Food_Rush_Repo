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
import CommonView from '@/src/components/common/CommonView';
import { useFocusEffect } from '@react-navigation/native';

const AnalyticsScreen = ({ navigation }: any) => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

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
  }, []);

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
    }, [])
  );

  const analyticsData = {
    revenue: {
      current: '$12,450',
      change: '+15.3%',
      data: [2400, 2800, 3200, 2900, 3800, 4200, 3900],
      color: ['#667eea', '#764ba2'],
      icon: 'cash-multiple',
    },
    orders: {
      current: '1,284',
      change: '+8.7%',
      data: [180, 220, 190, 280, 320, 350, 310],
      color: ['#f093fb', '#f5576c'],
      icon: 'cart-outline',
    },
    customers: {
      current: '856',
      change: '+12.1%',
      data: [120, 140, 160, 180, 200, 220, 210],
      color: ['#4facfe', '#00f2fe'],
      icon: 'account-group',
    },
    satisfaction: {
      current: '4.8',
      change: '+0.3',
      data: [4.2, 4.4, 4.6, 4.5, 4.7, 4.8, 4.8],
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
            backgroundColor: 'white',
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
              <Text style={{ color: '#8E8E93', fontSize: 14, fontWeight: '500' }}>
                {title}
              </Text>
              <Text style={{ 
                fontSize: isLarge ? 32 : 24, 
                fontWeight: 'bold', 
                color: '#1D1D1F',
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
          backgroundColor: 'white',
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1D1D1F' }}>
            {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trend
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
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1D1D1F' }}>
                Analytics
              </Text>
              <Text style={{ color: '#8E8E93', marginTop: 4, fontSize: 16 }}>
                Real-time business insights
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
                Dashboard
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
            backgroundColor: '#F2F2F7',
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
                backgroundColor: timeRange === range ? 'white' : 'transparent',
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
                  color: timeRange === range ? '#007AFF' : '#8E8E93',
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
          {renderAnimatedCard('revenue', 'Revenue', analyticsData.revenue, 0)}
          {renderAnimatedCard('orders', 'Orders', analyticsData.orders, 1)}
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          {renderAnimatedCard('customers', 'Customers', analyticsData.customers, 2)}
          {renderAnimatedCard('satisfaction', 'Rating', analyticsData.satisfaction, 3)}
        </View>

        {/* Detailed Chart */}
        {renderDetailedChart()}

        {/* Performance Summary */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            backgroundColor: 'white',
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1D1D1F', marginBottom: 16 }}>
            Performance Summary
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#8E8E93', fontSize: 16 }}>Peak Hours</Text>
            <Text style={{ color: '#1D1D1F', fontWeight: '600', fontSize: 16 }}>12:00 - 14:00</Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#8E8E93', fontSize: 16 }}>Top Category</Text>
            <Text style={{ color: '#1D1D1F', fontWeight: '600', fontSize: 16 }}>Main Dishes</Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#8E8E93', fontSize: 16 }}>Avg. Order Value</Text>
            <Text style={{ color: '#34C759', fontWeight: '600', fontSize: 16 }}>$24.80</Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#8E8E93', fontSize: 16 }}>Growth Rate</Text>
            <Text style={{ color: '#34C759', fontWeight: '600', fontSize: 16 }}>+18.5%</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </CommonView>
