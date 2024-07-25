import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Switch,
    Modal,
    useColorScheme,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CountryPicker} from 'react-native-country-codes-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [governmentIdInfo,] = useState({
        selectedFile: '',
        fullName: '',
        idNumber: '',
        issueDate: '',
        expirationDate: '',
    });
    const [countryCode, setCountryCode] = useState('+1');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [isLogoutPopupVisible, setLogoutPopupVisible] = useState(false);
    const [isDarkModeEnabled, setDarkModeEnabled] = useState(isDarkMode);
    const [isEnglishEnabled, setEnglishEnabled] = useState(isDarkMode);

    const handleProfileSetup = () => {
        navigation.navigate('ProfileSetup' as never);
    };

    const handleProfile = () => {
        navigation.navigate('Profile' as never);
    };

    const handleService = () => {
        navigation.navigate('servicelisting' as never);
    };
    const handleReview = () => {
        navigation.navigate('review1' as never);
    };

    const handlepayment = () => {
        navigation.navigate('withdraw' as never);
    }; 

    const toggleSection = (section: string) => {
        setExpandedSections((prevState) =>
            prevState.includes(section)
                ? prevState.filter((item) => item !== section)
                : [...prevState, section]
        );
    };

    const sections = ['Language setting'];

    const handleSelectCountry = (country: any) => {
        setCountryCode(country.dial_code);
        setPickerVisible(false);
    };

    const handleLogout = () => {
        setLogoutPopupVisible(true);
    };

    const handleConfirmLogout = () => {
        setLogoutPopupVisible(false);
        navigation.navigate('SplashScreen' as never);
    };
  

    const handleEnglishToggle = () => {
        setEnglishEnabled((previousState) => !previousState);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
            <TouchableOpacity onPress={handleService} style={[styles.section2, isDarkMode && styles.darkSection]}>
                    <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText]}>Service listing</Text>
                    <FontAwesomeIcon
                        name={'chevron-right'}
                        size={wp('6%')}
                        style={[styles.chevron, isDarkMode && styles.darkChevron]}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReview} style={[styles.section2, isDarkMode && styles.darkSection]}>
                    <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText]}>Review and Ratings</Text>
                    <FontAwesomeIcon
                        name={'chevron-right'}
                        size={wp('5%')}
                        style={[styles.chevron, isDarkMode && styles.darkChevron]}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlepayment} style={[styles.section2, isDarkMode && styles.darkSection]}>
                    <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText]}>Payment management</Text>
                    <FontAwesomeIcon
                        name={'chevron-right'}
                        size={wp('6%')}
                        style={[styles.chevron, isDarkMode && styles.darkChevron]}
                    />
                </TouchableOpacity>
                {sections.map((section) => (
                    <View key={section} style={styles.sectionContainer}>
                        <TouchableOpacity
                            onPress={() => toggleSection(section)}
                            style={[styles.section, isDarkMode && styles.darkSection]}
                        >
                            <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText]}>
                                {section}
                            </Text>
                            <FontAwesomeIcon
                                name={expandedSections.includes(section) ? 'chevron-down' : 'chevron-up'}
                                size={wp('6%')}
                                style={[styles.chevron, isDarkMode && styles.darkChevron]}
                            />
                        </TouchableOpacity>
                        
                        {expandedSections.includes(section) && section === 'Language setting' && (
                            <View style={[styles.detailsContainer,isDarkMode && styles.darkdetailsContainer]}>
                                <View>
                                    <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText]}>
                                        English
                                    </Text>
                                    <Switch
                                        style={styles.switch}
                                        trackColor={{ false: '#767577', true: '#12CCB7' }}
                                        thumbColor={isDarkModeEnabled ? '#fff' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={handleEnglishToggle}
                                        value={isEnglishEnabled}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                ))}
             
                <TouchableOpacity onPress={handleLogout} style={[styles.section2, isDarkMode && styles.darkSection]}>
                    <Text style={[styles.sectionText1]}>Log out</Text>
                </TouchableOpacity>

                <Modal transparent={true} visible={isLogoutPopupVisible} animationType="fade">
                    <View style={styles.popupContainer}>
                        <View style={styles.popup}>
                            <Icon name={'information-outline'} size={wp('12%')} style={[styles.error]} />
                            <Text style={styles.popupTitle}>Log out</Text>
                            <Text style={styles.popupMessage}>Sure you want to exit?</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => setLogoutPopupVisible(false)}
                                >
                                    <Text style={styles.buttonText}>No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleConfirmLogout}
                                >
                                    <Text style={styles.buttonText}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <CountryPicker
                    show={isPickerVisible}
                    pickerButtonOnPress={handleSelectCountry}
                    lang="en"
                    style={{
                        modal: {
                            height: 400,
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
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: wp('5%'),
        backgroundColor: '#fff',
    },
    darkContainer: {
        backgroundColor: '#010A0C',
    },
    sectionContainer: {
        marginBottom: hp('2.5%'),
    },
    chevron: {
        fontSize: wp('4%'),
        color: '#51514C',
    },
    error: {
        fontSize: wp('12%'),
        color: '#960000',
    },
    darkChevron: {
        fontSize: wp('5%'),
        color: '#fff',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: hp('1.25%'),
        paddingHorizontal: wp('5%'),
    },
    section1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: hp('1.25%'),
        paddingHorizontal: wp('5%'),
        marginTop: hp('2.5%'),
    },
    section2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: hp('1.25%'),
        paddingHorizontal: wp('5%'),
        marginBottom: hp('2.5%'),
    },
    section3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: hp('1.25%'),
        paddingHorizontal: wp('5%'),
        marginBottom: hp('2.5%'),
    },
    darkSection: {},
    sectionText: {
        fontSize: wp('4%'),
        fontWeight: '700',
        color: '#51514C',
    },
    sectionText1: {
        fontSize: wp('4%'),
        fontWeight: '700',
        color: '#C80000',
    },
   darkSectionText: {
        color: '#bbb',
    },
   detailsContainer: {
        marginTop: 0,
        borderWidth:1,
        backgroundColor: '#fff',
        borderRadius: wp('5%'),
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2.5%'),
    },
    darkdetailsContainer: {
        marginTop: 0,
        backgroundColor: '#021114',
        borderRadius: wp('5%'),
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2.5%'),
    },
    selectedFileText: {
        color: '#12CCB7',
        marginTop: hp('2.5%'),
    },
    input: {
        borderRadius: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#51514C',
        paddingVertical: hp('1.25%'),
        paddingHorizontal: wp('5%'),
        marginBottom: hp('2.5%'),
        color: '#000',
    },
    darkInput: {
        backgroundColor: '#51514C',
        borderColor: '#555',
        color: '#ddd',
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryCodeButton: {
        paddingVertical: hp('1.6%'),
        paddingHorizontal: wp('5%'),
        borderWidth: 1,
        borderColor: '#51514C',
        borderRadius: wp('2.5%'),
        marginBottom: hp('2.5%'),
        
        
    },
    darkCountryCodeButton: {
        backgroundColor: '#51514C',
        borderColor: '#555',
       
    },
    countryCodeButtonText: {
        fontSize: wp('4%'),
        color: '#555',
    },
    darkCountryCodeButtonText: {
        color: '#ddd',
    },
    phoneInput: {
        flex: 1,
        marginLeft: wp('2.5%'),
    },
    label: {
        fontSize: wp('3.5%'),
        color: '#51514C',
        marginBottom: hp('1.25%'),
    },
    darkLabel: {
        color: '#bbb',
    },
    switch: {
        bottom: hp('3.75%'),
    },
    darkModeToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1.875%'),
    },
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        width: wp('80%'),
        backgroundColor: '#fff',
        padding: wp('5%'),
        borderRadius: wp('2.5%'),
        alignItems: 'center',
    },
    popupTitle: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        marginBottom: hp('1.25%'),
        color: '#960000',
    },
    popupMessage: {
        fontSize: wp('4%'),
        marginBottom: hp('2.5%'),
        textAlign: 'center',
        color: '#960000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        padding: wp('2.5%'),
        alignItems: 'center',
        borderRadius: wp('2.5%'),
        marginHorizontal: wp('1.25%'),
        backgroundColor: '#12CCB7',
    },
    buttonText: {
        fontSize: wp('4%'),
        color: '#fff',
    },
});

export default SettingsScreen;

