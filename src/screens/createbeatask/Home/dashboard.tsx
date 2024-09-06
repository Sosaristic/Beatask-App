import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {useUserStore} from '../../../store/useUserStore';
import {TextCount} from '../../Home/chat/masglist';
import useFetch from '../../../hooks/useFetch';
import {PendingTask, UpcomingService} from '../../../interfaces/apiResponses';
import Empty from '../../../components/Empty';
import {convertStringToArray} from '../../../utils/helperFunc';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../App';

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

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const {user} = useUserStore(state => state);
  const {data, loading, error} = useFetch<UpcomingRes>(
    '/upcoming-bookings',
    'POST',
    {
      provider_id: user?.id,
    },
  );

  const {
    data: pendingData,
    loading: pendingLoading,
    error: pendingError,
  } = useFetch<PendingTaskRes>('/pending-tasks', 'POST', {
    provider_id: user?.id,
  });

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

  return (
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
        <Text
          style={[
            styles.greeting,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}>
          {getGreeting()} {user?.first_legal_name}
        </Text>
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
        {loading ? (
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
        ) : error || data?.data.length === 0 ? (
          <>
            <Empty height={hp('20%')} />
          </>
        ) : (
          <>
            {data?.data.map(item => {
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
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Chat', {
                          chatId: '',
                          providerId: item.user.email,
                          providerName: item.user.name,
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
                      ]}>
                      {dates[0]} - {dates[dates.length - 1]}
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
                      {item.user.home_address ? item.user.home_address : ''}
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.mapLink}>View map location</Text>
                  </TouchableOpacity>
                  <View style={styles.cardFooter}>
                    <Text
                      style={[
                        styles.totalCostLabel,
                        isDarkMode ? styles.darkSubtitle : styles.lightSubtitle,
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
                        isDarkMode ? styles.darkSubtitle : styles.lightSubtitle,
                      ]}>
                      Service Fee:
                    </Text>
                    <Text
                      style={[
                        styles.totalCost,
                        isDarkMode ? styles.darkText : styles.lightText,
                      ]}>
                      ${item.service_fee} (12%)
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text
                      style={[
                        styles.totalCostLabel,
                        isDarkMode ? styles.darkSubtitle : styles.lightSubtitle,
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

        {/* {[...Array(5)].map((_, index) => (
          <Card
            key={index}
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
                Home improvement
              </Text>
              <TouchableOpacity onPress={handleChat}>
                <Icon
                  name="chat-processing-outline"
                  size={wp('5%')}
                  color={isDarkMode ? 'white' : 'black'}
                  style={styles.chatIcon}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.cardSubtitle,
                isDarkMode ? styles.darkSubtitle : styles.lightSubtitle,
              ]}>
              Residential cleaning services
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
                ]}>
                Today 10:00 - 12:00 AM
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
                Bring your toolbox
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
                {' '}
                267 New Avenue Park, New York
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.mapLink}>View map location</Text>
            </TouchableOpacity>
            <View style={styles.cardFooter}>
              <Text
                style={[
                  styles.totalCostLabel,
                  isDarkMode ? styles.darkSubtitle : styles.lightSubtitle,
                ]}>
                Total cost
              </Text>
              <Text
                style={[
                  styles.totalCost,
                  isDarkMode ? styles.darkText : styles.lightText,
                ]}>
                $2,000
              </Text>
            </View>
          </Card>
        ))} */}
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
        {pendingLoading ? (
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
        ) : pendingError || pendingData?.data.length == 0 ? (
          <Empty height={hp('20%')} />
        ) : (
          <>
            {pendingData?.data.map(item => {
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
                          providerId: item.user.email,
                          providerName: item.user.name,
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
                      ]}>
                      {item.user.name}
                    </Text>
                  </View>

                  <Text
                    style={[isDarkMode ? styles.darkText : styles.lightText]}>
                    {dates[0]}
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
    </View>
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
});

export default HomeScreen;
