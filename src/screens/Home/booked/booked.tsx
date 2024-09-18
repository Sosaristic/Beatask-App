import React, {useEffect, useState} from 'react';
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

import {BookedServiceType} from '../../../interfaces/apiResponses';

import {ActivityIndicator} from 'react-native-paper';
import useFetch from '../../../hooks/useFetch';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../App';
import {TextCount} from '../chat/masglist';
import {useUserStore} from '../../../store/useUserStore';
import Empty from '../../../components/Empty';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';

type Prop = {
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>;
};

type BookedServiceRes = {
  message: string;
  data: BookedServiceType[];
};

const App = ({navigation}: Prop) => {
  const [selectedTab, setSelectedTab] = useState('Completed');
  const isDarkMode = useColorScheme() === 'dark';
  const {user} = useUserStore(state => state);
  const {unReadMessages} = useUserStore(state => state);

  const {
    data: bookedSuccess,
    error: bookedSuccessError,
    loading: bookedSuccessIsLoading,
  } = useFetch<BookedServiceRes>('/completed-services', 'POST', {
    user_id: user?.id,
  });
  const {
    data: bookedAwaiting,
    error: bookedAwaitingError,
    loading: bookedAwaitingIsLoading,
  } = useFetch<BookedServiceRes>('/awaiting-services', 'POST', {
    user_id: user?.id,
  });

  const {
    data: bookedUnsuccess,
    error: bookedUnsuccessError,
    loading: bookedUnsuccessIsLoading,
  } = useFetch<BookedServiceRes>('/unsuccessful-services', 'POST', {
    user_id: user?.id,
  });

  const handleProfile = () => {
    navigation.navigate('Profile' as never);
  };
  const handlechat = (
    chatId: string = '',
    providerId: string,
    providerName: string,
    providerAvatar: string,
    customerId: string,
    customerName: string,
    customerAvatar: string,
  ) => {
    navigation.navigate('Chat', {
      chatId,
      providerId,
      providerName,
      providerAvatar,
      customerName,
      customerId,
      customerAvatar,
    });
  };
  const handleHome = () => {
    navigation.navigate('Home' as never);
  };
  const handlebooked = () => {
    navigation.navigate('Booked' as never);
  };

  return (
    <SafeAreaViewContainer edges={['right', 'bottom', 'left']}>
      <View
        style={[
          styles.container,
          {backgroundColor: isDarkMode ? '#010A0C' : '#FFF'},
        ]}>
        <View style={styles.tabsContainer}>
          {['Completed', 'Awaiting', 'Unsuccessful'].map(tab => (
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
        <View />
        <ScrollView contentContainerStyle={styles.cardsContainer}>
          {selectedTab === 'Completed' && (
            <>
              {bookedSuccessIsLoading && (
                <ActivityIndicator
                  animating
                  size="large"
                  color={isDarkMode ? '#FFF' : '#000'}
                />
              )}

              {!bookedSuccessIsLoading && bookedSuccess === null && (
                <Text style={{marginTop: 20}}>No Completed Bookings</Text>
              )}
              {!bookedSuccessIsLoading &&
                bookedSuccess !== null &&
                bookedSuccess.data.length === 0 && <Empty />}
              {!bookedSuccessIsLoading && bookedSuccess !== null && (
                <>
                  {bookedSuccess.data.map((item, index) => (
                    <View style={styles.card} key={item.id}>
                      <Image
                        source={{uri: item.service.service_image as string}}
                        style={styles.cardImage}
                      />
                      <View style={styles.cardContent}>
                        <Text
                          style={[
                            styles.cardTitle,
                            {
                              color: isDarkMode ? '#FFF' : '#000',
                              textTransform: 'capitalize',
                            },
                          ]}>
                          {item.category.category}
                        </Text>
                        <Text
                          style={[
                            styles.cardSubtitle,
                            {
                              color: isDarkMode ? '#CCC' : '#666',
                              textTransform: 'capitalize',
                            },
                          ]}>
                          {item.service.sub_category}
                        </Text>
                        <Text
                          style={[
                            styles.cardStatus,
                            {
                              color: isDarkMode ? '#FFF' : '#000',
                              textTransform: 'capitalize',
                            },
                          ]}>
                          {`${item.provider.last_legal_name} ${item.provider.first_legal_name}`}
                        </Text>
                        <View style={styles.cardFooter}>
                          <Text style={styles.cardCompleted}>Completed</Text>
                          <Text
                            style={[
                              styles.cardDate,
                              {color: isDarkMode ? '#FFF' : '#000'},
                            ]}>
                            {new Date(item.updated_at).toDateString()}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() =>
                          handlechat(
                            '',
                            item.provider.email,
                            item.provider.name,
                            item.provider.profile_image,
                            user?.email as string,
                            user?.name as string,
                            user?.profile_image as string,
                          )
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

          {selectedTab === 'Unsuccessful' && (
            <>
              {bookedUnsuccessIsLoading && (
                <ActivityIndicator size="large" color="#12CCB7" />
              )}
              {!bookedUnsuccessIsLoading && bookedUnsuccess === null && (
                <Text style={{marginTop: 20}}>No Unsuccessful Bookings</Text>
              )}
              {!bookedUnsuccessIsLoading &&
                bookedUnsuccess?.data.length === 0 && <Empty />}
              {!bookedUnsuccessIsLoading && bookedUnsuccess !== null && (
                <>
                  {bookedUnsuccess.data.map((item, index) => (
                    <View style={styles.card} key={item.id}>
                      <Image
                        source={{uri: item.service.service_image as string}}
                        style={styles.cardImage}
                      />
                      <View style={styles.cardContent}>
                        <Text
                          style={[
                            styles.cardTitle,
                            {
                              color: isDarkMode ? '#FFF' : '#000',
                              textTransform: 'capitalize',
                            },
                          ]}>
                          {item.category.category}
                        </Text>
                        <Text
                          style={[
                            styles.cardSubtitle,
                            {
                              color: isDarkMode ? '#CCC' : '#666',
                              textTransform: 'capitalize',
                            },
                          ]}>
                          {item.service.sub_category}
                        </Text>
                        <Text
                          style={[
                            styles.cardStatus,
                            {
                              color: isDarkMode ? '#FFF' : '#000',
                              textTransform: 'capitalize',
                            },
                          ]}>
                          {`${item.provider.last_legal_name} ${item.provider.first_legal_name}`}
                        </Text>
                        <View style={styles.cardFooter}>
                          <Text style={styles.cardunsuccessful2}>Redo</Text>
                          <Text
                            style={[
                              styles.cardDate,
                              {color: isDarkMode ? '#FFF' : '#000'},
                            ]}>
                            On 20-06-2024
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() =>
                          handlechat(
                            '',
                            item.provider.email,
                            item.provider.name,
                            item.provider.profile_image,
                            user?.email as string,
                            user?.name as string,
                            user?.profile_image as string,
                          )
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

          {selectedTab === 'Awaiting' && (
            <>
              {bookedAwaitingIsLoading && (
                <ActivityIndicator
                  animating
                  size="large"
                  color={isDarkMode ? '#FFF' : '#000'}
                />
              )}
              {!bookedAwaitingIsLoading && bookedAwaiting === null && (
                <Text style={{marginTop: 20}}>No Awaiting Bookings</Text>
              )}

              {!bookedAwaitingIsLoading &&
                bookedAwaiting?.data.length === 0 && <Empty />}

              {!bookedAwaitingIsLoading && bookedAwaiting && (
                <>
                  {bookedAwaiting.data.map(item => (
                    <View style={styles.card} key={item.id}>
                      <Image
                        source={{uri: item.service.service_image as string}}
                        style={styles.cardImage}
                      />
                      <View style={styles.cardContent}>
                        <Text
                          style={[
                            styles.cardTitle,
                            {
                              color: isDarkMode ? '#FFF' : '#000',
                              textTransform: 'capitalize',
                            },
                          ]}>
                          {item.category.category}
                        </Text>
                        <Text
                          style={[
                            styles.cardSubtitle,
                            {
                              color: isDarkMode ? '#CCC' : '#666',
                              textTransform: 'capitalize',
                            },
                          ]}>
                          {item.service.sub_category}
                        </Text>
                        <Text
                          style={[
                            styles.cardStatus,
                            {
                              color: isDarkMode ? '#FFF' : '#000',
                              textTransform: 'capitalize',
                            },
                          ]}>
                          {`${item.provider.last_legal_name} ${item.provider.first_legal_name}`}
                        </Text>
                        <View style={styles.cardFooter2}>
                          <Text
                            style={[
                              styles.cardDate,
                              {color: isDarkMode ? '#FFF' : '#000'},
                            ]}>
                            {new Date(item.updated_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() =>
                          handlechat(
                            '',
                            item.provider.email,
                            item.provider.name,
                            item.provider.profile_image,
                            user?.email as string,
                            user?.name as string,
                            user?.profile_image as string,
                          )
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
            // <>
            //   {bookedUnsuccessIsLoading && (
            //     <ActivityIndicator size="large" color="#12CCB7" />
            //   )}
            //   {!bookedUnsuccessIsLoading && bookedUnsuccess === null && (
            //     <Text style={{marginTop: 20}}>No Unsuccessful Bookings</Text>
            //   )}
            //   {!bookedUnsuccessIsLoading && bookedUnsuccess !== null && (
            //     <>
            //       {bookedUnsuccess.data.map((item, index) => (
            //         <View style={styles.card} key={item.id}>
            //           <Image
            //             source={require('../../../assets/images/category/booked.png')}
            //             style={styles.cardImage}
            //           />
            //           <View style={styles.cardContent}>
            //             <Text
            //               style={[
            //                 styles.cardTitle,
            //                 {color: isDarkMode ? '#FFF' : '#000'},
            //               ]}>
            //               {item.category}
            //             </Text>
            //             <Text
            //               style={[
            //                 styles.cardSubtitle,
            //                 {color: isDarkMode ? '#CCC' : '#666'},
            //               ]}>
            //               {item.sub_category}
            //             </Text>
            //             <Text
            //               style={[
            //                 styles.cardStatus,
            //                 {color: isDarkMode ? '#FFF' : '#000'},
            //               ]}>
            //               {'Maryland Winkles'}
            //             </Text>
            //             <View style={styles.cardFooter}>
            //               <Text style={styles.cardunsuccessful2}>Redo</Text>
            //               <Text
            //                 style={[
            //                   styles.cardDate,
            //                   {color: isDarkMode ? '#FFF' : '#000'},
            //                 ]}>
            //                 On 20-06-2024
            //               </Text>
            //             </View>
            //           </View>
            //           <TouchableOpacity
            //             style={styles.chatButton}
            //             onPress={handlechat}>
            //             <Icon
            //               name="chat-processing-outline"
            //               size={wp('7%')}
            //               color={isDarkMode ? '#FFF' : '#000'}
            //             />
            //           </TouchableOpacity>
            //         </View>
            //       ))}
            //     </>
            //   )}
            // </>
          )}
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
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate('masglist' as never)}>
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
    height: hp('0.1%'),
    backgroundColor: '#CCC',
    alignSelf: 'center',
    marginVertical: hp('1%'),
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
