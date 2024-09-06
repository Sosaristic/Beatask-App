import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useNavigation} from '@react-navigation/native';
import * as DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Feather';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Formik, FormikProps} from 'formik';
import {ServiceListingValidationSchema} from '../../../components/forms/serviceListing';
import useFetch from '../../../hooks/useFetch';
import {FetchedCategory} from '../../../interfaces/apiResponses';
import {Checkbox} from 'react-native-paper';
import {customTheme} from '../../../custom_theme/customTheme';
import {CustomErrorModal, CustomModal} from '../../../components';
import {makeApiRequest} from '../../../utils/helpers';
import {useUserStore} from '../../../store/useUserStore';

interface Availability {
  date: string;
  startTime: string;
  endTime: string;
}

interface DateObject {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

interface ImageObject {
  fileCopyUri: string | null;
  name: string;
  size: number;
  type: string;
  uri: string;
}

type InitialValuesType = {
  service_name: string;
  years_of_experience: string;
  real_price: string;
  discounted_price: string;
  service_description: string;
  category_name: string;
  sub_category: string;
  service_image: DocumentPicker.DocumentPickerResponse | null;
  experience_document: DocumentPicker.DocumentPickerResponse | null;
};

const initialValues: InitialValuesType = {
  service_name: '',
  years_of_experience: '',
  real_price: '',
  discounted_price: '',
  service_description: '',
  category_name: '',
  sub_category: '',
  service_image: null,
  experience_document: null,
};

type CategoriesRes = {
  message: string;
  data: FetchedCategory[];
};

const BookingScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const {user} = useUserStore(state => state);
  const navigation = useNavigation();
  // const [serviceCategory, setServiceCategory] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const [certification, setCertification] = useState<
    DocumentPicker.DocumentPickerResponse[] | null
  >(null);
  const [imagePicked, setImagePicked] = useState<
    DocumentPicker.DocumentPickerResponse[] | null
  >(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const {data, loading, error} = useFetch<CategoriesRes>(
    '/get-categories',
    'GET',
  );
  const [categoryType, setCategoryType] = useState<'category' | 'sub_category'>(
    'category',
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryList, setSubCategoryList] = useState<string[]>([]);
  const formikRef = useRef<FormikProps<typeof initialValues>>(null);
  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Service added successfully',
    loadingMessage: 'processing..',
    requestLoading: false,
    showModal: false,
  });
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const dropdownHeight = useRef(new Animated.Value(0)).current; // Initial height of dropdown

  useEffect(() => {
    if (selectedCategory) {
      const filteredSubCategories = data?.data.find(
        item => item.category === selectedCategory,
      );
      setCategoryId(filteredSubCategories?.id as string);
      if (
        filteredSubCategories &&
        typeof filteredSubCategories.sub_category === 'string'
      ) {
        const parsedSubCategory = JSON.parse(
          filteredSubCategories.sub_category,
        );
        setSubCategoryList(parsedSubCategory);
      }
    }
  }, [selectedCategory]);

  const handleOptionPress = (option: string) => {
    console.log(`Pressed option: ${option}`);
  };

  const handleProfileSetup = () => {
    navigation.navigate('ProfileSetup' as never);
  };

  const handleServiceListing = () => {
    navigation.navigate('servicelisting' as never);
  };

  const handleFileUpload = async (field: string) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      // setCertification(res);
      if (field === 'experience_document') {
        setCertification(res);
      }
      if (field === 'service_image') {
        setImagePicked(res);
      }
      formikRef.current?.setFieldValue(field, res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };

  // const handleDayPress = (day: DateObject) => {
  //   if (!availability.some(slot => slot.date === day.dateString)) {
  //     setAvailability([
  //       ...availability,
  //       {date: day.dateString, startTime: '08:00 AM', endTime: '07:00 PM'},
  //     ]);
  //   }
  // };

  // const handleTimeChange = (
  //   date: string,
  //   field: 'startTime' | 'endTime',
  //   value: string,
  // ) => {
  //   setAvailability(
  //     availability.map(slot =>
  //       slot.date === date ? {...slot, [field]: value} : slot,
  //     ),
  //   );
  // };

  // const handleRemoveDate = (date: string) => {
  //   setAvailability(availability.filter(slot => slot.date !== date));
  // };

  // const toggleDropdown = () => {
  //   setShowDropdown(!showDropdown);
  //   Animated.timing(dropdownHeight, {
  //     toValue: showDropdown ? 0 : 700, // Set the height to 500 when dropdown is open
  //     duration: 300,
  //     easing: Easing.linear,
  //     useNativeDriver: false,
  //   }).start();
  // };

  // const toggleDropdownhome = () => {
  //   setShowDropdown(!showDropdown);
  //   Animated.timing(dropdownHeight, {
  //     toValue: showDropdown ? 0 : 500, // Set the height to 500 when dropdown is open
  //     duration: 300,
  //     easing: Easing.linear,
  //     useNativeDriver: false,
  //   }).start();
  // };

  const closeDropdown = () => {
    if (showDropdown) {
      setShowDropdown(false);
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  };

  const openCategory = (whichType: 'category' | 'sub_category') => {
    setOpenModal(true);
    setCategoryType(whichType);
  };
  const handleOptionSelect = (
    option: string,
    type: 'category' | 'sub_category',
    picked?: string[],
  ) => {
    if (type === 'category') {
      setSelectedCategory(option);
      formikRef.current?.setFieldValue('category_name', option);
    } else {
      setSelectedSubCategory(option);
      formikRef.current?.setFieldValue('sub_category', option);
    }
    setOpenModal(false);
  };

  const handleFormSubmit = async (values: InitialValuesType) => {
    const payload = {...values, provider_id: user?.id, category_id: categoryId};
    console.log('payload', payload);

    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const {data, error} = await makeApiRequest(
      '/add-services',
      'POST',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Service could not be added',
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
        navigation.navigate('dashboard' as never);
      }, 2000);
    }
  };

  const styles = getStyles(isDarkMode);

  const renderItem = ({item}: {item: FetchedCategory}) => {
    const pickedService = data?.data.find(
      item => item.category === selectedCategory,
    )?.sub_category;

    return (
      <>
        <TouchableOpacity
          style={{
            width: '100%',
            alignItems: 'flex-start',
            flexDirection: 'row',
          }}>
          <Checkbox.Item
            label={item.category}
            onPress={() =>
              handleOptionSelect(item.category, 'category', pickedService)
            }
            status={
              selectedCategory === item.category ? 'checked' : 'unchecked'
            }
            labelStyle={{textTransform: 'capitalize'}}
            style={{width: '100%'}}
          />
        </TouchableOpacity>
      </>
    );
  };

  const subCategoryRender = ({item}: {item: string}) => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}>
        <Checkbox.Item
          label={item}
          onPress={() => handleOptionSelect(item, 'sub_category')}
          status={selectedSubCategory === item ? 'checked' : 'unchecked'}
          labelStyle={{textTransform: 'capitalize'}}
          style={{width: '100%'}}
        />
      </TouchableOpacity>
    );
  };

  console.log(formikRef.current?.values);
  return (
    <ScrollView style={styles.container}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={ServiceListingValidationSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => {
          return (
            <View style={{gap: 12, marginBottom: 40}}>
              <View>
                <Text style={styles.label}>
                  What is the name of your Service
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('service_name')}
                  onBlur={handleBlur('service_name')}
                  value={values.service_name}
                  placeholder="Enter Service Name"
                />
                {touched.service_name && errors.service_name && (
                  <Text style={styles.errorText}>{errors.service_name}</Text>
                )}
              </View>

              <View>
                <Text style={styles.label}>
                  Which of these services do you offer
                </Text>
                <TouchableOpacity onPress={() => openCategory('category')}>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('category_name')}
                    onBlur={handleBlur('category_name')}
                    value={values.category_name}
                    editable={false}
                    placeholder="Choose Category"
                  />
                </TouchableOpacity>
                {touched.category_name && errors.category_name && (
                  <Text style={styles.errorText}>{errors.category_name}</Text>
                )}
              </View>
              <View>
                <Text style={styles.label}>
                  Skills relevant to the service your offer
                </Text>
                <TouchableOpacity onPress={() => openCategory('sub_category')}>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('sub_category')}
                    onBlur={handleBlur('sub_category')}
                    value={values.sub_category}
                    editable={false}
                    placeholder="Choose Sub Category"
                  />
                </TouchableOpacity>
                {touched.sub_category && errors.sub_category && (
                  <Text style={styles.errorText}>{errors.sub_category}</Text>
                )}
              </View>

              <View>
                <Text style={styles.label}>Years of Experience</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('years_of_experience')}
                  onBlur={handleBlur('years_of_experience')}
                  value={values.years_of_experience}
                  placeholder="Enter Years of Experience"
                  keyboardType="numeric"
                />
                {touched.years_of_experience && errors.years_of_experience && (
                  <Text style={styles.errorText}>
                    {errors.years_of_experience}
                  </Text>
                )}
              </View>
              <View>
                <Text style={styles.label}>Set Pricing</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('real_price')}
                  onBlur={handleBlur('real_price')}
                  value={values.real_price}
                  keyboardType="numeric"
                  placeholder="e.g $20"
                />
                {touched.real_price && errors.real_price && (
                  <Text style={styles.errorText}>{errors.real_price}</Text>
                )}
              </View>
              <View>
                <Text style={styles.label}>Set Discounted Price</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('discounted_price')}
                  onBlur={handleBlur('discounted_price')}
                  value={values.discounted_price}
                  keyboardType="numeric"
                  placeholder="e.g $20"
                />
                {touched.discounted_price && errors.discounted_price && (
                  <Text style={styles.errorText}>
                    {errors.discounted_price}
                  </Text>
                )}
              </View>
              <View>
                <Text style={styles.label}>Upload Service image</Text>
                <TouchableOpacity
                  onPress={() => handleFileUpload('service_image')}
                  style={styles.uploadButton}>
                  <Icon name="upload" size={30} color="#6e6e6e" />
                  <Text style={styles.uploadButtonText}>
                    <Text style={styles.chooseText}>Choose </Text>
                    file to upload
                  </Text>
                  <Text>{imagePicked !== null ? imagePicked[0].name : ''}</Text>
                </TouchableOpacity>
                {touched.service_image && errors.service_image && (
                  <Text style={styles.errorText}>{errors.service_image}</Text>
                )}
              </View>
              <View>
                <Text style={styles.label}>
                  Upload Certification for this service
                </Text>
                <TouchableOpacity
                  onPress={() => handleFileUpload('experience_document')}
                  style={styles.uploadButton}>
                  <Icon name="upload" size={30} color="#6e6e6e" />
                  <Text style={styles.uploadButtonText}>
                    <Text style={styles.chooseText}>Choose </Text>
                    file to upload
                  </Text>
                  <Text>
                    {certification !== null ? certification[0].name : ''}
                  </Text>
                </TouchableOpacity>
                {touched.experience_document && errors.experience_document && (
                  <Text style={styles.errorText}>
                    {errors.experience_document}
                  </Text>
                )}
              </View>

              <View>
                <Text style={styles.label}>Service Description</Text>
                <TextInput
                  style={[
                    {
                      borderRadius: 5,
                      borderWidth: 1,
                      borderStyle: 'dotted',
                      color: isDarkMode ? '#FFFFFF' : '#000000',
                      backgroundColor: isDarkMode ? '#51514C' : '#FFFFFF',
                      textAlignVertical: 'top', // Align text and placeholder to the top
                      // Ensure no top margin
                      paddingTop: hp('2%'), // Ensure no top padding
                      paddingLeft: 8,
                    },
                  ]}
                  value={values.service_description}
                  onChangeText={handleChange('service_description')}
                  onBlur={handleBlur('service_description')}
                  placeholder="Enter Service Description"
                  placeholderTextColor={isDarkMode ? '#CCCCCC' : '#707070'}
                  multiline
                  numberOfLines={4}
                />
                {touched.service_description && errors.service_description && (
                  <Text style={styles.errorText}>
                    {errors.service_description}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  alignItems: 'center',

                  width: '100%',
                  padding: 10,
                }}>
                <Text
                  style={{
                    backgroundColor: customTheme.primaryColor,
                    textAlign: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    fontSize: 18,
                    alignSelf: 'center',
                    marginHorizontal: 'auto',
                    borderRadius: 20,
                  }}>
                  SAVE
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </Formik>

      {/* <Text style={styles.label}>Service categories</Text>

      <TouchableOpacity onPress={() => setOpenModal(true)}>
        <Text style={styles.input}>Select Service Category</Text>
      </TouchableOpacity> */}
      {/* <Animated.View
          style={[styles.dropdownContent, {height: dropdownHeight}]}>
          <Text style={styles.headingtext}>Service Category</Text>
          <TouchableOpacity onPress={closeDropdown}></TouchableOpacity>
          <Icon
            onPress={closeDropdown}
            name="x"
            size={24}
            style={[styles.closeicon, styles.rightx]}
            color={isDarkMode ? '#000000' : '#FFFFFF'}
          />
          <TouchableOpacity style={styles.option} onPress={handleProfileSetup}>
            <Text style={styles.text}>Home Improvement</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={handleServiceListing}>
            <Text style={styles.text}>Wellness</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionPress('Review and Ratings')}>
            <Text style={styles.text}>Pets</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Business</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionPress('Log out')}>
            <Text style={styles.text}>IT and Graphic Design</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Events</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Troubleshooting and Repair</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Lessons</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Personal</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Legal</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </Animated.View> */}

      {/* <Text style={styles.label}>Skills relevant to the service you offer</Text>
      <TextInput
        style={styles.input}
        placeholder="Planning"
        placeholderTextColor={isDarkMode ? '#888888' : '#AAAAAA'}
        value={skills[0]}
        onChangeText={text => setSkills([text])}
      />

      <Text style={styles.label}>Years of experience</Text>
      <TextInput
        style={styles.input}
        placeholder="At least 5 years of experience"
        placeholderTextColor={isDarkMode ? '#888888' : '#AAAAAA'}
        value={yearsOfExperience}
        onChangeText={setYearsOfExperience}
      />
      <Text style={styles.label}>Upload certification for this service</Text> */}
      {/* <TouchableOpacity onPress={handleFileUpload} style={styles.uploadButton}>
        <Icon name="upload" size={30} color="#6e6e6e" />
        <Text style={styles.uploadButtonText}>
          <Text style={styles.chooseText}>Choose </Text>
          file to upload
        </Text>
      </TouchableOpacity> */}
      {/* {certification &&
          certification.map((file, index) => (
            <Text key={index} style={styles.selectedFileText}>
              {file.name}
            </Text>
          ))} */}
      {/* <Text style={styles.label}>Set availability</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={availability.reduce((acc, slot) => {
              acc[slot.date] = { selected: true, selectedColor: '#1E90FF' };
              return acc;
            }, {} as Record<string, any>)}
            theme={{
              calendarBackground: isDarkMode ? '#000000' : '#FFFFFF',
              dayTextColor: isDarkMode ? '#FFFFFF' : '#000000',
              textSectionTitleColor: isDarkMode ? '#FFFFFF' : '#000000',
              selectedDayBackgroundColor: '#1E90FF',
              selectedDayTextColor: '#FFFFFF',
            }}
          />
        </View> */}
      {/* {availability.map((slot, index) => (
          <View key={index} style={styles.timeSlot}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>{slot.date}</Text>
              <TouchableOpacity onPress={() => handleRemoveDate(slot.date)}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeInputs}>
              <TextInput
                style={styles.timeInput}
                value={slot.startTime}
                onChangeText={(text) => handleTimeChange(slot.date, 'startTime', text)}
              />
              <Text style={styles.timeSeparator}>-</Text>
              <TextInput
                style={styles.timeInput}
                value={slot.endTime}
                onChangeText={(text) => handleTimeChange(slot.date, 'endTime', text)}
              />
            </View>
          </View>
        ))} */}

      <Modal
        visible={openModal}
        transparent
        animationType="slide"
        onDismiss={() => setOpenModal(false)}
        onRequestClose={() => setOpenModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#1E90FF" />
            ) : error ? (
              <Text>Categories not found</Text>
            ) : (
              <>
                <Text
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 10,
                    width: '100%',
                    textAlign: 'left',
                    fontSize: hp(2.5),
                  }}>
                  {categoryType === 'category'
                    ? 'Categories'
                    : 'Sub Categories'}
                </Text>
                {categoryType === 'category' && (
                  <FlatList
                    data={data?.data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                  />
                )}
                {categoryType === 'sub_category' &&
                  subCategoryList.length > 0 && (
                    <FlatList
                      data={subCategoryList}
                      renderItem={subCategoryRender}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  )}
              </>
            )}
          </View>
        </View>
      </Modal>

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

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
    label: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
      fontSize: 16,
      marginBottom: 10,
    },
    input: {
      backgroundColor: isDarkMode ? '#333333' : '#DDDDDD',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      padding: 10,
      borderRadius: 5,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
    },
    skillContainer: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#FFFFFF' : '#000000',
      borderRadius: 5,
      padding: 10,
      margin: 5,
    },
    skill: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
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
    calendarContainer: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#FFFFFF' : '#000000',
      borderRadius: 5,
      marginBottom: 20,
    },
    timeSlot: {
      marginBottom: 20,
    },
    dateHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateText: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    removeText: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
      fontSize: 18,
    },
    timeInputs: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeInput: {
      backgroundColor: isDarkMode ? '#333333' : '#DDDDDD',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      padding: 10,
      borderRadius: 5,
      marginRight: 5,
      textAlign: 'center',
    },
    timeSeparator: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginHorizontal: 5,
    },
    dropdownTrigger: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: isDarkMode ? '#FFFFFF' : '#000000',
      borderRadius: 5,
      textAlign: 'center',
      marginBottom: 20,
    },
    closeIcon: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    dropdownContent: {
      position: 'absolute',
      bottom: 0,
      borderTopStartRadius: 35,
      borderTopEndRadius: 35,
      left: 0,
      right: 0,
      backgroundColor: isDarkMode ? '#DDDDDD' : '#333333', // Light in dark mode, dark in light mode
      borderRadius: 5,
      borderWidth: 1,
      borderColor: isDarkMode ? '#FFFFFF' : '#000000',
      padding: 10,
      zIndex: 1000,
      overflow: 'hidden',
    },
    headingtext: {
      fontWeight: 'bold',
      fontSize: 25,
      color: isDarkMode ? '#000000' : '#FFFFFF',
      marginBottom: 25,
      top: 10,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
    },
    text: {
      color: isDarkMode ? '#000000' : '#FFFFFF',
      fontSize: 16,
      lineHeight: 30,
    },
    logout: {
      color: 'red',
    },
    chevron: {
      marginLeft: 10,
    },
    closeicon: {
      right: 10,
      bottom: 40,
      fontWeight: 'bold',
    },
    rightChevron: {
      alignSelf: 'flex-end',
    },
    rightx: {
      alignSelf: 'flex-end',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      alignItems: 'center',
    },
    errorText: {
      color: 'red',
      fontSize: wp('3.5%'),
    },
  });

export default BookingScreen;
