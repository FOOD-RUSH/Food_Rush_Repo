export default ({ config }) => {
  return {
    name: 'Foodrush',
    slug: 'food-rush',
    version: '1.1.0',
    orientation: 'portrait',
    icon: './assets/FoodRush.png',
    scheme: 'foodrush',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    platforms: ['android', 'ios'],
    splash: {
      image: './assets/images/SplashScreen.png',
      resizeMode: 'contain',
      backgroundColor: '#06102b'
    },
    android: {
      package: 'com.mrcalculus.foodrush',
      adaptiveIcon: {
        foregroundImage: './assets/FoodRush-adaptive.png',
        backgroundColor: '#FFFFFF'
      },
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'INTERNET',
        'ACCESS_NETWORK_STATE'
      ]
    },
    ios: {
      bundleIdentifier: 'com.mrcalculus.foodrush',
      buildNumber: '1',
      supportsTablet: true
    },
    assetBundlePatterns: [
      'assets/fonts/**',
      'assets/images/**',
      'assets/sounds/**'
    ],
    plugins: [
      'expo-font',
      'expo-asset',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUseUsageDescription: 'This app needs your location to show nearby restaurants.',
          locationWhenInUsePermission: 'This app needs your location to show nearby restaurants.'
        }
      ],
      [
        'expo-notifications',
        {
          icon: './assets/images/notification-icon.png',
          color: '#007aff'
        }
      ],
      [
        '@sentry/react-native/expo',
        {
          organization: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
        }
      ]
    ],
    extra: {
      eas: {
        projectId: '08bd6b92-2717-47f7-b11c-ed37f5126c0e'
      }
    },
    owner: 'mr_calculus',
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
          }
        }
      ]
    }
  };
};
