// Payment service - Production-ready Mobile Money integration
// Supports MTN Mobile Money and Orange Money with robust polling

import { apiClient } from '@/src/services/shared/apiClient';
import { PaymentInitResponse } from '@/src/types/transaction';

export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'cash' | 'card';
  provider?: 'mtn' | 'orange';
  name: string;
  isDefault: boolean;
}

export interface PaymentInitRequest {
  orderId: string;
  method: 'mobile_money';
  phone: string;
  medium: 'mtn' | 'orange';
  name: string;
  email: string;
  serviceFee?: number;
}

export interface PaymentStatusResponse {
  success: boolean;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  transactionId: string;
  message: string;
  apiStatus?: 'SUCCESSFUL' | 'FAILED' | 'EXPIRED' | 'PENDING';
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  message?: string;
}

// Polling configuration for production
const POLLING_CONFIG = {
  INITIAL_DELAY: 3000, // 3 seconds before first check
  POLL_INTERVAL: 5000, // 5 seconds between polls
  MAX_POLL_DURATION: 120000, // 2 minutes total
  MAX_RETRIES: 3,
  BACKOFF_MULTIPLIER: 1.5,
  REQUEST_TIMEOUT: 10000,
};

// Active polling sessions to prevent duplicates
const activePollingSessions = new Map<string, AbortController>();

class PaymentService {
  private static instance: PaymentService;

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Validate phone number for Mobile Money providers
   */
  validatePhoneNumber(phoneNumber: string, medium: 'mtn' | 'orange'): boolean {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const localNumber = cleanNumber.startsWith('237')
      ? cleanNumber.substring(3)
      : cleanNumber;

    if (!/^\d{9}$/.test(localNumber)) {
      return false;
    }

    const prefix = localNumber.substring(0, 2);

    if (medium === 'mtn') {
      return ['65', '66', '67', '68'].includes(prefix);
    } else if (medium === 'orange') {
      return ['65', '66', '69'].includes(prefix);
    }

    return false;
  }

  /**
   * Format phone number for API calls
   */
  formatPhoneNumber(phoneNumber: string): string {
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    if (cleanNumber.startsWith('6') && cleanNumber.length === 9) {
      return cleanNumber;
    }

    return cleanNumber;
  }

  /**
   * Parse successful payment initialization response
   */
  private parsePaymentResponse(response: any): PaymentResult {
    const { status_code: statusCode, message, data } = response.data;

    if (statusCode === 200 && data?.transId) {
      return {
        success: true,
        transactionId: data.transId,
        message: data.message || message,
      };
    } else {
      return {
        success: false,
        error: message || 'Failed to initialize payment',
      };
    }
  }

  /**
   * Initialize Mobile Money payment
   */
  async initializePayment(request: PaymentInitRequest): Promise<PaymentResult> {
    try {
      if (!this.validatePhoneNumber(request.phone, request.medium)) {
        return {
          success: false,
          error: `Invalid ${request.medium.toUpperCase()} phone number format`,
        };
      }

      if (!request.orderId || !request.name || !request.email) {
        return {
          success: false,
          error: 'Order ID, name, and email are required',
        };
      }

      const formattedPhone = this.formatPhoneNumber(request.phone);

      const response = await apiClient.post<PaymentInitResponse>(
        '/payments/init',
        {
          orderId: request.orderId,
          method: request.method,
          phone: formattedPhone,
          medium: request.medium,
          name: request.name,
          email: request.email,
          ...(request.serviceFee && { serviceFee: request.serviceFee }),
        },
        { timeout: POLLING_CONFIG.REQUEST_TIMEOUT },
      );

      return this.parsePaymentResponse(response);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to initialize payment';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Check payment status with retry logic and exponential backoff
   */
  private async checkPaymentStatusWithRetry(
    transactionId: string,
    retryCount = 0,
  ): Promise<PaymentStatusResponse> {
    try {
      const response = await apiClient.get<any>(
        `/payments/verify?transId=${encodeURIComponent(transactionId)}`,
        { timeout: POLLING_CONFIG.REQUEST_TIMEOUT },
      );

      const apiData = response.data?.data || response.data;
      const apiStatus = apiData?.status;

      let internalStatus: 'pending' | 'completed' | 'failed' | 'expired';
      let success = false;
      let message = '';

      switch (apiStatus) {
        case 'SUCCESSFUL':
          internalStatus = 'completed';
          success = true;
          message =
            'Payment completed successfully! Your order has been confirmed.';

          break;
        case 'FAILED':
          internalStatus = 'failed';
          success = false;
          message =
            'Payment failed. Please try again or use a different payment method.';

          break;
        case 'EXPIRED':
          internalStatus = 'expired';
          success = false;
          message = 'Payment session expired. Please initiate a new payment.';

          break;
        case 'PENDING':
        default:
          internalStatus = 'pending';
          success = false;
          message = 'Payment is still being processed. Please wait...';

          break;
      }

      return {
        success,
        status: internalStatus,
        transactionId: apiData?.transId || transactionId,
        message,
        apiStatus,
      };
    } catch (error: any) {
      // Retry logic with exponential backoff for transient errors
      if (
        retryCount < POLLING_CONFIG.MAX_RETRIES &&
        (error.code === 'ECONNABORTED' ||
          error.response?.status === 429 ||
          error.response?.status >= 500)
      ) {
        const backoffDelay = Math.min(
          1000 * Math.pow(POLLING_CONFIG.BACKOFF_MULTIPLIER, retryCount),
          10000,
        );

        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        return this.checkPaymentStatusWithRetry(transactionId, retryCount + 1);
      }

      return {
        success: false,
        status: 'failed',
        transactionId,
        message:
          error.response?.data?.message ||
          'Failed to check payment status. Please try again.',
      };
    }
  }

  /**
   * Poll payment status with proper cleanup and deduplication
   * Returns an AbortController for manual cancellation
   * Enhanced for Android compatibility
   */
  async pollPaymentStatus(
    transactionId: string,
    onStatusChange: (status: PaymentStatusResponse) => void,
    onError?: (error: string) => void,
  ): Promise<AbortController> {
    // Cancel any existing polling for this transaction
    const existingController = activePollingSessions.get(transactionId);
    if (existingController) {
      try {
        existingController.abort();
      } catch (e) {
        // Ignore abort errors on older Android versions
        console.warn('Error aborting existing controller:', e);
      }
    }

    // Use AbortController with error handling for Android
    let abortController: AbortController;
    try {
      abortController = new AbortController();
    } catch (e) {
      // Fallback for environments without AbortController
      console.warn('AbortController not available, using manual abort flag');
      abortController = {
        signal: { aborted: false },
        abort: function () {
          this.signal.aborted = true;
        },
      } as any;
    }
    activePollingSessions.set(transactionId, abortController);

    const startTime = Date.now();

    const poll = async () => {
      // Check if polling should be aborted
      if (abortController.signal.aborted) {
        activePollingSessions.delete(transactionId);
        return;
      }

      // Check if max poll duration exceeded
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > POLLING_CONFIG.MAX_POLL_DURATION) {
        const timeoutError =
          'Payment verification timeout. Please check your transaction status manually.';
        onError?.(timeoutError);
        activePollingSessions.delete(transactionId);
        return;
      }

      try {
        const status = await this.checkPaymentStatusWithRetry(transactionId);

        // Check if aborted before calling callback (Android safety)
        if (abortController.signal.aborted) {
          activePollingSessions.delete(transactionId);
          return;
        }

        // Call status change callback with try-catch for Android
        try {
          onStatusChange(status);
        } catch (callbackError) {
          console.error('Error in status callback:', callbackError);
        }

        // Stop polling if terminal state reached
        if (
          status.status === 'completed' ||
          status.status === 'failed' ||
          status.status === 'expired'
        ) {
          activePollingSessions.delete(transactionId);
          return;
        }

        // Schedule next poll (with safety check)
        if (!abortController.signal.aborted) {
          // Use setImmediate for better Android compatibility
          const timerId = setTimeout(() => {
            if (!abortController.signal.aborted) {
              poll();
            }
          }, POLLING_CONFIG.POLL_INTERVAL);

          // Store timer ID for cleanup if needed
          (abortController as any).timerId = timerId;
        }
      } catch (error) {
        console.error('Polling error:', error);
        const errorMsg =
          error instanceof Error ? error.message : 'Polling error occurred';

        // Check if aborted before calling error callback
        if (!abortController.signal.aborted) {
          onError?.(errorMsg);
        }
        activePollingSessions.delete(transactionId);
      }
    };

    // Start polling after initial delay
    setTimeout(poll, POLLING_CONFIG.INITIAL_DELAY);

    return abortController;
  }

  /**
   * Manually check payment status (single request, no polling)
   */
  async checkPaymentStatus(
    transactionId: string,
  ): Promise<PaymentStatusResponse> {
    return this.checkPaymentStatusWithRetry(transactionId);
  }

  /**
   * Stop polling for a specific transaction
   * Enhanced with cleanup for Android
   */
  stopPolling(transactionId: string): void {
    const controller = activePollingSessions.get(transactionId);
    if (controller) {
      try {
        // Clear any pending timeouts
        if ((controller as any).timerId) {
          clearTimeout((controller as any).timerId);
        }
        controller.abort();
      } catch (e) {
        console.warn('Error stopping polling:', e);
      } finally {
        activePollingSessions.delete(transactionId);
      }
    }
  }

  /**
   * Stop all active polling sessions
   */
  stopAllPolling(): void {
    activePollingSessions.forEach((controller) => {
      controller.abort();
    });
    activePollingSessions.clear();
  }

  /**
   * Get available payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return [
      {
        id: 'mtn_mobile_money',
        type: 'mobile_money',
        provider: 'mtn',
        name: 'MTN Mobile Money',
        isDefault: true,
      },
      {
        id: 'orange_money',
        type: 'mobile_money',
        provider: 'orange',
        name: 'Orange Money',
        isDefault: false,
      },
      {
        id: 'cash_on_delivery',
        type: 'cash',
        name: 'Cash on Delivery',
        isDefault: false,
      },
    ];
  }

  /**
   * Process payment (legacy method)
   */
  async processPayment(
    amount: number,
    method: PaymentMethod,
    orderId: string,
  ): Promise<PaymentResult> {
    if (method.type === 'mobile_money') {
      return {
        success: false,
        error: 'Phone number required for Mobile Money payments',
      };
    }

    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
    };
  }
}

export default PaymentService.getInstance();
