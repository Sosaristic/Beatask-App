import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  useColorScheme,
  Image,
  Platform,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Checkbox} from 'react-native-paper';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {User, useUserStore} from '../../store/useUserStore';
import {makeApiRequest} from '../../utils/helpers';
import {
  CustomButton,
  CustomErrorModal,
  CustomInput,
  CustomModal,
} from '../../components';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../App';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {Formik} from 'formik';
import {LoginSchema} from '../../components/forms/authSchema';

export type LoginSuccessResponse = {
  data: User;
  msg: string;
  success: boolean;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const Login: React.FC<Props> = ({navigation}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const {
    actions: {login},
    device_token,
  } = useUserStore(state => state);

  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Login Successful',
    loadingMessage: 'Logging in..',
    requestLoading: false,
    showModal: false,
  });

  const [rememberMe, setRememberMe] = useState(false);

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const handleLogin = async (
    payload: {email: string; password: string} | {google_token: string},
  ) => {
    const notVerified =
      'Otp sent again please verify your email address to login';

    if (loginAttempts > 5) {
      setShowErrorModal({
        errorTitle: 'Unable to login',
        errorMessage: 'Too much attempts',
        isModalOpen: true,
      });
      return;
    }

    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });

    setLoginAttempts(prev => prev + 1);

    const {data, error} = await makeApiRequest<LoginSuccessResponse>(
      '/login',
      'POST',
      {
        ...payload,
        device_token,
      },
    );
    if (error) {
      GoogleSignin.revokeAccess()
        .then(() => GoogleSignin.signOut())
        .then(() => console.log('User signed out!'))
        .catch(err => console.log(err));
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Unable to login',
        errorMessage: error.msg,
        isModalOpen: true,
      });
      if (error.msg === notVerified) {
        setTimeout(() => {
          setShowErrorModal({
            ...showErrorModal,
            isModalOpen: false,
          });
          if ('email' in payload) {
            navigation.navigate('otp', {
              email: payload.email,
              type: 'email-verify',
            });
          }
        }, 1000);
      }
    }

    if (data) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: true,
      });

      login(data.data);
      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          showModal: false,
        });
        if (data.data?.two_factor) {
          navigation.navigate('otp', {
            email: data.data.email,
            type: '2fa',
            is_service_provider: data.data?.is_service_provider,
          });
          return;
        }
        if (data.data?.is_service_provider === 1) {
          navigation.navigate('dashboard');
          return;
        }
        navigation.navigate('Home' as never);
      }, 2000);
    }
  };

  const closeModal = () => {
    setShowPopup(false);
  };

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {data, type} = await GoogleSignin.signIn();
    if (type === 'cancelled') throw new Error('Cancelled');

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      data?.idToken as string,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  const LockoutModal: React.FC = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showPopup}
      onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon
              name="close-circle-outline"
              size={wp('10%')}
              color="red"
              style={styles.modalIcon}
            />
            <Text style={styles.modalText1}>Account lockout</Text>
            <Text style={styles.modalText2}>
              Your account is locked due to{'\n'}too many failed login attempts
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDarkMode ? styles.containerDark : styles.containerLight,
        {padding: wp('5%')}, // Responsive padding
      ]}>
      <LockoutModal />

      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={values => handleLogin(values)}
        validationSchema={LoginSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
        }) => {
          return (
            <View style={{gap: 10, marginTop: 10}}>
              <CustomInput
                label="Email Address"
                placeholder="Email address"
                type="email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                errorText={errors.email && touched.email ? errors.email : ''}
              />

              <CustomInput
                label="Password"
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                type="password"
                errorText={
                  errors.password && touched.password ? errors.password : ''
                }
              />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Checkbox.Item
                  label=""
                  mode="android"
                  style={{paddingLeft: 0, margin: 0}}
                  status={rememberMe ? 'checked' : 'unchecked'}
                  onPress={() => setRememberMe(!rememberMe)}
                />
                <Text
                  style={[
                    styles.checkboxLabel,
                    isDarkMode ? styles.textDark : styles.textLight,
                  ]}>
                  Remember me
                </Text>
              </View>

              <CustomButton
                disabled={
                  Object.keys(errors).length > 0 ||
                  Object.keys(touched).length === 0
                }
                buttonText="Next"
                onPress={handleSubmit}
              />
            </View>
          );
        }}
      </Formik>
      <TouchableOpacity onPress={() => navigation.navigate('forgotPassword')}>
        <Text style={styles.forgotPassword}>FORGOT PASSWORD?</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View
          style={[
            styles.line1,
            isDarkMode ? styles.lightLine : styles.darkLine,
          ]}
        />
        <Text
          style={[
            styles.dividerText,
            isDarkMode ? styles.textDark : styles.textLight,
          ]}>
          or login with
        </Text>
        <View
          style={[
            styles.line2,
            isDarkMode ? styles.lightLine : styles.darkLine,
          ]}
        />
      </View>

      <View style={styles.socialButtons}>
        {/* <TouchableOpacity
          style={styles.facebookButton}
          onPress={() =>
            onFacebookButtonPress()
              .then(res => handleLogin({google_token: res.user.uid}))
              .catch((err: any) =>
                Alert.alert(`Could not login with facebook credentials`),
              )
          }>
          <Icon name="facebook" size={wp('8%')} color="#fff" />
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={
            () =>
              onGoogleButtonPress()
                .then(res => handleLogin({google_token: res.user.uid}))
                .catch((err: any) => console.log(err))

            // GoogleSignin.revokeAccess()
            //   .then(() => GoogleSignin.signOut())
            //   .then(() => console.log('User signed out!'))
          }>
          <Image
            source={require('../../assets/images/google.png')}
            style={{width: 40, height: 40}}
          />
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[
              styles.appleButton,
              isDarkMode ? styles.appleButtonDark : styles.appleButtonLight,
            ]}>
            <Icon name="apple" size={wp('10%')} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

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
    flexGrow: 1,
  },
  containerDark: {
    backgroundColor: '#010A0C',
  },
  containerLight: {
    // backgroundColor: '#F8F7F4',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: hp('2%'), // Responsive margin bottom
    paddingHorizontal: wp('4%'), // Responsive horizontal padding
  },
  inputDark: {
    backgroundColor: '#51514C',
    color: '#fff',
  },
  inputLight: {
    // backgroundColor: '#fff',
    color: '#000',
  },
  eyeIcon: {
    position: 'absolute',
    right: wp('4%'), // Responsive right position
    marginTop: hp('2%'), // Responsive top margin
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    gap: 2,
    // Responsive margin bottom
  },
  checkboxLabel: {
    fontSize: wp('4%'), // Responsive font size
  },
  nextButton: {
    backgroundColor: '#888',
    borderRadius: wp('10%'), // Responsive border radius
    marginVertical: hp('2%'), // Responsive vertical margin
    marginHorizontal: wp('24%'), // Responsive horizontal padding
    paddingVertical: hp('2%'), // Responsive vertical padding
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: wp('4.5%'), // Responsive font size
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#12CCB7',
    textAlign: 'center',
    fontSize: wp('3.5%'), // Responsive font size
    marginTop: hp('2%'), // Responsive margin top
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('2%'), // Responsive margin vertical
    marginTop: hp('6%'), // Responsive margin top
  },
  line1: {
    flex: 1,
    height: 1,
    marginLeft: wp('3%'), // Responsive margin left
  },
  line2: {
    flex: 1,
    height: 1,
    marginRight: wp('3%'), // Responsive margin right
  },
  lightLine: {
    backgroundColor: '#F8F7F4',
  },
  darkLine: {
    backgroundColor: '#010A0C',
  },
  dividerText: {
    marginHorizontal: wp('2%'), // Responsive margin horizontal
    fontSize: wp('3.5%'), // Responsive font size
  },
  textDark: {
    color: '#fff',
  },
  textLight: {
    color: '#000',
  },
  label: {
    marginBottom: hp('3%'), // Responsive margin bottom
    fontSize: wp('5%'), // Responsive font size
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',

    alignItems: 'center',
    marginTop: hp('6%'), // Responsive margin top
  },
  googleButton: {
    width: wp('15%'), // Responsive width
    height: hp('8%'), // Responsive height
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    padding: wp('2%'), // Responsive padding
    borderRadius: wp('2%'), // Responsive border radius
  },
  appleButton: {
    padding: wp('2%'), // Responsive padding
    borderRadius: wp('4%'), // Responsive border radius
  },
  appleButtonDark: {
    // backgroundColor: '#333', // Dark mode background color
  },
  appleButtonLight: {
    backgroundColor: 'grey', // Light mode background color
  },
  errorText: {
    color: 'red',
    fontSize: wp('3%'), // Responsive font size
    marginTop: hp('1%'), // Responsive margin top
    marginLeft: wp('2%'), // Responsive margin left
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: wp('5%'), // Responsive padding
    borderRadius: wp('5%'), // Responsive border radius
    elevation: 5,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: hp('1%'), // Responsive margin bottom
  },
  modalText1: {
    textAlign: 'center',
    fontSize: wp('4%'), // Responsive font size
    marginBottom: hp('1%'), // Responsive margin bottom
    color: 'red',
    fontWeight: 'bold',
  },
  modalText2: {
    textAlign: 'center',
    fontSize: wp('4.5%'), // Responsive font size
    marginBottom: hp('1%'), // Responsive margin bottom
    color: 'red',
  },
  iosCheckBox: {
    width: wp('3%'), // Responsive width
    height: hp('3%'), // Responsive height
  },
  androidCheckBox: {
    width: wp('4%'), // Responsive width
    height: hp('4%'), // Responsive height
  },
});

export default Login;
