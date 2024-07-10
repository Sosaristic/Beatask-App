import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, useColorScheme, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const App = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme(); // Get the current color scheme (dark or light)
    
    const [code, setCode] = useState(['', '', '', '']);
    const [resendTimer, setResendTimer] = useState(60); // 1 minute in seconds
    const [showResendButton, setShowResendButton] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for showing the modal
    const [verificationSuccess, setVerificationSuccess] = useState(false); // State for verification success

    const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timerId = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timerId);
        } else {
            setShowResendButton(true);
        }
    }, [resendTimer]);

    // Function to check if all digits are entered
    const isCodeEntered = () => {
        for (let digit of code) {
            if (digit === '') {
                return false;
            }
        }
        return true;
    };

    const handleNextPress = () => {
        setShowModal(true);
        
        setTimeout(() => {
            setVerificationSuccess(true); 
            setTimeout(() => {
                setShowModal(false); 
                navigation.navigate('Home'as never);
            }, 3000); // Close modal after 3 seconds
        }, 2000); // Simulate verification for 2 seconds
    };

    const handleInputChange = (text: string, index: number) => {
        let newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Move focus to the previous input if the current input is cleared and not the first input
        if (text.length === 0 && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }

        // Move focus to the next input if the current input is filled and not the last input
        if (text.length === 1 && index < code.length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if the input text matches the trigger string
        if (text.toLowerCase() === '=cal') {
            console.log('Triggering action for =cal');
            // Perform your action here, e.g., navigate to another screen
        }
    };

    const handleResendCode = () => {
        // Handle resending the code
        console.log('Resend code');
        setResendTimer(60); // Reset the timer
        setShowResendButton(false); // Hide the resend button and show the countdown again
    };

    return (
        <ScrollView style={[styles.container, colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
            <Text style={[styles.title, colorScheme === 'dark' ? styles.darkTitle : styles.lightTitle]}>Enter verification code</Text>
            <Text style={[styles.subtitle, colorScheme === 'dark' ? styles.darkSubtitle : styles.lightSubtitle]}>
                Check your email, a 4 digits verification code was sent.
            </Text>
            <View style={styles.inputContainer}>
                {code.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={[
                            styles.input,
                            colorScheme === 'dark' ? styles.darkInput : styles.lightInput,
                        ]}
                        maxLength={1}
                        keyboardType="numeric"
                        value={digit}
                        onChangeText={(text) => handleInputChange(text, index)}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                    />
                ))}
            </View>
            <View style={styles.resendContainer}>
                {!showResendButton ? (
                    <Text>
                        <Text style={[styles.resendLabelText, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                            Resend code  
                        </Text>
                        <Text style={styles.resendLabelspace}>   </Text>
                        <Text style={[styles.countdownText, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                            {Math.floor(resendTimer / 60)}:{resendTimer % 60 < 10 ? '0' : ''}
                            {resendTimer % 60}
                        </Text>
                    </Text>
                ) : (
                    <TouchableOpacity onPress={handleResendCode}>
                        <Text style={[styles.resendText, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>RESEND CODE</Text>
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity
                onPress={handleNextPress}
                style={[styles.submitButton, { opacity: isCodeEntered() ? 1 : 0.5 }]}
                disabled={!isCodeEntered()}
            >
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
    
            {/* Modal for Verifying Code */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {verificationSuccess ? (
                            <>
                                <Text style={styles.tickMark}>✓</Text>
                                <Text style={styles.modalTextSuccess}>Verified!</Text>
                                <Text style={styles.modalText}>Your account is now fully active.</Text>
                            </>
                        ) : (
                            <>
                                <ActivityIndicator size="large" color="#12CCB7" />
                                <Text style={styles.modalText}>Verifying Code...</Text>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp('5%'),
        paddingTop: hp('5%'),
    },
    darkContainer: {
        backgroundColor: '#010A0C',
    },
    lightContainer: {
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: wp('8%'),
        fontWeight: '700',
        marginBottom: hp('2%'),
        marginLeft: wp('5%'),
    },
    darkTitle: {
        color: '#FFF',
    },
    lightTitle: {
        color: '#010A0C',
    },
    subtitle: {
        fontSize: wp('4%'),
        marginLeft: wp('5%'),
        marginBottom: hp('4%'),
    },
    darkSubtitle: {
        color: '#FFF',
    },
    lightSubtitle: {
        color: '#010A0C',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('4%'),
    },
    input: {
        fontSize: wp('8%'),
        textAlign: 'center',
        borderRadius: 8,
        width: wp('15%'),
        height: hp('10%'),
        marginHorizontal: wp('2%'),
    },
    darkInput: {
        backgroundColor: '#51514C',
        color: '#FFF',
    },
    lightInput: {
        backgroundColor: '#F2F2F2',
        color: '#010A0C',
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('4%'),
        marginTop: hp('4%'),
        marginLeft: wp('5%'),
    },
    resendLabelspace: {
        marginLeft: wp('2%'),
    },
    resendLabelText: {
        fontSize: wp('4%'),
        fontWeight: '700',
        right: wp('2%'),
    },
    countdownText: {
        fontSize: wp('4%'),
        fontWeight: '700',
        justifyContent: 'space-evenly',
        paddingLeft: wp('10%'),
    },
    darkText: {
        color: '#FFF',
    },
    lightText: {
        color: '#010A0C',
    },
    resendText: {
        fontSize: wp('4%'),
        fontWeight: '700',
    },
    submitButton: {
        backgroundColor: '#AEADA4',
        paddingVertical: hp('3%'),
        paddingHorizontal: wp('10%'),
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: hp('5%'),
    },
    submitButtonText: {
        alignSelf: 'center',
        fontSize: wp('5%'),
        fontWeight: '700',
        color: '#010A0C',
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: wp('10%'),
        paddingHorizontal: wp('20%'),
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: wp('4%'),
        fontWeight: '700',
        marginTop: hp('2%'),
        color: '#010A0C', // Default text color
    },
    modalTextSuccess: {
        fontSize: wp('6%'),
        fontWeight: '700',
        marginBottom: hp('2%'),
        color: '#12CCB7', // Success text color
    },
    tickMark: {
        fontSize: wp('12%'),
        color: '#12CCB7', // Tick mark color
    },
});

export default App;
