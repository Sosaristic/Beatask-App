import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  NavigationContainer,
  useNavigation,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {Provider as PaperProvider} from 'react-native-paper';
import {TouchableOpacity, useColorScheme} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your screens here
import AuthScreen from './src/screens/AuthScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import ServicesScreen1 from './src/screens/ServicesScreen1';
import ServicesScreen2 from './src/screens/ServicesScreen2';
import CreateBeatask from './src/screens/createbeatask/createaccountbeatask';
import CreateCustomer from './src/screens/createcustomer/createaccountcustomer';
import Upload from './src/screens/createbeatask/uplaoddoc';
import OTP from './src/screens/createbeatask/OTP';
import OTPCustomer from './src/screens/createcustomer/OTPcustomer';
import Login from './src/screens/Login/Login';
import OTPVerification from './src/screens/Login/OTPVerification';
import Home from './src/screens/Home/Homepage';
import Setting from './src/screens/createbeatask/setting/setting';
import ProfileSetup from './src/screens/Home/setting/profileSetup';
import servicelisting from './src/screens/Home/setting/servicelisting';
import profile from './src/screens/Home/profile';
import Booked from './src/screens/Home/booked/booked';
import Review from './src/screens/Home/setting/review';
import Chat from './src/screens/Home/chat/chat';
import Chat1 from './src/screens/createbeatask/Home/chat/chat';
import Service from './src/screens/Home/setting/Serviceprovider';
import Homeimp from './src/screens/Home/provider/Homeimp';
import Filter from './src/screens/Home/provider/filter';
import Masg from './src/screens/Home/provider/masg';
import payment from './src/screens/Home/provider/payment';
import calenderbook from './src/screens/Home/provider/calenderbooking';
import Request from './src/screens/Home/request';
import seved from './src/screens/Home/provider/sevedimp';
import masglist from './src/screens/Home/chat/masglist';
import masglist1 from './src/screens/createbeatask/Home/chat/masglist1';
import Agree from './src/screens/createbeatask/agreement';
import dashboard from './src/screens/createbeatask/Home/dashboard';
import booked1 from './src/screens/createbeatask/booked/booked1';
import Bid from './src/screens/createbeatask/Home/Bid';
import Bid1 from './src/screens/createbeatask/Home/Bid1';
import review1 from './src/screens/createbeatask/setting/review1';
import withdraw from './src/screens/createbeatask/setting/withdraw';
import withdraw1 from './src/screens/createbeatask/setting/withdraw1';
import spiner from './src/screens/Home/setting/spiner';
import {UploadTypes} from './src/navigation/types';

import useChats from './src/hooks/useChats';
import OtpScreen from './src/screens/OtpScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Filter as FilterType,
  SingleServicePayload,
} from './src/interfaces/apiResponses';
import SingleServiceScreen from './src/screens/Home/setting/SingleServiceScreen';
import messaging from '@react-native-firebase/messaging';
import {useUserStore} from './src/store/useUserStore';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import SuccessScreen from './src/screens/SuccessScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import {PaperDarkTheme, PaperLightTheme} from './src/custom_theme/theme';

import {PendingTabs} from './src/navigation/Tabs';
import AuthChoiceScreen from './src/screens/auth/AuthChoiceScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AccountsScreen from './src/screens/AccountsScreen';
import SubmitQuoteScreen from './src/screens/SubmitQuoteScreen';
import DeleteAccountScreen from './src/screens/DeleteAccountScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import UpdateDocsScreen from './src/screens/createbeatask/UpdateDocScreen';
import HelpCentreScreen from './src/screens/HelpCentreScreen';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import Paypal from './src/screens/createbeatask/Home/Paypal';
import ErrorScreen from './src/screens/ErrorScreen';

type SignUpTypes = {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  google_token?: string;
  image?: string;
};

type QuoteType = {
  user_id: number | string;
  request_service_id: number;
  provider_id: number;
};

export type PaymentScreenType = {
  approvalUrl: string;
  price: number;
  subscriptionName: string;
  success: boolean;
};

// Define RootStackParamList with appropriate types
export type RootStackParamList = {
  AuthScreen: undefined;
  Onboarding: undefined;
  ServicesScreen1: undefined;
  ServicesScreen2: undefined;
  CreateBeatask: SignUpTypes;
  Upload: {details: UploadTypes};
  OTP: {email: string};
  CreateCustomer: SignUpTypes;
  OTPCustomer: {email: string};
  Login: undefined;
  OTPVerification: {email: string; is_service_provider: boolean | number};
  Home: undefined;
  Setting: undefined;
  ProfileSetup: undefined;
  Profile: undefined;
  Servicelisting: undefined;
  Booked: undefined;
  Review: undefined;
  Chat: {
    chatId: string | {} | null;
    providerId: string;
    providerName: string;
    providerAvatar: string;
    customerId: string;
    customerName: string;
    customerAvatar: string;
  };
  Chat1: {
    chatId: string | {} | null;
    providerId: string;
    providerName: string;
  };
  Service: {id: number | string};
  Homeimp: {
    price_min?: string;
    price_max?: string;
    rating_min?: string;
    rating_max?: string;
    date?: string;
    category_name: string;
    services?: string;
  };
  Filter: {category: string};
  Masg: undefined;
  payment: {data: SingleServicePayload};
  calenderbook: {data: SingleServicePayload};
  Request: undefined;
  seved: undefined;
  masglist: undefined;
  masglist1: undefined;
  Agree: undefined;
  dashboard: undefined;
  booked1: undefined;
  Bid: undefined;
  Bid1: undefined;
  servicelisting: undefined;
  review1: undefined;
  withdraw: undefined;
  withdraw1: undefined;
  spiner: undefined;
  otp: {
    type: 'email-verify' | '2fa' | 'forgot-password';
    email: string;
    is_service_provider?: boolean | number;
  };
  singleservice: {data: SingleServicePayload};
  success: {redirectTo: 'Home' | 'dashboard'};
  error: undefined;
  forgotPassword: undefined;
  resetPassword: {email: string};
  requests: undefined;
  pending_actions: undefined;
  auth_choice: {type: 'customer' | 'provider'};
  provider_accounts: undefined;
  send_quote: QuoteType;
  delete_account: undefined;
  update_docs: undefined;
  help_center: undefined;
  paypal_screen: {url: string};
};

const queryClient = new QueryClient();

// Create a Stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const key =
  'pk_test_51Puzp4BBmm4vWQq6oKr3cNUZrEJ60Y3DzUnHDFKus6Kw4gnN7yrok5GoDEKsf5GqAU4ZgIBPGD6QpTci13RuxCvf00SJTEUxDN';

const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
};

async function requestUserPermission() {
  const isNotificationRequested = await AsyncStorage.getItem(
    'notification-requested',
  );

  const status = await notifee.getNotificationSettings();
  if (
    status.authorizationStatus >= AuthorizationStatus.DENIED &&
    !isNotificationRequested
  ) {
    await notifee.requestPermission();
    await AsyncStorage.setItem('notification-requested', 'true');
  }
  // const settings = await notifee.requestPermission();

  // if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
  //   console.log('Permission settings:', settings);
  // } else {
  //   console.log('User declined permissions');
  // }
}

// App component
const App = () => {
  const colorScheme = useColorScheme();
  const [firstRoute, setFirstRoute] = useState('');
  const [appLoaded, setAppLoaded] = useState(false);

  const isDarkMode = colorScheme === 'dark';
  const theme = colorScheme === 'dark' ? PaperDarkTheme : PaperLightTheme;
  const {
    actions: {setDeviceToken},
  } = useUserStore(state => state);
  useChats();

  useLayoutEffect(() => {
    AsyncStorage.getItem('user-first-time')
      .then(value => {
        if (value === 'true') {
          setFirstRoute('AuthScreen');
        } else {
          setFirstRoute('Onboarding');
        }
      })
      .finally(() => {
        setAppLoaded(true);
        setTimeout(() => {
          SplashScreen.hide();
        }, 1000);
      });
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '973264885829-t34kkc2db11kepn24rloo9a9bkjvkrof.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    (async () => {
      requestUserPermission();

      await messaging().registerDeviceForRemoteMessages();

      // Get the token
      const token = await messaging().getToken();

      if (token) setDeviceToken(token);
    })();
  }, []);

  // Custom component for headerRight
  const CustomHeaderRight = () => {
    const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleSettingsPress = () => {
      navigation.navigate('Home');
    };

    return (
      <TouchableOpacity onPress={handleSettingsPress} style={{marginRight: 10}}>
        <Icon
          name="home-outline"
          size={30}
          color={isDarkMode ? '#fff' : '#fff'}
        />
      </TouchableOpacity>
    );
  };

  if (!appLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <StripeProvider publishableKey={key}>
          <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
              initialRouteName={firstRoute as keyof RootStackParamList}
              screenOptions={{
                statusBarColor: '#010A0C',
                headerStyle: {backgroundColor: '#010A0C'},
                headerTintColor: '#fff',
                headerTitleAlign: 'center',
                headerBackTitle: 'Back',
              }}>
              <Stack.Screen
                name="AuthScreen"
                component={AuthScreen}
                options={{headerShown: false, headerBackTitle: 'Back'}}
              />
              <Stack.Screen
                name="Onboarding"
                component={ServicesScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ServicesScreen1"
                component={ServicesScreen1}
                options={{
                  headerShown: true,
                  title: '',
                  headerStyle: {backgroundColor: 'transparent'},
                  headerTransparent: true,
                }}
              />
              <Stack.Screen
                name="ServicesScreen2"
                component={ServicesScreen2}
                options={{
                  headerShown: true,
                  title: '',
                  headerStyle: {backgroundColor: 'transparent'},
                  headerTransparent: true,
                }}
              />
              <Stack.Screen
                name="CreateBeatask"
                component={CreateBeatask}
                options={{title: 'Create Account'}}
              />
              <Stack.Screen
                name="CreateCustomer"
                component={CreateCustomer}
                options={{title: 'Create Account'}}
              />
              <Stack.Screen
                name="Upload"
                component={Upload}
                options={{title: 'Create Account'}}
              />
              <Stack.Screen
                name="OTP"
                component={OTP}
                options={{title: 'Email Verification'}}
              />
              <Stack.Screen
                name="OTPCustomer"
                component={OTPCustomer}
                options={{title: 'Email Verification'}}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{title: 'Login', headerBackTitle: 'Back'}}
              />
              <Stack.Screen
                name="OTPVerification"
                component={OTPVerification}
                options={{title: 'Two-factor Authentication'}}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Setting"
                component={Setting}
                options={{title: 'Setting'}}
              />
              <Stack.Screen
                name="ProfileSetup"
                component={ProfileSetup}
                options={{title: 'Profile Setup', headerBackTitle: 'Back'}}
              />
              <Stack.Screen
                name="servicelisting"
                component={servicelisting}
                options={{title: 'Service Listing'}}
              />
              <Stack.Screen
                name="Profile"
                component={profile}
                options={{title: 'Profile', headerBackTitle: 'Back'}}
              />
              <Stack.Screen
                name="Booked"
                component={Booked}
                options={{title: 'Booked'}}
              />
              <Stack.Screen
                name="Review"
                component={Review}
                options={{title: 'Reviews'}}
              />
              <Stack.Screen
                name="Chat"
                component={Chat}
                options={{headerShown: true, title: 'Maryland Winkles'}}
              />
              <Stack.Screen
                name="Chat1"
                component={Chat1}
                options={{headerShown: true, title: 'Maryland Winkles'}}
              />
              <Stack.Screen
                name="Service"
                component={Service}
                options={{headerShown: true, title: 'Provider Profile'}}
              />
              <Stack.Screen
                name="Homeimp"
                component={Homeimp}
                options={{
                  headerShown: true,
                  title: 'Home Improvement',
                  headerRight: () => <CustomHeaderRight />,
                }}
              />
              <Stack.Screen
                name="Filter"
                component={Filter}
                options={{headerShown: true, title: 'Filter'}}
              />
              <Stack.Screen
                name="Masg"
                component={Masg}
                options={{headerShown: true, title: 'Message service provider'}}
              />
              <Stack.Screen
                name="payment"
                component={payment}
                options={{headerShown: true, title: 'Payment methods'}}
              />
              <Stack.Screen
                name="calenderbook"
                component={calenderbook}
                options={{headerShown: true, title: 'Calendar booking'}}
              />
              <Stack.Screen
                name="Request"
                component={Request}
                options={{headerShown: true, title: 'Request service'}}
              />
              <Stack.Screen
                name="seved"
                component={seved}
                options={{headerShown: true, title: 'Saved Providers'}}
              />
              <Stack.Screen
                name="masglist"
                component={masglist}
                options={{headerShown: true, title: 'Messages'}}
              />
              <Stack.Screen
                name="masglist1"
                component={masglist1}
                options={{headerShown: true}}
              />
              <Stack.Screen
                name="Agree"
                component={Agree}
                options={{
                  headerShown: true,
                  title: 'Independent contractor agreement',
                  headerTitleStyle: {fontSize: 17},
                }}
              />
              <Stack.Screen
                name="dashboard"
                component={dashboard}
                options={{
                  headerShown: false,
                  headerBackTitle: 'Dashboard',
                  headerBackTitleVisible: true,
                }}
              />
              <Stack.Screen
                name="booked1"
                component={booked1}
                options={{headerShown: true, title: 'Bookings'}}
              />
              <Stack.Screen
                name="Bid"
                component={Bid}
                options={{headerShown: false, title: 'Bids'}}
              />
              <Stack.Screen
                name="Bid1"
                component={Bid1}
                options={{headerShown: true, title: 'Subscriptions'}}
              />
              <Stack.Screen
                name="review1"
                component={review1}
                options={{headerShown: true, title: 'Review and Ratings'}}
              />
              <Stack.Screen
                name="withdraw"
                component={withdraw}
                options={{headerShown: true, title: 'Payment'}}
              />
              <Stack.Screen
                name="withdraw1"
                component={withdraw1}
                options={{headerShown: true, title: 'Withdraw'}}
              />
              <Stack.Screen
                name="spiner"
                component={spiner}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="otp"
                component={OtpScreen}
                options={{title: 'Two-factor Authentication'}}
              />
              <Stack.Screen
                name="singleservice"
                component={SingleServiceScreen}
                options={{title: 'Service Details'}}
              />
              <Stack.Screen
                name="success"
                component={SuccessScreen}
                options={{headerShown: false, title: 'Success'}}
              />
              <Stack.Screen
                name="error"
                component={ErrorScreen}
                options={{headerShown: false, title: 'Error'}}
              />
              <Stack.Screen
                name="forgotPassword"
                component={ForgotPasswordScreen}
                options={{title: 'Forgot Password'}}
              />
              <Stack.Screen
                name="resetPassword"
                component={ResetPasswordScreen}
                options={{title: 'Reset Password'}}
              />
              <Stack.Screen
                name="pending_actions"
                component={PendingTabs}
                options={{headerShown: false, title: 'Pending Actions'}}
              />
              <Stack.Screen
                name="auth_choice"
                component={AuthChoiceScreen}
                options={{headerShown: true, title: 'Create Account'}}
              />
              <Stack.Screen
                name="provider_accounts"
                component={AccountsScreen}
                options={{headerShown: true, title: 'Linked Accounts'}}
              />
              <Stack.Screen
                name="send_quote"
                component={SubmitQuoteScreen}
                options={{headerShown: true, title: 'Send Quote'}}
              />
              <Stack.Screen
                name="delete_account"
                component={DeleteAccountScreen}
                options={{headerShown: true, title: 'Deactivate Account'}}
              />
              <Stack.Screen
                name="update_docs"
                component={UpdateDocsScreen}
                options={{headerShown: true, title: 'Update Documents'}}
              />
              <Stack.Screen
                name="help_center"
                component={HelpCentreScreen}
                options={{headerShown: true, title: 'Help & Support'}}
              />
              <Stack.Screen
                name="paypal_screen"
                component={Paypal}
                options={{headerShown: false, title: 'Complete Payment'}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </StripeProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default App;
