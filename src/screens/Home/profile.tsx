import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CountryPicker} from 'react-native-country-codes-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {formatPhoneNumber} from '../createbeatask/createaccountbeatask';
import {User, useUserStore} from '../../store/useUserStore';
import {makeApiRequest} from '../../utils/helpers';
import {CustomErrorModal, CustomModal} from '../../components';
import SafeAreaViewContainer from '../../components/SafeAreaViewContainer';

type UpdateSuccessResponse = {
  data: User;
  msg: string;
  success: boolean;
};

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const {user, actions} = useUserStore(state => state);

  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [governmentIdInfo] = useState({
    selectedFile: '',
    fullName: '',
    idNumber: '',
    issueDate: '',
    expirationDate: '',
  });
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phone_number?.slice(2) || '',
  );

  console.log(user?.phone_number);

  const [profileDetails, setProfileDetails] = useState({
    first_legal_name: user?.first_legal_name || '',
    last_legal_name: user?.last_legal_name || '',
    email: user?.email || '',
    home_address: user?.home_address || '',
  });
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isLogoutPopupVisible, setLogoutPopupVisible] = useState(false);
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(isDarkMode);
  const [isEnglishEnabled, setEnglishEnabled] = useState(true);

  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Profile Updated Successfully',
    loadingMessage: 'Processing..',
    requestLoading: false,
    showModal: false,
  });

  const handleProfileSetup = () => {
    navigation.navigate('ProfileSetup' as never);
  };

  const handleProfile = () => {
    navigation.navigate('Profile' as never);
  };

  const handleService = () => {
    navigation.navigate('seved' as never);
  };
  const handleReview = () => {
    navigation.navigate('Review' as never);
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy' as never);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prevState =>
      prevState.includes(section)
        ? prevState.filter(item => item !== section)
        : [...prevState, section],
    );
  };

  const sections = ['Profile Setup', 'App setting', 'Language setting'];

  const handleSelectCountry = (country: any) => {
    setCountryCode(country.dial_code);
    setPickerVisible(false);
  };

  const handleCountryCodePress = () => {
    setPickerVisible(true);
  };

  const handleLogout = () => {
    setLogoutPopupVisible(true);
  };

  const handleConfirmLogout = async () => {
    const {data, error} = await makeApiRequest('/logout', 'POST', {});
    if (error) {
      console.log('error', error);
    }

    if (data) {
      setLogoutPopupVisible(false);
      navigation.navigate('SplashScreen' as never);
    }
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(previousState => !previousState);
  };

  const handleEnglishToggle = () => {
    setEnglishEnabled(previousState => !previousState);
  };

  // Function to reset country code selection
  const handleClearCountrySelection = () => {
    setCountryCode('');
  };

  const onProfileSave = async () => {
    const payload = {
      ...profileDetails,
      phone_number: formatPhoneNumber(countryCode, phoneNumber),
    };
    console.log(payload);
    for (const [key, value] of Object.entries(payload)) {
      if (value === null || value === undefined || value === '') {
        setShowErrorModal({
          ...showErrorModal,
          isModalOpen: true,
          errorMessage: 'Please fill all the required fields',
        });
        return;
      }
    }
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const {data, error} = await makeApiRequest<UpdateSuccessResponse>(
      `/update-user/${user?.id}`,
      'POST',
      payload,
    );

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Unable to Update Profile',
        errorMessage: error.msg,
        isModalOpen: true,
      });
    }

    if (data) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: true,
      });
      actions.login(data.data);

      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          requestLoading: false,
          showModal: false,
        });
        navigation.navigate('Home' as never);
      }, 3000);
    }
  };

  return (
    <SafeAreaViewContainer>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            isDarkMode && styles.darkContainer,
          ]}>
          {sections.map(section => (
            <View key={section} style={styles.sectionContainer}>
              <TouchableOpacity
                onPress={() => toggleSection(section)}
                style={[styles.section, isDarkMode && styles.darkSection]}>
                <Text
                  style={[
                    styles.sectionText,
                    isDarkMode && styles.darkSectionText,
                  ]}>
                  {section}
                </Text>
                <FontAwesomeIcon
                  name={
                    expandedSections.includes(section)
                      ? 'chevron-down'
                      : 'chevron-up'
                  }
                  size={wp('6%')}
                  style={[styles.chevron, isDarkMode && styles.darkChevron]}
                />
              </TouchableOpacity>
              {expandedSections.includes(section) &&
                section === 'Profile Setup' && (
                  <View
                    style={[
                      styles.detailsContainer,
                      isDarkMode && styles.darkdetailsContainer,
                    ]}>
                    <Text style={styles.selectedFileText}>
                      {governmentIdInfo.selectedFile}
                    </Text>
                    <Text style={styles.label}>First Legal Name</Text>
                    <TextInput
                      style={[styles.input, isDarkMode && styles.darkInput]}
                      placeholder="First legal name"
                      placeholderTextColor="#999"
                      value={profileDetails.first_legal_name}
                      onChangeText={text =>
                        setProfileDetails({
                          ...profileDetails,
                          first_legal_name: text,
                        })
                      }
                    />
                    <Text style={styles.label}>Last Legal Name</Text>
                    <TextInput
                      style={[styles.input, isDarkMode && styles.darkInput]}
                      placeholder="Last legal name"
                      placeholderTextColor="#999"
                      value={profileDetails.last_legal_name}
                      onChangeText={text =>
                        setProfileDetails({
                          ...profileDetails,
                          last_legal_name: text,
                        })
                      }
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={[styles.input, isDarkMode && styles.darkInput]}
                      placeholder="Email address"
                      placeholderTextColor="#999"
                      value={profileDetails.email}
                      onChangeText={text =>
                        setProfileDetails({...profileDetails, email: text})
                      }
                    />
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.phoneContainer}>
                      <TouchableOpacity
                        style={[
                          styles.countryCodeButton,
                          isDarkMode && styles.darkCountryCodeButton,
                        ]}
                        onPress={handleCountryCodePress}>
                        <Text
                          style={[
                            styles.countryCodeButtonText,
                            isDarkMode && styles.darkCountryCodeButtonText,
                          ]}>
                          {countryCode}
                        </Text>
                      </TouchableOpacity>
                      <TextInput
                        style={[
                          styles.input,
                          styles.phoneInput,
                          isDarkMode && styles.darkInput,
                        ]}
                        placeholder="555 555-1234"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={text => setPhoneNumber(text)}
                      />
                    </View>
                    <Text style={styles.label}>Home Address</Text>
                    <TextInput
                      style={[styles.input, isDarkMode && styles.darkInput]}
                      placeholder="Home address"
                      placeholderTextColor="#999"
                      value={profileDetails.home_address}
                      onChangeText={text =>
                        setProfileDetails({
                          ...profileDetails,
                          home_address: text,
                        })
                      }
                    />

                    <TouchableOpacity
                      onPress={onProfileSave}
                      style={styles.saveButton}>
                      <Text>Save</Text>
                    </TouchableOpacity>
                  </View>
                )}
              {expandedSections.includes(section) &&
                section === 'App setting' && (
                  <View
                    style={[
                      styles.detailsContainer,
                      isDarkMode && styles.darkdetailsContainer,
                    ]}>
                    <TouchableOpacity
                      onPress={handlePrivacyPolicy}
                      style={[
                        styles.section3,
                        isDarkMode && styles.darkSection,
                      ]}>
                      <Text
                        style={[
                          styles.sectionText,
                          isDarkMode && styles.darkSectionText,
                        ]}>
                        Privacy policy
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleProfile}
                      style={[
                        styles.section3,
                        isDarkMode && styles.darkSection,
                      ]}>
                      <Text
                        style={[
                          styles.sectionText,
                          isDarkMode && styles.darkSectionText,
                        ]}>
                        Help center
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

              {expandedSections.includes(section) &&
                section === 'Language setting' && (
                  <View
                    style={[
                      styles.detailsContainer,
                      isDarkMode && styles.darkdetailsContainer,
                    ]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={[
                          styles.sectionText,
                          isDarkMode && styles.darkSectionText,
                          {flexDirection: 'row', gap: 4, alignItems: 'center'},
                        ]}>
                        English
                      </Text>
                      <Switch
                        style={{marginLeft: 'auto'}}
                        trackColor={{false: '#767577', true: '#12CCB7'}}
                        thumbColor={isDarkModeEnabled ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        disabled
                        value={isEnglishEnabled}
                      />
                    </View>
                  </View>
                )}
            </View>
          ))}
          <TouchableOpacity
            onPress={handleService}
            style={[styles.section2, isDarkMode && styles.darkSection]}>
            <Text
              style={[
                styles.sectionText,
                isDarkMode && styles.darkSectionText,
              ]}>
              Saved providers
            </Text>
            <FontAwesomeIcon
              name={'chevron-right'}
              size={wp('6%')}
              style={[styles.chevron, isDarkMode && styles.darkChevron]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleReview}
            style={[styles.section2, isDarkMode && styles.darkSection]}>
            <Text
              style={[
                styles.sectionText,
                isDarkMode && styles.darkSectionText,
              ]}>
              Review and Ratings
            </Text>
            <FontAwesomeIcon
              name={'chevron-right'}
              size={wp('6%')}
              style={[styles.chevron, isDarkMode && styles.darkChevron]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('delete_account' as never)}
            style={[styles.section2, isDarkMode && styles.darkSection]}>
            <Text
              style={[
                styles.sectionText,
                isDarkMode && styles.darkSectionText,
              ]}>
              Deactivate account
            </Text>
            <FontAwesomeIcon
              name={'chevron-right'}
              size={wp('6%')}
              style={[styles.chevron, isDarkMode && styles.darkChevron]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.section2, isDarkMode && styles.darkSection]}>
            <Text style={[styles.sectionText1]}>Log out</Text>
          </TouchableOpacity>

          <Modal
            transparent={true}
            visible={isLogoutPopupVisible}
            animationType="fade">
            <View style={styles.popupContainer}>
              <View style={styles.popup}>
                <Icon
                  name={'information-outline'}
                  size={wp('12%')}
                  style={[styles.error]}
                />
                <Text style={styles.popupTitle}>Log out</Text>
                <Text style={styles.popupMessage}>Sure you want to exit?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setLogoutPopupVisible(false)}>
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleConfirmLogout}>
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
          <CustomModal {...showSuccessModal} />
          <CustomErrorModal
            {...showErrorModal}
            closeModal={() =>
              setShowErrorModal({...showErrorModal, isModalOpen: false})
            }
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaViewContainer>
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
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: wp('5%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.5%'),
  },
  darkdetailsContainer: {
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
  saveButton: {
    backgroundColor: '#12CCB7',
    paddingVertical: hp('2%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    marginTop: hp('4%'),
    marginHorizontal: wp('30%'),
  },
});

export default SettingsScreen;
