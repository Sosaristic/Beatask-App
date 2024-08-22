import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const App = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    // Navigate to the next screen
    navigation.navigate('ServicesScreen2' as never);
  };

  return (
    <ImageBackground
      source={require('../assets/images/pic2.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/mainlogo.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>Booking made easy in three steps.</Text>
        <View style={styles.pagination}>
          <View style={[styles.dash]} />
          <View style={[styles.dash, styles.activeDash]} />
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
