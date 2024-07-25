import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const WithdrawalScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const [amount, setAmount] = useState('');

    return (
        <View style={isDarkMode ? styles.containerDark : styles.containerLight}>
            <Text style={[styles.label, isDarkMode ? styles.textDark : styles.textLight]}>Enter amount</Text>
            <TextInput
                style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
                placeholder="Amount"
                placeholderTextColor={isDarkMode ? '#666' : '#999'}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <Text style={[styles.label, isDarkMode ? styles.textDark : styles.textLight]}>Withdrawal method</Text>
            <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>Method</Text>
            </View>
        </View>
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
    label: {
        fontSize: wp('4%'),
        marginBottom: wp('2%'),
    },
    input: {
        width: '100%',
        padding: wp('2%'),
        borderRadius: 5,
        marginBottom: wp('5%'),
    },
    inputLight: {
        backgroundColor: '#ddd',
        color: '#000',
    },
    inputDark: {
        backgroundColor: '#333',
        color: '#fff',
    },
    textLight: {
        color: '#000',
    },
    textDark: {
        color: '#fff',
    },
    dropdown: {
        width: '100%',
        padding: wp('2%'),
        backgroundColor: '#ddd',
        borderRadius: 5,
        justifyContent: 'center',
        marginBottom: wp('5%'),
    },
    dropdownText: {
        fontSize: wp('4%'),
        color: '#666',
    },
});

export default WithdrawalScreen;
