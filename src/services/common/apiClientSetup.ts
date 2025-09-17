// Setup file to configure the unified API client with auth store integration
import { apiClient } from '../apiClient';

// This function should be called during app initialization
export const setupApiClient = () => {
  // The logout callback is already set up in the AuthStore
  // This function is kept for backward compatibility and future setup needs
  console.log('Unified API client is ready');
};

// Export the unified API client
export const getApiClient = () => {
  return apiClient;
};

// For backward compatibility
export const setupApiClients = setupApiClient;