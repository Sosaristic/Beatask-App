import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';

// Define the interface for the country object
interface Country {
    dial_code: string;
    // Add other properties if needed
}

const CreateAccountScreen = () => {
    const colorScheme = useColorScheme(); // Get the current color scheme (dark or light)
    const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

    const [isPickerVisible, setPickerVisible] = useState(false);
    const [countryCode, setCountryCode] = useState('+1');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [termsChecked, setTermsChecked] = useState(false); // State for terms checkbox
    const [twoFAChecked, setTwoFAChecked] = useState(false); // State for 2FA checkbox
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const navigation = useNavigation();

    const handleSelectCountry = (country: Country) => {
        setCountryCode(`${country.dial_code}`);
        setPickerVisible(false);
    };

    const handleCountryCodePress = () => {
        setPickerVisible(true);
    };

    const validateFields = () => {
        let valid = true;
        let errors = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: ''
        };

        if (firstName.trim() === '') {
            errors.firstName = 'First name is required';
            valid = false;
        }
        if (lastName.trim() === '') {
            errors.lastName = 'Last name is required';
            valid = false;
        }
        if (email.trim() === '') {
            errors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
            valid = false;
        }
        if (phoneNumber.trim() === '') {
            errors.phoneNumber = 'Phone number is required';
            valid = false;
        }
        if (password.trim() === '') {
            errors.password = 'Password is required';
            valid = false;
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const sendDataToAPI = async () => {
        try {
            const response = await axios.post('https://beatask.cloud/register', {
                first_legal_name: firstName,
                last_legal_name: lastName,
                email: email,
                phone_number: phoneNumber,
                home_address: address,
                password: password,
            });
            console.log('API Response:', response.data);
            navigation.navigate('OTPCustomer'as never);
        } catch (error) {
            console.error('Error sending data:', error);
            
        }
    };

    

    const handleNextPress = () => {
    if (validateFields()) {
        // sendDataToAPI();
        navigation.navigate('OTPCustomer' as never);
    }
};


    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const containerStyle = [
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#FFFFFF' }
    ];

    return (
        <ScrollView contentContainerStyle={containerStyle}>
            <Text style={styles.label}>First legal name</Text>
            <TextInput
                style={styles.input}
                placeholder="First legal name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
            />
            {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

            <Text style={styles.label}>Last legal name</Text>
            <TextInput
                style={styles.input}
                placeholder="Last legal name"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
            />
            {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

            <Text style={styles.label}>Email address</Text>
            <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <Text style={styles.label}>Phone number</Text>
            <View style={styles.phoneContainer}>
                <TouchableOpacity style={styles.countryCodeButton} onPress={handleCountryCodePress}>
                    <Text style={styles.countryCodeButtonText}>{countryCode}</Text>
                </TouchableOpacity>

                <TextInput
                    style={[styles.input, styles.phoneInput]}
                    placeholder="555 555-1234"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text)}
                />
            </View>
            {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity style={styles.toggleButton} onPress={togglePasswordVisibility}>
                    <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#12CCB7" />
                </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <Text style={styles.label}>Home address</Text>
            <TextInput
                style={styles.input}
                placeholder="Home address"
                placeholderTextColor="#999"
                value={address}
                onChangeText={(text) => setAddress(text)}
            />

            {/* Terms of Use Checkbox */}
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={termsChecked}
                    onValueChange={(newValue) => setTermsChecked(newValue)}
                    tintColors={{ true: '#12CCB7', false: '#12CCB7' }}
                />
                <Text style={styles.checkboxLabel}>
                    I agree to Beatask
                    <Text style={{ color: '#12CCB7' }}> terms of use</Text>
                    {' '}and{'\n'}
                    <Text style={{ color: '#12CCB7' }}> privacy policy.</Text>
                </Text>
            </View>

            {/* Two-Factor Authentication Checkbox */}
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={twoFAChecked}
                    onValueChange={(newValue) => setTwoFAChecked(newValue)}
                    tintColors={{ true: '#12CCB7', false: '#12CCB7' }}
                />
                <Text style={styles.checkboxLabel}>
                    Two-Factor Authentication
                    <Text style={{ color: '#12CCB7' }}> (2FA)</Text>
                </Text>
            </View>

            {/* Next Button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
                <Text style={styles.nexttext}>Next</Text>
            </TouchableOpacity>

            {/* Country Picker Modal */}
            <CountryPicker
                show={isPickerVisible}
                pickerButtonOnPress={handleSelectCountry}
                lang="en"
                style={{
                    modal: {
                        height: 500,
                        backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#FFFFFF',
                    },
                    countryButtonStyles: {
                        backgroundColor: colorScheme === 'dark' ? '#AEADA4' : '#F2F2F2',
                        borderColor: colorScheme === 'dark' ? '#51514C' : '#ccc',
                    },
                    textInput: {
                        color: colorScheme === 'dark' ? '#010A0C' : '#000',
                    }
                }}
            />
        </ScrollView>
    );
};

const textDark = {
    color: '#fff',
};

const textLight = {
    color: '#000',
};

const lightStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: wp('5%'),
        backgroundColor: '#F8F7F4',
    },
    label: {
        ...textLight,
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
        textAlign: "center"
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%'), // Responsive margin bottom
    },
    checkboxLabel: {
        fontSize: wp('4%'),
        marginLeft: wp('2%'),
        color: 'dark' ? '#010A0C' : '#000',
    },
    errorText: {
        color: 'red',
        fontSize: wp('3.5%'),
        marginBottom: hp('2%'),
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
        color: "#010A0C",
        alignSelf: 'center',
        fontSize: wp('5%'),
        fontWeight: '700',
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
        ...textDark,
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
        textAlign: "center"
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%'), // Responsive margin bottom
    },
    checkboxLabel: {
        fontSize: wp('4%'), // Responsive font size
        marginLeft: wp('2%'),
    },
    errorText: {
        color: 'red',
        fontSize: wp('3.5%'),
        marginBottom: hp('2%'),
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
        color: "#010A0C",
        alignSelf: 'center',
        fontSize: wp('5%'),
        fontWeight: '700',
    },
});

export default CreateAccountScreen;
