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
import {RouteProp} from '@react-navigation/native';
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
import {Text as RNText} from 'react-native-paper';

type IdentificationInfo<Keys extends {[key: string]: unknown}> = {
  fullName: string;
  issueDate?: string;
  expirationDate?: string;
  selectedFile: DocumentPickerResponse | null;
  fileName: string;
} & Keys;

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

  const [governmentIdInfo, setGovernmentIdInfo] = useState<
    IdentificationInfo<{
      idNumber: string;
    }>
  >({
    fullName: '',
    idNumber: '',
    issueDate: '',
    expirationDate: '',
    selectedFile: null,
    fileName: '',
  });
  const [driverLicenseInfo, setDriverLicenseInfo] = useState<
    IdentificationInfo<{
      licenseNumber: string;
    }>
  >({
    fullName: '',
    licenseNumber: '',
    issueDate: '',
    expirationDate: '',
    selectedFile: null,
    fileName: '',
  });
  const [passportInfo, setPassportInfo] = useState<
    IdentificationInfo<{
      passportNumber: string;
    }>
  >({
    fullName: '',
    passportNumber: '',
    issueDate: '',
    expirationDate: '',
    selectedFile: null,
    fileName: '',
  });
  const [birthCertificateInfo, setBirthCertificateInfo] = useState<
    IdentificationInfo<{
      birthCertificateNumber: string;
    }>
  >({
    fullName: '',
    birthCertificateNumber: '',
    issueDate: '',
    selectedFile: null,
    fileName: '',
  });
  const [einInfo, setEinInfo] = useState<
    IdentificationInfo<{
      einNumber: string;
    }>
  >({
    fullName: '',
    einNumber: '',
    issueDate: '',
    selectedFile: null,
    fileName: '',
  });
  const [ssnNumber, setSsnNumber] = useState('');

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
      ein_document: einInfo.selectedFile,
      birth_certificate: birthCertificateInfo.birthCertificateNumber,
      ssn_number: ssnNumber,
      ...details,
    };
    // throw an error if any value is missing

    console.log(payload);

    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }

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
        if (details.google_token) {
          navigation.navigate('Login');
          return;
        }
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
              selectedFile: res || '',
              fileName: res.name as string,
            });
            break;
          case 'Driver’s license':
            setDriverLicenseInfo({
              ...driverLicenseInfo,
              selectedFile: res,
              fileName: res.name as string,
            });
            break;
          case 'Passport':
            setPassportInfo({
              ...passportInfo,
              selectedFile: res,
              fileName: res.name as string,
            });
            break;
          case 'Birth certificate':
            setBirthCertificateInfo({
              ...birthCertificateInfo,
              selectedFile: res,
              fileName: res.name as string,
            });
            break;
          case 'EIN Document':
            setEinInfo({
              ...einInfo,
              selectedFile: res,
              fileName: res.name as string,
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
      case 'EIN Image':
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
    'EIN Document',
    'SSN Number',
  ];
  console.log(einInfo.selectedFile);
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
                  ? 'chevron-up'
                  : 'chevron-down'
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
                  {governmentIdInfo.selectedFile ? (
                    <RNText>{governmentIdInfo.fileName}</RNText>
                  ) : (
                    <>
                      <Text style={styles.uploadButtonText}>
                        <Text style={styles.chooseText}>Choose </Text>
                        file to upload
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Government-issued ID number"
                  placeholderTextColor="#a3a3a3"
                  value={governmentIdInfo.idNumber}
                  onChangeText={text =>
                    setGovernmentIdInfo({...governmentIdInfo, idNumber: text})
                  }
                />
              </View>
            )}

          {expandedSections.includes(section) &&
            section === 'Driver’s license' && (
              <View style={styles.detailsContainer}>
                <TouchableOpacity
                  onPress={() => selectFile(section)}
                  style={styles.uploadButton}>
                  <Icon name="upload" size={30} color="#6e6e6e" />
                  {driverLicenseInfo.selectedFile ? (
                    <RNText>{driverLicenseInfo.fileName}</RNText>
                  ) : (
                    <>
                      <Text style={styles.uploadButtonText}>
                        <Text style={styles.chooseText}>Choose </Text>
                        file to upload
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

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
              </View>
            )}

          {expandedSections.includes(section) && section === 'Passport' && (
            <View style={styles.detailsContainer}>
              <TouchableOpacity
                onPress={() => selectFile(section)}
                style={styles.uploadButton}>
                <Icon name="upload" size={30} color="#6e6e6e" />
                {passportInfo.selectedFile ? (
                  <RNText>{passportInfo.fileName}</RNText>
                ) : (
                  <>
                    <Text style={styles.uploadButtonText}>
                      <Text style={styles.chooseText}>Choose </Text>
                      file to upload
                    </Text>
                  </>
                )}
              </TouchableOpacity>

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
            </View>
          )}

          {expandedSections.includes(section) &&
            section === 'Birth certificate' && (
              <View style={styles.detailsContainer}>
                <TouchableOpacity
                  onPress={() => selectFile(section)}
                  style={styles.uploadButton}>
                  <Icon name="upload" size={30} color="#6e6e6e" />
                  {birthCertificateInfo.selectedFile ? (
                    <RNText>{birthCertificateInfo.fileName}</RNText>
                  ) : (
                    <>
                      <Text style={styles.uploadButtonText}>
                        <Text style={styles.chooseText}>Choose </Text>
                        file to upload
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

          {expandedSections.includes(section) && section === 'EIN Document' && (
            <View style={styles.detailsContainer}>
              <TouchableOpacity
                onPress={() => selectFile(section)}
                style={styles.uploadButton}>
                <Icon name="upload" size={30} color="#6e6e6e" />

                {einInfo.selectedFile ? (
                  <RNText>{einInfo.fileName}</RNText>
                ) : (
                  <>
                    <Text style={styles.uploadButtonText}>
                      <Text style={styles.chooseText}>Choose </Text>
                      file to upload
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <RNText style={styles.selectedFileText}>
                {einInfo.fileName}
              </RNText>
              {/* <TextInput
                                style={[styles.input, isDarkMode && styles.darkInput]}
                                placeholder="Full name"
                                placeholderTextColor="#a3a3a3"
                                value={einInfo.fullName}
                                onChangeText={text => setEinInfo({ ...einInfo, fullName: text })}
                            /> */}
              {/* <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="EIN number"
                placeholderTextColor="#a3a3a3"
                value={einInfo.einNumber}
                onChangeText={text => setEinInfo({...einInfo, einNumber: text})}
              /> */}

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
          {expandedSections.includes(section) && section === 'SSN Number' && (
            <View style={styles.detailsContainer}>
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="SSN (Social Security Number)"
                placeholderTextColor="#a3a3a3"
                value={ssnNumber}
                onChangeText={setSsnNumber}
              />
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
