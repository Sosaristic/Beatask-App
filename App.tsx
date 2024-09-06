import React, {useEffect} from 'react';
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
import {TouchableOpacity, useColorScheme, Text} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your screens here
import SplashScreen from './src/screens/splashscreen';
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

// Define RootStackParamList with appropriate types
export type RootStackParamList = {
  SplashScreen: undefined;
  ServicesScreen: undefined;
  ServicesScreen1: undefined;
  ServicesScreen2: undefined;
  CreateBeatask: undefined;
  Upload: {details: UploadTypes};
  OTP: {email: string};
  CreateCustomer: undefined;
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
    type: 'email-verify' | '2fa';
    email: string;
    is_service_provider?: boolean | number;
  };
  singleservice: {data: SingleServicePayload};
};

// Create a Stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

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

// App component
const App = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const {
    actions: {setDeviceToken},
  } = useUserStore(state => state);
  useChats();

  useEffect(() => {
    (async () => {
      await messaging().registerDeviceForRemoteMessages();

      // Get the token
      const token = await messaging().getToken();
      if (token) setDeviceToken(token);
    })();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '1091447841957-ne5geghkkubum5lelevfurntp10k2v5d.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
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

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName="ServicesScreen"
        screenOptions={{
          statusBarColor: '#010A0C',
          headerStyle: {backgroundColor: '#010A0C'},
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ServicesScreen"
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
          options={{title: 'Login'}}
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
          options={{title: 'Profile Setup'}}
        />
        <Stack.Screen
          name="servicelisting"
          component={servicelisting}
          options={{title: 'Service Listing'}}
        />
        <Stack.Screen
          name="Profile"
          component={profile}
          options={{title: 'Profile'}}
        />
        <Stack.Screen
          name="Booked"
          component={Booked}
          options={{title: 'Booked'}}
        />
        <Stack.Screen
          name="Review"
          component={Review}
          options={{title: 'Review'}}
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
          options={{headerShown: true, title: 'Saved Provider'}}
        />
        <Stack.Screen
          name="masglist"
          component={masglist}
          options={{headerShown: true}}
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
          }}
        />
        <Stack.Screen
          name="dashboard"
          component={dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="booked1"
          component={booked1}
          options={{headerShown: true, title: 'Booking'}}
        />
        <Stack.Screen
          name="Bid"
          component={Bid}
          options={{headerShown: false, title: ''}}
        />
        <Stack.Screen
          name="Bid1"
          component={Bid1}
          options={{headerShown: false, title: ''}}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
