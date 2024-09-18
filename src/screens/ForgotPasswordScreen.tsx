import {StyleSheet, TouchableOpacity, View, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {Formik} from 'formik';
import {Text} from 'react-native-paper';
import {TextInput} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {forgotPasswordSchema} from '../components/forms/authSchema';
import {CustomErrorModal, CustomModal} from '../components';
import {makeApiRequest} from '../utils/helpers';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'forgotPassword'>;
};

const ForgotPasswordScreen: React.FC<Props> = ({navigation}) => {
  const colorScheme = useColorScheme();
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Otp sent successfully',
    loadingMessage: 'Sending otp..',
    requestLoading: false,
    showModal: false,
  });
  const isDarkMode = colorScheme === 'dark';

  const handleFormSubmit = async (values: {email: string}) => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });

    const {data, error} = await makeApiRequest(
      '/reset-password',
      'POST',
      values,
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
        navigation.navigate('otp', {
          email: values.email,
          type: 'forgot-password',
        });
      }, 2000);
    }
  };

  return (
    <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 20}}>
      <Formik
        initialValues={{email: ''}}
        onSubmit={values => handleFormSubmit(values)}
        validationSchema={forgotPasswordSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <Text
              style={[
                styles.label,
                isDarkMode ? styles.textDark : styles.textLight,
              ]}>
              Email Address
            </Text>
            <TextInput
              style={[
                styles.input,
                isDarkMode ? styles.inputDark : styles.inputLight,
                {height: hp('7%')}, // Responsive height
              ]}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="Email address"
              placeholderTextColor="#888"
              value={values.email}
            />
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

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

export default ForgotPasswordScreen;

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
    marginBottom: hp('3%'), // Responsive margin bottom
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
});
