/**
 * Tests for app reset utilities
 */

import { performCompleteAppReset, switchUserType, clearSessionData } from '../appReset';

// Mock the navigation helpers
jest.mock('../../navigation/navigationHelpers', () => ({
  reset: jest.fn(),
}));

// Mock the stores
jest.mock('../../stores/customerStores/cartStore', () => ({
  useCartStore: {
    getState: () => ({
      clearCart: jest.fn(),
    }),
  },
}));

jest.mock('../../stores/customerStores/AppStore', () => ({
  useAppStore: {
    getState: () => ({
      isOnboardingComplete: true,
      resetApp: jest.fn(),
      completeOnboarding: jest.fn(),
      setUserType: jest.fn(),
    }),
  },
}));

jest.mock('../../stores/customerStores/AuthStore', () => ({
  useAuthStore: {
    getState: () => ({
      selectedUserType: 'customer',
      resetAuth: jest.fn(),
      setSelectedUserType: jest.fn(),
    }),
  },
}));

// Mock the token manager
jest.mock('../../services/customer/tokenManager', () => ({
  default: {
    clearAllTokens: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('App Reset Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('performCompleteAppReset', () => {
    it('should successfully reset the app with default options', async () => {
      const result = await performCompleteAppReset();
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
      // Mock an error in token clearing
      const TokenManager = require('../../services/customer/tokenManager').default;
      TokenManager.clearAllTokens.mockRejectedValueOnce(new Error('Token clear failed'));

      const result = await performCompleteAppReset();
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('switchUserType', () => {
    it('should successfully switch user type', async () => {
      const result = await switchUserType('restaurant');
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('clearSessionData', () => {
    it('should successfully clear session data', async () => {
      const result = await clearSessionData();
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});