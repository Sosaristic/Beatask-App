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
import {RouteProp} from '@react-navigation/native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {
  CustomButton,
  CustomErrorModal,
  CustomInput,
  CustomModal,
} from '../../components';
import {makeApiRequest} from '../../utils/helpers';
import {formatPhoneNumber} from '../createbeatask/createaccountbeatask';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../../App';
import {useUserStore} from '../../store/useUserStore';
import SafeAreaViewContainer from '../../components/SafeAreaViewContainer';
import {Checkbox, Text as PaperText} from 'react-native-paper';
import {Formik} from 'formik';
import {customerSignUpSchema} from '../../components/forms/authSchema';

// Define the interface for the country object
interface Country {
  dial_code: string;
  // Add other properties if needed
}

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'CreateCustomer'>;
  route: RouteProp<RootStackParamList, 'CreateCustomer'>;
};

const CreateAccountScreen: React.FC<Props> = ({navigation, route}) => {
  const {
    params: {
      email: emailFromRoute,
      first_name,
      google_token,
      last_name,
      password: passwordFromRoute,
    },
  } = route || {};
  const colorScheme = useColorScheme(); // Get the current color scheme (dark or light)
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const {device_token} = useUserStore(state => state);

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');

  const [termsChecked, setTermsChecked] = useState(false); // State for terms checkbox
  const [twoFAChecked, setTwoFAChecked] = useState(false); // State for 2FA checkbox

  const initialValues = {
    first_legal_name: first_name || '',
    last_legal_name: last_name || '',
    terms_checked: false,
    email: emailFromRoute || '',
    home_address: '',
    ...(!google_token && {password: passwordFromRoute || ''}),
    phone_number: '',
    is_service_provider: 0,
    is_google_login: google_token ? 1 : 0,
    google_token,
  };

  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'registration Successful',
    loadingMessage: 'Processing registration',
    requestLoading: false,
    showModal: false,
  });

  const handleSelectCountry = (country: Country) => {
    setCountryCode(`${country.dial_code}`);
    setPickerVisible(false);
  };

  const handleCountryCodePress = () => {
    setPickerVisible(true);
  };

  const handleNextPress = async (values: typeof initialValues) => {
    const payload = {
      first_legal_name: values.first_legal_name,
      last_legal_name: values.last_legal_name,
      email: values.email,
      phone_number: formatPhoneNumber(countryCode, values.phone_number),
      home_address: values.home_address,
      password: google_token ? '123456789' : values.password,
      two_factor: twoFAChecked ? 1 : 0,
      is_service_provider: 0,
      device_token,
      is_google_login: google_token ? 1 : 0,
      google_token: google_token || '',
    };

    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const {data, error} = await makeApiRequest('/register', 'POST', payload);

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Registration failed',
        errorMessage: error.msg,
        isModalOpen: true,
      });
    }

    if (data) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: true,
      });

      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          showModal: false,
        });
        if (google_token) {
          navigation.navigate('Login');
          return;
        }
        navigation.navigate('otp', {
          email: payload.email,
          type: 'email-verify',
        });
      }, 2000);
    }
    // sendDataToAPI();
    // navigation.navigate('OTPCustomer' as never);
  };

  const containerStyle = [
    styles.container,
    {backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#FFFFFF'},
  ];

  return (
    <SafeAreaViewContainer edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={containerStyle}>
        {/* Terms of Use Checkbox */}

        <Formik
          initialValues={initialValues}
          onSubmit={values => handleNextPress(values)}
          validationSchema={customerSignUpSchema}>
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
              <View style={{gap: 20, marginBottom: 20}}>
                <CustomInput
                  onChangeText={handleChange('first_legal_name')}
                  onBlur={handleBlur('first_legal_name')}
                  value={values.first_legal_name}
                  placeholder="First legal name"
                  label="First legal name"
                  errorText={
                    errors.first_legal_name && touched.first_legal_name
                      ? errors.first_legal_name
                      : ''
                  }
                />

                <CustomInput
                  onChangeText={handleChange('last_legal_name')}
                  onBlur={handleBlur('last_legal_name')}
                  value={values.last_legal_name}
                  placeholder="Last legal name"
                  label="Last legal name"
                  errorText={
                    errors.last_legal_name && touched.last_legal_name
                      ? errors.last_legal_name
                      : ''
                  }
                />

                <CustomInput
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  editable={false}
                  placeholder="Email address"
                  label="Email address"
                  errorText={errors.email && touched.email ? errors.email : ''}
                />
                <View>
                  <PaperText variant="titleMedium" style={{marginBottom: 4}}>
                    Phone number
                  </PaperText>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={styles.countryCodeButton}
                      onPress={handleCountryCodePress}>
                      <PaperText>{countryCode}</PaperText>
                    </TouchableOpacity>

                    <TextInput
                      style={[styles.input, styles.phoneInput]}
                      placeholder="555 555-1234"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                      value={values.phone_number}
                      onChangeText={text => setFieldValue('phone_number', text)}
                    />
                  </View>
                  {errors.phone_number ? (
                    <PaperText style={{color: 'red'}}>
                      {errors.phone_number}
                    </PaperText>
                  ) : null}
                </View>
                <CustomInput
                  onChangeText={handleChange('home_address')}
                  onBlur={handleBlur('home_address')}
                  value={values.home_address}
                  placeholder="Home address"
                  label="Home address"
                  errorText={
                    errors.home_address && touched.home_address
                      ? errors.home_address
                      : ''
                  }
                />
                {!google_token && (
                  <CustomInput
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    label="Password"
                    value={values.password}
                    placeholder="password"
                    type="password"
                    errorText={
                      errors.password && touched.password ? errors.password : ''
                    }
                  />
                )}
                <View>
                  <View style={[styles.checkboxContainer, {marginTop: 6}]}>
                    <Checkbox.Item
                      status={values.terms_checked ? 'checked' : 'unchecked'}
                      onPress={() =>
                        setFieldValue('terms_checked', !values.terms_checked)
                      }
                      mode="android"
                      label=""
                    />
                    <PaperText style={styles.checkboxLabel}>
                      I agree to Beatask
                      <PaperText style={{color: '#12CCB7'}}>
                        {' '}
                        terms of use
                      </PaperText>{' '}
                      and
                      {'\n'}
                      <PaperText style={{color: '#12CCB7'}}>
                        {' '}
                        privacy policy.
                      </PaperText>
                    </PaperText>
                  </View>
                  {errors.terms_checked ? (
                    <PaperText style={{color: 'red', paddingHorizontal: 20}}>
                      {errors.terms_checked}
                    </PaperText>
                  ) : null}
                  <View style={styles.checkboxContainer}>
                    <Checkbox.Item
                      status={twoFAChecked ? 'checked' : 'unchecked'}
                      onPress={() => setTwoFAChecked(!twoFAChecked)}
                      mode="android"
                      label=""
                    />
                    <PaperText style={styles.checkboxLabel}>
                      Two-Factor Authentication
                      <PaperText style={{color: '#12CCB7'}}> (2FA)</PaperText>
                    </PaperText>
                  </View>
                </View>

                <CustomButton
                  onPress={handleSubmit}
                  buttonText="Next"
                  disabled={
                    Object.keys(errors).length > 0 ||
                    Object.keys(touched).length === 0
                  }
                />
              </View>
            );
          }}
        </Formik>

        {/* Two-Factor Authentication Checkbox */}

        {/* Next Button */}

        {/* Country Picker Modal */}
        <CountryPicker
          show={isPickerVisible}
          pickerButtonOnPress={handleSelectCountry}
          lang="en"
          style={{
            modal: {
              height: 500,
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
        <CustomModal {...showSuccessModal} />
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
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  countryCodeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    height: hp('7.5%'),
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
    marginBottom: hp('2.5%'),
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
    marginLeft: wp('2%'),
    color: 'dark' ? '#010A0C' : '#000',
  },
  errorText: {
    color: 'red',
    fontSize: wp('3.5%'),
    marginBottom: hp('2%'),
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
    marginBottom: hp('2.5%'),
  },
  countryCodeButton: {
    backgroundColor: '#51514C',
    height: hp('7.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
    // Responsive margin bottom
  },
  checkboxLabel: {
    fontSize: wp('4%'), // Responsive font size
    marginLeft: wp('2%'),
  },
  errorText: {
    color: 'red',
    fontSize: wp('3.5%'),
    marginBottom: hp('2%'),
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

export default CreateAccountScreen;
