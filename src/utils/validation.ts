import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup
    .string()
    .min(8, 'Password must contain atleast 8 characters')
    .required('Password required'),
});

// Email validation schema
export const emailValidation = yup
  .string()
  .email('Invalid email')
  .required('Email is required');

export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(5, 'Name must contain atleast 5 characters')
    .required('Name required'),
  email: emailValidation,
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{9}$/, 'Invalid Phone number (9 numbers required)')
    .required('Phone number required'),
  password: yup
    .string()
    .min(8, 'Password must contain atleast 8 characters')
    .required('Password required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirmation required'),
});



// Address validation schema
export const addressSchema = yup.object().shape({
  label: yup
    .string()
    .min(2, 'Label must be at least 2 characters')
    .max(50, 'Label must be less than 50 characters')
    .required('Label is required'),
  fullAddress: yup
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .required('Full address is required'),
  isDefault: yup.boolean().optional(),
  latitude: yup.number().optional().nullable(),
  longitude: yup.number().optional().nullable(),
  city: yup.string().optional().nullable(),
  country: yup.string().optional().nullable(),
  postalCode: yup.string().optional().nullable(),
});

// Order validation schema
export const orderSchema = yup.object().shape({
  restaurantId: yup.string().required('Restaurant is required'),
  items: yup
    .array()
    .of(
      yup.object().shape({
        menuItemId: yup.string().required('Menu item is required'),
        quantity: yup
          .number()
          .min(1, 'Quantity must be at least 1')
          .required('Quantity is required'),
        price: yup
          .number()
          .min(0, 'Price must be positive')
          .required('Price is required'),
      }),
    )
    .min(1, 'At least one item is required')
    .required('Items are required'),
  deliveryAddress: yup
    .object()
    .shape({
      label: yup.string().required('Address label is required'),
      fullAddress: yup.string().required('Full address is required'),
      latitude: yup.number().optional().nullable(),
      longitude: yup.number().optional().nullable(),
    })
    .required('Delivery address is required'),
  paymentMethod: yup
    .string()
    .oneOf(['mtn_mobile_money', 'orange_money'], 'Invalid payment method')
    .required('Payment method is required'),
  totalAmount: yup
    .number()
    .min(0, 'Total amount must be positive')
    .required('Total amount is required'),
  specialInstructions: yup.string().optional().nullable(),
});

// Payment validation schema
export const paymentSchema = yup.object().shape({
  orderId: yup.string().required('Order ID is required'),
  amount: yup
    .number()
    .min(100, 'Amount must be at least 100 XAF')
    .required('Amount is required'),
  method: yup
    .string()
    .oneOf(['mtn_mobile_money', 'orange_money'], 'Invalid payment method')
    .required('Payment method is required'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{9}$/, 'Invalid Phone number (9 numbers required)')
    .required('Phone number is required'),
});

// Notification settings validation schema
export const notificationSettingsSchema = yup.object().shape({
  pushEnabled: yup.boolean().required(),
  emailEnabled: yup.boolean().required(),
  smsEnabled: yup.boolean().required(),
  preferences: yup
    .object()
    .shape({
      orderUpdates: yup.boolean().required(),
      promotions: yup.boolean().required(),
      systemAlerts: yup.boolean().required(),
      deliveryUpdates: yup.boolean().required(),
    })
    .required(),
});

// Profile update validation schema
export const profileUpdateSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters')
    .optional(),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{9}$/, 'Invalid Phone number (9 numbers required)')
    .optional(),
  email: yup.string().email('Invalid email format').optional(),
});

// Password change validation schema
export const passwordChangeSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .min(8, 'Current password must be at least 8 characters')
    .required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'New password must be at least 8 characters')
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Password confirmation is required'),
});

// Export all schemas for easy access
export const validationSchemas = {
  login: loginSchema,
  register: registerSchema,
  address: addressSchema,
  order: orderSchema,
  payment: paymentSchema,
  profileUpdate: profileUpdateSchema,
  passwordChange: passwordChangeSchema,
};
