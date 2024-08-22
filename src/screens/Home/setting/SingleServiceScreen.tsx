import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../../App';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Image} from 'react-native';
import {customTheme} from '../../../custom_theme/customTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useFetch from '../../../hooks/useFetch';
import {singleProviderResponse} from '../../../interfaces/apiResponses';
import Empty from '../../../components/Empty';
import {AirbnbRating} from 'react-native-elements';
import {ScrollView} from 'react-native';
import {makeApiRequest} from '../../../utils/helpers';
import {useUserStore} from '../../../store/useUserStore';
import {CustomErrorModal, CustomModal} from '../../../components';
import {Modal} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

type Props = {
  route: RouteProp<RootStackParamList, 'singleservice'>;
  navigation: StackNavigationProp<RootStackParamList, 'singleservice'>;
};
const SingleServiceScreen = ({route, navigation}: Props) => {
  const {data} = route.params;
  const [likedReviews, setLikedReviews] = useState<{[key: string]: boolean}>({
    'review-0': true,
    'review-1': false,
    'review-2': false,
  });
  const colorScheme = useColorScheme() || 'light';
  const {user} = useUserStore(state => state);
  const [BookVisible, setBookVisible] = useState(false);

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

  const {
    data: providerResponse,
    error,
    loading,
  } = useFetch<singleProviderResponse>('/single-provider-info', 'POST', {
    provider_id: data.provider_id as string,
  });

  if (loading) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <ActivityIndicator size="large" color="#12CCB7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>Encountered and error fetching service details</Text>
      </View>
    );
  }

  if (providerResponse === null) {
    return <Empty />;
  }

  // const service = data.service.find(item => item.id === serviceId);

  const handleProviderSave = async () => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });

    const {data: saveResponse, error} = await makeApiRequest(
      '/saved-provider',
      'POST',
      {
        user_id: user?.id,
        saved_provider_id: providerResponse.data.id,
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
    if (saveResponse) {
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

  const handlemasg = (
    chatId: string = '',
    providerId: string,
    providerName: string,
  ) => {
    navigation.navigate('Chat', {chatId, providerId, providerName});
  };
  const handlepayment = async () => {
    setBookVisible(false);
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
      loadingMessage: 'Processing',
      successTitle: 'Booking',
      successMessage: 'Booking Successfully',
    });

    const {data: BookingResponse, error} = await makeApiRequest(
      '/book-services',
      'POST',
      {
        provider_id: data.provider_id,
        service_id: data.service_id,
        category_id: data.category_id,
        dates_and_times: [new Date()],
        description: 'test',
      },
    );

    if (BookingResponse) {
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: true,
        successTitle: 'Booking',
        successMessage: 'Booking Successfully',
      });

      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          requestLoading: false,
          successTitle: 'Booking',
          successMessage: 'Booking Successfully',
          showModal: false,
        });
        navigation.navigate('payment', {data});
      }, 2000);
    }
  };
  const handlecalenderpayment = () => {
    navigation.navigate('calenderbook', {
      data,
    });
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <Image source={{uri: data.service_image}} style={styles.image} />
        <View style={{padding: 10}}>
          <Text
            style={{
              fontSize: wp('6%'),
              color: customTheme.primaryColor,
              textTransform: 'capitalize',
            }}>
            {data.service_name}
          </Text>
          <Text
            style={{
              fontSize: wp('4%'),
              color: colorScheme === 'dark' ? 'white' : 'black',
              textTransform: 'capitalize',
            }}>
            {providerResponse.data.name}
          </Text>
          <View
            style={{
              gap: 10,
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: wp('4%'),
                color: colorScheme === 'dark' ? 'white' : 'black',
                textTransform: 'capitalize',
              }}>
              {data.category_name ?? ''}
            </Text>

            <Text
              style={{
                fontSize: wp('4%'),
                color: colorScheme === 'dark' ? 'white' : 'black',
              }}>
              ( {data.sub_category_name})
            </Text>
          </View>
          <Text
            style={{
              fontSize: wp('6%'),
              color: colorScheme === 'dark' ? 'white' : 'black',
              marginTop: 30,
            }}>
            Description
          </Text>
          <Text
            style={{
              fontSize: wp('4%'),
              color: colorScheme === 'dark' ? 'white' : 'black',
            }}>
            {data.service_description}
          </Text>
          <View style={styles.priceContainer}>
            <View
              style={[
                styles.ratingContainer,
                {justifyContent: 'space-between', marginVertical: 10},
              ]}>
              <Text
                style={{
                  color: customTheme.primaryColor,
                  fontWeight: 'bold',
                  fontSize: wp('8%'),
                  paddingHorizontal: 8,
                }}>
                ${data.real_price}
              </Text>
              <TouchableOpacity
                onPress={handleProviderSave}
                style={[
                  styles.availableButton,
                  {
                    backgroundColor: '#12CCB7',
                    borderColor: customTheme.primaryColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}>
                <Icon name="plus" size={20} color="#fff" />
                <Text
                  style={[
                    styles.availableButtonText,
                    {
                      color: 'white',
                      borderWidth: 0,
                    },
                  ]}>
                  Save Provider
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <Text
                style={[
                  styles.availableButton,
                  {
                    borderColor: colorScheme === 'dark' ? 'white' : 'black',
                    color: colorScheme === 'dark' ? 'white' : 'black',
                  },
                ]}>
                Available
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rating}>
            <Text style={styles.reviewTitle}>Rating & review</Text>
            <View style={styles.reviews}>
              {Array.isArray(providerResponse?.reviews) &&
                providerResponse?.reviews.map((review, index, arr) => (
                  <View key={index}>
                    <View
                      style={[
                        styles.reviewContainer,
                        index === arr.length - 1 && styles.lastReviewContainer,
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
                        <View style={styles.reviewLikes}>
                          <Text style={styles.reviewDate}>
                            {new Date(review.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <AirbnbRating
                        count={review.rating_stars as number}
                        defaultRating={5}
                        size={15}
                        isDisabled
                        showRating={false}
                      />
                    </View>
                    {index !== arr.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}

              {!Array.isArray(providerResponse?.reviews) && (
                <>
                  <View>
                    <View style={[styles.reviewContainer]}>
                      <Image
                        source={{
                          uri:
                            providerResponse?.reviews.user.profile_image ??
                            'https://avatar.iran.liara.run/public/45',
                        }}
                        style={styles.userImage}
                      />
                      <View style={styles.reviewTextContainer}>
                        <Text
                          style={
                            styles.userName
                          }>{`${providerResponse?.reviews.user.last_legal_name} ${providerResponse?.reviews.user.first_legal_name}`}</Text>
                        <Text style={styles.reviewText}>
                          {providerResponse?.reviews.review_message}
                        </Text>
                        <View style={styles.reviewLikes}>
                          <Text style={styles.reviewDate}>
                            {new Date(
                              providerResponse?.reviews.created_at as string,
                            ).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <AirbnbRating
                        count={providerResponse?.reviews.rating_stars as number}
                        defaultRating={5}
                        size={15}
                        isDisabled
                        showRating={false}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {providerResponse !== null && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() =>
              handlemasg(
                '',
                providerResponse?.data.email as string,
                `${providerResponse?.data.last_legal_name} ${providerResponse?.data.first_legal_name}`,
              )
            }>
            <Text style={styles.buttonText1}>MESSAGE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={() => setBookVisible(!BookVisible)}>
            <Text style={styles.buttonText}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={BookVisible} transparent={true} animationType="fade">
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
      </Modal>

      <CustomModal {...showSuccessModal} />
      <CustomErrorModal
        {...showErrorModal}
        closeModal={() =>
          setShowErrorModal({...showErrorModal, isModalOpen: false})
        }
      />
    </View>
  );
};

export default SingleServiceScreen;

const styles = StyleSheet.create({
  image: {
    width: wp('100%'),
    height: hp('40%'),
    resizeMode: 'cover',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('4%'),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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

    padding: wp('2%'),
    borderRadius: wp('8%'),
    paddingHorizontal: wp('5%'),
    // marginLeft: wp('10%'),
  },
  availableButtonText: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
    borderRadius: wp('8%'),
    borderWidth: wp('0.5%'),
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
  },
  reviewText: {
    fontSize: wp('3%'),

    marginBottom: wp('4%'),
  },
  reviewLikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewLikesText: {
    fontSize: 12,

    marginRight: wp('4%'),
  },
  reviewDate: {
    fontSize: wp('3.5%'),
  },
  divider: {
    height: 1,

    marginVertical: wp('4%'),
  },
  reviewTitle: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',

    marginBottom: hp('2%'),
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    borderTopLeftRadius: wp('4%'),
    borderTopRightRadius: wp('4%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.5%'),
    marginBottom: wp('2%'),
    justifyContent: 'flex-start',
  },
  lastReviewContainer: {
    borderRadius: wp('4%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('4%'),
    marginBottom: wp('4%'),
    justifyContent: 'center',
  },
  ratingCount: {
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  seeAllButton: {
    marginLeft: wp('18%'),
    padding: wp('4%'),
    borderRadius: wp('4%'),
  },
  rating: {
    padding: wp('3%'),
    borderRadius: wp('4%'),
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',

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
