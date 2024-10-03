import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {
  CustomButton,
  CustomErrorModal,
  CustomInput,
  CustomModal,
} from '../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useUserStore} from '../store/useUserStore';
import {makeApiRequest} from '../utils/helpers';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import LottieView from 'lottie-react-native';
import {Text} from 'react-native-paper';
type ScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'delete_account'>;
};

const DeleteAccountScreen = ({navigation}: ScreenProps) => {
  const [password, setPassword] = useState('');
  const {user} = useUserStore();
  const insets = useSafeAreaInsets();
  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Account deactivated successfully',
    loadingMessage: 'Processing',
    requestLoading: false,
    showModal: false,
  });
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });
  const handleDelete = async () => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      successMessage: 'Account deactivated successfully',
      showModal: true,
    });

    const {data, error} = await makeApiRequest(`/delete-user`, 'POST', {
      user_id: user?.id,
      password,
    });

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
        successMessage: 'Account deactivated successfully',
        showModal: true,
      });
      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          successMessage: 'Account deactivated successfully',
          showModal: false,
        });
        navigation.reset({
          index: 0,
          routes: [{name: 'SplashScreen'}],
        });
      }, 3000);
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: insets.top,
      }}>
      <View style={{alignItems: 'center'}}>
        <LottieView
          source={require('../assets/images/lottie/warning.json')}
          autoPlay
          loop
          style={{height: 250, width: 250}}
        />
      </View>
      <Text variant="titleMedium">By deactivating your account:</Text>
      <View>
        <Text>- You will no longer be able to login to your account.</Text>
        <Text>- Your account will be deactivated.</Text>
      </View>
      <Text style={{paddingVertical: 20}}>
        Are you sure you want to deactivate your account?
      </Text>
      <CustomInput
        label="Password"
        value={password}
        type="password"
        onChangeText={setPassword}
      />
      <CustomButton
        buttonText="Deactivate"
        style={{marginTop: 20, backgroundColor: !password ? 'grey' : 'red'}}
        disabled={!password}
        onPress={handleDelete}
      />
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

export default DeleteAccountScreen;

const styles = StyleSheet.create({});
