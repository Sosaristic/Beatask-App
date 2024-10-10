import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaViewContainer from '../components/SafeAreaViewContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userFirstTime = async () => {
  try {
    const value = await AsyncStorage.getItem('user-first-time');
    if (value === 'true') {
      return true;
    } else {
      await AsyncStorage.setItem('user-first-time', 'true');
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const App = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    // Navigate to the next screen
    navigation.navigate('ServicesScreen1' as never);
  };

  return (
    <SafeAreaViewContainer>
      <ImageBackground
        source={require('../assets/images/pic1.jpg')}
        style={styles.background}>
        <View style={styles.container}>
          <Image
            source={require('../assets/images/mainlogo.png')}
            style={styles.logo}
          />
          <Text style={styles.text}>
            Book trusted professional for home services.
          </Text>
          <View style={styles.pagination}>
            <View style={[styles.dash, styles.activeDash]} />
            <View style={styles.dash} />
            <View style={styles.dash} />
          </View>
          <TouchableOpacity onPress={handleNext}>
            <Icon
              name="arrow-right-circle-outline"
              size={wp('15%')}
              color="#00d3a9"
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaViewContainer>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  logo: {
    position: 'absolute',
    top: hp('5%'),
    right: wp('5%'),
    width: wp('25%'),
    height: hp('7%'),
    resizeMode: 'contain',
  },
  text: {
    color: 'white',
    fontSize: wp('6%'),
    fontWeight: 'bold',
    textAlign: 'justify',
    marginBottom: hp('5%'),
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
    alignSelf: 'flex-start', // Move the pagination to the left
  },
  dash: {
    width: wp('5%'),
    height: hp('1%'),
    borderRadius: wp('2.5%'),
    backgroundColor: 'white',
    marginHorizontal: wp('1%'),
  },
  activeDash: {
    backgroundColor: '#12ccb7',
  },
});

export default App;
