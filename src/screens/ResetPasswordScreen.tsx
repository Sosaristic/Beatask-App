import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {passwordResetSchema} from '../components/forms/authSchema';
import {CustomErrorModal, CustomModal} from '../components';
import {makeApiRequest} from '../utils/helpers';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'resetPassword'>;
  route: RouteProp<RootStackParamList, 'resetPassword'>;
};

const ResetPasswordScreen: React.FC<Props> = ({navigation, route}) => {
  const {email} = route.params || {};
  const colorScheme = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Password changed successfully',
    loadingMessage: 'Processing',
    requestLoading: false,
    showModal: false,
  });

  const isDarkMode = colorScheme === 'dark';

  const handleFormSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const payload = {
      email,
      password: values.password,
      password_confirmation: values.confirmPassword,
    };

    const {data, error} = await makeApiRequest(
      '/change-password',
      'POST',
      payload,
    );

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Error',
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
        navigation.replace('Login');
      }, 2000);
    }
  };

  return (
    <View>
      <Formik
        initialValues={{password: '', confirmPassword: ''}}
        onSubmit={values => handleFormSubmit(values)}
        validationSchema={passwordResetSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={{paddingHorizontal: 20, marginTop: 20, gap: 20}}>
            <View style={{gap: 10}}>
              <Text
                style={[
                  styles.label,
                  isDarkMode ? styles.textDark : styles.textLight,
                ]}>
                Password
              </Text>
              <View>
                <TextInput
                  style={[
                    styles.input,
                    isDarkMode ? styles.inputDark : styles.inputLight,
                    {height: hp('7%')}, // Responsive height
                  ]}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  value={values.password}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}>
                  <Icon
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={wp('6%')}
                    color="#12CCB7"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <View style={{gap: 10}}>
              <Text
                style={[
                  styles.label,
                  isDarkMode ? styles.textDark : styles.textLight,
                ]}>
                Confirm Password
              </Text>
              <View>
                <TextInput
                  style={[
                    styles.input,
                    isDarkMode ? styles.inputDark : styles.inputLight,
                    {height: hp('7%')}, // Responsive height
                  ]}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry={!showConfirmPassword}
                  value={values.confirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}>
                  <Icon
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={wp('6%')}
                    color="#12CCB7"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => handleSubmit()}>
              <Text style={styles.nextButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <CustomModal {...showSuccessModal} />
      <CustomErrorModal
        {...showErrorModal}
        closeModal={() =>
          setShowErrorModal({...showErrorModal, isModalOpen: false})
        }
      />
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: wp('3%'), // Responsive font size
    // Responsive margin top
    marginLeft: wp('2%'), // Responsive margin left
  },
  textDark: {
    color: '#fff',
  },
  textLight: {
    color: '#000',
  },
  label: {
    fontSize: wp('5%'), // Responsive font size
  },

  input: {
    borderWidth: 1,
    borderRadius: 5,
    // Responsive margin bottom
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
  eyeIcon: {
    position: 'absolute',
    right: wp('4%'), // Responsive right position
    marginTop: hp('2%'), // Responsive top margin
  },
});
