import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  last_legal_name: Yup.string()
    .required('Last legal name is required')
    .min(2, 'Last legal name must be at least 2 characters')
    .max(50, 'Last legal name must be at most 50 characters'),

  first_legal_name: Yup.string()
    .required('First legal name is required')
    .min(2, 'First legal name must be at least 2 characters')
    .max(50, 'First legal name must be at most 50 characters'),

  email: Yup.string().required('Email is required').email('Email is not valid'),

  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\d+$/, 'Phone number must contain only digits'),

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

  business_address: Yup.string()
    .required('Business address is required')
    .min(5, 'Business address must be at least 5 characters')
    .max(100, 'Business address must be at most 100 characters'),
  image: Yup.string().required('Profile image is required'),

  description: Yup.string()
    .max(500, 'Description must be at most 500 characters')
    .required('Description is required'),

  agree_terms: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions',
  ),

  two_factor: Yup.boolean().notRequired(),
});

export default validationSchema;
