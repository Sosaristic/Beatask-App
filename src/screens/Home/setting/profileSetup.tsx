import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
} from 'react-native';
import {CountryPicker} from 'react-native-country-codes-picker';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface Country {
  dial_code: string;
}

const CreateAccountScreen = () => {
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setcountry] = useState('');
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const pickImage = () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSelectCountry = (country: Country) => {
    setCountryCode(`${country.dial_code}`);
    setPickerVisible(false);
  };

  const handleCountryCodePress = () => {
    setPickerVisible(true);
  };

  const handleNextPress = () => {
    navigation.navigate('Setting' as never);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#FFFFFF'},
      ]}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{uri: imageUri}} style={styles.image} />
          ) : (
            <Image
              source={require('../../../assets/images/category/user.png')}
              style={styles.image}
            />
          )}
          <Icon
            name="pencil"
            size={24}
            color={colorScheme === 'dark' ? '#12CCB7' : '#12CCB7'}
            style={styles.icon}
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>Legal name</Text>
      <TextInput
        style={styles.input}
        placeholder="Legal name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.input}
        placeholder="Country"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Phone number</Text>
      <View style={styles.phoneContainer}>
        <TouchableOpacity
          style={styles.countryCodeButton}
          onPress={handleCountryCodePress}>
          <Text style={styles.countryCodeButtonText}>{countryCode}</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, styles.phoneInput]}
          placeholder="555 555-1234"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
        />
      </View>

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#999"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Business address</Text>
      <TextInput
        style={styles.input}
        placeholder="Business address"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nexttext}>Next</Text>
      </TouchableOpacity>

      <CountryPicker
        show={isPickerVisible}
        pickerButtonOnPress={handleSelectCountry}
        lang="en"
        style={{
          modal: {
            height: 300,
            backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#FFFFFF',
          },
          countryButtonStyles: {
            backgroundColor: colorScheme === 'dark' ? '#AEADA4' : '#F2F2F2',
            borderColor: colorScheme === 'dark' ? '#51514C' : '#ccc',
          },
          textInput: {
            color: colorScheme === 'dark' ? '#010A0C' : '#000',
          },
        }}
      />
    </ScrollView>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: wp('5%'),
    backgroundColor: '#F8F7F4',
  },
  label: {
    color: '#000',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    lineHeight: hp('2.6%'),
    marginBottom: hp('2%'),
  },
  input: {
    height: hp('7.5%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: hp('2.5%'),
    paddingHorizontal: wp('2.5%'),
    padding: hp('2%'),
    color: '#000',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  countryCodeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingTop: hp('2.5%'),
    paddingBottom: hp('2.5%'),
    paddingHorizontal: wp('3.75%'),
    borderRadius: 8,
    marginRight: wp('5%'),
    marginBottom: hp('1%'),
  },
  countryCodeButtonText: {
    color: '#000',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,
    marginTop: hp('1%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('2.5%'),
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  passwordInput: {
    flex: 1,
    height: hp('7.5%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: wp('2.5%'),
    padding: hp('2%'),
    color: '#000',
  },
  toggleButton: {
    position: 'absolute',
    right: wp('2.5%'),
    padding: wp('2.5%'),
  },
  nextButton: {
    backgroundColor: '#AEADA4',
    paddingTop: hp('2.5%'),
    marginTop: hp('5%'),
    paddingBottom: hp('2.5%'),
    marginHorizontal: wp('26.25%'),
    borderRadius: wp('25%'),
  },
  nexttext: {
    color: '#010A0C',
    alignSelf: 'center',
    fontSize: wp('5%'),
    fontWeight: '700',
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  icon: {
    position: 'absolute',
    bottom: 4,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 1,
    borderWidth: 1,
    borderColor: '#666',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: wp('5%'),
    backgroundColor: '#010A0C',
  },
  label: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    lineHeight: hp('2.6%'),
    marginBottom: hp('2%'),
  },
  input: {
    height: hp('7.5%'),
    borderColor: '#51514C',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: hp('2.5%'),
    paddingHorizontal: wp('2.5%'),
    padding: hp('2%'),
    color: '#fff',
    backgroundColor: '#51514C',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  countryCodeButton: {
    backgroundColor: '#51514C',
    paddingTop: hp('2.5%'),
    paddingBottom: hp('2.5%'),
    paddingHorizontal: wp('3.75%'),
    borderRadius: 8,
    marginRight: wp('5%'),
    marginBottom: hp('1%'),
  },
  countryCodeButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,
    marginTop: hp('1%'),
    borderColor: '#51514C',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('2.5%'),
    color: '#fff',
    backgroundColor: '#51514C',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  passwordInput: {
    flex: 1,
    height: hp('7.5%'),
    borderColor: '#51514C',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: wp('2.5%'),
    padding: hp('2%'),
    color: '#fff',
    backgroundColor: '#51514C',
  },
  toggleButton: {
    position: 'absolute',
    right: wp('2.5%'),
    padding: wp('2.5%'),
  },
  nextButton: {
    backgroundColor: '#AEADA4',
    paddingTop: hp('2.5%'),
    marginTop: hp('5%'),
    paddingBottom: hp('2.5%'),
    marginHorizontal: wp('26.25%'),
    borderRadius: wp('25%'),
  },
  nexttext: {
    color: '#010A0C',
    alignSelf: 'center',
    fontSize: wp('5%'),
    fontWeight: '700',
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  icon: {
    position: 'absolute',
    bottom: 4,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 1,
    borderWidth: 1,
    borderColor: '#666',
  },
});

export default CreateAccountScreen;
