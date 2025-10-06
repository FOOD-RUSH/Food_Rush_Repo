# FoodRush Customer App API Documentation

## 🍔 Quick Start Guide for Developers

This guide will help you integrate FoodRush's order and payment APIs into your customer application. Everything is explained simply, with real examples you can use right away.

---

## 📱 What Can Customers Do?

1. **Create orders** from restaurants
2. **Pay with mobile money** (MTN, Orange)
3. **Track their orders** in real-time
4. **View order history**
5. **Cancel orders** if needed
6. **Confirm delivery** when food arrives

---

## 🚀 Order Management APIs

### 1. Create a New Order

**Endpoint:** `POST /api/v1/orders`

This is how customers place orders. They select items from a restaurant menu, provide delivery details, and choose a payment method.

#### What You Need to Send

```json
{
  "customerId": "customer-uuid",           // The logged-in customer's ID
  "restaurantId": "restaurant-uuid",       // Which restaurant they're ordering from
  "items": [
    {
      "menuItemId": "menu-item-uuid",     // What food they want
      "quantity": 2,                       // How many
      "specialInstructions": "no onions"   // Any special requests (optional)
    }
  ],
  "deliveryAddress": "221B Baker Street, London",  // Where to deliver
  "deliveryLatitude": 51.523771,          // GPS coordinates for accurate delivery
  "deliveryLongitude": -0.158539,
  "paymentMethod": "mobile_money"         // or "cash"
}
```

#### What You Get Back (Success - 201)

```json
{
  "status_code": 201,
  "message": "Order created successfully",
  "data": {
    "id": "ord_123",                      // SAVE THIS! You need it for payment
    "userId": "usr_1",
    "restaurantId": "res_9",
    "items": [
      {
        "foodId": "food_1",
        "name": "Chicken Bowl",
        "quantity": 2,
        "price": 2500,                    // Price per item (in FCFA)
        "total": 5000,                    // quantity × price
        "specialInstructions": "No onions"
      }
    ],
    "subtotal": 5800,                     // Total for all food items
    "deliveryPrice": 700,                 // Delivery fee
    "total": 6500,                        // What customer pays (subtotal + delivery)
    "status": "pending",                  // Order is waiting for restaurant
    "paymentMethod": "mobile_money",
    "createdAt": "2025-09-09T21:40:00.000Z"
  }
}
```

#### Implementation Example

```javascript
async function createOrder(orderData) {
  try {
    const response = await fetch('https://api.foodrush.cm/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`  // Customer must be logged in
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const result = await response.json();
    
    // Save the order ID - you'll need it for payment!
    const orderId = result.data.id;
    const totalAmount = result.data.total;
    
    return { orderId, totalAmount, orderDetails: result.data };
    
  } catch (error) {
    console.error('Order creation failed:', error);
    throw error;
  }
}

// Usage
const newOrder = await createOrder({
  customerId: "usr_456",
  restaurantId: "res_789",
  items: [
    { menuItemId: "food_1", quantity: 2, specialInstructions: "Extra spicy" }
  ],
  deliveryAddress: "Bastos, Yaoundé",
  deliveryLatitude: 3.8667,
  deliveryLongitude: 11.5167,
  paymentMethod: "mobile_money"
});
```

---

### 2. View My Orders

**Endpoint:** `GET /api/v1/orders/my`

See all orders for the logged-in customer. You can filter by status and paginate results.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | all | Filter by: `pending`, `confirmed`, `preparing`, `ready_for_pickup`, `out_for_delivery`, `delivered`, `cancelled` |
| `limit` | number | 20 | How many orders to return |
| `offset` | number | 0 | Skip this many orders (for pagination) |

#### Example Request

```javascript
async function getMyOrders(status = null, limit = 20, offset = 0) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString()
  });
  
  if (status) {
    params.append('status', status);
  }

  const response = await fetch(
    `https://api.foodrush.cm/api/v1/orders/my?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    }
  );

  return response.json();
}

// Get only delivered orders
const deliveredOrders = await getMyOrders('delivered');

// Get active orders (not delivered or cancelled)
const activeOrders = await getMyOrders('out_for_delivery');
```

#### Response (200 OK)

```json
{
  "status_code": 200,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": "ord_123",
      "userId": "usr_1",
      "restaurantId": "res_9",
      "items": [
        {
          "foodId": "food_1",
          "name": "Chicken Bowl",
          "quantity": 2,
          "price": 2500,
          "total": 5000
        }
      ],
      "subtotal": 5000,
      "deliveryPrice": 700,
      "total": 5700,
      "status": "out_for_delivery",          // Current order status
      "paymentMethod": "mobile_money",
      "createdAt": "2025-09-09T21:40:00.000Z",
      "delivery": {                          // Delivery info (if assigned)
        "id": "del_44",
        "status": "OUT_FOR_DELIVERY",
        "rider": {
          "id": "rid_7",
          "fullName": "John Rider",
          "phoneNumber": "+237670000000"    // Customer can call rider
        }
      }
    }
  ]
}
```

---

### 3. Get Single Order Details

**Endpoint:** `GET /api/v1/orders/{id}`

Get detailed information about a specific order.

```javascript
async function getOrderDetails(orderId) {
  const response = await fetch(
    `https://api.foodrush.cm/api/v1/orders/${orderId}`,
    {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Order not found');
  }

  return response.json();
}
```

---

### 4. Cancel an Order

**Endpoint:** `PATCH /api/v1/orders/{id}/cancel`

Customers can cancel orders that are still `pending` (restaurant hasn't confirmed yet).

#### Request Body

```json
{
  "reason": "Changed my mind" // Optional but recommended
}
```

#### Implementation

```javascript
async function cancelOrder(orderId, reason) {
  const response = await fetch(
    `https://api.foodrush.cm/api/v1/orders/${orderId}/cancel`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ reason })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    // Might fail if order is already confirmed
    throw new Error(error.message || 'Cannot cancel order');
  }

  return response.json();
}

// Usage
try {
  await cancelOrder('ord_123', 'Ordered by mistake');
  alert('Order cancelled successfully');
} catch (error) {
  alert('Cannot cancel: ' + error.message);
}
```

---

### 5. Confirm Delivery Received

**Endpoint:** `POST /api/v1/orders/{id}/confirm-received`

Customer confirms they received their food. This is important for completing the order cycle.

```javascript
async function confirmDeliveryReceived(orderId) {
  const response = await fetch(
    `https://api.foodrush.cm/api/v1/orders/${orderId}/confirm-received`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    }
  );

  return response.json();
}

// Call this when customer clicks "I received my order"
await confirmDeliveryReceived('ord_123');
```

#### Response

```json
{
  "status_code": 200,
  "message": "Operation completed successfully",
  "data": null
}
```

---

## 💳 Payment APIs

### Payment Flow Overview

```
1. Customer creates order → Get orderId
2. Initialize payment with orderId after restaurant has accepted order, triggered by button to proceed to payement 
3. Customer enters mobile money PIN on their phone
4. Poll/verify payment status
5. Payment confirmed → Order proceeds
```

---

### 1. Initialize Payment

**Endpoint:** `POST /api/v1/payments/init`

Start a mobile money payment for an order.

#### Request Body

```json
{
  "orderId": "ord_123",          // From order creation
  "method": "mobile_money",      // Always "mobile_money" for now
  "phone": "670000000",          // Customer's mobile money number (9 digits)
  "medium": "mtn",               // "mtn" or "orange"
  "name": "Jane Doe",            // Customer's name
  "email": "jane@example.com"    // Customer's email
}
```

#### Response (200 OK)

```json
{
  "status_code": 200,
  "message": "Payment initiated",
  "data": {
    "transId": "FPY-abc123",     // IMPORTANT: Save this for verification
    "status": "PENDING",
    "amount": 6500,
    "message": "Please check your phone and enter your PIN"
  }
}
```

#### Implementation

```javascript
async function initializePayment(orderId, paymentDetails) {
  const response = await fetch('https://api.foodrush.cm/api/v1/payments/init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      orderId,
      method: 'mobile_money',
      phone: paymentDetails.phone,
      medium: paymentDetails.provider, // 'mtn' or 'orange'
      name: paymentDetails.customerName,
      email: paymentDetails.customerEmail
    })
  });

  const result = await response.json();
  return result.data.transId; // You need this for verification
}
```

---

### 2. Verify Payment Status

**Endpoint:** `GET /api/v1/payments/verify?transId={transId}`

Check if the payment has been completed. You should poll this endpoint every 3-5 seconds until status is `SUCCESSFUL` or `FAILED`.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transId` | string | Yes | Transaction ID from payment initialization |

#### Response

```json
{
  "transId": "FPY-abc123",
  "status": "SUCCESSFUL",           // PENDING, SUCCESSFUL, or FAILED
  "medium": "mobile money",
  "serviceName": "FoodRush",
  "amount": 6500,
  "payerName": "Jane Doe",
  "email": "jane@example.com",
  "financialTransId": "MTN-789456", // Provider's transaction ID
  "dateInitiated": "2025-10-06",
  "dateConfirmed": "2025-10-06"     // null if still pending
}
```

#### Implementation with Polling

```javascript
async function verifyPayment(transId) {
  const response = await fetch(
    `https://api.foodrush.cm/api/v1/payments/verify?transId=${transId}`,
    {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    }
  );

  return response.json();
}

// Poll payment status until confirmed or timeout
async function waitForPaymentConfirmation(transId, timeoutMinutes = 5) {
  const maxAttempts = (timeoutMinutes * 60) / 3; // Check every 3 seconds
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await verifyPayment(transId);

    if (status.status === 'SUCCESSFUL') {
      return { success: true, transaction: status };
    }

    if (status.status === 'FAILED') {
      return { success: false, error: 'Payment failed' };
    }

    // Still pending, wait 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    attempts++;
  }

  return { success: false, error: 'Payment timeout' };
}

// Usage
const transId = await initializePayment(orderId, paymentDetails);
showLoadingMessage('Waiting for payment confirmation...');

const result = await waitForPaymentConfirmation(transId);

if (result.success) {
  showSuccessMessage('Payment successful! Your order is confirmed.');
} else {
  showErrorMessage(result.error);
}
```

---

### 3. Check Order Payment Status

**Endpoint:** `GET /api/v1/payments/status/{orderId}`

Quick way to check if an order has been paid.

```javascript
async function isOrderPaid(orderId) {
  const response = await fetch(
    `https://api.foodrush.cm/api/v1/payments/status/${orderId}`,
    {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    }
  );

  const result = await response.json();
  return result.paid; // true or false
}

// Usage
if (await isOrderPaid('ord_123')) {
  console.log('Order is paid!');
}
```

#### Response

```json
{
  "status": "SUCCESSFUL",
  "paid": true,
  "transId": "FPY-abc123",
  "medium": "mtn"
}
```

---

### 4. View Payment History

**Endpoint:** `GET /api/v1/payments/transactions/{userId}`

Get all payment transactions for a customer.

```javascript
async function getPaymentHistory(userId) {
  const response = await fetch(
    `https://api.foodrush.cm/api/v1/payments/transactions/${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    }
  );

  return response.json();
}
```

#### Response

```json
[
  {
    "transId": "FPY-abc123",
    "status": "SUCCESSFUL",
    "amount": 6500,
    "payerName": "Jane Doe",
    "medium": "mobile money",
    "dateInitiated": "2025-10-06",
    "dateConfirmed": "2025-10-06"
  }
]
```

---

## 🎯 Complete Order & Payment Flow

Here's a complete example showing how to create an order and process payment:

```javascript
class FoodRushCustomer {
  constructor(apiUrl, authToken) {
    this.apiUrl = apiUrl;
    this.authToken = authToken;
  }

  // Step 1: Create the order
  async createOrder(orderData) {
    const response = await fetch(`${this.apiUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) throw new Error('Order creation failed');
    
    const result = await response.json();
    return result.data;
  }

  // Step 2: Initialize payment
  async initPayment(orderId, paymentInfo) {
    const response = await fetch(`${this.apiUrl}/api/v1/payments/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify({
        orderId,
        method: 'mobile_money',
        ...paymentInfo
      })
    });

    const result = await response.json();
    return result.data.transId;
  }

  // Step 3: Wait for payment confirmation
  async waitForPayment(transId, maxWaitSeconds = 300) {
    const startTime = Date.now();
    const checkInterval = 3000; // 3 seconds

    while (Date.now() - startTime < maxWaitSeconds * 1000) {
      const response = await fetch(
        `${this.apiUrl}/api/v1/payments/verify?transId=${transId}`,
        {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        }
      );

      const status = await response.json();

      if (status.status === 'SUCCESSFUL') {
        return { success: true, details: status };
      }

      if (status.status === 'FAILED') {
        return { success: false, error: 'Payment rejected' };
      }

      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    return { success: false, error: 'Payment timeout' };
  }

  // Complete flow
  async placeOrder(orderData, paymentInfo) {
    try {
      // 1. Create order
      console.log('Creating order...');
      const order = await this.createOrder(orderData);
      console.log(`Order created: ${order.id}, Total: ${order.total} FCFA`);

      // 2. Initialize payment
      console.log('Initializing payment...');
      const transId = await this.initPayment(order.id, paymentInfo);
      console.log('Payment prompt sent to customer phone');

      // 3. Wait for confirmation
      console.log('Waiting for payment confirmation...');
      const paymentResult = await this.waitForPayment(transId);

      if (paymentResult.success) {
        console.log('Payment successful! Order confirmed.');
        return {
          success: true,
          orderId: order.id,
          transactionId: transId
        };
      } else {
        console.error('Payment failed:', paymentResult.error);
        return {
          success: false,
          error: paymentResult.error,
          orderId: order.id
        };
      }

    } catch (error) {
      console.error('Order placement failed:', error);
      throw error;
    }
  }
}

// Usage Example
const customer = new FoodRushCustomer(
  'https://api.foodrush.cm',
  userAuthToken
);

const result = await customer.placeOrder(
  {
    customerId: "usr_456",
    restaurantId: "res_789",
    items: [
      {
        menuItemId: "food_123",
        quantity: 2,
        specialInstructions: "Extra sauce"
      }
    ],
    deliveryAddress: "Bastos, Yaoundé",
    deliveryLatitude: 3.8667,
    deliveryLongitude: 11.5167,
    paymentMethod: "mobile_money"
  },
  {
    phone: "670000000",
    medium: "mtn",
    name: "Jane Doe",
    email: "jane@example.com"
  }
);

if (result.success) {
  alert(`Order ${result.orderId} placed successfully!`);
} else {
  alert(`Order failed: ${result.error}`);
}
```

---

## 📊 Order Status Flow

Understanding order statuses helps you show the right UI to customers:

```
PENDING → Order created, waiting for restaurant
    ↓
CONFIRMED → Restaurant accepted
    ↓
PREPARING → Food is being cooked
    ↓
READY_FOR_PICKUP → Food ready, waiting for rider
    ↓
OUT_FOR_DELIVERY → Rider is delivering
    ↓
DELIVERED → Customer received food
```

Or at any point:
```
CANCELLED → Order was cancelled (by customer or restaurant)
```

---

## ⚠️ Important Things to Remember

### 1. **Phone Number Format**
```javascript
// CORRECT formats for Cameroon
"670000000"   // 9 digits, no country code
"6 70 00 00 00"  // With spaces (API will clean)

// WRONG
"+237670000000"  // Don't include +237
"237670000000"   // Don't include 237
```

### 2. **Payment Providers**
```javascript
const PROVIDERS = {
  MTN: 'mtn',      // MTN Mobile Money
  ORANGE: 'orange' // Orange Money
};

// Make sure customer selects correct provider for their number
```

### 3. **Error Handling**

Always handle these scenarios:

```javascript
// Order creation errors
try {
  const order = await createOrder(data);
} catch (error) {
  // Possible issues:
  // - Restaurant closed
  // - Invalid menu items
  // - Delivery address outside zone
  // - Missing required fields
}

// Payment errors
try {
  const transId = await initPayment(orderId, paymentInfo);
} catch (error) {
  // Possible issues:
  // - Invalid phone number
  // - Insufficient balance
  // - Wrong provider selected
  // - Network issues
}

// Payment timeout
const result = await waitForPayment(transId);
if (!result.success) {
  if (result.error === 'Payment timeout') {
    // Customer didn't enter PIN in time
    // Show option to retry or cancel
  } else {
    // Payment was rejected
    // Show error and offer alternative
  }
}
```

### 4. **User Experience Tips**

```javascript
// Show loading states
showLoading('Creating your order...');

// Keep user informed during payment
showMessage('Check your phone for MTN prompt');
showMessage('Waiting for payment confirmation...');

// Provide clear feedback
if (paymentSuccess) {
  showSuccess('Payment confirmed! Restaurant is preparing your order.');
} else {
  showError('Payment failed. Please try again or choose cash payment.');
}

// Allow order tracking
setInterval(async () => {
  const order = await getOrderDetails(orderId);
  updateOrderStatus(order.status);
  
  if (order.delivery && order.delivery.rider) {
    showRiderInfo(order.delivery.rider);
  }
}, 10000); // Check every 10 seconds
```

### 5. **Security Best Practices**

```javascript
// Always use HTTPS
const API_URL = 'https://api.foodrush.cm'; // ✓
// const API_URL = 'http://api.foodrush.cm'; // ✗

// Store auth token securely
// Use secure storage, not localStorage for sensitive apps
import SecureStorage from 'secure-storage';
await SecureStorage.setItem('authToken', token);

// Never log sensitive data
console.log('Payment info:', paymentInfo); // ✗
console.log('Payment initiated'); // ✓

// Validate user input
function validatePhone(phone) {
  // Remove spaces and validate format
  const cleaned = phone.replace(/\s/g, '');
  return /^6[0-9]{8}$/.test(cleaned);
}
```

---

## 🧪 Testing Checklist

Before launching your app, test these scenarios:

- [ ] Create order with single item
- [ ] Create order with multiple items
- [ ] Create order with special instructions
- [ ] Cancel pending order
- [ ] Try to cancel confirmed order (should fail)
- [ ] Pay with MTN Mobile Money
- [ ] Pay with Orange Money
- [ ] Payment timeout (don't enter PIN)
- [ ] Payment rejection (wrong PIN)
- [ ] View order history
- [ ] Filter orders by status
- [ ] Track delivery in real-time
- [ ] Confirm delivery received
- [ ] View payment history

---

## 📞 Need Help?

If you encounter issues:

1. Check the response status codes and error messages
2. Verify authentication token is valid
3. Confirm phone numbers are in correct format
4. Test with small amounts first
5. Contact FoodRush support at support@foodrush.cm

---

## 🎓 Quick Reference

### Base URL
```
https://api.foodrush.cm
```

### Authentication
All requests require a Bearer token:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Response Format
All responses follow this structure:
```json
{
  "status_code": 200,
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Common Status Codes
- `200` - Success
- `201` - Created (for order creation)
- `400` - Bad request (check your data)
- `401` - Unauthorized (check auth token)
- `404` - Not found
- `500` - Server error (retry or contact support)

---

Good luck building your FoodRush customer app! 🚀🍕