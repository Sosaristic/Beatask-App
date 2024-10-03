import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {useUserStore} from '../../../store/useUserStore';
import {TextCount} from '../../Home/chat/masglist';
import useFetch from '../../../hooks/useFetch';
import {PendingTask, UpcomingService} from '../../../interfaces/apiResponses';
import Empty from '../../../components/Empty';
import {convertStringToArray} from '../../../utils/helperFunc';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../App';
import {customTheme} from '../../../custom_theme/customTheme';
import {Modal} from 'react-native';
import {makeApiRequest} from '../../../utils/helpers';
import {TextInput} from 'react-native';
import {CustomErrorModal, CustomModal} from '../../../components';
import {Text as FText} from 'react-native-paper';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';
import {useFocusEffect} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import useCustomQuery from '../../../hooks/useCustomQuery';

type CardProps = {
  children: React.ReactNode;
  style?: any; // Change this to a more specific type if needed
};

const Card: React.FC<CardProps> = ({children, style}) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const greetingTime = new Date().getHours();

const getGreeting = () => {
  if (greetingTime < 12) {
    return 'Good Morning';
  } else if (greetingTime < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

type UpcomingRes = {
  message: string;
  data: UpcomingService[];
};

type PendingTaskRes = {
  message: string;
  data: PendingTask[];
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'dashboard'>;
};

type RequestCompleteType = {
  user_id: number | string;
  booking_id: number | string;
  provider_id: number;
};

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const requestCompleteData = useRef<RequestCompleteType | null>(null);
  const [requestData, setRequestData] = useState<RequestCompleteType | null>(
    null,
  );
  const [instructions, setInstructions] = useState('');
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Service Complete request Successful',
    loadingMessage: 'Requesting..',
    requestLoading: false,
    showModal: false,
  });

  const {user} = useUserStore(state => state);
  const {
    data,
    loading,
    error,
    fetchData: fetchUpcoming,
  } = useFetch<UpcomingRes>('/upcoming-bookings', 'POST', {
    provider_id: user?.id,
  });

  const {
    data: upcomingResData,
    isLoading: upcomingResLoading,
    error: upcomingResError,
    refetch: upcomingRefetch,
  } = useCustomQuery<UpcomingRes>(['upcoming'], '/upcoming-bookings', 'POST', {
    provider_id: user?.id,
  });

  const {
    data: pendingResData,
    isLoading: pendingResLoading,
    error: pendingResError,
    refetch,
    isFetching,
  } = useCustomQuery<PendingTaskRes>(
    ['pending-tasks'],
    '/pending-tasks',
    'POST',
    {
      provider_id: 2,
    },
  );

  console.log('is fetching', isFetching);

  useFocusEffect(
    useCallback(() => {
      refetch();
      upcomingRefetch();
    }, [refetch]),
  );

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

  const handleServiceCompleteReq = async () => {
    console.log('requestData', requestData);
    const payload = {...requestCompleteData.current, notes: instructions};
    console.log('payload', payload);

    setModalVisible(false);
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const {data, error} = await makeApiRequest(
      '/request-to-complete-service',
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
        errorTitle: 'Error',
        errorMessage: error.msg,
        isModalOpen: true,
      });
    }
    if (data) {
      queryClient.invalidateQueries({queryKey: ['upcoming']});
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
        setInstructions('');
      }, 1000);
    }
  };

  return (
    <SafeAreaViewContainer>
      <View
        style={[
          styles.container,
          isDarkMode ? styles.darkContainer : styles.lightContainer,
        ]}>
        <View style={styles.header}>
          <Image
            source={{uri: user?.profile_image}}
            style={styles.profileImage}
          />
          <View style={{marginLeft: 10}}>
            <FText variant="bodySmall">{getGreeting()}</FText>
            <FText variant="titleMedium" style={{textTransform: 'capitalize'}}>
              {user?.first_legal_name + ' ' + user?.last_legal_name}
            </FText>
          </View>
          <TouchableOpacity style={styles.settingsIcon} onPress={handlesetting}>
            <Ionicons
              name="settings-outline"
              size={wp('6%')}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}>
          Upcoming bookings
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 10}}>
          {upcomingResLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 10,

                width: wp('100%'),
              }}>
              <ActivityIndicator size="large" color="#12CCB7" />
            </View>
          ) : upcomingResError || upcomingResData?.data.length === 0 ? (
            <>
              <Empty height={hp('20%')} />
            </>
          ) : (
            <>
              {upcomingResData?.data.map(item => {
                const dates = convertStringToArray(item.dates_and_times);
                return (
                  <Card
                    key={item.id}
                    style={[
                      styles.bookingCard,
                      isDarkMode ? styles.darkCard : styles.lightCard,
                    ]}>
                    <View style={styles.bookingCardContent}>
                      <Text
                        style={[
                          styles.cardTitle,
                          isDarkMode ? styles.darkText : styles.lightText,
                        ]}>
                        {item.category.category}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 20,
                        }}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Chat', {
                              chatId: '',
                              providerId: user?.email || '',
                              providerName: user?.name || '',
                              providerAvatar: user?.profile_image || '',
                              customerId: item.user.email || '',
                              customerName: item.user.name || '',
                              customerAvatar: item.user.profile_image || '',
                            })
                          }>
                          <Icon
                            name="chat-processing-outline"
                            size={wp('5%')}
                            color={isDarkMode ? 'white' : 'black'}
                            style={styles.chatIcon}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            paddingHorizontal: 10,
                          }}
                          onPress={() => {
                            setModalVisible(true);
                            setRequestData({
                              provider_id: user?.id as number,
                              booking_id: item.id,
                              user_id: item.user.id,
                            });
                            requestCompleteData.current = {
                              provider_id: user?.id as number,
                              booking_id: item.id,
                              user_id: item.user.id,
                            };
                          }}>
                          <FontAwesome
                            name="ellipsis-v"
                            size={wp('5%')}
                            color={isDarkMode ? 'white' : 'black'}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.cardSubtitle,
                        isDarkMode ? styles.darkSubtitle : styles.lightSubtitle,
                      ]}>
                      {item.service.service_name}
                    </Text>
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
                          {flex: 1},
                        ]}>
                        {dates.map((date, index) => (
                          <Text key={index} style={{flex: 1}}>
                            {`${new Date(date).toLocaleString()}`},{' '}
                          </Text>
                        ))}
                      </Text>
                    </View>
                    <View style={styles.bookingCardContent}>
                      <Text
                        style={[
                          styles.cardInfo,
                          isDarkMode ? styles.darkText : styles.lightText,
                        ]}>
                        Customer Name:{' '}
                      </Text>
                      <Text
                        style={[
                          styles.cardInfo,
                          isDarkMode ? styles.darkText : styles.lightText,
                          {textTransform: 'capitalize'},
                        ]}>
                        {item.user.name}
                      </Text>
                    </View>
                    <View style={styles.bookingCardContent}>
                      <Text
                        style={[
                          styles.cardInfo,
                          isDarkMode ? styles.darkText : styles.lightText,
                        ]}>
                        Specific info:
                      </Text>
                      <Text
                        style={[
                          styles.cardInfo,
                          isDarkMode ? styles.darkText : styles.lightText,
                        ]}>
                        {' '}
                        {item.description}
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
                        {item.user.home_address ?? ''}
                      </Text>
                    </View>

                    <View style={styles.cardFooter}>
                      <Text
                        style={[
                          styles.totalCostLabel,
                          isDarkMode
                            ? styles.darkSubtitle
                            : styles.lightSubtitle,
                        ]}>
                        Total cost
                      </Text>
                      <Text
                        style={[
                          styles.totalCost,
                          isDarkMode ? styles.darkText : styles.lightText,
                        ]}>
                        ${item.total_price_before_fee}
                      </Text>
                    </View>
                    <View style={styles.cardFooter}>
                      <Text
                        style={[
                          styles.totalCostLabel,
                          isDarkMode
                            ? styles.darkSubtitle
                            : styles.lightSubtitle,
                        ]}>
                        Service Fee:
                      </Text>
                      <Text
                        style={[
                          styles.totalCost,
                          isDarkMode ? styles.darkText : styles.lightText,
                        ]}>
                        ${item.service_fee.toFixed(2)} (12%)
                      </Text>
                    </View>
                    <View style={styles.cardFooter}>
                      <Text
                        style={[
                          styles.totalCostLabel,
                          isDarkMode
                            ? styles.darkSubtitle
                            : styles.lightSubtitle,
                        ]}>
                        Final You Receive:
                      </Text>
                      <Text
                        style={[
                          styles.totalCost,
                          isDarkMode ? styles.darkText : styles.lightText,
                        ]}>
                        ${item.final_total_price}
                      </Text>
                    </View>
                  </Card>
                );
              })}
            </>
          )}
        </ScrollView>

        <Text
          style={[
            styles.sectionTitle,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}>
          Pending tasks
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{padding: 10, gap: 8}}>
          {pendingResLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 10,

                width: wp('100%'),
              }}>
              <ActivityIndicator size="large" color="#12CCB7" />
            </View>
          ) : pendingResError || pendingResData?.data.length == 0 ? (
            <Empty height={hp('20%')} />
          ) : (
            <>
              {pendingResData?.data.map(item => {
                const dates = convertStringToArray(item.dates_and_times);
                return (
                  <View
                    key={item.id}
                    style={[
                      {width: wp('45%'), padding: wp('2%'), borderRadius: 10},
                      isDarkMode ? styles.darkCard : styles.lightCard,
                    ]}>
                    <View style={styles.bookingCardContent}>
                      <Text
                        style={[
                          styles.cardTitle,
                          isDarkMode ? styles.darkText : styles.lightText,
                        ]}>
                        {item.category.category}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Chat', {
                            chatId: '',
                            providerId: user?.email || '',
                            providerName: user?.name || '',
                            providerAvatar: user?.profile_image || '',
                            customerId: item.user.email,
                            customerName: item.user.name,
                            customerAvatar: item.user.profile_image || '',
                          })
                        }>
                        <Icon
                          name="chat-processing-outline"
                          size={wp('5%')}
                          color={isDarkMode ? 'white' : 'black'}
                          style={styles.chatIcon}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.bookingCardContent}>
                      <Text
                        style={[
                          styles.cardInfo,
                          isDarkMode ? styles.darkText : styles.lightText,
                          {textTransform: 'capitalize'},
                        ]}>
                        {item.user.name}
                      </Text>
                    </View>

                    <Text
                      style={[isDarkMode ? styles.darkText : styles.lightText]}>
                      {`${new Date(dates[0]).toLocaleString()}`}
                    </Text>
                    <Text
                      style={[isDarkMode ? styles.darkText : styles.lightText]}>
                      {' '}
                      -{' '}
                    </Text>
                    <Text
                      style={[isDarkMode ? styles.darkText : styles.lightText]}>
                      {dates[dates.length - 1]}
                    </Text>
                  </View>
                );
              })}
            </>
          )}

          {/* {[...Array(5)].map((_, index) => (
          <Card
            key={index}
            style={[
              styles.taskCard,
              isDarkMode ? styles.darkCard : styles.lightCard,
            ]}>
            <Text
              style={[
                styles.cardTitle,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}>
              Home management
            </Text>
            <Text
              style={[
                styles.cardTitle,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}>
              June 19
            </Text>
            <Text
              style={[
                styles.cardInfo,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}>
              9:00am
            </Text>
            <Text
              style={[
                styles.cardInfo,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}>
              {' '}
              -{' '}
            </Text>
            <Text
              style={[
                styles.cardInfo,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}>
              4:00pm
            </Text>
          </Card>
        ))} */}
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

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onDismiss={() => setModalVisible(false)}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                {
                  paddingHorizontal: 20,
                  gap: 8,
                  backgroundColor: isDarkMode
                    ? customTheme.lightDarkColor
                    : '#FFFFFF',
                },
              ]}>
              <Pressable
                onPress={() => setModalVisible(false)}
                hitSlop={{top: 10, bottom: 10, left: 20, right: 20}}
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                  padding: 10,
                }}>
                <FontAwesome
                  name="close"
                  size={28}
                  color={isDarkMode ? '#FFF' : '#000'}
                />
              </Pressable>
              <FText variant="titleMedium">Request Service Completion</FText>
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
                onChangeText={text => setInstructions(text)}
                placeholder="Enter Note"
                placeholderTextColor={isDarkMode ? '#CCCCCC' : '#707070'}
                multiline
                numberOfLines={2}
              />
              <TouchableOpacity
                onPress={handleServiceCompleteReq}
                disabled={!instructions}
                style={{
                  backgroundColor: instructions
                    ? customTheme.primaryColor
                    : 'gray',
                  padding: 10,
                  width: '100%',
                  borderRadius: 10,
                  paddingVertical: 12,
                }}>
                <Text style={{width: '100%', textAlign: 'center'}}>
                  Proceed
                </Text>
              </TouchableOpacity>
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
      </View>
    </SafeAreaViewContainer>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
    paddingTop: hp('2%'),
  },
  profileImage: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
  },
  greeting: {
    fontSize: wp('4%'),
    marginLeft: wp('3%'),
    textTransform: 'capitalize',
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
  settingsIcon: {
    marginLeft: 'auto',
  },
  sectionTitle: {
    fontSize: wp('4%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('1%'),
  },
  card: {
    borderRadius: wp('2%'),
    padding: wp('3%'),
    marginLeft: wp('5%'),
    marginRight: wp('3%'),
  },
  darkCard: {
    backgroundColor: '#1E1E1E',
  },
  lightCard: {
    backgroundColor: '#F5F5F5',
  },
  bookingCard: {
    width: wp('85%'),
    // height: hp('43%'),
  },
  taskCard: {
    width: wp('40%'),
    height: hp('20%'),
    marginRight: wp('2%'),
  },
  bookingCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp('2.5%'),
  },
  chatIcon: {
    marginLeft: wp('2%'),
  },
  cardTitle: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  cardSubtitle: {
    fontSize: wp('3%'),
    marginBottom: hp('0.5%'),
    color: 'grey',
  },
  darkSubtitle: {
    color: 'grey',
  },
  lightSubtitle: {
    color: 'grey',
  },
  cardInfo: {
    fontSize: wp('3%'),
    marginBottom: hp('0.5%'),
    alignSelf: 'center',
  },
  mapLink: {
    fontSize: wp('3%'),
    paddingTop: hp('1%'),
    marginBottom: hp('1%'),
    color: '#00BCD4',
    alignSelf: 'flex-end',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  totalCostLabel: {
    fontSize: wp('3%'),
  },
  totalCost: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
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
});

export default HomeScreen;
