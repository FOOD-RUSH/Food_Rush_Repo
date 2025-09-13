# TODO List for Profile Screen Updates and App Flow

## 1. Change Profile Screen Colors to Grey
- [x] Edit ProfileScreen.tsx to change icon colors to grey (#666666) for account_settings, restaurant_settings, support options
- [x] Keep other options (payment_billing, notifications, about) with blue color (#007AFF)

## 2. Verify App Flow (User Selection -> Login)
- [x] Confirm OnboardingScreen UserTypeSelection directs to correct login based on selection
- [x] Test AuthNavigator uses selectedUserType for RestaurantLoginScreen vs LoginScreen
- [x] Create UserTypeSelectionScreen with clean, animated design and blue theme
- [x] Integrate UserTypeSelectionScreen with RootNavigator

## 3. Add API Testing Screen
- [ ] Check and update navigation types for new ApiTestingScreen
- [ ] Add ApiTestingScreen route to RestaurantNavigator.tsx
- [ ] Create ApiTestingScreen.tsx with input fields for endpoint, method, headers, body
- [ ] Add API testing option to profileOptions in ProfileScreen.tsx
- [ ] Implement API call functionality and response display

## 4. Testing
- [ ] Test color changes in profile screen
- [ ] Test navigation flow from user selection to login
- [ ] Test API testing functionality with sample endpoints
