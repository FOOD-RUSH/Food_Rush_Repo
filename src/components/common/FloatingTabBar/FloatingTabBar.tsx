import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { useAppNavigationTheme } from '../../../config/theme';
import { IoniconsIcon, IoniconsName } from '../icons';

const { width: screenWidth } = Dimensions.get('window');

interface FloatingTabBarProps extends BottomTabBarProps {
  userType?: 'customer' | 'restaurant';
}

const FloatingTabBar: React.FC<FloatingTabBarProps> = ({
  state,
  descriptors,
  navigation,
  userType = 'customer',
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const navigationTheme = useAppNavigationTheme();

  // Calculate tab bar dimensions
  const tabBarWidth = screenWidth * 0.9; // 90% of screen width for better coverage
  const tabBarHeight = 70; // Slightly taller for better touch targets
  const bottomMargin = Platform.OS === 'ios' ? insets.bottom : 35; // More space from bottom

  const getIconName = (routeName: string, focused: boolean): IoniconsName => {
    if (userType === 'customer') {
      switch (routeName) {
        case 'Home':
          return focused ? 'home' : 'home-outline';
        case 'Orders':
          return focused ? 'bookmark' : 'bookmark-outline';
        case 'Profile':
          return focused ? 'person' : 'person-outline';
        default:
          return 'help-outline';
      }
    } else {
      // Restaurant icons
      switch (routeName) {
        case 'Orders':
          return focused ? 'receipt' : 'receipt-outline';
        case 'Menu':
          return focused ? 'restaurant' : 'restaurant-outline';
        case 'Analytics':
          return focused ? 'bar-chart' : 'bar-chart-outline';
        case 'Account':
          return focused ? 'person' : 'person-outline';
        default:
          return 'help-outline';
      }
    }
  };

  const getTabLabel = (routeName: string): string => {
    const descriptor = descriptors[state.routes[state.index].key];
    const label = descriptor.options.tabBarLabel;

    if (typeof label === 'string') {
      return label;
    }

    return routeName;
  };

  return (
    <View style={[styles.container, { bottom: bottomMargin }]}>
      <View
        style={[
          styles.tabBar,
          {
            width: tabBarWidth,
            height: tabBarHeight,
            backgroundColor: navigationTheme.colors.card,
            shadowColor: navigationTheme.dark ? '#000' : '#000',
            borderWidth: navigationTheme.dark ? 0 : 0.5,
            borderColor: navigationTheme.dark
              ? 'transparent'
              : colors.outline + '20',
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const iconName = getIconName(route.name, isFocused);
          const label = getTabLabel(route.name);

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tabItem,
                {
                  backgroundColor: isFocused
                    ? `${navigationTheme.colors.primary}15`
                    : 'transparent',
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <IoniconsIcon
                  name={iconName}
                  size={24}
                  color={
                    isFocused
                      ? navigationTheme.colors.primary
                      : colors.onSurfaceVariant
                  }
                />
                {isFocused && (
                  <View
                    style={[
                      styles.indicator,
                      { backgroundColor: navigationTheme.colors.primary },
                    ]}
                  />
                )}
              </View>
              {isFocused && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: navigationTheme.colors.primary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    // Enhanced shadow for better floating effect
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 22,
    minHeight: 50,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Urbanist-SemiBold',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default FloatingTabBar;
