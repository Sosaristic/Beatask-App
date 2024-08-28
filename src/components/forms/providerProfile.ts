import * as Yup from 'yup';

export const ProviderValidationSchema = Yup.object().shape({
  first_legal_name: Yup.string().required('First legal name is required'),
  last_legal_name: Yup.string().required('Last legal name is required'),
  email: Yup.string().email('Email is not valid').required('Email is required'),
  phone_number: Yup.string().required('Phone number is required'),
  business_address: Yup.string().required('Business address is required'),
});
