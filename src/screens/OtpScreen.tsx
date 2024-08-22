import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {makeApiRequest} from '../utils/helpers';
import {CustomErrorModal, CustomModal} from '../components';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import OTPTextInput from 'react-native-otp-textinput';

type Props = {
  route: RouteProp<RootStackParamList, 'otp'>;
  navigation: StackNavigationProp<RootStackParamList, 'otp'>;
};

const OtpScreen: React.FC<Props> = ({route, navigation}) => {
  const colorScheme = useColorScheme(); // Get the current color scheme (dark or light)
  const {email, type, is_service_provider} = route.params;

  const [resendTimer, setResendTimer] = useState(90); // 1 minute in seconds
  const [showResendButton, setShowResendButton] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [otp, setOtp] = useState('');
  const otpRef = useRef<OTPTextInput>(null);

  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Background check',
    successMessage: 'Your account is now fully active. ',
    loadingMessage: 'Background check is in progress. Please hold on.',
    requestLoading: false,
    showModal: false,
  });

  useEffect(() => {
    navigation.setOptions({
      title:
        type === 'email-verify'
          ? 'Email Verification'
          : 'Two Factor Authentication',
    });
  }, [type]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else {
      setShowResendButton(true);
    }
    return () => clearInterval(timerId);
  }, [resendTimer]);

  // Function to check if all digits are entered

  const handleNextPress = async () => {
    setShowModal(true);

    console.log(otp);

    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });

    const {data, error} = await makeApiRequest('/verified', 'POST', {
      email,
      otp,
    });

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Error',
        errorMessage: error?.msg as string,
        isModalOpen: true,
      });
    }

    if (data) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: true,
        successTitle: 'Background check',
        successMessage: 'Your account is now fully active. ',
        loadingMessage: 'Background check is in progress. Please hold on.',
      });
      otpRef.current?.clear();
      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          showModal: false,
        });

        if (type === '2fa') {
          if (is_service_provider === 1) {
            navigation.navigate('dashboard' as never);
            return;
          }

          navigation.navigate('Home' as never);
        } else {
          navigation.navigate('Login' as never);
        }
      }, 2000);
    }
  };

  const handleResendCode = async () => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    setShowErrorModal({
      errorTitle: '',
      errorMessage: '',
      isModalOpen: false,
    });
    const {data, error} = await makeApiRequest('/resend-otp', 'POST', {
      email,
    });

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      otpRef.current?.clear();
      setShowErrorModal({
        errorTitle: 'Error',
        errorMessage: error?.msg as string,
        isModalOpen: true,
      });
    }

    if (data) {
      otpRef.current?.clear();
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: true,
        successTitle: 'Otp Sent',
        successMessage: 'Otp sent successfully',
      });

      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          showModal: false,
          successMessage: 'Otp sent successfully',
          successTitle: 'Otp Sent',
        });
      }, 1000);
      setResendTimer(90); // Reset the timer
      setShowResendButton(false); // Hide the resend button and show the countdown again
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer,
      ]}>
      <Text
        style={[
          styles.title,
          colorScheme === 'dark' ? styles.darkTitle : styles.lightTitle,
        ]}>
        Enter verification code
      </Text>
      <Text
        style={[
          styles.subtitle,
          colorScheme === 'dark' ? styles.darkSubtitle : styles.lightSubtitle,
        ]}>
        Check your email, a 6 digits verification code was sent.
      </Text>
      <View style={{width: '100%'}}>
        <OTPTextInput
          inputCount={6}
          handleTextChange={e => setOtp(e)}
          ref={otpRef}
          textInputStyle={styles.lightInput}
          containerStyle={{
            width: wp('100%'),
            position: 'relative',
            justifyContent: 'flex-start',
          }}
        />
      </View>
      <View style={styles.resendContainer}>
        {!showResendButton ? (
          <Text>
            <Text
              style={[
                styles.resendLabelText,
                colorScheme === 'dark' ? styles.darkText : styles.lightText,
              ]}>
              Resend code
            </Text>
            <Text style={styles.resendLabelspace}> </Text>
            <Text
              style={[
                styles.countdownText,
                colorScheme === 'dark' ? styles.darkText : styles.lightText,
              ]}>
              {Math.floor(resendTimer / 60)}:{resendTimer % 60 < 10 ? '0' : ''}
              {resendTimer % 60}
            </Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendCode}>
            <Text
              style={[
                styles.resendText,
                colorScheme === 'dark' ? styles.darkText : styles.lightText,
              ]}>
              RESEND CODE
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={handleNextPress}
        style={[styles.submitButton, {opacity: otp.length === 6 ? 1 : 0.5}]}
        disabled={otp.length < 6}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Modal for Verifying Code */}

      <CustomModal {...showSuccessModal} />
      <CustomErrorModal
        {...showErrorModal}
        closeModal={() =>
          setShowErrorModal({...showErrorModal, isModalOpen: false})
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    paddingTop: hp('5%'),
  },
  darkContainer: {
    backgroundColor: '#010A0C',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: wp('8%'),
    fontWeight: '700',
    marginBottom: hp('2%'),
    marginLeft: wp('5%'),
  },
  darkTitle: {
    color: '#FFF',
  },
  lightTitle: {
    color: '#010A0C',
  },
  subtitle: {
    fontSize: wp('4%'),
    marginLeft: wp('5%'),
    marginBottom: hp('4%'),
  },
  darkSubtitle: {
    color: '#FFF',
  },
  lightSubtitle: {
    color: '#010A0C',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  input: {
    fontSize: wp('8%'),
    textAlign: 'center',
    borderRadius: 8,
    width: wp('12%'),
    height: hp('10%'),
    marginHorizontal: wp('2%'),
  },
  darkInput: {
    backgroundColor: '#51514C',
    color: '#FFF',
  },
  lightInput: {
    width: wp('12%'),
    backgroundColor: '#F2F2F2',
    color: '#010A0C',
    borderBottomWidth: 0,
    borderRadius: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('4%'),
    marginTop: hp('4%'),
    marginLeft: wp('5%'),
  },
  resendLabelspace: {
    marginLeft: wp('2%'),
  },
  resendLabelText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    right: wp('2%'),
  },
  countdownText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    justifyContent: 'space-evenly',
    paddingLeft: wp('10%'),
  },
  darkText: {
    color: '#FFF',
  },
  lightText: {
    color: '#010A0C',
  },
  resendText: {
    fontSize: wp('4%'),
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#AEADA4',
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('10%'),
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: hp('5%'),
  },
  submitButtonText: {
    alignSelf: 'center',
    fontSize: wp('5%'),
    fontWeight: '700',
    color: '#010A0C',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: wp('10%'),
    paddingHorizontal: wp('6%'),
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginTop: hp('2%'),
    color: '#010A0C', // Default text color
  },
  modalTextSuccess: {
    fontSize: wp('6%'),
    fontWeight: '700',
    marginBottom: hp('2%'),
    color: '#12CCB7', // Success text color
  },
  modalIcon: {
    width: wp('12%'),
    height: hp('6%'),
    marginBottom: hp('2%'),
  },
});

export default OtpScreen;
