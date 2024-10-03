import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Modal,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextCount} from '../../Home/chat/masglist';
import useFetch from '../../../hooks/useFetch';
import {RequestedService} from '../../../interfaces/apiResponses';
import {CustomErrorModal, CustomModal, Loader} from '../../../components';
import Empty from '../../../components/Empty';
import {useUserStore} from '../../../store/useUserStore';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';
import {Text as FText} from 'react-native-paper';
import {customTheme} from '../../../custom_theme/customTheme';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {makeApiRequest} from '../../../utils/helpers';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../App';

type ScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Bid'>;
};

type BidRes = {
  message: string;
  data: RequestedService[];
};

type QuoteType = {
  user_id: number | string;

  request_service_id: number;
  provider_id: number;
};

const BidScreen: React.FC<ScreenProps> = ({navigation}) => {
  const colorScheme = useColorScheme();

  const {user, isSubscribed} = useUserStore(state => state);
  const isDarkMode = colorScheme === 'dark';
  const {data, loading, error, fetchData} = useFetch<BidRes>(
    '/get-requested-services',
    'GET',
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Quote Submitted',
    loadingMessage: 'Processing...',
    requestLoading: false,
    showModal: false,
  });

  const quotePayload = useRef<QuoteType | null>(null);

  const handleprofile = () => {
    navigation.navigate('ProfileSetup' as never);
  };
  const handlesetting = () => {
    navigation.navigate('Setting' as never);
  };
  const handleHome = () => {
    navigation.navigate('dashboard' as never);
  };
  const handleChat = () => {
    navigation.navigate('masglist1' as never);
  };
  const handlebooked = () => {
    navigation.navigate('booked1' as never);
  };
  const handlebid = () => {
    navigation.navigate('Bid' as never);
  };
  const handleBid1 = async (payload: QuoteType) => {
    console.log(user);
    if (!isSubscribed) {
      navigation.navigate('Bid1' as never);
      return;
    }

    quotePayload.current = payload;
    const data = {
      ...quotePayload.current,
      quote_message: instructions,
    };

    navigation.navigate('send_quote', {...data});
  };

  return (
    <SafeAreaViewContainer>
      <View
        style={[
          styles.container,
          isDarkMode ? styles.darkContainer : styles.lightContainer,
        ]}>
        <ScrollView
          style={isDarkMode ? styles.containerDark : styles.containerLight}>
          <Text
            style={[
              styles.header,
              isDarkMode ? styles.textDark : styles.textLight,
            ]}>
            Bid to be hired
          </Text>
          <Text
            style={[
              styles.subHeader,
              isDarkMode ? styles.textDark : styles.textLight,
            ]}>
            Here you can see service request from users, compare their needs,
            and select the best fit.
          </Text>

          {loading ? (
            <Loader />
          ) : data === null || data.data.length === 0 ? (
            <Empty />
          ) : error ? (
            <Text>There is an error getting the data.</Text>
          ) : (
            <>
              {data.data.map((job, index) => (
                <View key={index} style={styles.jobCard}>
                  <Text
                    style={[
                      styles.time,
                      isDarkMode ? styles.textDark : styles.textLight,
                    ]}>
                    {new Date(job.created_at).toDateString()}
                  </Text>
                  <Text
                    style={[
                      styles.category,
                      isDarkMode ? styles.textDark : styles.textLight,
                    ]}>
                    {job.category}
                  </Text>
                  <Text
                    style={[
                      styles.description,
                      isDarkMode ? styles.textDark : styles.textLight,
                    ]}>
                    {job.description}
                  </Text>
                  <Text
                    style={[
                      styles.location,
                      isDarkMode ? styles.textDark : styles.textLight,
                      {textTransform: 'capitalize'},
                    ]}>
                    {job.get_user.name}
                  </Text>
                  <Text
                    style={[
                      styles.location,
                      isDarkMode ? styles.textDark : styles.textLight,
                    ]}>
                    {job.get_user.home_address}
                  </Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      handleBid1({
                        user_id: job.user_id,

                        request_service_id: job.id as number,
                        provider_id: user?.id as number,
                      })
                    }>
                    <Text style={styles.buttonText}>SEND QUOTE</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </ScrollView>
        <View
          style={[
            styles.footer,
            {backgroundColor: isDarkMode ? '#021114' : '#FFF'},
          ]}>
          <TouchableOpacity style={styles.footerItem} onPress={handleHome}>
            <Icon
              name="home-outline"
              size={wp('7%')}
              color={isDarkMode ? '#FFF' : '#000'}
            />
            <Text
              style={[
                styles.footerText,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}>
              HOME
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={handlebooked}>
            <Icon
              name="calendar-check-outline"
              size={wp('7%')}
              color={isDarkMode ? '#FFF' : '#000'}
            />
            <Text
              style={[
                styles.footerText,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}>
              BOOKED
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={handleChat}>
            <Icon
              name="chat-processing-outline"
              size={wp('7%')}
              color={isDarkMode ? '#FFF' : '#000'}
            />
            <View style={{position: 'absolute', top: 0, right: -4}}>
              <TextCount />
            </View>
            <Text
              style={[
                styles.footerText,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}>
              MESSAGE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={handlebid}>
            <Icon
              name="briefcase-variant-outline"
              size={wp('7%')}
              color={isDarkMode ? '#FFF' : '#000'}
            />
            <Text
              style={[
                styles.footerText,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}>
              BID
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={handleprofile}>
            <Icon
              name="account-outline"
              size={wp('7%')}
              color={isDarkMode ? '#FFF' : '#000'}
            />
            <Text
              style={[
                styles.footerText,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}>
              PROFILE
            </Text>
          </TouchableOpacity>
        </View>

        <CustomModal {...showSuccessModal} />
        <CustomErrorModal
          {...showErrorModal}
          closeModal={() =>
            setShowErrorModal({...showErrorModal, isModalOpen: false})
          }
        />
      </View>
    </SafeAreaViewContainer>
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
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
  },
  subHeader: {
    fontSize: wp('4.7%'),
    marginBottom: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    paddingBottom: wp('5%'),
  },
  jobCard: {
    marginBottom: wp('5%'),
    paddingBottom: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  time: {
    fontSize: wp('3%'),
    marginBottom: wp('1%'),
  },
  category: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
    textTransform: 'capitalize',
  },
  description: {
    fontSize: wp('4.5%'),
    marginBottom: wp('2%'),
  },
  location: {
    fontSize: wp('3.5%'),
    marginBottom: wp('3%'),
  },
  button: {
    backgroundColor: '#00f2ea',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  textLight: {
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Default light mode background color
    paddingVertical: hp('1%'),
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: wp('3%'),
    color: '#000', // Default light mode text color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#12ccb7',
    borderWidth: 1,
    borderRadius: wp('2%'),
    paddingBottom: hp('5%'),
    paddingTop: hp('0%'),
    marginTop: hp('0%'),
    marginBottom: hp('1%'),
    paddingVertical: hp('5%'),
    paddingHorizontal: wp('4%'),
  },
});

export default BidScreen;
