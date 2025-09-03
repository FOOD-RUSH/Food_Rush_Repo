# Remove Location System - Implementation Plan

## Information Gathered
- Location system consists of useLocation hook, LocationService, store, types, and modals
- Used in HomeScreen, HomeHeader, NearbyRestaurantsScreen, AddressEditModal
- APIs use coordinates for nearby restaurants functionality in useCustomerApi.ts and restaurant.service.ts
- HomeHeader displays current location address
- AddressInputModalNew.tsx and AddressEditModal.tsx handle address input
- "Use current location" button exists in address modals
- NearbyRestaurantsScreen uses location for nearby restaurants

## Plan
- [x] Remove location system usage from HomeScreen.tsx
- [x] Hardcode address values in HomeHeader.tsx
- [x] Keep AddressInputModalNew.tsx unchanged
- [x] Disable functionality of "Use current location" button in AddressEditModal.tsx
- [x] Add hardcoded coordinates to useCustomerApi.ts and restaurant.service.ts
- [x] Update NearbyRestaurantsScreen.tsx to use hardcoded coordinates
- [x] Remove location imports and dependencies from affected files

## Dependent Files to Edit
- [x] src/screens/customer/home/HomeScreen.tsx
- [x] src/components/customer/HomeHeader.tsx
- [x] src/components/customer/AddressEditModal.tsx
- [x] src/hooks/customer/useCustomerApi.ts
- [x] src/services/customer/restaurant.service.ts
- [x] src/screens/customer/home/NearbyRestaurantsScreen.tsx

## Followup Steps
- [ ] Test app compilation
- [ ] Verify HomeHeader shows hardcoded address
- [ ] Verify address screen works as before
- [ ] Verify "Use current location" button is visible but non-functional
- [ ] Remove any unused location-related code
