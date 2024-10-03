import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React from 'react';
import {CustomButton, CustomInput} from '../../components';

import {Formik} from 'formik';

import * as Yup from 'yup';
import SafeAreaViewContainer from '../../components/SafeAreaViewContainer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Image} from 'react-native';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

const AuthSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+\s*$/,
      'invalid email address',
    )
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&,.\[\]^*])[A-Za-z\d@$!%?&,.\[\]^*]+/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    )
    .required('Password is required'),
});

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'auth_choice'>;
  route: RouteProp<RootStackParamList, 'auth_choice'>;
};

type Payload = {
  email: string;
  last_name: string;
  first_name: string;
  google_token: string;
  image: string;
};

const AuthChoiceScreen: React.FC<Props> = ({navigation, route}) => {
  const {params} = route;

  const colorScheme = useColorScheme(); // Detects dark or light mode

  const isDarkMode = colorScheme === 'dark';

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

  const handleFormSubmit = (values: {email: string; password: string}) => {
    if (params.type === 'customer') {
      navigation.navigate('CreateCustomer', {
        email: values.email.trim(),
        password: values.password,
      });
      return;
    }
    navigation.navigate('CreateBeatask', {
      email: values.email.trim(),
      password: values.password,
    });
  };

  const handleGoogleSignUp = (data: Payload) => {
    if (params.type === 'customer') {
      navigation.navigate('CreateCustomer', {
        ...data,
      });
      return;
    }
    navigation.navigate('CreateBeatask', {
      ...data,
    });
  };

  return (
    <SafeAreaViewContainer edges={['bottom', 'left', 'right']}>
      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={values => handleFormSubmit(values)}
        validationSchema={AuthSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          isSubmitting,
        }) => {
          console.log(isValid);
          return (
            <View style={{paddingHorizontal: 10, marginTop: 20, gap: 20}}>
              <CustomInput
                label="Email"
                type="text"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                errorText={errors.email && touched.email ? errors.email : ''}
                placeholder="Email"
              />
              <CustomInput
                label="Password"
                type="password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                errorText={
                  errors.password && touched.password ? errors.password : ''
                }
                placeholder="Password"
              />
              <CustomButton
                disabled={!isValid}
                buttonText="Proceed"
                onPress={handleSubmit}
              />
            </View>
          );
        }}
      </Formik>

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
          or sign up with
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
              .then(res => {
                const payload = {
                  last_name: res.user.displayName?.split(' ')[0] as string,
                  first_name: res.user.displayName?.split(' ')[1] as string,
                  email: res.user.email as string,
                  google_token: res.user.uid,
                  image: res.user.photoURL as string,
                };
                handleGoogleSignUp(payload);
              })
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
                .then(res => {
                  const payload = {
                    last_name: res.additionalUserInfo?.profile?.given_name,
                    first_name: res.additionalUserInfo?.profile?.family_name,
                    email: res.user.email as string,
                    google_token: res.user.uid,
                    image: res.user.photoURL as string,
                  };
                  handleGoogleSignUp(payload);
                })
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
    </SafeAreaViewContainer>
  );
};

export default AuthChoiceScreen;

const styles = StyleSheet.create({
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
});
