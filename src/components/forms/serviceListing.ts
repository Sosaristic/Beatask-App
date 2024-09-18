import * as Yup from 'yup';

const imageSchema = Yup.object().shape({
  fileCopyUri: Yup.string().nullable(),
  name: Yup.string().required('Image name is required'),
  size: Yup.number().positive().required('Image size is required'),
  type: Yup.string().required('Image type is required'),
  uri: Yup.string().required('Image URI is required'),
});

export const ServiceListingValidationSchema = Yup.object().shape({
  service_name: Yup.string().required('Service name is required'),
  years_of_experience: Yup.number()
    .required('Years of experience is required')
    .min(5, 'Years of experience must be at least 5')
    .typeError('Years of experience must be a number'),
  service_image: imageSchema.required('Service image is required'),
  experience_document: imageSchema.required(
    'Service certification is required',
  ),
  real_price: Yup.string().required('Real price is required'),
  discounted_price: Yup.string().required('Discounted price is required'),
  service_description: Yup.string()
    .required('Service description is required')
    .min(5, 'Service description must be at least 5 characters'),
});
