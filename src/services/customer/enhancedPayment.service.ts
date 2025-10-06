// Enhanced Payment Service - Production-ready Mobile Money integration
// Implements the complete payment flow as specified in the API documentation

import { apiClient } from '@/src/services/shared/apiClient';

export interface PaymentInitRequest {
  orderId: string;
  method: 'mobile_money';
  phone: string;
  medium: 'mtn' | 'orange';
  name: string;
  email: string;
}

export interface PaymentInitResponse {
  status_code: number;
  message: string;
  data: {
    transId: string;
    status: 'PENDING';
    amount: number;
    message: string;
  };
}

export interface PaymentVerificationResponse {
  transId: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  medium: string;
  serviceName: string;
  amount: number;
  payerName: string;
  email: string;
  financialTransId?: string;
  dateInitiated: string;
  dateConfirmed?: string;
}

export interface PaymentStatusResponse {
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  paid: boolean;
  transId: string;
  medium: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  message?: string;
  status?: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
}

export interface PaymentPollingResult {
  success: boolean;
  status: 'SUCCESSFUL' | 'FAILED' | 'TIMEOUT';
  transactionId: string;
  error?: string;
  details?: PaymentVerificationResponse;
}

class EnhancedPaymentService {
  private static instance: EnhancedPaymentService;
  private readonly POLLING_INTERVAL = 3000; // 3 seconds
  private readonly PAYMENT_TIMEOUT = 300000; // 5 minutes
  private readonly MAX_RETRY_ATTEMPTS = 3;

  static getInstance(): EnhancedPaymentService {
    if (!EnhancedPaymentService.instance) {
      EnhancedPaymentService.instance = new EnhancedPaymentService();
    }
    return EnhancedPaymentService.instance;
  }

  /**
   * Validate phone number for Cameroon Mobile Money providers
   */
  validatePhoneNumber(phoneNumber: string, medium: 'mtn' | 'orange'): boolean {
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Remove country code if present
    const localNumber = cleanNumber.startsWith('237') 
      ? cleanNumber.substring(3) 
      : cleanNumber;

    // Validate format: 9 digits starting with 6
    if (!/^6\d{8}$/.test(localNumber)) {
      return false;
    }

    // Provider-specific validation
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
   * Format phone number for API calls (9 digits without country code)
   */
  formatPhoneNumber(phoneNumber: string): string {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Remove country code if present
    if (cleanNumber.startsWith('237') && cleanNumber.length === 12) {
      return cleanNumber.substring(3);
    }
    
    // Return as-is if already 9 digits
    if (cleanNumber.length === 9 && cleanNumber.startsWith('6')) {
      return cleanNumber;
    }
    
    throw new Error('Invalid phone number format');
  }

  /**
   * Validate payment request data
   */
  private validatePaymentRequest(request: PaymentInitRequest): void {
    if (!request.orderId?.trim()) {
      throw new Error('Order ID is required');
    }
    
    if (!request.name?.trim()) {
      throw new Error('Customer name is required');
    }
    
    if (!request.email?.trim() || !this.isValidEmail(request.email)) {
      throw new Error('Valid email address is required');
    }
    
    if (!this.validatePhoneNumber(request.phone, request.medium)) {
      throw new Error(`Invalid ${request.medium.toUpperCase()} phone number`);
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Initialize payment with comprehensive validation and error handling
   */
  async initializePayment(request: PaymentInitRequest): Promise<PaymentResult> {
    try {
      // Validate request data
      this.validatePaymentRequest(request);

      // Format phone number
      const formattedPhone = this.formatPhoneNumber(request.phone);

      // Prepare API request
      const paymentData = {
        orderId: request.orderId,
        method: request.method,
        phone: formattedPhone,
        medium: request.medium,
        name: request.name.trim(),
        email: request.email.trim().toLowerCase(),
      };

      console.log('🔄 Initializing payment:', {
        orderId: paymentData.orderId,
        medium: paymentData.medium,
        phone: `${paymentData.phone.substring(0, 3)}****${paymentData.phone.substring(7)}`,
      });

      const response = await apiClient.post<PaymentInitResponse>(
        '/payments/init',
        paymentData,
      );

      if (response.data.status_code === 200 && response.data.data) {
        console.log('✅ Payment initialized successfully:', response.data.data.transId);
        
        return {
          success: true,
          transactionId: response.data.data.transId,
          message: response.data.data.message,
          status: 'PENDING',
        };
      } else {
        console.error('❌ Payment initialization failed:', response.data.message);
        return {
          success: false,
          error: response.data.message || 'Failed to initialize payment',
        };
      }
    } catch (error: any) {
      console.error('❌ Payment initialization error:', error);
      
      // Handle specific error cases
      if (error.message.includes('phone number')) {
        return {
          success: false,
          error: `Please enter a valid ${request.medium.toUpperCase()} phone number`,
        };
      }
      
      if (error.response?.status === 400) {
        return {
          success: false,
          error: error.response.data?.message || 'Invalid payment information',
        };
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Authentication failed. Please log in again.',
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to initialize payment. Please try again.',
      };
    }
  }

  /**
   * Verify payment status
   */
  async verifyPaymentStatus(transactionId: string): Promise<PaymentVerificationResponse | null> {
    try {
      const response = await apiClient.get<PaymentVerificationResponse>(
        `/payments/verify?transId=${transactionId}`,
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ Payment verification error:', error);
      return null;
    }
  }

  /**
   * Check order payment status
   */
  async checkOrderPaymentStatus(orderId: string): Promise<PaymentStatusResponse | null> {
    try {
      const response = await apiClient.get<PaymentStatusResponse>(
        `/payments/status/${orderId}`,
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ Order payment status check error:', error);
      return null;
    }
  }

  /**
   * Poll payment status until completion or timeout
   */
  async pollPaymentStatus(
    transactionId: string,
    onStatusUpdate?: (status: PaymentVerificationResponse) => void,
    timeoutMs: number = this.PAYMENT_TIMEOUT,
  ): Promise<PaymentPollingResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let pollCount = 0;

      const poll = async () => {
        pollCount++;
        console.log(`🔄 Polling payment status (attempt ${pollCount}):`, transactionId);

        try {
          const status = await this.verifyPaymentStatus(transactionId);
          
          if (!status) {
            // If we can't get status, continue polling unless timeout
            if (Date.now() - startTime >= timeoutMs) {
              resolve({
                success: false,
                status: 'TIMEOUT',
                transactionId,
                error: 'Payment verification timeout',
              });
              return;
            }
            
            setTimeout(poll, this.POLLING_INTERVAL);
            return;
          }

          // Notify caller of status update
          onStatusUpdate?.(status);

          if (status.status === 'SUCCESSFUL') {
            console.log('✅ Payment successful:', transactionId);
            resolve({
              success: true,
              status: 'SUCCESSFUL',
              transactionId,
              details: status,
            });
            return;
          }

          if (status.status === 'FAILED') {
            console.log('❌ Payment failed:', transactionId);
            resolve({
              success: false,
              status: 'FAILED',
              transactionId,
              error: 'Payment was rejected or failed',
              details: status,
            });
            return;
          }

          // Still pending, check timeout
          if (Date.now() - startTime >= timeoutMs) {
            console.log('⏰ Payment timeout:', transactionId);
            resolve({
              success: false,
              status: 'TIMEOUT',
              transactionId,
              error: 'Payment session expired. Please try again.',
            });
            return;
          }

          // Continue polling
          setTimeout(poll, this.POLLING_INTERVAL);
        } catch (error) {
          console.error('❌ Polling error:', error);
          
          // On error, continue polling unless timeout
          if (Date.now() - startTime >= timeoutMs) {
            resolve({
              success: false,
              status: 'TIMEOUT',
              transactionId,
              error: 'Payment verification timeout',
            });
            return;
          }
          
          setTimeout(poll, this.POLLING_INTERVAL);
        }
      };

      // Start polling
      poll();
    });
  }

  /**
   * Complete payment flow with retry logic
   */
  async processPaymentWithRetry(
    request: PaymentInitRequest,
    onStatusUpdate?: (status: PaymentVerificationResponse) => void,
    maxRetries: number = this.MAX_RETRY_ATTEMPTS,
  ): Promise<PaymentPollingResult> {
    let lastError: string = '';
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Payment attempt ${attempt}/${maxRetries}`);
      
      try {
        // Initialize payment
        const initResult = await this.initializePayment(request);
        
        if (!initResult.success || !initResult.transactionId) {
          lastError = initResult.error || 'Failed to initialize payment';
          
          // Don't retry on validation errors
          if (lastError.includes('phone number') || lastError.includes('email')) {
            return {
              success: false,
              status: 'FAILED',
              transactionId: '',
              error: lastError,
            };
          }
          
          if (attempt === maxRetries) break;
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }

        // Poll for payment completion
        const pollResult = await this.pollPaymentStatus(
          initResult.transactionId,
          onStatusUpdate,
        );

        // Return result (success or failure)
        return pollResult;
        
      } catch (error: any) {
        lastError = error.message || 'Payment processing failed';
        console.error(`❌ Payment attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) break;
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return {
      success: false,
      status: 'FAILED',
      transactionId: '',
      error: lastError || 'Payment failed after multiple attempts',
    };
  }

  /**
   * Get payment provider display name
   */
  getProviderDisplayName(medium: 'mtn' | 'orange'): string {
    return medium === 'mtn' ? 'MTN Mobile Money' : 'Orange Money';
  }

  /**
   * Get payment instructions for provider
   */
  getPaymentInstructions(medium: 'mtn' | 'orange'): string[] {
    const providerName = this.getProviderDisplayName(medium);
    
    return [
      `Check your ${providerName} phone for a payment prompt`,
      'Enter your Mobile Money PIN when prompted',
      'Confirm the payment amount and merchant details',
      'Wait for payment confirmation',
    ];
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}

export default EnhancedPaymentService.getInstance();