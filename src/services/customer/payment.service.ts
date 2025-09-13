// Payment service - focused only on payment functionality
// Location services have been moved to src/services/customer/LocationService.ts

export interface PaymentMethod {
  id: string;
  type: 'mtn' | 'orange' | 'card';
  name: string;
  isDefault: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
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
   * Process payment with selected method
   */
  async processPayment(
    amount: number,
    method: PaymentMethod,
    orderId: string,
  ): Promise<PaymentResult> {
    try {
      // Implementation for payment processing
      console.log('Processing payment:', { amount, method, orderId });

      // This would integrate with actual payment providers
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
      { id: '1', type: 'mtn', name: 'MTN Mobile Money', isDefault: true },
      { id: '2', type: 'orange', name: 'Orange Money', isDefault: false },
    ];
  }
}

export default PaymentService.getInstance();
