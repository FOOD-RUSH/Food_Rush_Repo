// Payment service - Mobile Money integration for Cameroon market
// Supports MTN Mobile Money and Orange Money with USSD code flow

import { apiClient } from '@/src/services/shared/apiClient';

export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'cash' | 'card';
  provider?: 'mtn' | 'orange_money'; // Only for mobile_money type
  name: string;
  isDefault: boolean;
}

export interface PaymentInitRequest {
  orderId: string;
  method: 'mobile_money';
  phone: string;
  medium: 'mtn' | 'orange_money';
  name: string;
  email: string;
}

export interface PaymentInitResponse {
  success: boolean;
  transactionId: string;
  ussdCode?: string;
  message: string;
  expiresAt?: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  transactionId: string;
  message: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  ussdCode?: string;
  error?: string;
  message?: string;
}

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
  validatePhoneNumber(
    phoneNumber: string,
    medium: 'mtn' | 'orange_money',
  ): boolean {
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    // MTN numbers: 67, 68, 65, 66 (Cameroon)
    // Orange numbers: 69, 65, 66 (some overlap with MTN)
    if (medium === 'mtn') {
      return /^(237)?(6[5-8])\d{7}$/.test(cleanNumber);
    } else if (medium === 'orange_money') {
      return /^(237)?(6[5-6,9])\d{7}$/.test(cleanNumber);
    }

    return false;
  }

  /**
   * Format phone number for API calls
   */
  formatPhoneNumber(phoneNumber: string): string {
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    // Add country code if not present
    if (cleanNumber.startsWith('6') && cleanNumber.length === 9) {
      return `237${cleanNumber}`;
    }

    return cleanNumber;
  }

  /**
   * Initialize Mobile Money payment
   */
  async initializePayment(request: PaymentInitRequest): Promise<PaymentResult> {
    try {

      // Validate phone number
      if (!this.validatePhoneNumber(request.phone, request.medium)) {
        return {
          success: false,
          error: `Invalid ${request.medium.toUpperCase()} phone number format`,
        };
      }

      // Validate required fields
      if (!request.orderId || !request.name || !request.email) {
        return {
          success: false,
          error: 'Order ID, name, and email are required',
        };
      }

      // Format phone number
      const formattedPhone = this.formatPhoneNumber(request.phone);

      // Prepare API request body according to your specification
      const paymentData = {
        orderId: request.orderId,
        method: request.method, // Always 'mobile_money'
        phone: formattedPhone,
        medium: request.medium, // 'mtn' or 'orange_money'
        name: request.name,
        email: request.email,
      };

      const response = await apiClient.post<PaymentInitResponse>(
        '/payments/init',
        paymentData,
      );

      if (response.data.success) {
        return {
          success: true,
          transactionId: response.data.transactionId,
          ussdCode: response.data.ussdCode,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          error: response.data.message,
        };
      }
    } catch (error: any) {
      console.error('❌ Payment initialization error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to initialize payment',
      };
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(
    transactionId: string,
  ): Promise<PaymentStatusResponse> {
    try {
      const response = await apiClient.get<PaymentStatusResponse>(
        `/payments/status/${transactionId}`,
      );

      return response.data;
    } catch (error: any) {
      console.error('Payment status check error:', error);
      return {
        success: false,
        status: 'failed',
        transactionId,
        message:
          error.response?.data?.message || 'Failed to check payment status',
      };
    }
  }

  /**
   * Process payment with selected method (legacy method for backward compatibility)
   */
  async processPayment(
    amount: number,
    method: PaymentMethod,
    orderId: string,
  ): Promise<PaymentResult> {
    try {

      // For Mobile Money, we need phone number - this should be handled by the UI
      if (method.type === 'mobile_money') {
        return {
          success: false,
          error: 'Phone number required for Mobile Money payments',
        };
      }

      // For other payment methods (future implementation)
      return {
        success: true,
        transactionId: `txn_${Date.now()}`,
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  /**
   * Get available payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // This would fetch from API or local storage
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
        provider: 'orange_money',
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
}

export default PaymentService.getInstance();
