
import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email')
    .required('Email required'),
  password: yup
    .string()
    .min(8, 'Password must contain atleast 8 characters')
    .required('Password required'),
});
//email validation schema
export const emailValidation = yup.string().email('Invalid email').required('Email is required')

export const registerSchema = yup.object().shape({
  displayName: yup
    .string()
    .min(5, 'Name must contain atleast 5 characters')
    .required('Name required'),
  email: emailValidation,
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{9}$/, 'invalide Phone number(9 number)')
    .required('Phone number required'),
  password: yup
    .string()
    .min(8, 'Password must contain atleast 8 characters')
    .required('Password required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Password do not match')
    .required('Confirmation required'),
   

});

