# Payment Integration Guide

## Successful Payment Initialization Response

When a payment is successfully initialized, the API returns the following response structure:

```json
{
  "status_code": 201,
  "message": "Resource created successfully",
  "data": {
    "message": "Accepted",
    "transId": "E1HWnnNj",
    "dateInitiated": "2025-10-09T20:04:37.508Z"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status_code` | number | HTTP status code (201 for successful creation) |
| `message` | string | General response message |
| `data.message` | string | Specific status message ("Accepted" for successful init) |
| `data.transId` | string | Unique transaction identifier for tracking |
| `data.dateInitiated` | string | ISO timestamp when payment was initiated |

## Implementation Details

### 1. Payment Service Updates

The payment services have been updated to handle both status codes:
- `200` - OK (existing payments)
- `201` - Created (new payment initialization)

### 2. Response Parsing

The `parsePaymentResponse` method in `PaymentService` handles the response:

```typescript
private parsePaymentResponse(response: any): PaymentResult {
  const { status_code, message, data } = response.data;
  
  // Success status codes: 200 (OK) or 201 (Created)
  if ((status_code === 200 || status_code === 201) && data?.transId) {
    return {
      success: true,
      transactionId: data.transId,
      ussdCode: data.ussdCode,
      message: data.message || message,
    };
  }
  
  return {
    success: false,
    error: message || 'Failed to initialize payment',
  };
}
```

### 3. Enhanced Logging

The payment services now include comprehensive logging:

```typescript
console.log('📋 Payment response received:', {
  status_code,
  message,
  transId: data?.transId,
  dateInitiated: data?.dateInitiated,
});
```

### 4. Type Definitions

New TypeScript interfaces have been added to `src/types/transaction.ts`:

```typescript
// Specific successful response type
export interface PaymentInitSuccessResponse {
  status_code: 201;
  message: 'Resource created successfully';
  data: {
    message: 'Accepted';
    transId: string;
    dateInitiated: string;
  };
}

// Generic payment response type
export interface PaymentInitResponse {
  status_code: number;
  message: string;
  data: {
    message: string;
    transId: string;
    dateInitiated: string;
    status?: 'PENDING';
    amount?: number;
    ussdCode?: string;
  };
}
```

## Usage in Components

The `PaymentProcessingScreen` component automatically handles the successful response:

1. **Initialization**: Calls the payment service with user details
2. **Response Handling**: Processes the successful response and extracts `transId`
3. **Status Polling**: Uses the `transId` to poll for payment completion
4. **UI Updates**: Shows appropriate success/failure states

## Error Handling

The system handles various error scenarios:

- **Invalid phone numbers**: Validates against MTN/Orange prefixes
- **Missing required fields**: Checks for orderId, name, and email
- **Network errors**: Provides user-friendly error messages
- **API errors**: Logs detailed error information for debugging

## Testing

To test the payment flow:

1. Use valid MTN/Orange phone numbers
2. Ensure all required fields are provided
3. Monitor console logs for detailed payment flow information
4. Verify that status code 201 is handled correctly

## Next Steps

1. **Payment Verification**: Implement polling for payment status updates
2. **Error Recovery**: Add retry mechanisms for failed payments
3. **User Experience**: Enhance UI feedback during payment processing
4. **Analytics**: Track payment success/failure rates

## Related Files

- `src/services/customer/payment.service.ts` - Main payment service
- `src/services/customer/enhancedPayment.service.ts` - Enhanced payment service
- `src/types/transaction.ts` - Type definitions
- `src/screens/customer/payment/PaymentProcessingScreen.tsx` - UI component