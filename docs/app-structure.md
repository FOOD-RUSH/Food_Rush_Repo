# Food Delivery App Structure Documentation

## Overview

This document provides an overview of the existing food delivery app structure for Yaounde, Cameroon. The app is built using React Native with Expo, featuring a customer-focused interface with standard e-commerce functionality.

## Core Technologies

- React Native with Expo
- TypeScript for type safety
- React Navigation for routing
- Zustand for state management
- React Native Paper for UI components
- Tailwind CSS (Nativewind) for styling

## App Navigation Structure

The app uses a tab-based navigation system for the main sections:

1. **Home Tab**
   - Main discovery screen with food items and restaurants
   - Search functionality
   - Category browsing
   - Promotional content

2. **Orders Tab**
   - Order history and tracking
   - Active vs completed orders
   - Re-ordering functionality

3. **Profile Tab**
   - User account management
   - Address management
   - Settings and preferences
   - Help and support

## Key Features Implemented

### 1. User Authentication
- Login/Signup flows
- Password reset functionality
- Social login options (implied by assets)

### 2. Food Discovery
- Home screen with featured items
- Category browsing
- Search functionality with filters
- Restaurant listings

### 3. Shopping Cart & Checkout
- Add items to cart
- Quantity management
- Special instructions
- Order summary
- Delivery address selection
- Payment method selection (placeholder)

### 4. Order Management
- Order history tracking
- Active order status
- Re-ordering capability

### 5. Profile Management
- User information editing
- Address management
- Payment methods
- Notification preferences
- Help center access

## Data Management

The app uses Zustand for state management with separate stores for different features:
- Cart store for managing food items
- Authentication store for user sessions
- App store for theme and settings

## UI Components

The app includes a variety of reusable components:
- Common views and layouts
- Form elements (inputs, buttons)
- Cards for food items and restaurants
- Modals for actions and confirmations
- Bottom sheets for checkout flows

## Current Limitations

1. Address management is basic (text-based entries)
2. Location services are not fully implemented
3. Payment methods are placeholders
4. Some functionality is mocked (like food details loading)