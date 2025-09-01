import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

const DashboardScreen = ({ navigation }: any) => {
  const [timeRange, setTimeRange] = useState('week');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const screenWidth = Dimensions.get('window').width;

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
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]).start(() => startPulse());
    };
    startPulse();
  }, []);

  const dashboardData = {
    todayStats: {
      orders: { value: 47, change: '+12%', color: '#FF6B6B' },
      revenue: { value: '$1,240', change: '+8%', color: '#4ECDC4' },
      customers: { value: 32, change: '+15%', color: '#A8E6CF' },
      avgOrder: { value: '$26.38', change: '+3%', color: '#FFD93D' },
    },
    recentOrders: [
      { id: '#1234', customer: 'John Doe', amount: '$24.50', status: 'completed', time: '2 min ago' },
      { id: '#1235', customer: 'Jane Smith', amount: '$18.75', status: 'preparing', time: '5 min ago' },
      { id: '#1236', customer: 'Mike Johnson', amount: '$32.20', status: 'delivered', time: '8 min ago' },
      { id: '#1237', customer: 'Sarah Wilson', amount: '$15.90', status: 'pending', time: '12 min ago' },
    ],
    topItems: [
      { name: 'Margherita Pizza', orders: 28, revenue: '$420', trend: 'up' },
      { name: 'Caesar Salad', orders: 19, revenue: '$285', trend: 'up' },
      { name: 'Pasta Carbonara', orders: 15, revenue: '$225', trend: 'down' },
      { name: 'Grilled Salmon', orders: 12, revenue: '$360', trend: 'up' },
    ]
  };

  const navigateToAnalytics = () => {
    if (navigation) {
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
        // Navigate back to AnalyticsScreen in the stack
        navigation.goBack();
      });
    }
  };

  const renderStatCard = (
    title: string,
    data: any,
    icon: string,
    index: number
  ) => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        {
          translateY: slideAnim.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 50 + index * 15],
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
            flex: 1,
            marginHorizontal: 6,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'white',
            borderRadius: 18,
            padding: 18,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 6,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: data.color,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <MaterialCommunityIcons name={icon as any} size={24} color="white" />
            </Animated.View>
            
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1D1D1F', marginBottom: 4 }}>
              {data.value}
            </Text>
            
            <Text style={{ color: '#8E8E93', fontSize: 12, fontWeight: '500', marginBottom: 6 }}>
              {title}
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="trending-up"
                size={14}
                color="#34C759"
              />
              <Text style={{ color: '#34C759', fontSize: 12, fontWeight: '600', marginLeft: 3 }}>
                {data.change}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderRecentOrders = () => (
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1D1D1F' }}>
          Recent Orders
        </Text>
        <TouchableOpacity>
          <Text style={{ color: '#007AFF', fontWeight: '600' }}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {dashboardData.recentOrders.map((order, index) => (
        <Animated.View
          key={order.id}
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, -20],
                }),
              },
            ],
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: index < dashboardData.recentOrders.length - 1 ? 1 : 0,
            borderBottomColor: '#F2F2F7',
          }}
        >
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: getStatusColor(order.status),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <MaterialCommunityIcons
              name={getStatusIcon(order.status)}
              size={20}
              color="white"
            />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1D1D1F', marginBottom: 2 }}>
              {order.customer}
            </Text>
            <Text style={{ fontSize: 14, color: '#8E8E93' }}>
              {order.id} • {order.time}
            </Text>
          </View>
          
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1D1D1F', marginBottom: 2 }}>
              {order.amount}
            </Text>
            <View style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 8,
              backgroundColor: getStatusBg(order.status),
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: getStatusColor(order.status),
                textTransform: 'capitalize',
              }}>
                {order.status}
              </Text>
            </View>
          </View>
        </Animated.View>
      ))}
    </Animated.View>
  );

  const renderTopItems = () => (
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
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1D1D1F', marginBottom: 16 }}>
        Top Selling Items
      </Text>
      
      {dashboardData.topItems.map((item, index) => (
        <Animated.View
          key={item.name}
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 20],
                }),
              },
            ],
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: index < dashboardData.topItems.length - 1 ? 1 : 0,
            borderBottomColor: '#F2F2F7',
          }}
        >
          <View style={{
            width: 6,
            height: 40,
            borderRadius: 3,
            backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#8E8E93',
            marginRight: 12,
          }} />
          
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1D1D1F', marginBottom: 4 }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 14, color: '#8E8E93' }}>
              {item.orders} orders • {item.revenue}
            </Text>
          </View>
          
          <MaterialCommunityIcons
            name={item.trend === 'up' ? 'trending-up' : 'trending-down'}
            size={20}
            color={item.trend === 'up' ? '#34C759' : '#FF3B30'}
          />
        </Animated.View>
      ))}
    </Animated.View>
  );

  const renderQuickActions = () => (
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
        Quick Actions
      </Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[
          { title: 'New Order', icon: 'plus-circle', color: '#667eea' },
          { title: 'Menu', icon: 'food', color: '#f093fb' },
          { title: 'Reports', icon: 'chart-line', color: '#4facfe' },
          { title: 'Settings', icon: 'cog', color: '#43e97b' },
        ].map((action, index) => (
          <TouchableOpacity
            key={action.title}
            activeOpacity={0.8}
            style={{ alignItems: 'center', flex: 1 }}
          >
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: action.color,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <MaterialCommunityIcons
                name={action.icon as any}
                size={26}
                color="white"
              />
            </Animated.View>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#1D1D1F' }}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#34C759';
      case 'delivered': return '#007AFF';
      case 'preparing': return '#FF9500';
      case 'pending': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed': return '#34C75920';
      case 'delivered': return '#007AFF20';
      case 'preparing': return '#FF950020';
      case 'pending': return '#FF3B3020';
      default: return '#8E8E9320';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'check-circle';
      case 'delivered': return 'truck-delivery';
      case 'preparing': return 'chef-hat';
      case 'pending': return 'clock-outline';
      default: return 'help-circle';
    }
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
                Dashboard
              </Text>
              <Text style={{ color: '#8E8E93', marginTop: 4, fontSize: 16 }}>
                Welcome back! Here&#39;s your overview
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#F2F2F7',
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons name="bell-outline" size={22} color="#1D1D1F" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={navigateToAnalytics}
                style={{
                  backgroundColor: '#007AFF',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 22,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#007AFF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                <MaterialCommunityIcons name="chart-box" size={18} color="white" />
                <Text style={{ color: 'white', marginLeft: 6, fontWeight: '600' }}>
                  Analytics
                </Text>
              </TouchableOpacity>
            </View>
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
          {['today', 'week', 'month'].map((range) => (
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
                  textTransform: 'capitalize',
                }}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          {renderStatCard('Orders', dashboardData.todayStats.orders, 'cart-outline', 0)}
          {renderStatCard('Revenue', dashboardData.todayStats.revenue, 'cash-multiple', 1)}
        </View>
        
        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          {renderStatCard('Customers', dashboardData.todayStats.customers, 'account-group', 2)}
          {renderStatCard('Avg Order', dashboardData.todayStats.avgOrder, 'calculator', 3)}
        </View>

        {/* Recent Orders */}
        {renderRecentOrders()}

        {/* Top Items */}
        {renderTopItems()}

        {/* Quick Actions */}
        {renderQuickActions()}
      </ScrollView>
    </CommonView>
