import { Dimensions } from 'react-native';

// Test screen configurations for different device sizes
export interface TestScreenConfig {
  name: string;
  width: number;
  height: number;
  pixelRatio: number;
  isTablet: boolean;
  description: string;
}

export const TEST_SCREEN_CONFIGS: TestScreenConfig[] = [
  // iPhone SE (1st gen) - Small phone
  {
    name: 'iPhone SE',
    width: 320,
    height: 568,
    pixelRatio: 2,
    isTablet: false,
    description: 'Small phone, low-end device',
  },

  // iPhone 12/13 - Standard phone
  {
    name: 'iPhone 12',
    width: 390,
    height: 844,
    pixelRatio: 3,
    isTablet: false,
    description: 'Standard modern phone',
  },

  // iPhone 12 Pro Max - Large phone
  {
    name: 'iPhone 12 Pro Max',
    width: 428,
    height: 926,
    pixelRatio: 3,
    isTablet: false,
    description: 'Large modern phone',
  },

  // iPad Mini - Small tablet
  {
    name: 'iPad Mini',
    width: 768,
    height: 1024,
    pixelRatio: 2,
    isTablet: true,
    description: 'Small tablet',
  },

  // iPad Pro 11" - Standard tablet
  {
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    pixelRatio: 2,
    isTablet: true,
    description: 'Standard tablet',
  },

  // iPad Pro 12.9" - Large tablet
  {
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    pixelRatio: 2,
    isTablet: true,
    description: 'Large tablet',
  },

  // Samsung Galaxy S20 - Android phone
  {
    name: 'Galaxy S20',
    width: 360,
    height: 800,
    pixelRatio: 3,
    isTablet: false,
    description: 'Android flagship phone',
  },

  // Samsung Galaxy Tab S7 - Android tablet
  {
    name: 'Galaxy Tab S7',
    width: 800,
    height: 1280,
    pixelRatio: 2,
    isTablet: true,
    description: 'Android tablet',
  },
];

// Mock Dimensions for testing (simplified for development)
export const mockDimensions = (config: TestScreenConfig) => {
  // This is a simplified version for development testing
  // In a real test environment, you would use Jest mocks
  console.log(
    `Mocking dimensions for ${config.name}: ${config.width}x${config.height}`,
  );

  return () => {
    console.log(`Restoring original dimensions`);
  };
};

// Test utilities for responsive components (development helpers)
export const createResponsiveTestSuite = (componentName: string) => {
  console.log(`Creating responsive test suite for ${componentName}`);

  TEST_SCREEN_CONFIGS.forEach((config) => {
    console.log(
      `Test config: ${config.name} (${config.width}x${config.height})`,
    );
    console.log(`- Is tablet: ${config.isTablet}`);
    console.log(`- Pixel ratio: ${config.pixelRatio}`);
    console.log(`- Description: ${config.description}`);
  });

  return {
    componentName,
    configs: TEST_SCREEN_CONFIGS,
    mockFunction: mockDimensions,
  };
};

// Utility to get test configuration by name
export const getTestConfig = (name: string): TestScreenConfig | undefined => {
  return TEST_SCREEN_CONFIGS.find((config) => config.name === name);
};

// Generate test data for different screen sizes
export const generateResponsiveTestData = () => {
  return TEST_SCREEN_CONFIGS.map((config) => ({
    ...config,
    expectedBreakpoints: {
      isSmallDevice: config.width < 380,
      isTablet: config.isTablet,
      isLargeScreen: config.width >= 768,
    },
    expectedSpacing: {
      small: config.isTablet ? 8 : 4,
      medium: config.isTablet ? 16 : 8,
      large: config.isTablet ? 24 : 16,
    },
    expectedTypography: {
      body: config.isTablet ? 16 : 14,
      heading: config.isTablet ? 24 : 20,
      caption: config.isTablet ? 12 : 10,
    },
  }));
};

// Performance testing helper (development)
export const createPerformanceTestSuite = (componentName: string) => {
  console.log(`⚡ Creating performance test suite for ${componentName}`);

  TEST_SCREEN_CONFIGS.forEach((config) => {
    const budget = config.isTablet ? 100 : 50; // ms
    console.log(`${config.name}: Performance budget = ${budget}ms`);
  });

  return {
    componentName,
    configs: TEST_SCREEN_CONFIGS,
    budgets: TEST_SCREEN_CONFIGS.map((config) => ({
      name: config.name,
      budget: config.isTablet ? 100 : 50,
    })),
  };
};

// Accessibility testing helper (development)
export const createAccessibilityTestSuite = (componentName: string) => {
  console.log(`♿ Creating accessibility test suite for ${componentName}`);

  TEST_SCREEN_CONFIGS.forEach((config) => {
    const minTouchTarget = config.isTablet ? 44 : 40;
    console.log(`${config.name}: Min touch target = ${minTouchTarget}px`);
  });

  return {
    componentName,
    configs: TEST_SCREEN_CONFIGS,
    requirements: {
      minTouchTarget: 35, // WCAG AA
      minContrastRatio: 4.5,
      supportsScreenReader: true,
    },
  };
};

// Visual testing helper (development)
export const createVisualTestSuite = (componentName: string) => {
  console.log(`👁️ Creating visual test suite for ${componentName}`);

  TEST_SCREEN_CONFIGS.forEach((config) => {
    console.log(
      `${config.name}: ${config.width}x${config.height} (${config.description})`,
    );
  });

  return {
    componentName,
    configs: TEST_SCREEN_CONFIGS,
    visualChecks: [
      'layout_alignment',
      'spacing_consistency',
      'color_contrast',
      'touch_targets',
      'text_readability',
    ],
  };
};
