---

Getting menu itEMS by id
endpoint: https://foodrush-be.onrender.com/api/v1/menu-items/{id}
nearLat : number
nearLng : number
id: string

return

    {

"status_code": 200,
"message": "Resource retrieved successfully",
"data": {
"id": "71ca8f31-997a-4b2a-a8d1-2dcc1318cbc3",
"name": "SALAD",
"description": "FRUIT SALAD",
"price": "200.00",
"image": "/uploads/menu/1757445200328-394529360.jpg",
"isAvailable": true,
"restaurantId": "049fc5bf-05af-4386-afca-a61c1a0c20ac"
}
}

---

# endpoint: menu/all/nearby

# params

- nearLat : number
- nearLng : number
- id: string
- raduisKm: string;

return
{
"status_code": 200,
"message": "Resource retrieved successfully",
"data": [
{
"id": "71ca8f31-997a-4b2a-a8d1-2dcc1318cbc3",
"name": "SALAD",
"description": "FRUIT SALAD",
"price": "200.00",
"isAvailable": true,
"pictureUrl": "/uploads/menu/1757445200328-394529360.jpg",
"restaurant": {
"id": "049fc5bf-05af-4386-afca-a61c1a0c20ac",
"name": "GLENN CHILL",
"latitude": null,
"longitude": null
},
"startAt": "2025-10-13T00:00:00.000Z",
"endAt": "2025-10-17T00:00:00.000Z",
"createdAt": "2025-09-09T19:13:20.742Z",
"updatedAt": "2025-09-09T19:13:20.742Z",
"distanceKm": null
},
{
"id": "c03629cc-aa1d-477f-b3f5-55725425454c",
"name": "Ndole",
"description": "Ndole with boiled plantains and stuffed bread with some pepper and complements",
"price": "1000.00",
"isAvailable": true,
"pictureUrl": "/uploads/menu/1755705045654-507834508.png",
"restaurant": {
"id": "cd28f1b3-0f2f-42fa-88ad-91fead122695",
"name": "Paulos",
"latitude": null,
"longitude": null
},
"startAt": null,
"endAt": null,
"createdAt": "2025-08-20T15:50:46.073Z",
"updatedAt": "2025-08-20T15:50:46.073Z",
"distanceKm": null
},
{
"id": "4244d47c-0656-4515-bf31-80eb018c86cb",
"name": "Ndole",
"description": "Ndole with boiled plantains and stuffed bread with some pepper and complements",
"price": "1000.00",
"isAvailable": true,
"pictureUrl": "/uploads/menu/1755705024296-139753304.png",
"restaurant": {
"id": "cd28f1b3-0f2f-42fa-88ad-91fead122695",
"name": "Paulos",
"latitude": null,
"longitude": null
},
"startAt": null,
"endAt": null,
"createdAt": "2025-08-20T15:50:24.716Z",
"updatedAt": "2025-08-20T15:50:24.716Z",
"distanceKm": null
},
{
"id": "78bf1f82-0edf-4088-a7ce-9fb4d2455ced",
"name": "Ndole",
"description": "Ndole with boiled plantains and stuffed bread with some pepper and complements",
"price": "1000.00",
"isAvailable": true,
"pictureUrl": "/uploads/menu/1755705003037-239178717.png",
"restaurant": {
"id": "cd28f1b3-0f2f-42fa-88ad-91fead122695",
"name": "Paulos",
"latitude": null,
"longitude": null
},
"startAt": null,
"endAt": null,
"createdAt": "2025-08-20T15:50:03.557Z",
"updatedAt": "2025-08-20T15:50:03.557Z",
"distanceKm": null
}
]
}

---

# endpoint: restaurants/nearby

# params

- nearLat : number
- nearLng : number
- id: string
- raduisKm: string;
- limit: number;
  isOpen: number;

===============================
return
{
"status_code": 200,
"message": "Restaurant retrieved successfully",
"data": [
{
"id": "ee249889-5e1a-4aa5-8b4b-fe1f6d8d0586",
"name": "Paulo",
"address": "Box officee",
"latitude": null,
"longitude": null,
"isOpen": true,
"verificationStatus": "APPROVED",
"menuMode": "FIXED",
"createdAt": "2025-08-20T14:47:50.976Z",
"rating": null,
"ratingCount": 0
},
{
"id": "cd28f1b3-0f2f-42fa-88ad-91fead122695",
"name": "Paulos",
"address": "Box officees",
"latitude": null,
"longitude": null,
"isOpen": true,
"verificationStatus": "APPROVED",
"menuMode": "FIXED",
"createdAt": "2025-08-20T15:06:52.277Z",
"rating": null,
"ratingCount": 0
},
{
"id": "2446d618-60e7-43e9-8dc2-8812bdbea4f0",
"name": "string",
"address": "string",
"latitude": null,
"longitude": null,
"isOpen": true,
"verificationStatus": "PENDING_VERIFICATION",
"menuMode": "FIXED",
"createdAt": "2025-08-25T12:23:29.882Z",
"rating": null,
"ratingCount": 0
},
{
"id": "0dd75d2f-6a68-4817-8e65-9d6003f33107",
"name": "DIALOCOOKS",
"address": "string",
"latitude": null,
"longitude": null,
"isOpen": true,
"verificationStatus": "PENDING_VERIFICATION",
"menuMode": "FIXED",
"createdAt": "2025-08-25T12:31:28.862Z",
"rating": null,
"ratingCount": 0
},
{
"id": "ede29a56-3686-455b-98df-c7ead96b1126",
"name": "Paulo",
"latitude": null,
"longitude": null,
"isOpen": true,
"verificationStatus": "PENDING_VERIFICATION",
"menuMode": "FIXED",
"createdAt": "2025-08-25T15:45:25.416Z",
"rating": null,
"ratingCount": 0
},
{
"id": "bb3cc06d-33af-4ead-aff7-f23380de27a8",
"name": "place",
"address": "nlonkak",
"latitude": null,
"longitude": null,
"isOpen": true,
"verificationStatus": "PENDING_VERIFICATION",
"menuMode": "FIXED",
"createdAt": "2025-08-29T21:22:03.868Z",
"rating": null,
"ratingCount": 0
},
{
"id": "8edbde08-cc66-44f7-ad0c-831630ebac8d",
"name": "pauloDybala",
"latitude": null,
"longitude": null,
"isOpen": true,
"verificationStatus": "PENDING_VERIFICATION",
"menuMode": "FIXED",
"createdAt": "2025-09-03T14:31:10.583Z",
"rating": null,
"ratingCount": 0
},
{
"id": "049fc5bf-05af-4386-afca-a61c1a0c20ac",
"name": "GLENN CHILL",
"address": "BUEA",
"latitude": null,
"longitude": null,
"isOpen": true,
"verificationStatus": "APPROVED",
"menuMode": "FIXED",
"createdAt": "2025-09-09T19:09:14.792Z",
"rating": null,
"ratingCount": 0
}
]
}

---

# endpoint: https://foodrush-be.onrender.com/api/v1/restaurants/{id}/detail

# params

nearLat : number
nearLng : number
id: string
====================================
return
{
"status_code": 200,
"message": "Restaurant retrieved successfully",
"data": {
"id": "049fc5bf-05af-4386-afca-a61c1a0c20ac",
"name": "GLENN CHILL",
"address": "BUEA",
"image": null,
"rating": null,
"ratingCount": 0,
"menu": [
{
"id": "71ca8f31-997a-4b2a-a8d1-2dcc1318cbc3",
"name": "SALAD",
"description": "FRUIT SALAD",
"price": "200.00",
"isAvailable": true,
"pictureUrl": "/uploads/menu/1757445200328-394529360.jpg",
"restaurant": {
"id": "049fc5bf-05af-4386-afca-a61c1a0c20ac",
"name": "GLENN CHILL",
"latitude": null,
"longitude": null
},
"startAt": "2025-10-13T00:00:00.000Z",
"endAt": "2025-10-17T00:00:00.000Z",
"createdAt": "2025-09-09T19:13:20.742Z",
"updatedAt": "2025-09-09T19:13:20.742Z",
"distanceKm": null
}
]
}
}

---

POST /api/v1/restaurants/{id}/rate

params: id
score: number

Delete /api/v1/restaurants/{id}/rate
params: id

---

// Order creation

params for order creation:

{
"customerId": "customer-uuid",
"restaurantId": "restaurant-uuid",
"items": [
{
"menuItemId": "menu-item-uuid",
"quantity": 2,
"specialInstructions": "no onions"
}
],
"deliveryAddress": "221B Baker Street, London",
"deliveryLatitude": 51.523771,
"deliveryLongitude": -0.158539
}

Return Example
{
"status_code": 201,
"message": "Order created successfully",
"data": {
"id": "ord_123",
"userId": "usr_1",
"restaurantId": "res_9",
"items": [
{
"foodId": "food_1",
"name": "Chicken Bowl",
"quantity": 2,
"price": 2500,
"total": 5000,
"specialInstructions": "No onions"
},
{
"foodId": "food_2",
"name": "Juice",
"quantity": 1,
"price": 800,
"total": 800
}
],
"subtotal": 5800,
"deliveryPrice": 700,
"total": 6500,
"status": "pending",
"paymentMethod": "cash",
"createdAt": "2025-09-09T21:40:00.000Z"
}
}

---

GET /orders/{id}
params
id: string

return example
{
"status_code": 200,
"message": "Order retrieved successfully",
"data": {
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
"status": "pending",
"paymentMethod": "cash",
"createdAt": "2025-09-09T21:40:00.000Z",
"delivery": {
"id": "del_44",
"status": "OUT_FOR_DELIVERY",
"deliveredAt": null,
"customerConfirmed": false,
"customerConfirmedAt": null,
"rider": {
"id": "rid_7",
"fullName": "John Rider",
"email": "rider@example.com",
"phoneNumber": "+237..."
}
}
}
}

---

confirmation of order recieved
POST /api/v1/orders/{id}/confirm-received

params:
id: string

---

Confirming Orders
POST /api/v1/orders/{id}/customer-confirm

NB: Customer confirms the order to lock delivery fee and proceed to payment

params:
id string

---

LISTING MYOrders

enpoint: orders/my
parmas:
status: pending ...
limit: offset

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
"status": "confirmed",
"paymentMethod": "cash",
"createdAt": "2025-09-09T21:40:00.000Z",
"delivery": {
"id": "del_44",
"status": "OUT_FOR_DELIVERY",
"rider": {
"id": "rid_7",
"fullName": "John Rider",
"phoneNumber": "+237..."
}
}
}
]
}

---

lIKE RESTAURANTS

POST /api/v1/restaurants/{id}/like
Like a restaurant (customer)

---

UNlIKE RESTAURANTS

DELETE /api/v1/restaurants/{id}/like
Unlike a restaurant (customer)

---

LIST lIKED RESTAURANTS

GET /api/v1/restaurants/liked
List restaurants liked

---

SOCIAL AUTHENTICATION
POST /api/v1/auth/social-auth
Social authentication (Google, Facebook, Apple)

requestbody:
{
"provider": "google",
"providerId": "google-user-id-123",
"email": "user@example.com",
"fullName": "John Doe",
"profilePicture": "https://example.com/profile.jpg"
}

PATCH
/api/v1/auth/profile
Update current user profile

params:
{

"fullName": "John Doe",
"phoneNumber": "+237612345678",
"profilePicture": "https://example.com/profile.jpg"

}

GET
api/v1/auth/profile
{bearerToken: handled by apiClient}

RETURN

{

"status_code": 200,
"message": "Authentication request successful",
"data": {
"sub": "2497ffd8-6242-4ba0-8922-902a0131cbd4",
"id": "2497ffd8-6242-4ba0-8922-902a0131cbd4",
"email": "tochukwupaul21@gmail.com",
"fullName": "Paulo",
"phoneNumber": "+237677008986",
"profilePicture": null,
"role": "customer",
"status": "active"
}
}
