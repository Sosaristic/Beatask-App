import React, {useEffect, useRef, useState} from 'react';
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
  Alert,
} from 'react-native';
import {RadioButton, useTheme, Text as PaperText} from 'react-native-paper';
import {RouteProp} from '@react-navigation/native';
import {makeApiRequest} from '../../../utils/helpers';
import {CustomErrorModal, CustomModal, Loader} from '../../../components';
import useFetch from '../../../hooks/useFetch';
import {BookingPriceResponse} from '../../../interfaces/apiResponses';
import {RootStackParamList} from '../../../../App';

import {useStripe} from '@stripe/stripe-react-native';
import {customTheme} from '../../../custom_theme/customTheme';
import {StackNavigationProp} from '@react-navigation/stack';
import {useUserStore} from '../../../store/useUserStore';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';

type Props = {
  route: RouteProp<RootStackParamList, 'payment'>;
  navigation: StackNavigationProp<RootStackParamList, 'payment'>;
};

type StripRes = {
  customer: string;
  paymentIntent: string;
  error: boolean;
  ephemeralKey: string;
  publishableKey: string;
};

const PaymentScreen: React.FC<Props> = ({route, navigation}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>('stripe');

  const colorScheme = useColorScheme();
  const windowWidth = Dimensions.get('window').width;
  const {data: serviceData} = route.params;
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [sheetLoading, setSheetLoading] = useState(false);
  const {user} = useUserStore(state => state);

  const {colors} = useTheme();

  const {initPaymentSheet, presentPaymentSheet} = useStripe();
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

  const getDetails = async (): Promise<StripRes | undefined> => {
    const {data: apiRes, error: errRes} = await makeApiRequest<StripRes>(
      '/stripe',
      'POST',
      {
        service_id: serviceData.service_id,
        provider_id: serviceData.provider_id,
        total_price: data?.total_price,
        user_id: user?.id,
      },
    );
    if (apiRes) {
      return {
        customer: apiRes.customer,
        paymentIntent: apiRes.paymentIntent,
        error: apiRes.error,
        ephemeralKey: apiRes.ephemeralKey,
        publishableKey: apiRes.publishableKey,
      };
    }
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

  const openPaymentSheet = async () => {
    const res = await getDetails();

    if (res === undefined) return;

    const {error: iniError, paymentOption} = await initPaymentSheet({
      merchantDisplayName: 'Beatask',
      customerId: res.customer,
      customerEphemeralKeySecret: res.ephemeralKey,
      paymentIntentClientSecret: res.paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });

    if (iniError) {
      Alert.alert('Something went wrong in init');
      return;
    }

    setSheetLoading(true);

    const {error} = await presentPaymentSheet();
    if (error) {
      setSheetLoading(false);
    } else {
      navigation.replace('success', {redirectTo: 'Home'});
      setSheetLoading(false);
    }
  };

  return (
    <SafeAreaViewContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          Select the payment method you want to use
        </Text>

        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => setSelectedMethod('GooglePay')}>
          <Image
            source={require('../../../assets/images/stripe-s.png')}
            style={styles.modalIcon}
          />
          <PaperText variant="titleLarge" style={{marginLeft: 20}}>
            Stripe
          </PaperText>
          <View style={{marginLeft: 'auto'}}>
            <RadioButton
              value="stripe"
              status={'checked'}
              // onPress={() => setSelectedMethod('stripe')}
            />
          </View>
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

        <TouchableOpacity
          style={[
            styles.payButton,
            {
              backgroundColor: !selectedMethod
                ? 'gray'
                : customTheme.primaryColor,
            },
          ]}
          disabled={!selectedMethod}
          onPress={openPaymentSheet}>
          <Text style={styles.payButtonText}>PAY</Text>
        </TouchableOpacity>
        <CustomModal {...showSuccessModal} />
        <CustomErrorModal
          {...showErrorModal}
          closeModal={() =>
            setShowErrorModal({...showErrorModal, isModalOpen: false})
          }
        />
        {sheetLoading && <Loader />}
      </ScrollView>
    </SafeAreaViewContainer>
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
      backgroundColor: isDarkMode ? '#333' : '#FFF',
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
