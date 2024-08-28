import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Card} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios'; // Import axios if using it
import {makeApiRequest} from '../../utils/helpers';
import {CustomErrorModal, CustomModal} from '../../components';
import {useUserStore} from '../../store/useUserStore';

const serviceCategories = [
  'Home Improvement',
  'Business',
  'IT and Graphic Design',
  'Wellness',
  'Pets',
  'Events',
  'Troubleshooting and Repair',
  'Lessons',
  'Personal',
  'Legal',
];

const isCategory = (category: string) => {
  console.log('selected', serviceCategories.includes(category));
  return serviceCategories.includes(category);
};

const RequestServiceScreen = () => {
  const [instructions, setInstructions] = useState('');
  const [instructionsLength, setInstructionsLength] = useState(0);
  const isDarkMode = useColorScheme() === 'dark';
  const [bookVisible, setBookVisible] = useState(false);
  const [sortValue, setSortValue] = useState('rating');
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServiceOption, setSelectedServiceOption] = useState(
    'Select service categories',
  );
  const [services, setServices] = useState<any[]>([]); // State to store services
  const [loading, setLoading] = useState(true); // State to handle loading
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });
  const {user} = useUserStore(state => state);

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Service Request Successful',
    loadingMessage: 'Sending request..',
    requestLoading: false,
    showModal: false,
  });

  useEffect(() => {
    // Fetch services when the component mounts
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://beatask.cloud/get-requested-services',
      );
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstructionsChange = (text: string) => {
    if (text.length <= 100) {
      setInstructions(text);
      setInstructionsLength(text.length);
    }
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setBookVisible(false);
    // Add sorting logic here
  };

  const handlePost = async () => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const {data, error} = await makeApiRequest('request-service', 'POST', {
      category: selectedServiceOption,
      description: instructions,
      user_id: user?.id,
    });
    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Unable to send request',
        errorMessage: error.msg,
        isModalOpen: true,
      });

      if (data) {
        setShowSuccessModal({
          ...showSuccessModal,
          requestLoading: false,
          showModal: true,
        });
        setInstructions('');
        setTimeout(() => {
          setShowSuccessModal({
            ...showSuccessModal,
            showModal: false,
          });
        }, 2000);
      }
    }

    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate('Home' as never);
    }, 5000);
  };

  const toggleBookModal = () => {
    setBookVisible(!bookVisible);
  };

  const handleServiceOptionSelect = (option: string) => {
    setSelectedServiceOption(option);
    toggleBookModal();
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#000000' : '#FFFFFF'},
      ]}>
      <Text style={[styles.title, {color: isDarkMode ? '#FFFFFF' : '#000000'}]}>
        Request a service
      </Text>
      <Text
        style={[styles.subtitle, {color: isDarkMode ? '#FFFFFF' : '#000000'}]}>
        Here you can make a service request, specifying your needs and
        requirements. Service providers will be able to view and submit bids.
        You can compare offers, and select the best fit.
      </Text>
      <Text style={[styles.label, {color: isDarkMode ? '#FFFFFF' : '#000000'}]}>
        Service category
      </Text>
      <TouchableOpacity
        style={[
          styles.dropdown,
          {backgroundColor: isDarkMode ? '#333333' : '#CCCCCC'},
        ]}
        onPress={toggleBookModal}>
        <Text style={{color: isDarkMode ? '#CCCCCC' : '#333333'}}>
          {selectedServiceOption}
        </Text>
      </TouchableOpacity>
      <Card
        style={[
          styles.card,
          {backgroundColor: isDarkMode ? '#333333' : '#FFFFFF'},
        ]}>
        <Text
          style={[styles.header, {color: isDarkMode ? '#FFFFFF' : '#000000'}]}>
          Description
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: '#12ccb7',
              color: isDarkMode ? '#FFFFFF' : '#000000',
              backgroundColor: isDarkMode ? '#51514C' : '#FFFFFF',
              textAlignVertical: 'top',
              marginTop: hp('2%'),
              paddingTop: hp('2%'),
            },
          ]}
          value={instructions}
          onChangeText={handleInstructionsChange}
          placeholder="Write a description"
          placeholderTextColor={isDarkMode ? '#CCCCCC' : '#707070'}
          multiline
          numberOfLines={4}
        />
        <Text
          style={[
            styles.charCount,
            {color: isDarkMode ? '#CCCCCC' : '#707070'},
          ]}>
          {instructionsLength}/100
        </Text>
      </Card>
      <TouchableOpacity
        style={[
          styles.postButton,
          {
            backgroundColor:
              instructionsLength === 0 || !isCategory(selectedServiceOption)
                ? '#cccccc'
                : '#12ccb7',
          },
        ]}
        disabled={
          instructionsLength === 0 || !isCategory(selectedServiceOption)
        }
        onPress={handlePost}>
        <Text style={styles.postButtonText}>POST</Text>
      </TouchableOpacity>
      <Modal visible={bookVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeading}>
              <Text style={styles.modalHeadingText}>Service categories</Text>
              <TouchableOpacity onPress={toggleBookModal}>
                <Icon name="close" size={24} color="#010A0C" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: hp('30%'), width: '100%'}}>
              {serviceCategories.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => handleServiceOptionSelect(option)}>
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent1}>
            <Image
              source={require('../../assets/images/verified.png')}
              style={styles.modalIcon}
            />
            <Text style={styles.modalText}>Posted</Text>
            <Text style={styles.modalSubText}>Request Posted</Text>
          </View>
        </View>
      </Modal>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {!loading && services.length > 0 && (
        <ScrollView style={styles.servicesList}>
          {services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>
                {service.description}
              </Text>
            </View>
          ))}

          <CustomModal {...showSuccessModal} />
          <CustomErrorModal
            {...showErrorModal}
            closeModal={() =>
              setShowErrorModal({...showErrorModal, isModalOpen: false})
            }
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: wp('3.5%'),
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: wp('5%'),
    marginBottom: hp('1%'),
  },
  dropdown: {
    height: hp('7%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
  },
  card: {
    padding: wp('4%'),
    marginBottom: hp('2%'),
  },
  header: {
    fontSize: wp('4.5%'),
    marginBottom: hp('1%'),
  },
  input: {
    borderWidth: 1,
    borderRadius: wp('2%'),
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('4%'),
    marginTop: hp('1%'),
  },
  charCount: {
    alignSelf: 'flex-end',
    marginTop: hp('1%'),
  },
  postButton: {
    backgroundColor: '#12ccb7',
    borderRadius: wp('12%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('25%'),
    marginTop: hp('5%'),
  },
  postButtonText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: wp('5%'),
    borderTopLeftRadius: wp('10%'),
    borderTopRightRadius: wp('10%'),
    alignItems: 'center',
  },
  modalContent1: {
    backgroundColor: '#fff',
    padding: wp('5%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    marginHorizontal: wp('15%'),
  },
  modalHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalHeadingText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#010A0C',
  },
  modalOption: {
    paddingVertical: hp('2%'),
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: wp('4%'),
    color: '#010A0C',
  },
  modalIcon: {
    width: wp('8%'),
    height: hp('4%'),
    marginBottom: '2%',
  },
  modalText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('2%'),
    color: '#000',
  },
  modalSubText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('1%'),
    color: '#000',
  },
  servicesList: {
    marginTop: hp('2%'),
  },
  serviceItem: {
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  serviceTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: wp('3.5%'),
  },
});

export default RequestServiceScreen;
