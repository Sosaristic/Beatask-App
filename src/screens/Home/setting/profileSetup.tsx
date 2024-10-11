import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
} from 'react-native';
import {CountryPicker} from 'react-native-country-codes-picker';

import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useUserStore} from '../../../store/useUserStore';
import {Formik} from 'formik';
import {ProviderValidationSchema} from '../../../components/forms/providerProfile';
import {makeApiRequest} from '../../../utils/helpers';
import {CustomErrorModal, CustomModal} from '../../../components';
import {LoginSuccessResponse} from '../../Login/Login';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';
import {Text} from 'react-native-paper';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../App';

type ScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProfileSetup'>;
};
interface Country {
  dial_code: string;
}

type InitialValues = {
  profile_image: string;
  first_legal_name: string;
  last_legal_name: string;
  email: string;
  phone_number: string;
  business_address: string;
};

const CreateAccountScreen: React.FC<ScreenProps> = ({navigation}) => {
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const {
    user,
    actions: {login},
  } = useUserStore(state => state);

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');

  const [imageUri, setImageUri] = useState<string | undefined>(
    user?.profile_image || '',
  );
  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Profile Updated',
    loadingMessage: 'processing..',
    requestLoading: false,
    showModal: false,
  });
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const pickImage = () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSelectCountry = (country: Country) => {
    setCountryCode(`${country.dial_code}`);
    setPickerVisible(false);
  };

  const handleCountryCodePress = () => {
    setPickerVisible(true);
  };

  const handleNextPress = async (values: InitialValues) => {
    const payload = {
      ...values,
      phone_number: `${countryCode}${values.phone_number}`,
      profile_image: imageUri,
    };

    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }

    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const {data, error} = await makeApiRequest<LoginSuccessResponse>(
      `/update-user/${user?.id}`,
      'POST',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      console.log(error);
      setShowErrorModal({
        errorTitle: 'Profile Update Failed',
        errorMessage: "We couldn't update your profile. Please try again",
        isModalOpen: true,
      });
    }

    if (data) {
      login(data.data);

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
      }, 2000);
    }

    // navigation.navigate('Setting' as never);
  };

  return (
    <SafeAreaViewContainer edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#FFFFFF'},
        ]}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image source={{uri: imageUri}} style={styles.image} />
            ) : (
              <Image
                source={
                  user?.profile_image
                    ? {uri: user?.profile_image}
                    : {uri: 'https://avatar.iran.liara.run/public/44'}
                }
                style={styles.image}
              />
            )}
            <Icon
              name="pencil"
              size={24}
              color={colorScheme === 'dark' ? '#12CCB7' : '#12CCB7'}
              style={styles.icon}
            />
            {!imageUri && (
              <Text
                style={[
                  darkStyles.errorText,
                  {marginTop: 10, width: 200, textAlign: 'center'},
                ]}>
                Image is required
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <Formik
          initialValues={{
            profile_image: user?.profile_image || '',
            first_legal_name: user?.first_legal_name || '',
            last_legal_name: user?.last_legal_name || '',
            phone_number: user?.phone_number?.slice(2) || '',
            email: user?.email || '',
            business_address: user?.business_address || '',
          }}
          onSubmit={values => {
            handleNextPress(values);
          }}
          validationSchema={ProviderValidationSchema}>
          {({values, handleChange, handleBlur, handleSubmit, errors}) => (
            <View style={{gap: 12}}>
              <View style={{gap: 8}}>
                <Text>First Legal Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  placeholderTextColor="#999"
                  onChangeText={handleChange('first_legal_name')}
                  onBlur={handleBlur('first_legal_name')}
                  value={values.first_legal_name}
                />
                {errors.first_legal_name && (
                  <Text style={darkStyles.errorText}>
                    {errors.first_legal_name}
                  </Text>
                )}
              </View>
              <View style={{gap: 8}}>
                <Text>Last Legal Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  placeholderTextColor="#999"
                  onChangeText={handleChange('last_legal_name')}
                  onBlur={handleBlur('last_legal_name')}
                  value={values.last_legal_name}
                />
                {errors.last_legal_name && (
                  <Text style={darkStyles.errorText}>
                    {errors.last_legal_name}
                  </Text>
                )}
              </View>
              <View style={{gap: 8}}>
                <Text>Phone number</Text>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <TouchableOpacity
                      style={styles.countryCodeButton}
                      onPress={handleCountryCodePress}>
                      <Text>{countryCode}</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[styles.input, styles.phoneInput]}
                    placeholder="555 555-1234"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={values.phone_number}
                    onChangeText={handleChange('phone_number')}
                    onBlur={handleBlur('phone_number')}
                  />
                </View>
              </View>
              <View style={{gap: 8}}>
                <Text>Email address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {errors.email && (
                  <Text style={darkStyles.errorText}>{errors.email}</Text>
                )}
              </View>
              <View style={{gap: 8}}>
                <Text>Business address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Business address"
                  placeholderTextColor="#999"
                  onChangeText={handleChange('business_address')}
                  onBlur={handleBlur('business_address')}
                  value={values.business_address}
                />
                {errors.business_address && (
                  <Text style={darkStyles.errorText}>
                    {errors.business_address}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('update_docs')}
                style={[
                  styles.input,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                ]}>
                <Text>Other Details</Text>
                <EvilIcons
                  name="chevron-right"
                  size={24}
                  color={colorScheme === 'dark' ? '#12CCB7' : '#000'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!imageUri}
                style={styles.nextButton}
                onPress={() => handleSubmit()}>
                <Text style={styles.nexttext}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

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

const lightStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: wp('5%'),
    backgroundColor: '#F8F7F4',
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: '#000',

    fontWeight: '600',
  },
  input: {
    height: hp('7.5%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,

    paddingHorizontal: wp('2.5%'),

    color: '#000',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingTop: hp('2.5%'),
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
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  icon: {
    position: 'absolute',
    bottom: 4,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 1,
    borderWidth: 1,
    borderColor: '#666',
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
    color: '#fff',
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
    borderWidth: 1,
    backgroundColor: '#51514C',
    paddingTop: hp('2.5%'),
    height: hp('7.5%'),
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
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  icon: {
    position: 'absolute',
    bottom: 4,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 1,
    borderWidth: 1,
    borderColor: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: wp('3.5%'),
  },
});

export default CreateAccountScreen;
