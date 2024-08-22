import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ToastAndroid,
} from 'react-native';
import {CountryPicker} from 'react-native-country-codes-picker';
import {RouteProp, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RootStackParamList} from '../../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {CustomErrorModal} from '../../components';

// Define the interface for the country object
interface Country {
  dial_code: string;
  // Add other properties if needed
}

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'CreateBeatask'>;
};

export const formatPhoneNumber = (callCode: string, phone: string) => {
  if (phone.startsWith('0')) {
    phone = phone.slice(1);
  }

  return `${callCode}${phone}`;
};

const CreateAccountScreen: React.FC<Props> = ({navigation}) => {
  const colorScheme = useColorScheme(); // Get the current color scheme (dark or light)
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [details, setDetails] = useState({
    last_legal_name: '',
    first_legal_name: '',
    email: '',
    business_address: '',
  });
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [termsChecked, setTermsChecked] = useState(false); // State for terms checkbox
  const [twoFAChecked, setTwoFAChecked] = useState(false); // State for 2FA checkbox
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: 'Missing Fields',
    errorMessage: 'All fields are required',
    isModalOpen: false,
  });

  const handleSelectCountry = (country: Country) => {
    setCountryCode(`${country.dial_code}`);
    setPickerVisible(false);
  };

  const handleCountryCodePress = () => {
    setPickerVisible(true);
  };

  const handleNextPress = () => {
    if (!termsChecked) {
      ToastAndroid.showWithGravity(
        'Terms and conditions must be accepted',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      return;
    }

    const payload = {
      ...details,

      phone_number: formatPhoneNumber(countryCode, phoneNumber),
      password,
      two_factor: twoFAChecked ? 1 : 0,
      is_service_provider: 1,
    };

    for (const [key, value] of Object.entries(payload)) {
      if (value === null || value === undefined || value === '') {
        setShowErrorModal({
          ...showErrorModal,
          isModalOpen: true,
          errorMessage: 'Please fill all the required fields',
        });
        return;
      }
    }

    navigation.navigate('Upload', {
      details: payload,
    });
  };
  const handleagree = () => {
    navigation.navigate('Agree' as never);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const containerStyle = [
    styles.container,
    {backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#FFFFFF'},
  ];
  console.log(termsChecked);

  return (
    <ScrollView contentContainerStyle={containerStyle}>
      <Text style={styles.label}>First legal name</Text>
      <TextInput
        style={styles.input}
        placeholder="First legal name"
        placeholderTextColor="#999"
        onChangeText={text => setDetails({...details, first_legal_name: text})}
      />

      <Text style={styles.label}>Last legal name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last legal name"
        placeholderTextColor="#999"
        onChangeText={text => setDetails({...details, last_legal_name: text})}
      />

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#999"
        keyboardType="email-address"
        onChangeText={text => setDetails({...details, email: text})}
      />

      <Text style={styles.label}>Phone number</Text>
      <View style={styles.phoneContainer}>
        <TouchableOpacity
          style={styles.countryCodeButton}
          onPress={handleCountryCodePress}>
          <Text style={styles.countryCodeButtonText}>{countryCode}</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, styles.phoneInput]}
          placeholder="555 555-1234"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
        />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={togglePasswordVisibility}>
          <Icon
            name={isPasswordVisible ? 'eye' : 'eye-slash'}
            size={20}
            color="#12CCB7"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Business address</Text>
      <TextInput
        style={styles.input}
        placeholder="Business address"
        placeholderTextColor="#999"
        onChangeText={text => setDetails({...details, business_address: text})}
      />

      {/* Terms of Use Checkbox */}
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={termsChecked}
          onValueChange={newValue => setTermsChecked(newValue)}
          tintColors={{true: '#12CCB7', false: '#12CCB7'}}
        />
        <Text style={styles.checkboxLabel}>
          I agree to Beatask
          <Text style={{color: '#12CCB7'}} onPress={handleagree}>
            {' '}
            terms of use
          </Text>{' '}
          and{'\n'}
          <Text style={{color: '#12CCB7'}} onPress={handleagree}>
            {' '}
            privacy policy.
          </Text>
        </Text>
      </View>

      {/* Two-Factor Authentication Checkbox */}
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={twoFAChecked}
          onValueChange={newValue => setTwoFAChecked(newValue)}
          tintColors={{true: '#12CCB7', false: '#12CCB7'}}
        />
        <Text style={styles.checkboxLabel}>
          Two-Factor Authentication
          <Text style={{color: '#12CCB7'}}> (2FA)</Text>
        </Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nexttext}>Next</Text>
      </TouchableOpacity>

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
    marginBottom: hp('2.5%'),
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
    paddingTop: hp('2.5%'),
    paddingBottom: hp('2.5%'),
    paddingHorizontal: wp('3.75%'),
    borderRadius: 8,
    marginRight: wp('5%'),
    marginBottom: hp('1%'),
  },
  countryCodeButtonText: {
    color: '#000',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,
    marginTop: hp('1%'),
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
    marginBottom: hp('2%'), // Responsive margin bottom
  },
  checkboxLabel: {
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
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
    marginBottom: hp('2.5%'),
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
    paddingTop: hp('2.5%'),
    paddingBottom: hp('2.5%'),
    paddingHorizontal: wp('3.75%'),
    borderRadius: 8,
    marginRight: wp('5%'),
    marginBottom: hp('1%'),
  },
  countryCodeButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,
    marginTop: hp('1%'),
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
    marginLeft: wp('2%'),
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
