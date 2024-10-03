import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {CountryPicker} from 'react-native-country-codes-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Camera from 'react-native-vector-icons/Entypo';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RootStackParamList} from '../../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {CustomErrorModal, CustomInput} from '../../components';
import {Avatar, Checkbox, Text as PaperText} from 'react-native-paper';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {customTheme} from '../../custom_theme/customTheme';
import {Formik} from 'formik';
import validationSchema from '../../components/forms/providerSignUpSchema';
import {useUserStore} from '../../store/useUserStore';
import {RouteProp} from '@react-navigation/native';
import SafeAreaViewContainer from '../../components/SafeAreaViewContainer';

// Define the interface for the country object
interface Country {
  dial_code: string;
  // Add other properties if needed
}

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'CreateBeatask'>;
  route: RouteProp<RootStackParamList, 'CreateBeatask'>;
};
interface ImageFile {
  name: string;
  size: number;
  type: string;
  uri: string;
}

export const formatPhoneNumber = (callCode: string, phone: string) => {
  if (phone.startsWith('0')) {
    phone = phone.slice(1);
  }
  return `${callCode}${phone}`;
};

type initialValuesType = {
  first_legal_name: string;
  last_legal_name: string;
  email: string;
  business_address: string;
  password: string;
  phone: string;
  description: string;
  agree_terms: boolean;
  two_factor_authentication: boolean;
};

const CreateAccountScreen: React.FC<Props> = ({navigation, route}) => {
  const {
    params: {
      email,
      first_name,
      google_token,
      last_name,
      password,
      image: imageFromRoute,
    },
  } = route || {};
  const colorScheme = useColorScheme(); // Get the current color scheme (dark or light)
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const {device_token} = useUserStore(state => state);

  const [isPickerVisible, setPickerVisible] = useState(false);

  const [countryCode, setCountryCode] = useState('+1');

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const [image, setImage] = useState<ImageFile | null>(null);
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: 'Missing Fields',
    errorMessage: 'All fields are required',
    isModalOpen: false,
  });

  const initialValues = {
    first_legal_name: first_name || '',
    last_legal_name: last_name || '',
    email: email,
    business_address: '',
    password: password || '',
    phone: '',
    description: '',
    agree_terms: false,
    is_google_login: google_token ? 1 : 0,
    two_factor_authentication: false,
    image: '',
  };

  const handleSelectCountry = (country: Country) => {
    setCountryCode(`${country.dial_code}`);
    setPickerVisible(false);
  };

  const handleCountryCodePress = () => {
    setPickerVisible(true);
  };

  const handleImagePicker = async (
    setFieldValue: (field: string, value: string) => void,
  ) => {
    try {
      const res: DocumentPickerResponse | null =
        await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.allFiles], // You can specify a mime type to filter file types
        });

      if (res) {
        setImage(res as ImageFile);

        setFieldValue('image', res.uri);
      }
    } catch (error) {}
  };

  const handleagree = () => {
    navigation.navigate('Agree' as never);
  };

  const containerStyle = [
    styles.container,
    {backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#FFFFFF'},
  ];

  const handleFormSubmit = (values: initialValuesType) => {
    const payload = {
      ...values,

      phone_number: formatPhoneNumber(countryCode, values.phone),
      two_factor: values.two_factor_authentication ? 1 : 0,
      is_service_provider: 1,
      password: google_token ? '' : values.password,
      device_token,
      profile_image: image,
      is_google_login: google_token ? 1 : 0,
      google_token: google_token || '',
    };
    navigation.navigate('Upload', {
      details: payload,
    });
  };

  return (
    <SafeAreaViewContainer edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={containerStyle}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => {
            return (
              <>
                <View style={{alignItems: 'center', marginBottom: 20}}>
                  <Avatar.Image
                    source={{
                      uri: google_token
                        ? imageFromRoute
                        : image?.uri ||
                          'https://avatar.iran.liara.run/public/28',
                    }}
                  />
                  <Text style={{top: 8}}>
                    {image?.name || 'Add a profile picture'}
                  </Text>

                  <TouchableOpacity
                    style={{top: -40, right: -25}}
                    onPress={() => handleImagePicker(setFieldValue)}>
                    <Camera
                      name="camera"
                      size={30}
                      color={
                        colorScheme === 'dark'
                          ? customTheme.primaryColor
                          : 'black'
                      }
                    />
                  </TouchableOpacity>

                  {errors.image && (
                    <Text style={{marginTop: -10, color: 'red'}}>
                      {errors.image}
                    </Text>
                  )}
                </View>
                <View style={{gap: 20}}>
                  <View>
                    <Text style={styles.label}>First legal name</Text>
                    <TextInput
                      onBlur={handleBlur('first_legal_name')}
                      onChangeText={handleChange('first_legal_name')}
                      value={values.first_legal_name}
                      style={styles.input}
                      placeholder="First legal name"
                      placeholderTextColor="#999"
                    />
                    {errors.first_legal_name && touched.first_legal_name && (
                      <Text style={darkStyles.errorText}>
                        {errors.first_legal_name}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text style={styles.label}>Last legal name</Text>
                    <TextInput
                      onBlur={handleBlur('last_legal_name')}
                      onChangeText={handleChange('last_legal_name')}
                      value={values.last_legal_name}
                      style={styles.input}
                      placeholder="Last legal name"
                      placeholderTextColor="#999"
                    />
                    {errors.last_legal_name && touched.last_legal_name && (
                      <Text style={darkStyles.errorText}>
                        {errors.last_legal_name}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text style={styles.label}>Email address</Text>
                    <TextInput
                      onBlur={handleBlur('email')}
                      onChangeText={handleChange('email')}
                      value={values.email}
                      style={styles.input}
                      editable={false}
                      placeholder="Email address"
                      placeholderTextColor="#999"
                    />
                    {errors.email && touched.email && (
                      <Text style={darkStyles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  <View>
                    <Text style={[styles.label]}>Phone number</Text>
                    <View style={styles.phoneContainer}>
                      <TouchableOpacity
                        style={styles.countryCodeButton}
                        onPress={handleCountryCodePress}>
                        <Text style={styles.countryCodeButtonText}>
                          {countryCode}
                        </Text>
                      </TouchableOpacity>

                      <TextInput
                        style={[styles.input, styles.phoneInput]}
                        placeholder="555 555-1234"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={values.phone}
                      />
                    </View>
                    {errors.phone && touched.phone && (
                      <Text style={[darkStyles.errorText]}>{errors.phone}</Text>
                    )}
                  </View>
                  {!google_token && (
                    <CustomInput
                      label="Password"
                      type="password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      errorText={
                        errors.password && touched.password
                          ? errors.password
                          : ''
                      }
                    />
                  )}

                  <View>
                    <Text style={styles.label}>Business Address</Text>
                    <TextInput
                      onBlur={handleBlur('business_address')}
                      onChangeText={handleChange('business_address')}
                      value={values.business_address}
                      style={styles.input}
                      placeholder="Business name"
                      placeholderTextColor="#999"
                    />
                    {errors.business_address && touched.business_address && (
                      <Text style={darkStyles.errorText}>
                        {errors.business_address}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          borderColor: '#12ccb7',

                          textAlignVertical: 'top', // Align text and placeholder to the top
                          marginTop: hp('2%'), // Ensure no top margin
                          paddingTop: hp('2%'), // Ensure no top padding
                          height: hp('20%'),
                        },
                      ]}
                      value={values.description}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      placeholder="Enter Description"
                      multiline
                      numberOfLines={8}
                    />
                    {errors.description && touched.description && (
                      <Text style={darkStyles.errorText}>
                        {errors.description}
                      </Text>
                    )}
                  </View>
                  <View>
                    <View style={styles.checkboxContainer}>
                      <Checkbox.Item
                        status={values.agree_terms ? 'checked' : 'unchecked'}
                        onPress={() =>
                          setFieldValue('agree_terms', !values.agree_terms)
                        }
                        mode="android"
                        label=""
                      />
                      <PaperText style={styles.checkboxLabel}>
                        I agree to Beatask
                        <PaperText
                          style={{color: '#12CCB7'}}
                          onPress={handleagree}>
                          {' '}
                          terms of use
                        </PaperText>{' '}
                        and{'\n'}
                        <PaperText
                          style={{color: '#12CCB7'}}
                          onPress={handleagree}>
                          {' '}
                          privacy policy.
                        </PaperText>
                      </PaperText>
                    </View>
                    {errors.agree_terms && touched.agree_terms && (
                      <Text style={[darkStyles.errorText, {}]}>
                        {errors.agree_terms}
                      </Text>
                    )}

                    <View style={styles.checkboxContainer}>
                      <Checkbox.Item
                        status={
                          values.two_factor_authentication
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() =>
                          setFieldValue(
                            'two_factor_authentication',
                            !values.two_factor_authentication,
                          )
                        }
                        mode="android"
                        label=""
                      />
                      <PaperText style={styles.checkboxLabel}>
                        Two-Factor Authentication
                        <Text style={{color: '#12CCB7'}}> (2FA)</Text>
                      </PaperText>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.nextButton}
                    disabled={
                      Object.keys(errors).length > 0 ||
                      Object.keys(touched).length === 0
                    }
                    onPress={() => handleSubmit()}>
                    <Text style={styles.nexttext}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          }}
        </Formik>

        {/* Country Picker Modal */}
        <CountryPicker
          show={isPickerVisible}
          pickerButtonOnPress={handleSelectCountry}
          lang="en"
          style={{
            modal: {
              height: 300,
              backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#FFFFFF',
            },
            countryButtonStyles: {
              backgroundColor: colorScheme === 'dark' ? '#AEADA4' : '#F2F2F2',
              borderColor: colorScheme === 'dark' ? '#51514C' : '#ccc',
            },
            textInput: {
              color: colorScheme === 'dark' ? '#010A0C' : '#000',
            },
          }}
        />
        <CustomErrorModal
          {...showErrorModal}
          closeModal={() =>
            setShowErrorModal({...showErrorModal, isModalOpen: false})
          }
        />
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

const textDark = {
  color: '#fff',
};

const textLight = {
  color: '#000',
};

const lightStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: wp('5%'),
    backgroundColor: '#F8F7F4',
  },
  label: {
    ...textLight,
    fontSize: wp('4.5%'),
    fontWeight: '600',
    lineHeight: hp('2.6%'),
    marginBottom: hp('2%'),
  },
  input: {
    height: hp('7.5%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,

    paddingHorizontal: wp('2.5%'),
    padding: hp('2%'),
    color: '#000',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  countryCodeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: hp('7.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('3.75%'),
    borderRadius: 8,
    marginRight: wp('5%'),
  },
  countryCodeButtonText: {
    color: '#000',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,

    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('2.5%'),
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: hp('7.5%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: wp('2.5%'),
    padding: hp('2%'),
    color: '#000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Responsive margin bottom
  },
  checkboxLabel: {
    fontSize: wp('4%'),
  },
  toggleButton: {
    position: 'absolute',
    right: wp('2.5%'),
    padding: wp('2.5%'),
  },
  nextButton: {
    backgroundColor: '#AEADA4',
    paddingTop: hp('2.5%'),
    marginTop: hp('5%'),
    paddingBottom: hp('2.5%'),
    marginHorizontal: wp('26.25%'),
    borderRadius: wp('25%'),
  },
  nexttext: {
    color: '#010A0C',
    alignSelf: 'center',
    fontSize: wp('5%'),
    fontWeight: '700',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: wp('5%'),
    backgroundColor: '#010A0C',
  },
  label: {
    ...textDark,
    fontSize: wp('4.5%'),
    fontWeight: '600',
    lineHeight: hp('2.6%'),
    marginBottom: hp('2%'),
  },
  input: {
    height: hp('7.5%'),
    borderColor: '#51514C',
    borderWidth: 1,
    borderRadius: 8,

    paddingHorizontal: wp('2.5%'),
    padding: hp('2%'),
    color: '#fff',
    backgroundColor: '#51514C',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeButton: {
    backgroundColor: '#51514C',
    height: hp('7.5%'),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('3.75%'),
    borderRadius: 8,
    marginRight: wp('5%'),
  },
  countryCodeButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,

    borderColor: '#51514C',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('2.5%'),
    color: '#fff',
    backgroundColor: '#51514C',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  passwordInput: {
    flex: 1,
    height: hp('7.5%'),
    borderColor: '#51514C',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: wp('2.5%'),
    padding: hp('2%'),
    color: '#fff',
    backgroundColor: '#51514C',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'), // Responsive margin bottom
  },
  checkboxLabel: {
    fontSize: wp('4%'), // Responsive font size
  },
  toggleButton: {
    position: 'absolute',
    right: wp('2.5%'),
    padding: wp('2.5%'),
  },
  nextButton: {
    backgroundColor: '#AEADA4',
    paddingTop: hp('2.5%'),
    marginTop: hp('5%'),
    paddingBottom: hp('2.5%'),
    marginHorizontal: wp('26.25%'),
    borderRadius: wp('25%'),
  },
  nexttext: {
    color: '#010A0C',
    alignSelf: 'center',
    fontSize: wp('5%'),
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
    fontSize: wp('3.5%'),
  },
});

export default CreateAccountScreen;
