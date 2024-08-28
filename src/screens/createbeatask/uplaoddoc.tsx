import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useColorScheme,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RootStackParamList} from '../../../App';
import {CustomErrorModal, CustomModal} from '../../components';
import {makeApiRequest} from '../../utils/helpers';
import {StackNavigationProp} from '@react-navigation/stack';

type Props = {
  route: RouteProp<RootStackParamList, 'Upload'>;
  navigation: StackNavigationProp<RootStackParamList, 'Upload'>;
};

const UploadDocument: React.FC<Props> = ({route, navigation}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const {details} = route.params;

  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateType, setDateType] = useState('');
  const [currentSection, setCurrentSection] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Registration Successful',
    loadingMessage: 'processing..',
    requestLoading: false,
    showModal: false,
  });
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: 'Missing Fields',
    errorMessage: 'All fields are required',
    isModalOpen: false,
  });

  const [governmentIdInfo, setGovernmentIdInfo] = useState({
    fullName: '',
    idNumber: '',
    issueDate: '',
    expirationDate: '',
    selectedFile: '',
  });
  const [driverLicenseInfo, setDriverLicenseInfo] = useState({
    fullName: '',
    licenseNumber: '',
    issueDate: '',
    expirationDate: '',
    selectedFile: '',
  });
  const [passportInfo, setPassportInfo] = useState({
    fullName: '',
    passportNumber: '',
    issueDate: '',
    expirationDate: '',
    selectedFile: '',
  });
  const [birthCertificateInfo, setBirthCertificateInfo] = useState({
    fullName: '',
    birthCertificateNumber: '',
    issueDate: '',
    selectedFile: '',
  });
  const [einInfo, setEinInfo] = useState({
    fullName: '',
    einNumber: '',
    issueDate: '',
    selectedFile: '',
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prevState =>
      prevState.includes(section)
        ? prevState.filter(item => item !== section)
        : [...prevState, section],
    );
  };

  const handledsubmitPress = async () => {
    const payload = {
      government_issue_id: governmentIdInfo.idNumber,
      government_issue_image: governmentIdInfo.selectedFile,
      full_name_driver_license: driverLicenseInfo.fullName,
      driver_license_number: driverLicenseInfo.licenseNumber,
      driver_license_image: driverLicenseInfo.selectedFile,
      driver_license_expiry_date: driverLicenseInfo.expirationDate,
      driver_license_issue_date: driverLicenseInfo.issueDate,
      passport_number: passportInfo.passportNumber,
      passport_image: passportInfo.selectedFile,
      ein_number: einInfo.einNumber,
      birth_certificate: birthCertificateInfo.birthCertificateNumber,
      ...details,
    };
    // throw an error if any value is missing

    if (einInfo.einNumber === '') {
      setShowErrorModal({
        ...showErrorModal,
        isModalOpen: true,
        errorMessage: 'EIN number is required',
      });
      return;
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }

    console.log(formData);

    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const {data, error} = await makeApiRequest('/register', 'POST', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('error', error);

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Registration failed',
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

      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          showModal: false,
        });
        navigation.navigate('otp', {
          email: payload.email,
          type: 'email-verify',
        });
      }, 2000);
    }

    // navigation.navigate('OTP' as never);
  };

  const selectFile = async (section: string) => {
    try {
      const res: DocumentPickerResponse | null =
        await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.allFiles], // You can specify a mime type to filter file types
        });
      if (res) {
        switch (section) {
          case 'Government-issued ID':
            setGovernmentIdInfo({
              ...governmentIdInfo,
              selectedFile: res.name || '',
            });
            break;
          case 'Driver’s license':
            setDriverLicenseInfo({
              ...driverLicenseInfo,
              selectedFile: res.name || '',
            });
            break;
          case 'Passport':
            setPassportInfo({
              ...passportInfo,
              selectedFile: res.name || '',
            });
            break;
          case 'Birth certificate':
            setBirthCertificateInfo({
              ...birthCertificateInfo,
              selectedFile: res.name || '',
            });
            break;
          case 'EIN number':
            setEinInfo({
              ...einInfo,
              selectedFile: res.name || '',
            });
            break;
          default:
            break;
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        // Handle other errors
        console.log(err);
      }
    }
  };

  const showDatePicker = (section: string, type: string) => {
    setCurrentSection(section);
    setDateType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    switch (currentSection) {
      case 'Government-issued ID':
        if (dateType === 'issueDate') {
          setGovernmentIdInfo({...governmentIdInfo, issueDate: formattedDate});
        } else {
          setGovernmentIdInfo({
            ...governmentIdInfo,
            expirationDate: formattedDate,
          });
        }
        break;
      case 'Driver’s license':
        if (dateType === 'issueDate') {
          setDriverLicenseInfo({
            ...driverLicenseInfo,
            issueDate: formattedDate,
          });
        } else {
          setDriverLicenseInfo({
            ...driverLicenseInfo,
            expirationDate: formattedDate,
          });
        }
        break;
      case 'Passport':
        if (dateType === 'issueDate') {
          setPassportInfo({...passportInfo, issueDate: formattedDate});
        } else {
          setPassportInfo({...passportInfo, expirationDate: formattedDate});
        }
        break;
      case 'Birth certificate':
        setBirthCertificateInfo({
          ...birthCertificateInfo,
          issueDate: formattedDate,
        });
        break;
      case 'EIN number':
        setEinInfo({...einInfo, issueDate: formattedDate});
        break;
      default:
        break;
    }
    hideDatePicker();
  };

  const sections = [
    'Government-issued ID',
    'Driver’s license',
    'Passport',
    'Birth certificate',
    'EIN number',
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDarkMode && styles.darkContainer,
      ]}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>
        Upload your document
      </Text>
      <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>
        Upload one of the following documents.
      </Text>
      <Text style={[styles.disclaimer, isDarkMode && styles.darkDisclaimer]}>
        Disclaimer: This information will be used solely for verifying your
        identity and will not be used for any other purpose.
      </Text>

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
            <Icon
              name={
                expandedSections.includes(section)
                  ? 'chevron-down'
                  : 'chevron-up'
              }
              size={24}
              style={[styles.chevron, isDarkMode && styles.darkchevron]}
              color="white"
            />
          </TouchableOpacity>
          {expandedSections.includes(section) &&
            section === 'Government-issued ID' && (
              <View style={styles.detailsContainer}>
                <TouchableOpacity
                  onPress={() => selectFile(section)}
                  style={styles.uploadButton}>
                  <Icon name="upload" size={30} color="#6e6e6e" />
                  <Text style={styles.uploadButtonText}>
                    <Text style={styles.chooseText}>Choose </Text>
                    file to upload
                  </Text>
                </TouchableOpacity>
                <Text style={styles.selectedFileText}>
                  {governmentIdInfo.selectedFile}
                </Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Full name"
                  placeholderTextColor="#a3a3a3"
                  value={governmentIdInfo.fullName}
                  onChangeText={text =>
                    setGovernmentIdInfo({...governmentIdInfo, fullName: text})
                  }
                />
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Government-issued ID number"
                  placeholderTextColor="#a3a3a3"
                  value={governmentIdInfo.idNumber}
                  onChangeText={text =>
                    setGovernmentIdInfo({...governmentIdInfo, idNumber: text})
                  }
                />
                <View style={styles.dateContainer}>
                  <TouchableOpacity
                    onPress={() => showDatePicker(section, 'issueDate')}>
                    <TextInput
                      style={[
                        styles.inputHalf1,
                        isDarkMode && styles.darkInput,
                      ]}
                      placeholder="Select Issue Date"
                      placeholderTextColor="#a3a3a3"
                      value={governmentIdInfo.issueDate}
                      editable={false}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => showDatePicker(section, 'expirationDate')}>
                    <TextInput
                      style={[
                        styles.inputHalf2,
                        isDarkMode && styles.darkInput,
                      ]}
                      placeholder="Select Expiration Date"
                      placeholderTextColor="#a3a3a3"
                      value={governmentIdInfo.expirationDate}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

          {expandedSections.includes(section) &&
            section === 'Driver’s license' && (
              <View style={styles.detailsContainer}>
                <TouchableOpacity
                  onPress={() => selectFile(section)}
                  style={styles.uploadButton}>
                  <Icon name="upload" size={30} color="#6e6e6e" />
                  <Text style={styles.uploadButtonText}>
                    <Text style={styles.chooseText}>Choose </Text>
                    file to upload
                  </Text>
                </TouchableOpacity>
                <Text style={styles.selectedFileText}>
                  {driverLicenseInfo.selectedFile}
                </Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Full name"
                  placeholderTextColor="#a3a3a3"
                  value={driverLicenseInfo.fullName}
                  onChangeText={text =>
                    setDriverLicenseInfo({...driverLicenseInfo, fullName: text})
                  }
                />
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Drivers license number"
                  placeholderTextColor="#a3a3a3"
                  value={driverLicenseInfo.licenseNumber}
                  onChangeText={text =>
                    setDriverLicenseInfo({
                      ...driverLicenseInfo,
                      licenseNumber: text,
                    })
                  }
                />
                <View style={styles.dateContainer}>
                  <TouchableOpacity
                    onPress={() => showDatePicker(section, 'issueDate')}>
                    <TextInput
                      style={[
                        styles.inputHalf1,
                        isDarkMode && styles.darkInput,
                      ]}
                      placeholder="Select Issue Date"
                      placeholderTextColor="#a3a3a3"
                      value={driverLicenseInfo.issueDate}
                      editable={false}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => showDatePicker(section, 'expirationDate')}>
                    <TextInput
                      style={[
                        styles.inputHalf2,
                        isDarkMode && styles.darkInput,
                      ]}
                      placeholder="Select Expiration Date"
                      placeholderTextColor="#a3a3a3"
                      value={driverLicenseInfo.expirationDate}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

          {expandedSections.includes(section) && section === 'Passport' && (
            <View style={styles.detailsContainer}>
              <TouchableOpacity
                onPress={() => selectFile(section)}
                style={styles.uploadButton}>
                <Icon name="upload" size={30} color="#6e6e6e" />
                <Text style={styles.uploadButtonText}>
                  <Text style={styles.chooseText}>Choose </Text>
                  file to upload
                </Text>
              </TouchableOpacity>
              <Text style={styles.selectedFileText}>
                {passportInfo.selectedFile}
              </Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Full name"
                placeholderTextColor="#a3a3a3"
                value={passportInfo.fullName}
                onChangeText={text =>
                  setPassportInfo({...passportInfo, fullName: text})
                }
              />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Passport number"
                placeholderTextColor="#a3a3a3"
                value={passportInfo.passportNumber}
                onChangeText={text =>
                  setPassportInfo({...passportInfo, passportNumber: text})
                }
              />
              <View style={styles.dateContainer}>
                <TouchableOpacity
                  onPress={() => showDatePicker(section, 'issueDate')}>
                  <TextInput
                    style={[styles.inputHalf1, isDarkMode && styles.darkInput]}
                    placeholder="Select Issue Date"
                    placeholderTextColor="#a3a3a3"
                    value={passportInfo.issueDate}
                    editable={false}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => showDatePicker(section, 'expirationDate')}>
                  <TextInput
                    style={[styles.inputHalf2, isDarkMode && styles.darkInput]}
                    placeholder="Select Expiration Date"
                    placeholderTextColor="#a3a3a3"
                    value={passportInfo.expirationDate}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {expandedSections.includes(section) &&
            section === 'Birth certificate' && (
              <View style={styles.detailsContainer}>
                <TouchableOpacity
                  onPress={() => selectFile(section)}
                  style={styles.uploadButton}>
                  <Icon name="upload" size={30} color="#6e6e6e" />
                  <Text style={styles.uploadButtonText}>
                    <Text style={styles.chooseText}>Choose </Text>
                    file to upload
                  </Text>
                </TouchableOpacity>
                <Text style={styles.selectedFileText}>
                  {birthCertificateInfo.selectedFile}
                </Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Full name"
                  placeholderTextColor="#a3a3a3"
                  value={birthCertificateInfo.fullName}
                  onChangeText={text =>
                    setBirthCertificateInfo({
                      ...birthCertificateInfo,
                      fullName: text,
                    })
                  }
                />
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Birth certificate number"
                  placeholderTextColor="#a3a3a3"
                  value={birthCertificateInfo.birthCertificateNumber}
                  onChangeText={text =>
                    setBirthCertificateInfo({
                      ...birthCertificateInfo,
                      birthCertificateNumber: text,
                    })
                  }
                />
                <TouchableOpacity
                  onPress={() => showDatePicker(section, 'issueDate')}>
                  <TextInput
                    style={[styles.inputHalf1, isDarkMode && styles.darkInput]}
                    placeholder="Select Issue Date"
                    placeholderTextColor="#a3a3a3"
                    value={birthCertificateInfo.issueDate}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
            )}

          {expandedSections.includes(section) && section === 'EIN number' && (
            <View style={styles.detailsContainer}>
              {/* <TouchableOpacity onPress={() => selectFile(section)} style={styles.uploadButton}>
                                <Icon name="upload" size={30} color="#6e6e6e" />
                                <Text style={styles.uploadButtonText}>
                                    <Text style={styles.chooseText}>Choose </Text>
                                    file to upload
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.selectedFileText}>{einInfo.selectedFile}</Text>
                            <TextInput
                                style={[styles.input, isDarkMode && styles.darkInput]}
                                placeholder="Full name"
                                placeholderTextColor="#a3a3a3"
                                value={einInfo.fullName}
                                onChangeText={text => setEinInfo({ ...einInfo, fullName: text })}
                            /> */}
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="EIN number"
                placeholderTextColor="#a3a3a3"
                value={einInfo.einNumber}
                onChangeText={text => setEinInfo({...einInfo, einNumber: text})}
              />
              {/* <TouchableOpacity onPress={() => showDatePicker(section, 'issueDate')}>
                                <TextInput
                                    style={[styles.inputHalf1, isDarkMode && styles.darkInput]}
                                    placeholder="Select Issue Date"
                                    placeholderTextColor="#a3a3a3" 
                                    value={einInfo.issueDate}
                                    editable={false}
                                />
                            </TouchableOpacity> */}
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity
        onPress={handledsubmitPress}
        style={[styles.submitButton, isDarkMode && styles.darkSubmitButton]}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <CustomModal {...showSuccessModal} />
      <CustomErrorModal
        {...showErrorModal}
        closeModal={() =>
          setShowErrorModal({...showErrorModal, isModalOpen: false})
        }
      />
    </ScrollView>
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
  title: {
    fontSize: wp('8%'),
    color: '#010A0C',
    marginBottom: hp('2%'),
  },
  darkTitle: {
    color: '#fff',
  },
  subtitle: {
    fontSize: wp('4%'),
    color: '#010A0C',
    marginBottom: hp('2%'),
  },
  darkSubtitle: {
    color: '#fff',
  },
  disclaimer: {
    fontSize: wp('3%'),
    color: '#960000',
    marginBottom: hp('3%'),
  },
  darkDisclaimer: {
    color: '#EEB0B0',
  },
  sectionContainer: {
    marginBottom: hp('2%'),
  },
  chevron: {
    fontSize: wp('5%'),
    color: '#51514C',
  },
  darkchevron: {
    fontSize: wp('5%'),
    color: '#fff',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
  },
  darkSection: {
    // No specific changes for dark mode
  },
  sectionText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#51514C',
  },
  darkSectionText: {
    color: '#bbb',
  },
  detailsContainer: {
    marginTop: hp('2%'),
  },
  uploadButton: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#51514C',
    borderStyle: 'dotted',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  uploadButtonText: {
    fontSize: wp('4%'),
    color: '#51514C',
    marginTop: hp('2%'),
  },
  chooseText: {
    color: '#12CCB7',
  },
  selectedFileText: {
    color: '#12CCB7',
    marginTop: hp('2%'),
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#51514C',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
    marginBottom: hp('2%'),
  },
  darkInput: {
    backgroundColor: '#51514C',
    borderColor: '#555',
    color: '#ddd',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  inputHalf1: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#51514C',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
    marginBottom: hp('2%'),
  },
  inputHalf2: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#51514C',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
    marginBottom: hp('2%'),
  },
  submitButton: {
    backgroundColor: '#AEADA4',
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('10%'),
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: hp('5%'),
  },
  darkSubmitButton: {
    backgroundColor: '#AEADA4',
  },
  submitButtonText: {
    fontSize: wp('5%'),
    fontWeight: '700',
    color: '#010A0C',
    alignSelf: 'center',
  },
});

export default UploadDocument;
