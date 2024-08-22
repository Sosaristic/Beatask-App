import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Dimensions,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {makeApiRequest} from '../../../utils/helpers';
import {CustomErrorModal, CustomModal} from '../../../components';
import useFetch from '../../../hooks/useFetch';
import {BookingPriceResponse} from '../../../interfaces/apiResponses';
import {RootStackParamList} from '../../../../App';

type Props = {
  route: RouteProp<RootStackParamList, 'payment'>;
};

const PaymentScreen: React.FC<Props> = ({route}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get('window').width;
  const {data: serviceData} = route.params;
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const navigation = useNavigation();
  const {loading, error, data} = useFetch<BookingPriceResponse>(
    '/get-service-price',
    'POST',
    {id: serviceData.service_id},
  );
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Booking Successful',
    loadingMessage: 'Processing',
    requestLoading: false,
    showModal: false,
  });

  const handleSend = async () => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const {data, error} = await makeApiRequest('/book-services', 'POST', {
      provider_id: 2,
      service_id: 4,
      category_id: 1,
      dates_and_times: [new Date()],
      description: 'test',
    });

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Unable to Book Provider',
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
        navigation.navigate('Home' as never);
      }, 2000);
    }

    // You can also perform other actions upon sending here
  };

  const isDarkMode = colorScheme === 'dark';

  const styles = createStyles(isDarkMode, windowWidth);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#12CCB7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>An Error has occured </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        Select the payment method you want to use
      </Text>

      <TouchableOpacity
        style={styles.paymentOption}
        onPress={() => setSelectedMethod('PayPal')}>
        <Icon name="logo-paypal" size={windowWidth * 0.1} color="#0070BA" />
        <Text style={styles.paymentText}>PayPal</Text>
        <RadioButton
          value="PayPal"
          status={selectedMethod === 'PayPal' ? 'checked' : 'unchecked'}
          onPress={() => setSelectedMethod('PayPal')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.paymentOption}
        onPress={() => setSelectedMethod('GooglePay')}>
        <Image
          source={require('../../../assets/images/google.png')}
          style={styles.modalIcon}
        />
        <Text style={styles.paymentText}>Google Pay</Text>
        <RadioButton
          value="GooglePay"
          status={selectedMethod === 'GooglePay' ? 'checked' : 'unchecked'}
          onPress={() => setSelectedMethod('GooglePay')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.paymentOption}
        onPress={() => setSelectedMethod('ApplePay')}>
        <Icon name="logo-apple" size={windowWidth * 0.1} color="#000" />
        <Text style={styles.paymentText}>Apple Pay</Text>
        <RadioButton
          value="ApplePay"
          status={selectedMethod === 'ApplePay' ? 'checked' : 'unchecked'}
          onPress={() => setSelectedMethod('ApplePay')}
        />
      </TouchableOpacity>

      <View style={styles.totalCostContainer}>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Booking fee</Text>
          <Text style={styles.costValue}>${data?.beatask_service_fee}</Text>
        </View>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Service</Text>
          <Text style={styles.costValue}>${data?.service_price}</Text>
        </View>

        <View style={styles.costRow}>
          <Text style={styles.costLabelTotal}>Total</Text>
          <Text style={styles.costValueTotal}>${data?.total_price}</Text>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../../assets/images/verified.png')}
              style={styles.modalIcon}
            />
            <Text style={styles.modalText}>Booking successful</Text>
            <Text style={styles.modalSubText}>
              Payment successful, and booking confirmed. Redirecting to
              homepage.
            </Text>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.payButton} onPress={handleSend}>
        <Text style={styles.payButtonText}>PAY</Text>
      </TouchableOpacity>
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

const createStyles = (isDarkMode: boolean, windowWidth: number) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: windowWidth * 0.04,
      backgroundColor: isDarkMode ? '##010A0C' : '#FFF',
    },
    header: {
      fontSize: windowWidth * 0.04,
      color: isDarkMode ? '#FFF' : '#000',
      marginBottom: windowWidth * 0.04,
    },
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#fff' : '#FFF',
      padding: windowWidth * 0.02,
      borderRadius: windowWidth * 0.02,
      marginBottom: windowWidth * 0.034,
      borderWidth: 1,
    },
    paymentText: {
      flex: 1,
      color: isDarkMode ? '#010A0C' : '#010A0C',
      marginLeft: windowWidth * 0.024,
      fontSize: windowWidth * 0.044,
      fontWeight: '400',
    },
    subHeader: {
      fontSize: windowWidth * 0.04,
      color: isDarkMode ? '#FFF' : '#000',
      marginBottom: windowWidth * 0.025,
    },
    input: {
      backgroundColor: isDarkMode ? '#333' : '#FFF',
      borderRadius: windowWidth * 0.03,
      padding: windowWidth * 0.025,
      color: isDarkMode ? '#FFF' : '#010A0C',
      marginBottom: windowWidth * 0.05,
      borderWidth: 1,
      fontSize: windowWidth * 0.045,
    },
    totalCostContainer: {
      backgroundColor: isDarkMode ? '#010A0C' : '#FFF',
      borderRadius: windowWidth * 0.03,
      padding: windowWidth * 0.05,
      marginBottom: windowWidth * 0.05,
      borderWidth: 1,
    },
    costRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: windowWidth * 0.03,
    },
    costLabel: {
      color: isDarkMode ? '#FFF' : '#000',
      fontSize: windowWidth * 0.044,
    },
    costValue: {
      color: isDarkMode ? '#FFF' : '#000',
      fontSize: windowWidth * 0.044,
    },
    costLabelTotal: {
      color: isDarkMode ? '#FFF' : '#000',
      fontSize: windowWidth * 0.044,
      fontWeight: 'bold',
    },
    costValueTotal: {
      color: isDarkMode ? '#FFF' : '#000',
      fontSize: windowWidth * 0.04,
      fontWeight: 'bold',
    },
    payButton: {
      backgroundColor: '#12CCB7',
      padding: windowWidth * 0.04,
      marginHorizontal: windowWidth * 0.25,
      marginTop: windowWidth * 0.08,
      borderRadius: windowWidth * 0.09,
      alignItems: 'center',
    },
    payButtonText: {
      color: '#000',
      fontSize: windowWidth * 0.04,
      fontWeight: 'bold',
    },
    modalIcon: {
      width: 45,
      height: 45,
      marginBottom: '2%',
    },
    //   modalIcon1: {
    //     width: 40,
    //     height: 40,
    //     marginBottom: ('2%'),
    //   },
    errorText: {
      color: isDarkMode ? '#FFF' : '#000',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
      backgroundColor: '#fff',
      width: '80%', // Adjust width as a percentage of the screen width
      paddingHorizontal: '5%', // Adjust horizontal padding as a percentage of the screen width
      paddingVertical: '3%', // Adjust vertical padding as a percentage of the screen height
      alignItems: 'center',
      borderRadius: windowWidth * 0.02,
    },
    modalText: {
      fontSize: windowWidth * 0.05, // Adjust font size based on window width
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '2%', // Adjust margin as a percentage of the screen height
      color: '#000',
    },
    modalSubText: {
      fontSize: windowWidth * 0.04, // Adjust font size based on window width
      textAlign: 'center',
      marginBottom: '1%', // Adjust margin as a percentage of the screen height
      color: '#000',
    },
  });

export default PaymentScreen;
