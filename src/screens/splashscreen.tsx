import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  useColorScheme,
  ScrollView,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Font} from '../components/coustomFonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SplashScreenComponent = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  const createcoustomer = () => {
    navigation.navigate('CreateCustomer' as never);
  };

  const createbeatask = () => {
    navigation.navigate('CreateBeatask' as never);
  };

  const login = () => {
    navigation.navigate('Login' as never);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      const timeout = setTimeout(() => {
        SplashScreen.hide();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo11.png')}
          style={styles.logo}
        />
      </View>
      <Text style={[styles.title, {fontFamily: Font}]}>
        Connect with {'\n'}service providers.{'\n'} Get tasks done quickly.
      </Text>
      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={createbeatask}>
        <Text style={styles.buttonText}>I AM A BEATASKER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={createcoustomer}>
        <Text style={styles.buttonText}>I Need A BEATASKER</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={login}>
        <Text style={styles.loginText}>SIGN IN</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: hp('2%'),
  },
  logo: {
    width: wp('25%'),
    height: hp('12.5%'),
    resizeMode: 'contain',
    marginBottom: hp('6.25%'),
  },
  title: {
    fontWeight: 'bold',
    fontSize: wp('8%'),
    color: '#000000',
    textAlign: 'center',
    marginHorizontal: wp('5%'),
    marginBottom: hp('5%'),
    lineHeight: hp('5.3%'),
  },
  createAccountButton: {
    backgroundColor: '#12CCB7',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('15%'),
    borderRadius: wp('7.5%'),
    marginBottom: hp('2.5%'),
  },
  buttonText: {
    color: '#0D0D0D',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  loginButton: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('10%'),
  },
  loginText: {
    color: '#12CCB7',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#010A0C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: hp('2%'),
  },
  logo: {
    width: wp('25%'),
    height: hp('12.5%'),
    resizeMode: 'contain',
    marginBottom: hp('6.25%'),
  },
  title: {
    fontWeight: 'bold',
    fontSize: wp('8%'),
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: wp('5%'),
    marginBottom: hp('5%'),
    lineHeight: hp('5.3%'),
  },
  createAccountButton: {
    backgroundColor: '#12CCB7',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('15%'),
    borderRadius: wp('7.5%'),
    marginBottom: hp('2.5%'),
  },
  buttonText: {
    color: '#0D0D0D',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  loginButton: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('10%'),
  },
  loginText: {
    color: '#12CCB7',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
});

export default SplashScreenComponent;
