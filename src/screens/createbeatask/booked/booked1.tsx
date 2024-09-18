import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {TextCount} from '../../Home/chat/masglist';
import useFetch from '../../../hooks/useFetch';
import {CustomErrorModal, CustomModal, Loader} from '../../../components';
import Empty from '../../../components/Empty';
import {
  CompletedServiceProvider,
  IncomingService,
  UnsuccessfulRequest,
  UpcomingService,
} from '../../../interfaces/apiResponses';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../App';
import {convertStringToArray} from '../../../utils/helperFunc';
import {makeApiRequest} from '../../../utils/helpers';
import {useUserStore} from '../../../store/useUserStore';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';

type UnsuccessfulRes = {
  message: string;
  data: UpcomingService[];
};
type CompletedRes = {
  message: string;
  data: CompletedServiceProvider[];
};

type IncomingRes = {
  message: string;
  services: IncomingService[];
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'booked1'>;
};

const App: React.FC<Props> = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState('Incoming'); // Default to "Incoming" tab
  const isDarkMode = useColorScheme() === 'dark';
  const {user} = useUserStore(state => state);
  console.log(user?.id);
  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Service Booked',
    loadingMessage: 'processing..',
    requestLoading: false,
    showModal: false,
  });
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const {
    data: completed,
    loading: completedLoading,
    error: completedError,
  } = useFetch<CompletedRes>('/completed-services-provider', 'POST', {
    provider_id: user?.id,
  });
  const {
    data: incoming,
    loading: incomingLoading,
    error: incomingError,
  } = useFetch<IncomingRes>('/incoming-services', 'POST', {
    provider_id: user?.id,
  });
  const {
    data: cancelled,
    loading: cancelledLoading,
    error: cancelledError,
  } = useFetch<UnsuccessfulRes>('/unsuccessful-services-provider', 'POST', {
    provider_id: user?.id,
  });

  const handleProfile = () => {
    navigation.navigate('ProfileSetup' as never);
  };
  const handlechat = () => {
    navigation.navigate('Chat' as never);
  };
  const handleHome = () => {
    navigation.navigate('dashboard' as never);
  };
  const handlebooked = () => {
    navigation.navigate('booked1' as never);
  };
  const handleChat = () => {
    navigation.navigate('masglist1' as never);
  };
  const handlebid = () => {
    navigation.navigate('Bid' as never);
  };

  const handleConfirm = async (id: number) => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const {data, error} = await makeApiRequest('/confirm-booking', 'POST', {
      booking_id: id,
    });

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Booking Failed',
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
        navigation.navigate('dashboard');
      }, 2000);
    }
  };

  const handleReject = async (id: number) => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
      successMessage: 'Booking Rejected',
    });
    const {data, error} = await makeApiRequest('/reject-booking', 'POST', {
      booking_id: id,
    });

    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Could not reject booking',
        errorMessage: error.msg,
        isModalOpen: true,
      });
    }

    if (data) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: true,
        successMessage: 'Booking Rejected',
      });

      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          showModal: false,
        });
        navigation.navigate('dashboard');
      }, 2000);
    }
  };

  return (
    <SafeAreaViewContainer edges={['right', 'bottom', 'left']}>
      <View
        style={[
          styles.container,
          {backgroundColor: isDarkMode ? '#010A0C' : '#FFF'},
        ]}>
        <View style={styles.tabsContainer}>
          {['Incoming', 'Complete', 'Cancelled'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab(tab)}>
              <Text
                style={[
                  styles.tabButtonText,
                  {color: isDarkMode ? '#FFF' : '#000'},
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView contentContainerStyle={styles.cardsContainer}>
          {selectedTab === 'Incoming' && (
            <>
              {incomingLoading ? (
                <Loader />
              ) : incomingError ? (
                <Text>An Error Occurred</Text>
              ) : incoming === null || incoming.services.length === 0 ? (
                <Empty />
              ) : (
                <View style={{gap: 30}}>
                  {incoming.services.map((item, index) => {
                    const convertedArray = convertStringToArray(
                      item.dates_and_times,
                    );
                    return (
                      <View key={item.id} style={{marginVertical: 20}}>
                        <View style={[styles.card]}>
                          <Image
                            source={{uri: item.service.service_image}}
                            style={styles.cardImage}
                          />
                          <View style={styles.cardContent}>
                            <Text
                              style={[
                                styles.cardTitle,
                                {color: isDarkMode ? '#FFF' : '#000'},
                              ]}>
                              {item.user.name}
                            </Text>
                            <Text
                              style={[
                                styles.cardStatus,
                                {color: isDarkMode ? '#FFF' : '#000'},
                              ]}>
                              {item.service.service_name}
                            </Text>
                            <Text
                              style={[
                                styles.cardSubtitle,
                                {color: isDarkMode ? '#CCC' : '#666'},
                              ]}>
                              {item.service.service_description}
                            </Text>
                            <View style={styles.cardFooter}>
                              <Text style={styles.cardCompleted}>
                                {item.service.is_completed ? 'Completed' : ''}
                              </Text>
                              <Text
                                style={[
                                  styles.cardDate,
                                  {color: isDarkMode ? '#FFF' : '#000'},
                                ]}>
                                On {new Date(item.created_at).toDateString()}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={styles.chatButton}
                            onPress={() =>
                              navigation.navigate('Chat', {
                                chatId: '',
                                providerId: user?.email as string,
                                providerName: user?.name as string,
                                providerAvatar: user?.profile_image as string,
                                customerId: item.user.email,
                                customerName: item.user.name,
                                customerAvatar: item.user.profile_image,
                              })
                            }>
                            <Icon
                              name="chat-processing-outline"
                              size={wp('7%')}
                              color={isDarkMode ? '#FFF' : '#000'}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.hr]}>
                          <View style={styles.bookingCardContent}>
                            <Text
                              style={[
                                styles.cardInfo,
                                isDarkMode ? styles.darkText : styles.lightText,
                              ]}>
                              Date & Time:{' '}
                            </Text>
                            <Text
                              style={[
                                styles.cardInfo,
                                isDarkMode ? styles.darkText : styles.lightText,
                              ]}>
                              {`${convertedArray[0]} \n to \n ${convertedArray[1]}`}
                            </Text>
                          </View>
                          <View style={styles.bookingCardContent}>
                            <Text
                              style={[
                                styles.cardInfo,
                                isDarkMode ? styles.darkText : styles.lightText,
                              ]}>
                              Location:
                            </Text>
                            <Text
                              style={[
                                styles.cardInfo,
                                isDarkMode ? styles.darkText : styles.lightText,
                              ]}>
                              {item.user.home_address}
                            </Text>
                          </View>
                          <TouchableOpacity>
                            <Text style={styles.mapLink}>
                              View map location
                            </Text>
                          </TouchableOpacity>
                          <View style={styles.bookingCardContent}>
                            <TouchableOpacity
                              style={styles.button1}
                              onPress={() => handleReject(item.id)}>
                              <Text style={styles.buttonText1}>REJECT</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() => handleConfirm(item.id)}>
                              <Text style={styles.buttonText}>CONFIRM</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}

          {selectedTab === 'Complete' && (
            <>
              {completedLoading ? (
                <Loader />
              ) : completedError ? (
                <Text>An Error Occurred</Text>
              ) : completed === null || completed.data.length === 0 ? (
                <Empty />
              ) : (
                <View style={{gap: 10}}>
                  {completed.data.map(item => (
                    <View style={styles.card} key={item.id}>
                      <Image
                        source={{uri: item.service.service_image}}
                        style={styles.cardImage}
                      />
                      <View style={styles.cardContent}>
                        <Text
                          style={[
                            styles.cardTitle,
                            {color: isDarkMode ? '#FFF' : '#000'},
                          ]}>
                          {item.user.name}
                        </Text>
                        <Text
                          style={[
                            styles.cardStatus,
                            {color: isDarkMode ? '#FFF' : '#000'},
                          ]}>
                          {item.service.service_name}
                        </Text>
                        <Text
                          style={[
                            styles.cardSubtitle,
                            {color: isDarkMode ? '#CCC' : '#666'},
                          ]}>
                          {item.service.sub_category}
                        </Text>
                        <View style={styles.cardFooter2}>
                          <Text
                            style={[
                              styles.cardDate,
                              {color: isDarkMode ? '#FFF' : '#000'},
                            ]}>
                            On {new Date(item.created_at).toDateString()}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() =>
                          navigation.navigate('Chat', {
                            chatId: '',
                            providerId: user?.email as string,
                            providerName: user?.name as string,
                            providerAvatar: user?.profile_image as string,
                            customerId: item.user.email,
                            customerName: item.user.name,
                            customerAvatar: item.user.profile_image,
                          })
                        }>
                        <Icon
                          name="chat-processing-outline"
                          size={wp('7%')}
                          color={isDarkMode ? '#FFF' : '#000'}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          {selectedTab === 'Cancelled' && (
            <>
              {cancelledLoading ? (
                <Loader />
              ) : cancelledError ? (
                <Text>An Error Occurred</Text>
              ) : cancelled === null || cancelled.data.length === 0 ? (
                <Empty />
              ) : (
                <>
                  {cancelled.data.map(item => (
                    <View style={styles.card} key={item.id}>
                      <Image
                        source={{uri: item.service.service_image}}
                        style={styles.cardImage}
                      />
                      <View style={styles.cardContent}>
                        <Text
                          style={[
                            styles.cardTitle1,
                            {color: isDarkMode ? '#FF0000' : '#FF0000'},
                          ]}>
                          {item.user.name}
                        </Text>
                        <Text
                          style={[
                            styles.cardStatus1,
                            {color: isDarkMode ? '#FF0000' : '#FF0000'},
                          ]}>
                          {item.service.service_name}
                        </Text>
                        <Text
                          style={[
                            styles.cardSubtitle1,
                            {color: isDarkMode ? '#FF0000' : '#FF0000'},
                          ]}>
                          {item.description}
                        </Text>
                        <View style={styles.cardFooter}>
                          <Text
                            style={[
                              styles.cardDate,
                              {color: isDarkMode ? '#FF0000' : '#FF0000'},
                            ]}>
                            On {new Date(item.created_at).toDateString()}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() =>
                          navigation.navigate('Chat', {
                            chatId: '',
                            providerId: user?.email as string,
                            providerName: user?.name as string,
                            providerAvatar: user?.profile_image as string,
                            customerId: item.user.email,
                            customerName: item.user.name,
                            customerAvatar: item.user.profile_image,
                          })
                        }>
                        <Icon
                          name="chat-processing-outline"
                          size={wp('7%')}
                          color={isDarkMode ? '#FFF' : '#000'}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}
            </>
          )}
          <CustomModal {...showSuccessModal} />
          <CustomErrorModal
            {...showErrorModal}
            closeModal={() =>
              setShowErrorModal({...showErrorModal, isModalOpen: false})
            }
          />
        </ScrollView>
        <View style={[{marginTop: hp('2%')}]} />
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
                {color: isDarkMode ? '#FFF' : '#000'},
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
                {color: isDarkMode ? '#FFF' : '#000'},
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
                {color: isDarkMode ? '#FFF' : '#000'},
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
                {color: isDarkMode ? '#FFF' : '#000'},
              ]}>
              BID
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={handleProfile}>
            <Icons
              name="user"
              size={wp('7%')}
              color={isDarkMode ? '#FFF' : '#000'}
            />
            <Text
              style={[
                styles.footerText,
                {color: isDarkMode ? '#FFF' : '#000'},
              ]}>
              PROFILE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaViewContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010A0C',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp('1%'),
  },
  tabButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('5%'),
    borderColor: '#12CCB7',
    borderWidth: 1,
  },
  activeTabButton: {
    backgroundColor: '#12CCB7',
    borderColor: '#12CCB7',
    borderWidth: 1,
  },
  tabButtonText: {
    color: '#FFF',
    fontSize: wp('4%'),
  },
  hr: {
    width: wp('90%'),
    borderTopWidth: 2,
    borderColor: '#666',
    // backgroundColor: '#CCC',
    alignSelf: 'center',
    marginVertical: hp('1%'),
  },
  bookingCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp('2.5%'),
  },
  cardInfo: {
    fontSize: wp('4%'),
    marginBottom: hp('0.5%'),
    alignSelf: 'center',
    fontWeight: '500',
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
  button1: {
    borderColor: '#00f2ea',
    borderWidth: 1,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: 30,
    alignSelf: 'center',
  },
  buttonText1: {
    color: '#00f2ea',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  mapLink: {
    fontSize: wp('4%'),
    paddingTop: hp('1%'),
    marginBottom: hp('1%'),
    color: '#00BCD4',
    alignSelf: 'flex-end',
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  cardsContainer: {
    padding: wp('2%'),
  },
  card: {
    borderRadius: wp('3%'),
    overflow: 'hidden',
    marginBottom: wp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('2%'),
  },
  cardImage: {
    width: wp('30%'),
    height: hp('15%'),
    borderRadius: wp('3%'),
    marginRight: wp('2%'),
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
  },
  cardSubtitle: {
    color: '#CCC',
    fontSize: wp('3%'),
    marginBottom: wp('2%'),
  },
  cardStatus: {
    fontSize: wp('4%'),
    marginBottom: wp('2%'),
  },
  cardTitle1: {
    color: 'red',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
  },
  cardSubtitle1: {
    color: '#CCC',
    fontSize: wp('3%'),
    marginBottom: wp('2%'),
  },
  cardStatus1: {
    fontSize: wp('4%'),
    marginBottom: wp('2%'),
  },
  cardFooter: {
    flexDirection: 'column',
  },
  cardFooter2: {
    flexDirection: 'column',
  },
  cardCompleted: {
    color: '#12CCB7',
    fontSize: wp('4%'),
    marginBottom: wp('2%'),
  },
  cardunsuccessful2: {
    color: '#FF0000',
    fontSize: wp('4%'),
    marginBottom: wp('2%'),
  },
  cardDate: {
    fontSize: wp('3%'),
  },
  chatButton: {
    padding: wp('2%'),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp('1%'),
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
  },
});

export default App;
