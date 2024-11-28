import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextCount} from '../../Home/chat/masglist';
import {makeApiRequest} from '../../../utils/helpers';
import {useStripe} from '@stripe/stripe-react-native';
import {useUserStore} from '../../../store/useUserStore';
import {StackNavigationProp} from '@react-navigation/stack';
import {PaymentScreenType, RootStackParamList} from '../../../../App';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';
import {customTheme} from '../../../custom_theme/customTheme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Bid1'>;
};

const SubscriptionScreen: React.FC<Props> = ({navigation}) => {
  const colorScheme = useColorScheme();
  const {user, actions} = useUserStore(state => state);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(0);
  const isDarkMode = colorScheme === 'dark';
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const handleSubscription = async (type: 'one_month' | 'two_month') => {
    setIsDisabled(true);
    if (type === 'one_month') {
      setIsLoading(1);
    }
    if (type === 'two_month') {
      setIsLoading(2);
    }
    const url =
      type === 'one_month'
        ? '/paypal-subscription-one-month-premium'
        : '/paypal-subscription-two-months';
    const {data, error} = await makeApiRequest<PaymentScreenType>(url, 'POST', {
      provider_id: user?.id,
    });
    if (data) {
      navigation.navigate('paypal_screen', {url: data.approvalUrl});
    }
    setIsDisabled(false);
    setIsLoading(0);

    // if (error) return;

    // if (data) {
    //   const {error: iniError, paymentOption} = await initPaymentSheet({
    //     merchantDisplayName: 'Beatask',
    //     customerId: data.customer,
    //     customerEphemeralKeySecret: data.ephemeralKey,
    //     paymentIntentClientSecret: data.paymentIntent,
    //     // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
    //     //methods that complete payment after a delay, like SEPA Debit and Sofort.
    //     allowsDelayedPaymentMethods: true,
    //     defaultBillingDetails: {
    //       name: user?.name as string,
    //     },
    //   });

    //   if (iniError) {
    //     Alert.alert('Something went wrong in init');
    //     return;
    //   }

    //   const {error} = await presentPaymentSheet();
    //   if (error) {
    //     // setSheetLoading(false);
    //   } else {
    //     actions.setIsSubscribed(true);
    //     navigation.replace('success', {redirectTo: 'dashboard'});
    //     // setSheetLoading(false);
    //   }
    // }
  };

  return (
    <SafeAreaViewContainer edges={['right', 'bottom', 'left']}>
      <View
        style={[
          styles.container,
          isDarkMode ? styles.darkContainer : styles.lightContainer,
        ]}>
        <ScrollView
          style={isDarkMode ? styles.containerDark : styles.containerLight}>
          <Text
            style={[
              styles.header,
              isDarkMode ? styles.textDark : styles.textLight,
            ]}>
            Get quote credits
          </Text>
          <Text
            style={[
              styles.subHeader,
              isDarkMode ? styles.textDark : styles.textLight,
            ]}>
            Before you can access the bid section, you have to subscribe to a
            package in order to send quotes to clients.
          </Text>

          {[
            {
              title: 'Introductory Unlimited Plan',
              price: '$14.99',
              type: 'two_month',
              duration: 'for two months',
              loading: isLoading === 2 ? true : false,
              description:
                'You are able to send Unlimited quotes for two months at a discounted rate.',
              buttonLabel: 'SUBSCRIBE',
            },
            {
              title: 'Premium Access Plan',
              price: '$29.99',
              type: 'one_month',
              duration: 'per month',
              loading: isLoading === 1 ? true : false,
              description:
                'You can send Unlimited quotes, priority listing, advanced analytics such as being able to see when their quote was opened, reasons for rejection (consumer behavior), early access to leads, priority support.',
              buttonLabel: 'SUBSCRIBE',
            },
          ].map((plan, index) => (
            <View
              key={index}
              style={[
                styles.planCard,
                isDarkMode ? styles.planCardDark : styles.planCardLight,
              ]}>
              <Text
                style={[
                  styles.planTitle,
                  isDarkMode ? styles.textDark : styles.textLight,
                ]}>
                {plan.title}
              </Text>
              <Text
                style={[
                  styles.planPrice,
                  isDarkMode ? styles.textDark : styles.textLight,
                ]}>
                {plan.price}
              </Text>
              <Text
                style={[
                  styles.planDuration,
                  isDarkMode ? styles.textDark : styles.textLight,
                ]}>
                {plan.duration}
              </Text>
              <Text
                style={[
                  styles.planDescription,
                  isDarkMode ? styles.textDark : styles.textLight,
                ]}>
                {plan.description}
              </Text>
              <TouchableOpacity
                disabled={isDisabled}
                style={styles.subscribeButton}
                onPress={() =>
                  handleSubscription(plan.type as 'one_month' | 'two_month')
                }>
                {plan.loading ? (
                  <ActivityIndicator
                    size={'small'}
                    color={customTheme.primaryColor}
                  />
                ) : (
                  <Text style={styles.subscribeButtonText}>
                    {plan.buttonLabel}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaViewContainer>
  );
};

const styles = StyleSheet.create({
  containerLight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: wp('5%'),
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#000000',
    padding: wp('5%'),
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
  },
  subHeader: {
    fontSize: wp('4%'),
    marginBottom: wp('5%'),
  },
  planCard: {
    borderRadius: 15,
    padding: wp('5%'),
    marginBottom: wp('5%'),
  },
  planCardLight: {
    backgroundColor: '#F0F0F0',
  },
  planCardDark: {
    backgroundColor: '#333333',
  },
  planTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
  },
  planPrice: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
  },
  planDuration: {
    fontSize: wp('4%'),
    marginBottom: wp('2%'),
  },
  planDescription: {
    fontSize: wp('4%'),
    marginBottom: wp('5%'),
  },
  subscribeButton: {
    backgroundColor: '#00f2ea',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: 30,
    alignSelf: 'center',
  },
  subscribeButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  textLight: {
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Default light mode background color
    paddingVertical: hp('1%'),
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: wp('3%'),
    color: '#000', // Default light mode text color
  },
});

export default SubscriptionScreen;
