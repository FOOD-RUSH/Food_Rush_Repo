// Payment service - Mobile Money integration for Cameroon market
// Supports MTN Mobile Money and Orange Money with USSD code flow

import { apiClient } from '@/src/services/shared/apiClient';
import { PaymentInitResponse } from '@/src/types/transaction';

export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'cash' | 'card';
  provider?: 'mtn' | 'orange'; // Only for mobile_money type
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
  serviceFee?: number; // Optional service fee field
}

// PaymentInitResponse is now imported from types/transaction.ts

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
    medium: 'mtn' | 'orange',
  ): boolean {
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    // Remove country code if present
    const localNumber = cleanNumber.startsWith('237') 
      ? cleanNumber.substring(3) 
      : cleanNumber;

    // Must be exactly 9 digits
    if (!/^\d{9}$/.test(localNumber)) {
      return false;
    }

    // Get the first two digits (prefix)
    const prefix = localNumber.substring(0, 2);
    
    if (medium === 'mtn') {
      // MTN prefixes: 65, 66, 67, 68
      return ['65', '66', '67', '68'].includes(prefix);
    } else if (medium === 'orange') {
      // Orange prefixes: 65, 66, 69 (some overlap with MTN)
      return ['65', '66', '69'].includes(prefix);
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
      return `${cleanNumber}`;
    }

    return cleanNumber;
  }

  /**
   * Parse successful payment initialization response
   */
  private parsePaymentResponse(response: any): PaymentResult {
    const { status_code, message, data } = response.data;
    
    if (response.data?.status_code === 200 && response.data?.data?.transId) {
      return {
        success: true,
        transactionId: data.transId,
        ussdCode: data.ussdCode,
        message: data.message || message,
      };
    } else {
      console.error('❌ Payment initialization failed:', {
        status_code,
        message,
        data,
      });
      
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


      // Validate phone number
      if (!this.validatePhoneNumber(request.phone, request.medium)) {
        console.error('❌ Invalid phone number:', {
          phone: request.phone.substring(0, 3) + '****' + request.phone.substring(7),
          medium: request.medium,
        });
        return {
          success: false,
          error: `Invalid ${request.medium.toUpperCase()} phone number format`,
        };
      }

      // Validate required fields
      if (!request.orderId || !request.name || !request.email) {
        console.error('❌ Missing required fields:', {
          orderId: !!request.orderId,
          name: !!request.name,
          email: !!request.email,
        });
        return {
          success: false,
          error: 'Order ID, name, and email are required',
        };
      }

      // Format phone number
      const formattedPhone = this.formatPhoneNumber(request.phone);

      // Prepare API request body according to your specification
      // const paymentData = {
      //   orderId: request.orderId,
      //   method: request.method, // Always 'mobile_money'
      //   phone: formattedPhone,
      //   medium: request.medium, // 'mtn' or 'orange'
      //   name: request.name,
      //   email: request.email,
      //   ...(request.serviceFee && { serviceFee: request.serviceFee }), // Include service fee if provided
      // };

      const response = await apiClient.post<PaymentInitResponse>('/payment/initialize', request);
      return this.parsePaymentResponse(response);
    } catch (error: any) {
      console.error('❌ Payment initialization error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to initialize payment',
      };
    }
  }

  /**
   * Check payment status using the verify endpoint as per API documentation
   */
  async checkPaymentStatus(
    transactionId: string,
  ): Promise<PaymentStatusResponse> {
    try {
      const response = await apiClient.get<PaymentStatusResponse>(`/payment/status/${transactionId}`);

      // Transform the API response to match our interface
      const apiData = response.data;
      const apiStatus = apiData.status;
      
      // Map API status to our internal status
      let internalStatus: 'pending' | 'completed' | 'failed' | 'expired';
      let success = false;
      let message = '';
      
      switch (apiStatus) {
        case 'SUCCESSFUL':
          internalStatus = 'completed';
          success = true;
          message = 'Payment completed successfully';
          break;
        case 'FAILED':
          internalStatus = 'failed';
          success = false;
          message = 'Payment failed';
          break;
        case 'EXPIRED':
          internalStatus = 'expired';
          success = false;
          message = 'Payment session expired';
          break;
        case 'PENDING':
        default:
          internalStatus = 'pending';
          success = false;
          message = 'Payment is pending';
          break;
      }
      

      
      return {
        success,
        status: internalStatus,
        transactionId: apiData.transId || transactionId,
        message,
        apiStatus,
      };
    } catch (error: any) {
      console.error('❌ Payment status check error:', error);
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
}

export default PaymentService.getInstance();
