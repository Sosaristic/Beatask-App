import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import {Button, Text, Card} from 'react-native-paper';
import {Calendar} from 'react-native-calendars';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RouteProp} from '@react-navigation/native';
import {CustomErrorModal, CustomModal, Loader} from '../../../components';
import {makeApiRequest} from '../../../utils/helpers';
import {RootStackParamList} from '../../../../App';
import useFetch from '../../../hooks/useFetch';
import {BookingPriceResponse} from '../../../interfaces/apiResponses';
import {StackNavigationProp} from '@react-navigation/stack';
import {customTheme} from '../../../custom_theme/customTheme';
import {useUserStore} from '../../../store/useUserStore';

type Props = {
  route: RouteProp<RootStackParamList, 'calenderbook'>;
  navigation: StackNavigationProp<RootStackParamList, 'calenderbook'>;
};

const userTimeSlots = [
  {time: '08:00 AM', selected: false},
  {time: '09:00 AM', selected: false},
  {time: '10:00 AM', selected: false},
  {time: '11:00 AM', selected: false},
  {time: '12:00 PM', selected: false},
  {time: '01:00 PM', selected: false},
  {time: '02:00 PM', selected: false},
  {time: '03:00 PM', selected: false},
  {time: '04:00 PM', selected: false},
  {time: '05:00 PM', selected: false},
  {time: '06:00 PM', selected: false},
];

type BookedDates = {
  [key: string]: {
    selected: boolean;
    marked: boolean;
    selectedColor: string;
    time: string;
  };
};

const CleaningServiceRequest: React.FC<Props> = ({route, navigation}) => {
  const {data} = route.params;
  const {user} = useUserStore(state => state);

  const [instructions, setInstructions] = useState('');
  const [instructionsLength, setInstructionsLength] = useState(0);
  const {
    loading,
    error,
    data: bookingPrice,
  } = useFetch<BookingPriceResponse>('/get-service-price', 'POST', {
    id: data.service_id,
  });

  const [bookDate, setBookDate] = useState(
    new Date().toISOString().split('T')[0],
  );

  const [bookedDates, setBookedDates] = useState<BookedDates>({
    [bookDate]: {
      selected: true,
      marked: true,
      selectedColor: customTheme.primaryColor,
      time: '08:00 AM',
    },
  });

  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Booking Successful',
    loadingMessage: 'Processing',
    requestLoading: false,
    showModal: false,
  });

  const handleSend = async () => {
    const chosenDatesAndTime: string[] = [];

    for (const [key, value] of Object.entries(bookedDates)) {
      chosenDatesAndTime.push(`${key} ${value.time}`);
    }

    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });

    const {data: BookingResponse, error} = await makeApiRequest(
      '/book-services',
      'POST',
      {
        provider_id: data.provider_id,
        service_id: data.service_id,
        category_id: data.category_id,
        dates_and_times: chosenDatesAndTime,
        description: instructions,
        user_id: user?.id,
      },
    );

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Unable to Book Provider',
        errorMessage: error.msg,
        isModalOpen: true,
      });
    }
    if (BookingResponse) {
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
        navigation.navigate('payment', {data});
      }, 2000);
    }
  };
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleCalendarChange = (day: {dateString: string}) => {
    const bookedDatesPayload = {...bookedDates};
    if (Object.hasOwn(bookedDatesPayload, day.dateString)) {
      delete bookedDatesPayload[day.dateString];
    } else {
      bookedDatesPayload[day.dateString] = {
        selected: true,
        marked: true,
        selectedColor: customTheme.primaryColor,
        time: '08:00 AM',
      };
    }
    setBookedDates(bookedDatesPayload);
  };

  const handleChoosenTime = (time: string, date: string) => {
    setBookedDates(prevBookedDates => {
      const newBookedDates = {...prevBookedDates};
      newBookedDates[date].time = time;
      return newBookedDates;
    });
  };

  const handleInstructionsChange = (text: string) => {
    if (text.length <= 100) {
      setInstructions(text);
      setInstructionsLength(text.length);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleString('default', {weekday: 'long'});
    const dayOfMonth = date.getDate();
    const month = date.toLocaleString('default', {month: 'long'});
    const year = date.getFullYear();

    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    const ordinalSuffix = getOrdinalSuffix(dayOfMonth);

    return `${dayOfWeek} ${dayOfMonth}${ordinalSuffix} ${month} ${year}`;
  };

  const styles = getStyles(isDarkMode);

  if (loading) return <Loader />;

  if (error)
    return (
      <View>
        <Text style={styles.errorText}>An Error Occurred</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.header}>Select date</Text>
        <Calendar
          onDayPress={handleCalendarChange}
          markedDates={{...bookedDates}}
          current={new Date().toISOString().split('T')[0]}
        />
        <View style={styles.selectedDatesContainer}>
          {Object.keys(bookedDates).map(date => (
            <View key={date} style={styles.selectedDateContainer}>
              <Text style={styles.selectedDate}>{formatDate(date)}</Text>
              <ScrollView
                horizontal
                contentContainerStyle={styles.timeButtonsContainer}>
                {userTimeSlots.map(time => (
                  <Button
                    key={time.time}
                    onPress={() => handleChoosenTime(time.time, date)}
                    style={[
                      styles.timeButton,
                      bookedDates[date].time === time.time
                        ? styles.selectedButton
                        : styles.unselectedButton,
                    ]}>
                    {time.time}
                  </Button>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
      </Card>
      <Card style={styles.card}>
        <Text style={[styles.header, {textAlign: 'left'}]}>
          Service details
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={styles.total}>Category:</Text>
            <Text style={styles.total}>Sub-category:</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={[styles.total, {textTransform: 'capitalize'}]}>
              {data.category_name}
            </Text>
            <Text style={[styles.total, {textTransform: 'capitalize'}]}>
              {data.sub_category_name}
            </Text>
          </View>
        </View>
      </Card>
      <Card style={styles.card1}>
        <Text style={styles.header}>Any specific instructions?</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: '#12ccb7',
              color: isDarkMode ? '#FFFFFF' : '#000000',
              backgroundColor: isDarkMode ? '#51514C' : '#FFFFFF',
              textAlignVertical: 'top', // Align text and placeholder to the top
              marginTop: hp('2%'), // Ensure no top margin
              paddingTop: hp('2%'), // Ensure no top padding
            },
          ]}
          value={instructions}
          onChangeText={handleInstructionsChange}
          placeholder="Enter instructions"
          placeholderTextColor={isDarkMode ? '#CCCCCC' : '#707070'}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.charCount}>{instructionsLength}/100</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={[styles.header, {textAlign: 'left'}]}>Total cost</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={styles.total}>Booking fee:</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.total}>
              ${bookingPrice?.beatask_service_fee}
            </Text>
          </View>
        </View>
      </Card>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../../assets/images/verified.png')}
              style={styles.modalIcon}
            />
            <Text style={styles.modalText}>Sent request</Text>
            <Text style={styles.modalSubText}>
              Your service request has been sent to the service provider. Await
              accept/reject notification soon.
            </Text>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>SEND REQUEST</Text>
      </TouchableOpacity>

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
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: wp('4%'),
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    card: {
      width: '100%',
      padding: wp('4%'),
      marginBottom: hp('2%'),
      backgroundColor: isDarkMode ? '#021114' : '#fff',
    },
    card1: {
      width: '100%',
      padding: wp('4%'),
      marginBottom: hp('2%'),
      backgroundColor: isDarkMode ? '#333' : '#fff',
    },
    total: {
      color: isDarkMode ? '#fff' : '#000',
      textAlign: 'left',
      marginVertical: hp('0.5%'),
      fontSize: wp('4%'),
    },
    header: {
      fontSize: wp('4.5%'),
      marginVertical: hp('1%'),
      color: isDarkMode ? '#fff' : '#000',
    },
    selectedDatesContainer: {
      marginVertical: hp('1%'),
    },
    selectedDateContainer: {
      marginBottom: hp('2%'),
    },
    selectedDate: {
      fontSize: wp('4%'),
      color: '#12CCB7',
    },
    timeButtonsContainer: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      marginVertical: hp('1%'),
    },
    timeButton: {
      margin: wp('1%'),
    },
    input: {
      borderColor: '#12ccb7',
      borderWidth: 1,
      borderRadius: wp('2%'),
      paddingBottom: hp('5%'),
      paddingTop: hp('0%'),
      marginTop: hp('0%'),
      marginBottom: hp('1%'),
      color: isDarkMode ? '#FFF' : '#000',
      backgroundColor: isDarkMode ? '#51514C' : '#fff',
      paddingVertical: hp('5%'),
      paddingHorizontal: wp('4%'),
    },
    charCount: {
      alignSelf: 'flex-end',
      color: isDarkMode ? '#fff' : '#000',
    },
    sendButton: {
      backgroundColor: '#12CCB7',
      paddingVertical: hp('2%'),
      paddingHorizontal: hp('8%'),
      borderRadius: wp('10%'),
      alignItems: 'center',
      marginTop: hp('4%'),
      marginHorizontal: wp('1%'),
    },
    sendButtonText: {
      color: '#000',
      fontSize: wp('4%'),
      fontWeight: 'bold',
    },
    modalIcon: {
      width: 45,
      height: 45,
      marginBottom: '2%',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
      backgroundColor: '#fff',
      width: '80%',
      paddingHorizontal: '5%',
      paddingVertical: '3%',
      alignItems: 'center',
      borderRadius: wp('5%'),
    },
    modalText: {
      fontSize: wp('4%'), // Adjust font size based on window width
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: hp('2%'), // Adjust margin as a percentage of the screen height
      color: '#000',
    },
    modalSubText: {
      fontSize: wp('4%'),
      textAlign: 'center',
      marginBottom: hp('1%'),
      color: '#000',
    },

    selectedButton: {
      backgroundColor: '#12CCB7',
      borderWidth: 1,
      borderColor: '#12CCB7',
    },
    unselectedButton: {
      backgroundColor: 'transparent',
      borderColor: '#12CCB7',
      borderWidth: 1,
    },
    selectedText: {
      color: isDarkMode ? '#FFF' : '#000', // Text color for selected state
    },
    unselectedText: {
      color: isDarkMode ? '#FFF' : '#000', // Text color for unselected state
    },
    errorText: {
      color: isDarkMode ? '#FFF' : '#000',
    },
  });

export default CleaningServiceRequest;
