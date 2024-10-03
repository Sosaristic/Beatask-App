import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import {useFocusEffect, RouteProp} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootStackParamList} from '../../../../App';
import useFetch from '../../../hooks/useFetch';
import {
  ServiceType,
  SingleServicePayload,
  singleProviderResponse,
} from '../../../interfaces/apiResponses';
import {StackNavigationProp} from '@react-navigation/stack';
import {CustomErrorModal, CustomModal, GetRating} from '../../../components';
import {makeApiRequest} from '../../../utils/helpers';
import {useUserStore} from '../../../store/useUserStore';
import {customTheme} from '../../../custom_theme/customTheme';
import {Text as PaperText} from 'react-native-paper';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';

//array of services rendered different data

type Props = {
  route: RouteProp<RootStackParamList, 'Service'>;
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>;
};

const HomeScreen = ({route, navigation}: Props) => {
  const colorScheme = useColorScheme() || 'light';
  const screenWidth = Dimensions.get('window').width;
  const [BookVisible, setBookVisible] = useState(false);
  const {user} = useUserStore(state => state);
  const {id} = route.params || {};
  const [tab, setTab] = useState(1);

  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Provider saved successfully',
    loadingMessage: 'Saving...',
    requestLoading: false,
    showModal: false,
  });

  const {data, error, loading} = useFetch<singleProviderResponse>(
    '/single-provider-info',
    'POST',
    {provider_id: id as string},
  );

  console.log('data', data);

  useFocusEffect(
    React.useCallback(() => {
      setBookVisible(false);
      return () => setBookVisible(false);
    }, []),
  );

  const styles = getStyles(colorScheme, screenWidth);
  const [likedReviews, setLikedReviews] = useState<{[key: string]: boolean}>({
    'review-0': true,
    'review-1': false,
    'review-2': false,
  });

  const handlemasg = (
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
      customerId,
      customerName,
      customerAvatar,
    });
  };

  const toggleLike = (reviewKey: string) => {
    setLikedReviews(prevState => ({
      ...prevState,
      [reviewKey]: !prevState[reviewKey],
    }));
  };

  if (loading) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <ActivityIndicator size="large" color={customTheme.primaryColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text>Unable to fetch provider details</Text>
      </View>
    );
  }

  const handleProviderSave = async () => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const {data: providerResponse, error} = await makeApiRequest(
      '/saved-provider',
      'POST',
      {
        user_id: user?.id,
        saved_provider_id: id,
      },
    );
    if (error) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: false,
      });
      setShowErrorModal({
        errorTitle: 'Unable to save provider',
        errorMessage: error.msg,
        isModalOpen: true,
      });
    }
    if (providerResponse) {
      console.log('saved successfully', providerResponse);

      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: true,
      });

      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          requestLoading: false,
          showModal: false,
        });
      }, 2000);
    }
  };

  const handleSingleService = (payload: ServiceType) => {
    const payloadData: SingleServicePayload = {
      category_name: '',
      sub_category_name: '',
      category_id: payload.category_id,
      service_name: payload.service_name,
      service_id: payload.id,
      provider_id: payload.provider_id as string,
      real_price: payload.real_price,
      service_description: payload.service_description,
      service_image: payload.service_image,
      provider_name: data?.data.name as string,
    };

    navigation.navigate('singleservice', {data: payloadData});
  };

  return (
    <SafeAreaViewContainer edges={['right', 'bottom', 'left']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image
            source={{uri: data?.data?.profile_image}}
            style={styles.image}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{data?.data.name ?? ''}</Text>
            <Text style={styles.description}>{data?.data?.description}</Text>
            <View style={styles.priceContainer}>
              <View style={styles.ratingContainer}>
                <TouchableOpacity
                  onPress={handleProviderSave}
                  style={[
                    styles.availableButton,
                    {
                      backgroundColor: '#12CCB7',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderColor: 'transparent',
                    },
                  ]}>
                  <Icon name="plus" size={20} color="#fff" />
                  <Text style={[styles.availableButtonText, {color: '#fff'}]}>
                    Save Provider
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.availableButton}>
                <Text style={styles.availableButtonText}>Available</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20,
                gap: 6,
              }}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  {borderBottomColor: tab === 1 ? '#12CCB7' : 'transparent'},
                ]}
                onPress={() => setTab(1)}>
                <Text
                  style={[styles.tab, {color: tab === 1 ? '#12CCB7' : 'grey'}]}>
                  Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  {borderBottomColor: tab === 2 ? '#12CCB7' : 'transparent'},
                ]}
                onPress={() => setTab(2)}>
                <Text
                  style={[styles.tab, {color: tab === 2 ? '#12CCB7' : 'grey'}]}>
                  Reviews and Rating
                </Text>
              </TouchableOpacity>
            </View>

            {tab === 1 && (
              <>
                <PaperText
                  variant="titleMedium"
                  style={{
                    marginVertical: 10,
                  }}>
                  Services Rendered
                </PaperText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    height: 160,
                    flex: 1,
                    flexDirection: 'row',
                    gap: 15,
                    marginBottom: 20,
                  }}>
                  {Array.isArray(data?.service) ? (
                    data?.service?.map((service, index) => (
                      <View style={styles.categoryWrapper} key={index}>
                        <TouchableOpacity
                          style={styles.category}
                          onPress={() => handleSingleService(service)}>
                          <Image
                            source={{uri: service.service_image ?? ''}}
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                          />
                          <Text style={styles.categoryText}>
                            {service.service_name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : data?.service !== null ? (
                    <View style={styles.categoryWrapper}>
                      <TouchableOpacity
                        style={styles.category}
                        onPress={() =>
                          handleSingleService(data?.service as any)
                        }>
                        <Image
                          source={{uri: data?.service.service_image ?? ''}}
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                        />
                        <Text style={styles.categoryText}>
                          {data?.service.service_name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <Text style={{fontSize: 18}}>
                        No Services yet by this provider
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </>
            )}

            {tab === 2 && (
              <>
                <View style={styles.rating}>
                  <Text style={styles.reviewTitle}>Rating & review</Text>
                  <View style={styles.reviews}>
                    {Array.isArray(data?.reviews) &&
                      data?.reviews.map((review, index) => (
                        <View key={index}>
                          <View
                            style={[
                              styles.reviewContainer,
                              index === reviews.length - 1 &&
                                styles.lastReviewContainer,
                            ]}>
                            <Image
                              source={{
                                uri:
                                  review.user.profile_image ??
                                  'https://avatar.iran.liara.run/public/45',
                              }}
                              style={styles.userImage}
                            />
                            <View style={styles.reviewTextContainer}>
                              <Text
                                style={
                                  styles.userName
                                }>{`${review.user.last_legal_name} ${review.user.first_legal_name}`}</Text>
                              <Text style={styles.reviewText}>
                                {review.review_message}
                              </Text>
                              <GetRating
                                rating={review.rating_stars as number}
                              />
                              <View style={styles.reviewLikes}>
                                <Text style={styles.reviewDate}>
                                  {new Date(
                                    review.created_at,
                                  ).toLocaleDateString()}
                                </Text>
                              </View>
                            </View>
                          </View>
                          {index !== reviews.length - 1 && (
                            <View style={styles.divider} />
                          )}
                        </View>
                      ))}

                    {!Array.isArray(data?.reviews) && (
                      <>
                        <View>
                          <View style={[styles.reviewContainer]}>
                            <Image
                              source={{
                                uri:
                                  data?.reviews.user.profile_image ??
                                  'https://avatar.iran.liara.run/public/45',
                              }}
                              style={styles.userImage}
                            />
                            <View style={styles.reviewTextContainer}>
                              <Text
                                style={
                                  styles.userName
                                }>{`${data?.reviews.user.last_legal_name} ${data?.reviews.user.first_legal_name}`}</Text>
                              <Text style={styles.reviewText}>
                                {data?.reviews.review_message}
                              </Text>
                              <View style={styles.reviewLikes}>
                                <TouchableOpacity>
                                  <Icon
                                    name={'cards-heart'}
                                    size={24}
                                    color={'red'}
                                  />
                                </TouchableOpacity>
                                <Text style={styles.reviewLikesText}>
                                  {data?.reviews.rating_stars}
                                </Text>
                                <GetRating
                                  rating={data?.reviews.rating_stars as number}
                                />
                                <Text style={styles.reviewDate}>
                                  {new Date(
                                    data?.reviews.created_at as string,
                                  ).toLocaleDateString()}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() =>
              handlemasg(
                '',
                data?.data.email as string,
                data?.data.name as string,
                data?.data.profile_image as string,
                user?.email as string,
                user?.name as string,
                user?.profile_image as string,
              )
            }>
            <Text style={styles.buttonText1}>MESSAGE</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
          style={styles.bookNowButton}
          onPress={() => setBookVisible(!BookVisible)}>
          <Text style={styles.buttonText}>BOOK NOW</Text>
        </TouchableOpacity> */}
        </View>
        {/* <Modal visible={BookVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeading}>
              <Text style={styles.modalHeadingText}>Booking system</Text>
              <TouchableOpacity onPress={() => setBookVisible(false)}>
                <Icon name="close" size={24} color="#010A0C" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handlepayment}
              style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Instant booking </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlecalenderpayment}
              style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Recurring booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlecalenderpayment}
              style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Calendar booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

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

const reviews = [
  {
    name: 'Lauralee Quintero',
    text: 'Awesome! this is what I was looking for, I recommend them to everyone ❤️❤️❤️',
    likes: '724',
    date: '20/06/2024',
  },
  {
    name: 'Lauralee Quintero',
    text: 'The workers are very professional and the results are very satisfying! I like it! 👍👍👍',
    likes: '724',
    date: '16/06/2024',
  },
  {
    name: 'Lauralee Quintero',
    text: "This is the first time I've used his services, and the results were amazing!",
    likes: '724',
    date: '30/05/2024',
  },
];

const getStyles = (colorScheme: 'light' | 'dark', screenWidth: number) => {
  const isDarkMode = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1c1c1c' : '#fff',
    },
    scrollContent: {
      flexGrow: 1,
    },
    image: {
      width: wp('100%'),
      height: hp('40%'),
      resizeMode: 'cover',
    },
    content: {
      padding: wp('4%'),
    },
    title: {
      fontSize: wp('6.5%'),
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: hp('2%'),
      textTransform: 'capitalize',
    },
    description: {
      fontSize: wp('4%'),
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: hp('4%'),
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: hp('4%'),
    },
    rating: {
      backgroundColor: isDarkMode ? '#021114' : '#f0f0f0',
      padding: wp('3%'),
      borderRadius: wp('4%'),
    },
    price: {
      fontSize: wp('7%'),
      fontWeight: 'bold',
      color: '#12CCB7',
      marginRight: wp('4%'),
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      // marginLeft: wp('12%'),
    },
    singleStar: {
      flexDirection: 'row',
      backgroundColor: '#12CCB7',
      padding: wp('1.5%'),
      borderRadius: wp('4%'),
    },
    ratingText: {
      fontSize: wp('4%'),
      color: '#1c1c1c',
    },
    availableButton: {
      borderWidth: wp('0.5%'),
      borderColor: isDarkMode ? '#fff' : '#000',
      padding: wp('2%'),
      borderRadius: wp('8%'),
      paddingHorizontal: wp('5%'),
      // marginLeft: wp('10%'),
    },
    availableButtonText: {
      color: isDarkMode ? '#fff' : '#1c1c1c',
      fontSize: wp('3.5%'),
      textAlign: 'center',
    },
    reviewTitle: {
      fontSize: wp('5.5%'),
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: hp('2%'),
    },
    reviewContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#021114' : '#f0f0f0',
      borderTopLeftRadius: wp('4%'),
      borderTopRightRadius: wp('4%'),
      paddingHorizontal: wp('4%'),
      paddingVertical: hp('0.5%'),
      marginBottom: wp('2%'),
      justifyContent: 'flex-start',
    },
    lastReviewContainer: {
      backgroundColor: isDarkMode ? '#021114' : '#f0f0f0',
      borderRadius: wp('4%'),
      paddingHorizontal: wp('4%'),
      paddingVertical: wp('4%'),
      marginBottom: wp('4%'),
      justifyContent: 'center',
    },
    ratingCount: {
      fontSize: wp('4%'),
      fontWeight: '500',
      color: isDarkMode ? '#fff' : '#000',
    },
    seeAllButton: {
      marginLeft: wp('18%'),
      padding: wp('4%'),
      borderRadius: wp('4%'),
    },
    seeAllButtonText: {
      color: '#12CCB7',
      fontSize: wp('4%'),
      fontWeight: '500',
    },
    reviews: {
      marginBottom: hp('4%'),
    },
    userImage: {
      width: wp('11%'),
      height: hp('6%'),
      borderRadius: wp('9%'),
      marginRight: wp('2%'),
      alignSelf: 'flex-start',
    },
    reviewTextContainer: {
      flex: 1,
    },
    userName: {
      fontSize: wp('4%'),
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    reviewText: {
      fontSize: wp('3%'),
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: wp('4%'),
    },
    reviewLikes: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reviewLikesText: {
      fontSize: 12,
      color: isDarkMode ? '#fff' : '#000',
      marginRight: wp('4%'),
    },
    reviewDate: {
      fontSize: wp('3.5%'),
      color: isDarkMode ? '#fff' : '#000',
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? '#444' : '#ccc',
      marginVertical: wp('4%'),
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: isDarkMode ? '#021114' : '#f0f0f0',
      padding: wp('4%'),
      borderRadius: 10,
    },
    messageButton: {
      borderWidth: 1,
      padding: wp('3.5%'),
      borderRadius: wp('24%'),
      borderColor: '#12CCB7',
      flex: 1,
      margin: wp('1%'),
    },
    bookNowButton: {
      backgroundColor: '#12CCB7',
      padding: wp('3.5%'),
      borderRadius: wp('24%'),
      flex: 1,
      margin: wp('1%'),
    },
    buttonText: {
      color: '#1c1c1c',
      textAlign: 'center',
      fontSize: wp('4%'),
      fontWeight: '500',
    },
    buttonText1: {
      color: '#12CCB7',
      fontSize: wp('4%'),
      fontWeight: '500',
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: wp('4%'),
      borderTopLeftRadius: wp('8%'),
      borderTopRightRadius: wp('8%'),
      alignItems: 'center',
    },
    modalHeading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: wp('90%'),
      alignItems: 'center',
    },
    modalHeadingText: {
      fontSize: wp('5%'),
      fontWeight: 'bold',
      marginBottom: wp('4%'),
      color: '#010A0C',
    },
    modalOption: {
      paddingVertical: wp('4%'),
    },
    modalOptionText: {
      fontSize: wp('5%'),
      color: '#010A0C',
      fontWeight: '400',
    },
    tabButton: {
      flex: 1,
      borderBottomWidth: wp('0.5%'),
      borderBottomColor: '#12CCB7',
      alignItems: 'center',
    },
    tab: {
      fontSize: wp('5%'),
    },
    categoryWrapper: {
      width: '48%',
      height: hp('18%'),
      marginVertical: hp('1%'),
      borderRadius: wp('2%'), // Rounded corners for category items
      overflow: 'hidden', // Ensure contents don't overflow the container
    },
    category: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    categoryText: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      // backgroundColor: isDarkMode ? '#fff' : '#333',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background for text
      paddingHorizontal: wp('3%'),
      paddingVertical: hp('1%'),
      color: '#12CCB7', // Text color
      fontSize: wp('3.5%'), // Adjust font size as needed
      textAlign: 'center',
      zIndex: 1,
    },
  });
};

export default HomeScreen;
