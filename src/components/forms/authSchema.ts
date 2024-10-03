import * as Yup from 'yup';

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+\s*$/,
      'invalid email address',
    )
    .required('Email is required'),
});

export const passwordResetSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&,.\[\]^*])[A-Za-z\d@$!%?&,.\[\]^*]+/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const customerSignUpSchema = Yup.object().shape({
  first_legal_name: Yup.string()
    .required('First legal name is required')
    .min(2, 'First legal name must be at least 2 characters')
    .max(50, 'First legal name must be at most 50 characters'),

  last_legal_name: Yup.string()
    .required('Last legal name is required')
    .min(2, 'Last legal name must be at least 2 characters')
    .max(50, 'Last legal name must be at most 50 characters'),
  email: Yup.string()
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+\s*$/,
      'invalid email address',
    )
    .required('Email is required'),
  is_google_login: Yup.number().required(),
  password: Yup.string().when('is_google_login', {
    is: 0,
    then: () =>
      Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&,.\[\]^*])[A-Za-z\d@$!%?&,.\[\]^*]+/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        )
        .required('Password is required'),
  }),
  terms_checked: Yup.boolean()
    .oneOf([true], 'You must accept terms of use privacy policy')
    .required('You must accept terms of use privacy policy'),

  home_address: Yup.string().required('Home address is required'),

  phone_number: Yup.string()
    .required('Phone number is required')
    .matches(/^\d+$/, 'Phone number must contain only digits'),
});

// write a login schema with email and password

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+\s*$/,
      'invalid email address',
    )
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});
