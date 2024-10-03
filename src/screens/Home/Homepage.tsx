import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {useFocusEffect} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this package
import Icons from 'react-native-vector-icons/Feather'; // Make sure to install this package
import {useUserStore} from '../../store/useUserStore';
import {
  FeaturedProvider,
  HalfPrice,
  MostBookedService,
  SearchedResults,
  SingleServicePayload,
  WomenenServiceType,
} from '../../interfaces/apiResponses';
import {makeApiRequest} from '../../utils/helpers';
import {ActivityIndicator, Text as PText} from 'react-native-paper';
import {chunkArray} from '../../utils/helperFunc';
import {TextCount} from './chat/masglist';
import {RootStackParamList} from '../../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import Empty from '../../components/Empty';
import {useDebouncedCallback} from 'use-debounce';
import notifee from '@notifee/react-native';

import {customTheme} from '../../custom_theme/customTheme';
import SafeAreaViewContainer from '../../components/SafeAreaViewContainer';
import useCustomQuery from '../../hooks/useCustomQuery';
import Refresh from '../../components/Refresh';

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

type FaeturedServiceRes = {
  data: FeaturedProvider[];
  message: string;
};
type Mostbooked = {
  data: MostBookedService[];
  message: string;
};

type HalfPriceRes = {
  data: HalfPrice[];
  message: string;
};

type WomenServiceRes = {
  message: string;
  data: WomenenServiceType[];
};

type SearchResultRes = {
  message: string;
  data: SearchedResults[];
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Service'>;
};

export const GetRating = ({rating}: {rating: number}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      {Array.from({length: rating}, (_, i) => (
        <Text key={i}> ⭐ </Text>
      ))}
    </View>
  );
};

const HomeScreen = ({navigation}: Props) => {
  const {width, height} = useWindowDimensions();
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState([
    'Home Improvement',
    'Business',
    'IT and Graphic Design',
  ]);

  const {user} = useUserStore(state => state);
  console.log(user?.phone_number.slice(1));

  const [searchedResults, setSearchedResults] = useState<SearchedResults[]>([]);

  const {
    data: featuredProviderRes,
    isError: featuredProviderError,
    isLoading: featuredProviderLoading,
    refetch: fetchFeaturedProvider,
    isFetching,
  } = useCustomQuery<FaeturedServiceRes>(
    ['featured-providers'],
    '/featured-providers',
    'GET',
  );

  const {
    data: mostBookedServicesRes,
    isError: mostBookedError,
    isLoading: mostBookedResLoading,
    refetch: fetchMostBooked,
  } = useCustomQuery<Mostbooked>(
    ['most-booked-services'],
    '/most-booked-services',
    'GET',
  );

  const {
    data: halfPriceServicesRes,
    isError: halfPriceError,
    isLoading: halfPriceResLoading,
    refetch: fetchHalfPrice,
  } = useCustomQuery<HalfPriceRes>(
    ['half-price-services'],
    '/half-price-services',
    'GET',
  );

  const {
    data: womenServicesRes,
    isError: womenServicesError,
    isLoading: womenServicesLoading,
    refetch: fetchWomenServices,
  } = useCustomQuery<WomenServiceRes>(
    ['women-services'],
    '/women-services',
    'GET',
  );

  useFocusEffect(
    useCallback(() => {
      fetchFeaturedProvider();
      fetchMostBooked();
      fetchHalfPrice();
      fetchWomenServices();
    }, [
      fetchFeaturedProvider,
      fetchMostBooked,
      fetchHalfPrice,
      fetchWomenServices,
    ]),
  );

  console.log('half service', halfPriceServicesRes?.data[0].category);

  const handleOptionRemove = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleClearAll = () => {
    setOptions([]);
  };

  const openSearchModal = () => {
    setShowModal(true);
  };

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'A Provider has accepted your request',
      body: 'A Provider has accepted your booking request',
      android: {
        channelId,
        // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const closeSearchModal = () => {
    setShowModal(false);
  };

  const debounceRequest = useDebouncedCallback(async searchText => {
    const {data: searchData, error} = await makeApiRequest<SearchResultRes>(
      '/search-service',
      'POST',
      {
        service_name: searchText,
      },
    );

    if (searchData) {
      setSearchedResults(searchData.data);
    }
    if (error) {
      console.log('error', error);
    }
  }, 300);

  const filterOptions = (text: string) => {
    setSearchText(text); // Update search text state
    debounceRequest(text);

    // Update filtered options state
  };

  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const styles = getStyles(isDarkMode);

  const handleprofile = () => {
    navigation.navigate('Profile' as never);
  };
  const handleHome = () => {
    navigation.navigate('Home' as never);
  };
  const handleChat = () => {
    navigation.navigate('masglist' as never);
  };
  const handlebooked = () => {
    navigation.navigate('Booked' as never);
  };
  const handleFABPress = () => {
    navigation.navigate('Request' as never);
  };

  const handleprovider = (id: number) => {
    navigation.navigate('Service', {id: id});
  };

  const handleSearchResult = (payload: SearchedResults) => {
    const payloadData: SingleServicePayload = {
      category_name: payload.category.category,
      real_price: payload.real_price.toString(),
      provider_id: payload.provider_id,
      service_id: payload.id,
      category_id: payload.category_id,
      service_name: payload.service_name,
      service_image: payload.service_image,
      provider_name: '',
      sub_category_name: payload.sub_category,
      service_description: payload.service_description,
    };
    setShowModal(false);
    navigation.navigate('singleservice', {data: payloadData});
  };

  const handleMostBooked = (payload: MostBookedService) => {
    const payloadData: SingleServicePayload = {
      category_name: payload.service.category.category,
      real_price: payload.service.real_price.toString(),
      provider_id: payload.service.provider_id,
      service_id: payload.service_id,
      category_id: payload.service.category_id,
      service_name: payload.service.service_name,
      service_image: payload.service.service_image,
      provider_name: payload.service.provider_id,
      sub_category_name: payload.service.sub_category,
      service_description: payload.service.service_description,
    };

    navigation.navigate('singleservice', {data: payloadData});
  };

  const handleHalfPrice = (payload: HalfPrice) => {
    const payloadData: SingleServicePayload = {
      category_name: payload.category.category,
      real_price: payload.real_price,
      provider_id: payload.provider_id,
      category_id: payload.category_id,
      service_id: payload.id,
      service_name: payload.service_name,
      service_image: payload.service_image,
      provider_name: payload.provider.name,
      sub_category_name: payload.sub_category,
      service_description: payload.service_description,
    };
    navigation.navigate('singleservice', {data: payloadData});
  };

  const handleWomenFeatured = (payload: WomenenServiceType) => {
    const payloadData: SingleServicePayload = {
      category_name: payload.category.category,
      real_price: payload.real_price.toString(),
      provider_id: payload.provider_id,
      category_id: payload.category_id,
      service_id: payload.id,
      service_name: payload.service_name,
      service_image: payload.service_image,
      provider_name: '',
      sub_category_name: payload.sub_category,
      service_description: payload.service_description,
    };
    navigation.navigate('singleservice', {data: payloadData});
  };

  // Function to toggle like based on provider

  const womanDataComponent = () => {
    if (
      !womenServicesRes ||
      (womenServicesRes === undefined && womenServicesLoading)
    )
      return null;

    let womenData = chunkArray(womenServicesRes?.data, 2);

    return (
      <View>
        {womenData.map(item => (
          <View
            key={new Date().getTime()}
            style={{
              flexDirection: 'row',
              gap: 8,
              width: width,
              flex: 1,
              paddingHorizontal: 8,
            }}>
            {item.map(serivce => {
              return (
                <View style={styles.categoryWrapper} key={new Date().getTime()}>
                  <TouchableOpacity
                    style={styles.category}
                    onPress={() => handleWomenFeatured(serivce)}>
                    <Image
                      source={{uri: serivce.service_image}}
                      style={styles.image}
                    />
                    <Text style={styles.categoryText}>
                      {serivce.service_name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaViewContainer>
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.header}>
            <Image
              source={{
                uri:
                  user?.profile_image ??
                  'https://avatar.iran.liara.run/public/3',
              }}
              style={styles.profileImage}
            />
            <View style={{marginLeft: 8}}>
              <PText variant="bodySmall">{getGreeting()}</PText>
              <PText
                variant="titleMedium"
                style={{textTransform: 'capitalize'}}>
                {user?.last_legal_name + ' ' + user?.first_legal_name}
              </PText>
            </View>
          </View>
          <View style={styles.searchContainer}>
            <Icon
              name="magnify"
              size={wp('6%')}
              color={isDarkMode ? '#CCC' : '#51514C'}
              style={styles.searchIcon}
            />
            <TextInput
              style={[
                styles.searchBar,
                {color: isDarkMode ? '#FFF' : '#000', height: 40},
              ]}
              placeholder="Search services"
              placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
              onPress={openSearchModal}
            />
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={closeSearchModal}>
            <TouchableWithoutFeedback onPress={closeSearchModal}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                {backgroundColor: isDarkMode ? '#333' : '#FFF', top: hp('20%')},
              ]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeSearchModal}>
                  <Icon
                    name="arrow-left"
                    size={24}
                    color={isDarkMode ? '#FFF' : '#000'}
                  />
                </TouchableOpacity>
                <TextInput
                  style={[
                    styles.modalSearchInput,
                    {color: isDarkMode ? '#FFF' : '#000'},
                  ]}
                  placeholder="Search services"
                  placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                  value={searchText}
                  onChangeText={filterOptions} // Call filterOptions on text change
                />
              </View>
              <View style={styles.optionsContainer}>
                <View style={styles.optionsHeader}>
                  <Text
                    style={[
                      styles.recentText,
                      {color: isDarkMode ? '#FFF' : '#000'},
                    ]}>
                    Results
                  </Text>
                  {/* <TouchableOpacity onPress={handleClearAll}>
                  <Text style={styles.clearAllText}>CLEAR ALL</Text>
                </TouchableOpacity> */}
                </View>
                {searchedResults.length > 0 &&
                  searchedResults.map((option, index) => (
                    <TouchableOpacity
                      key={Math.random()}
                      onPress={() => handleSearchResult(option)}>
                      <View style={styles.optionItem}>
                        <Text
                          style={[
                            styles.optionText,
                            {color: isDarkMode ? '#FFF' : '#000'},
                          ]}>
                          {option.service_name}
                        </Text>
                        {/* <TouchableOpacity
                        onPress={() => handleOptionRemove(index)}>
                        <Icon
                          name="close"
                          size={20}
                          color={isDarkMode ? '#FFF' : '#000'}
                        />
                      </TouchableOpacity> */}
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </Modal>
          <Swiper style={styles.swiper} showsButtons={false} autoplay={true}>
            <View style={styles.slide}>
              <Text style={styles.slideText}>Slide 1</Text>
            </View>
            <View style={styles.slide}>
              <Text style={styles.slideText}>Slide 2</Text>
            </View>
            <View style={styles.slide}>
              <Text style={styles.slideText}>Slide 3</Text>
            </View>
          </Swiper>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 4,
              paddingRight: 20,
              paddingVertical: 10,
            }}
            onPress={() => navigation.navigate('pending_actions')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                borderBottomColor: customTheme.primaryColor,
                borderBottomWidth: 1,
              }}>
              <Text
                style={{
                  color: customTheme.primaryColor,
                }}>
                Pending Actions
              </Text>
              <Icons
                name="chevron-right"
                size={20}
                color={customTheme.primaryColor}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryHeader1}>
              Beatask service categories
            </Text>
            <View style={styles.categories}>
              <View style={styles.categoryWrapper}>
                <TouchableOpacity
                  style={styles.category}
                  onPress={() =>
                    navigation.navigate('Homeimp', {
                      category_name: 'home improvement',
                    })
                  }>
                  <View style={styles.backgroundImage}>
                    <Image
                      source={{
                        uri: 'https://ik.imagekit.io/onj3o7rvm/beatask/Home1%20(1).webp',
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                      }}
                    />
                    <Text style={styles.categoryText}>Home Improvement</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.categoryWrapper}>
                <TouchableOpacity
                  style={styles.category}
                  onPress={() =>
                    navigation.navigate('Homeimp', {
                      category_name: 'business',
                    })
                  }>
                  <Image
                    source={{
                      uri: 'https://ik.imagekit.io/onj3o7rvm/beatask/BUSINESS.webp',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                  />
                  <Text style={styles.categoryText}>Business</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryWrapper}>
                <TouchableOpacity
                  style={styles.category}
                  onPress={() =>
                    navigation.navigate('Homeimp', {
                      category_name: 'it and graphic design',
                    })
                  }>
                  <Image
                    source={{
                      uri: 'https://res.cloudinary.com/dv2rpts6d/image/upload/v1725554471/It_1_cvjo9d.webp',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                  />
                  <Text style={styles.categoryText}>IT and Graphic Design</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryWrapper}>
                <TouchableOpacity
                  style={styles.category}
                  onPress={() =>
                    navigation.navigate('Homeimp', {
                      category_name: 'wellness',
                    })
                  }>
                  <Image
                    source={{
                      uri: 'https://ik.imagekit.io/onj3o7rvm/beatask/WELLNESS.webp',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                  />
                  <Text style={styles.categoryText}>Wellness</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryWrapper}>
                <TouchableOpacity
                  style={styles.category}
                  onPress={() =>
                    navigation.navigate('Homeimp', {
                      category_name: 'pets',
                    })
                  }>
                  <Image
                    source={{
                      uri: 'https://ik.imagekit.io/onj3o7rvm/beatask/PETS.webp',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                  />
                  <Text style={styles.categoryText}>Pets</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryWrapper}>
                <TouchableOpacity
                  style={styles.category}
                  onPress={() =>
                    navigation.navigate('Homeimp', {
                      category_name: 'home events',
                    })
                  }>
                  <Image
                    source={{
                      uri: 'https://res.cloudinary.com/dv2rpts6d/image/upload/v1725554623/Events_qtvps0.webp',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                  />
                  <Text style={styles.categoryText}>Events</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryWrapper}>
                <TouchableOpacity
                  style={styles.category}
                  onPress={() =>
                    navigation.navigate('Homeimp', {
                      category_name: 'troubleshooting and repair',
                    })
                  }>
                  <Image
                    source={{
                      uri: 'https://ik.imagekit.io/onj3o7rvm/beatask/Troubleshooting.webp?updatedAt=1725551207520',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                  />
                  <Text style={styles.categoryText}>
                    Troubleshooting and Repair
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryWrapper}>
                <TouchableOpacity
                  style={styles.category}
                  onPress={() =>
                    navigation.navigate('Homeimp', {
                      category_name: 'lessons',
                    })
                  }>
                  <Image
                    source={{
                      uri: 'https://res.cloudinary.com/dv2rpts6d/image/upload/v1725554746/Lessons_uqbknv.webp',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                  />
                  <Text style={styles.categoryText}>Lessons</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryWrapper}>
                <TouchableOpacity
                  style={styles.category}
                  onPress={() =>
                    navigation.navigate('Homeimp', {
                      category_name: 'personal',
                    })
                  }>
                  <Image
                    source={{
                      uri: 'https://ik.imagekit.io/onj3o7rvm/beatask/Personal.webp?updatedAt=1725550542186',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                  />
                  <Text style={styles.categoryText}>Personal</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryWrapper}>
                <TouchableOpacity
                  style={styles.category}
                  onPress={() =>
                    navigation.navigate('Homeimp', {
                      category_name: 'legal',
                    })
                  }>
                  <Image
                    source={{
                      uri: 'https://ik.imagekit.io/onj3o7rvm/beatask/Legal.webp?updatedAt=1725550306084',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                    }}
                  />
                  <Text style={styles.categoryText}>Legal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.featuredHeader}>Featured service providers</Text>

          {featuredProviderLoading ? (
            <View
              style={{
                minHeight: 300,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={24} />
            </View>
          ) : featuredProviderError ||
            featuredProviderRes?.data.length === 0 ||
            !featuredProviderRes ? (
            <View
              style={{
                minHeight: 300,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Empty />
            </View>
          ) : (
            <Swiper
              showsButtons={false}
              autoplay={true}
              autoplayTimeout={12}
              showsPagination={false}
              horizontal
              style={styles.providerSwiper}
              loop={true}>
              {chunkArray(featuredProviderRes?.data, 2).map((item, index) => (
                <View
                  key={Math.random()}
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    width: width,
                    flex: 1,
                    paddingHorizontal: 8,
                  }}>
                  {item.map(provider => (
                    <TouchableOpacity
                      key={Math.random()}
                      style={styles.providerCard}
                      onPress={() => handleprovider(provider.id)}>
                      <View style={styles.providerImageWrapper}>
                        <Image
                          source={{
                            uri: provider.profile_image
                              ? provider.profile_image
                              : 'https://via.placeholder.com/150',
                          }}
                          style={styles.fullImage}
                        />
                      </View>
                      <Text style={styles.providerName} ellipsizeMode="tail">
                        {provider.name}
                      </Text>

                      <Text
                        style={styles.providerDescription}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        {provider.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </Swiper>
          )}

          <Text style={styles.featuredHeader}>Most booked services</Text>

          {mostBookedResLoading ? (
            <View
              style={{
                minHeight: 300,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={24} />
            </View>
          ) : mostBookedError ||
            mostBookedServicesRes === null ||
            mostBookedServicesRes?.data?.length === 0 ? (
            <View
              style={{
                minHeight: 300,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Empty />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 8, gap: 10}}>
              {mostBookedServicesRes?.data.map(service => (
                <TouchableOpacity
                  key={Math.random()}
                  style={{width: width * 0.4}}
                  onPress={() => handleMostBooked(service)}>
                  <View style={styles.providerImageWrapper1}>
                    <Image
                      source={{
                        uri: service.service.service_image
                          ? service.service.service_image
                          : 'https://via.placeholder.com/150',
                      }}
                      style={styles.fullImage1}
                    />
                  </View>
                  <Text style={styles.providerName1}>
                    {service.service.service_name}
                  </Text>
                  <Text style={styles.providerDescription1}>
                    {GetRating({rating: service.service.review_rating})}
                    <Text style={styles.chooseText}> </Text>
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      width: '100%',
                    }}>
                    <Text style={styles.chooseText}>
                      ${service.service.discounted_price}
                    </Text>
                    <Text style={styles.providerDescription2}>
                      ${service.service.real_price}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Text style={styles.categoryHeader}>Featured services for women</Text>

          {womenServicesLoading ? (
            <View
              style={{
                minHeight: 300,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={24} />
            </View>
          ) : womenServicesError ? (
            <View>
              <Refresh onRefresh={() => fetchWomenServices()} />
            </View>
          ) : womenServicesRes?.data.length === 0 ? (
            <View>
              <Empty />
            </View>
          ) : (
            <>{womanDataComponent()}</>
          )}

          {/* <View style={styles.categoryContainer}>
          <View style={styles.categories}>
            <View style={styles.categoryWrapper}>
              <TouchableOpacity
                style={styles.category}
                onPress={handleCategory}>
                <Image
                  source={require('../../assets/images/category/Troubleshooting.jpg')}
                  style={styles.image}
                />
                <Text style={styles.categoryText}>Fitness coaching</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryWrapper}>
              <TouchableOpacity
                style={styles.category}
                onPress={handleCategory}>
                <Image
                  source={require('../../assets/images/category/Troubleshooting.jpg')}
                  style={styles.image}
                />
                <Text style={styles.categoryText}>Yoga session</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryWrapper}>
              <TouchableOpacity
                style={styles.category}
                onPress={handleCategory}>
                <Image
                  source={require('../../assets/images/category/Troubleshooting.jpg')}
                  style={styles.image}
                />
                <Text style={styles.categoryText}>Hair styling</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryWrapper}>
              <TouchableOpacity
                style={styles.category}
                onPress={handleCategory}>
                <Image
                  source={require('../../assets/images/category/Troubleshooting.jpg')}
                  style={styles.image}
                />
                <Text style={styles.categoryText}>Wedding cake</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryWrapper}>
              <TouchableOpacity
                style={styles.category}
                onPress={handleCategory}>
                <Image
                  source={require('../../assets/images/category/Troubleshooting.jpg')}
                  style={styles.image}
                />
                <Text style={styles.categoryText}>Marriage therapy</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryWrapper}>
              <TouchableOpacity
                style={styles.category}
                onPress={handleCategory}>
                <Image
                  source={require('../../assets/images/category/Troubleshooting.jpg')}
                  style={styles.image}
                />
                <Text style={styles.categoryText}>Event makeup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> */}

          <Text style={styles.categoryHeader}>Half price deals</Text>

          {halfPriceResLoading ? (
            <View
              style={{
                minHeight: 300,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={24} />
            </View>
          ) : !halfPriceServicesRes ||
            halfPriceServicesRes?.data.length === 0 ||
            halfPriceError ? (
            <View
              style={{
                minHeight: 300,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Empty />
            </View>
          ) : (
            <Swiper
              showsButtons={false}
              autoplay={true}
              autoplayTimeout={12}
              showsPagination={false}
              horizontal
              style={styles.providerSwiper}
              loop={true}>
              {chunkArray(halfPriceServicesRes?.data, 2).map((item, index) => (
                <View
                  key={Math.random()}
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    width: width,
                    flex: 1,
                    paddingHorizontal: 8,
                  }}>
                  {item.map(service => (
                    <TouchableOpacity
                      key={Math.random()}
                      style={{width: '48%'}}
                      onPress={() => handleHalfPrice(service)}>
                      <View style={styles.providerImageWrapper1}>
                        <Image
                          source={{
                            uri: service.service_image
                              ? service.service_image
                              : 'https://via.placeholder.com/150',
                          }}
                          style={styles.fullImage1}
                        />
                      </View>
                      <Text style={styles.providerName1}>
                        {service.service_name}
                      </Text>
                      <Text style={styles.providerDescription1}>
                        <GetRating rating={service.review_rating} />
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          width: '100%',
                        }}>
                        <Text style={styles.chooseText}>
                          ${service.discounted_price}
                        </Text>
                        <Text style={styles.providerDescription2}>
                          ${service.real_price}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </Swiper>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.fab} onPress={handleFABPress}>
          <Icon name="briefcase-variant-outline" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerItem} onPress={handleHome}>
            <Icon
              name="home-outline"
              size={wp('7%')}
              color={isDarkMode ? '#FFF' : '#000'}
            />
            <Text style={styles.footerText}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={handlebooked}>
            <Icon
              name="calendar-check-outline"
              size={wp('7%')}
              color={isDarkMode ? '#FFF' : '#000'}
            />
            <Text style={styles.footerText}>BOOKED</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={handleChat}>
            <View style={{position: 'absolute', top: 0, right: -4}}>
              <TextCount />
            </View>
            <Icon
              name="chat-processing-outline"
              size={wp('7%')}
              color={isDarkMode ? '#FFF' : '#000'}
            />
            <Text style={styles.footerText}>MESSAGE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={handleprofile}>
            <Icons
              name="user"
              size={wp('7%')}
              color={isDarkMode ? '#FFF' : '#000'}
            />
            <Text style={styles.footerText}>PROFILE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaViewContainer>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
    scrollContainer: {
      flex: 1,
    },

    image: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: wp('3%'),
    },
    profileImage: {
      width: wp('10%'),
      height: wp('10%'),
      borderRadius: wp('5%'),
    },
    greeting: {
      marginLeft: wp('2%'),
      fontSize: wp('4%'),
      color: isDarkMode ? '#FFF' : '#000',
      textTransform: 'capitalize',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#333' : '#FFF',
      borderRadius: wp('2%'),
      borderWidth: 1,
      borderColor: '#51514C',
      margin: wp('3%'),
      paddingHorizontal: wp('2%'),
    },
    searchIcon: {
      marginRight: wp('2%'),
    },
    searchBar: {
      flex: 1,
      color: isDarkMode ? '#FFF' : '#51514C',
    },
    swiper: {
      height: hp('20%'),
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB',
      marginHorizontal: wp('4%'),
      borderRadius: 5,
      marginBottom: -300,
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'pink',
      marginHorizontal: wp('1%'),
      paddingTop: wp('18%'),
    },
    slideText: {
      color: isDarkMode ? '#FFF' : '#000',
    },
    categoryContainer: {
      padding: wp('3%'),
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
      position: 'relative',
      borderRadius: wp('2%'), // Adding borderRadius for category items
      overflow: 'hidden', // Ensure contents don't overflow the container
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
    },
    categoryWrapper: {
      width: '48%',
      aspectRatio: 1, // Maintain aspect ratio for each category item
      marginVertical: hp('1%'),
      borderRadius: wp('2%'), // Rounded corners for category items
      overflow: 'hidden', // Ensure contents don't overflow the container
    },
    category: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    categoryHeader: {
      fontSize: wp('4%'),
      color: isDarkMode ? '#FFF' : '#000',
      // backgroundColor: "#12CCB7",
      height: hp('6%'),
      borderRadius: wp('1%'),
      padding: wp('3%'),
      marginHorizontal: wp('3%'),
      marginBottom: wp('3%'),
      marginTop: wp('2%'),
      // alignSelf: 'center',
    },
    categoryHeader1: {
      fontSize: wp('4%'),
      color: isDarkMode ? '#FFF' : '#000',
      // backgroundColor: "#12CCB7",
      height: hp('6%'),
      borderRadius: wp('1%'),
      padding: wp('3%'),
      // marginHorizontal: wp('3%'),
      marginBottom: wp('3%'),
      marginTop: wp('2%'),
      // alignSelf: 'center',
    },
    categories: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    featuredHeader: {
      fontSize: wp('4%'),
      color: isDarkMode ? '#FFF' : '#000',
      // backgroundColor: "#12CCB7",
      height: hp('6%'),
      borderRadius: wp('1%'),
      padding: wp('3%'),
      marginHorizontal: wp('3%'),
      marginBottom: wp('3%'),
      marginTop: wp('2%'),
      // alignSelf: 'center',
    },
    providerSwiper: {
      height: hp('49%'),
      marginBottom: wp('-30%'),
      // marginTop: wp('-8%'),
    },
    providerWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: wp('3%'),
    },
    providerCard: {
      width: '50%', // Each card should take up 50% of the slide width
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#fff' : '#FFF',
      borderRadius: wp('2%'),
      padding: wp('3%'),
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#DDD',
      paddingHorizontal: wp('3%'),
      // marginHorizontal: wp('3%'),
      marginRight: wp('3%'),
    },
    heartIcon: {
      position: 'absolute',
      top: wp('3%'),
      right: wp('3%'),
      zIndex: 1, // Ensure the heart icon is above other content
    },
    providerImageWrapper: {
      width: '100%',
      height: wp('40%'),
      borderRadius: wp('2%'),
      overflow: 'hidden',
      marginBottom: wp('2%'),
    },

    providerCard1: {
      width: '50%', // Each card should take up 50% of the slide width
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: isDarkMode ? '#fff' : '#FFF',
      borderRadius: wp('2%'),
      padding: wp('3%'),
      // borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#DDD',
      paddingHorizontal: wp('3%'),
      // marginHorizontal: wp('3%'),
      marginRight: wp('3%'),
    },
    providerImageWrapper1: {
      width: '100%',
      height: wp('40%'),
      // borderRadius: wp('12%'),
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative',
    },
    chooseText: {
      color: '#12CCB7',
    },
    fullImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    fullImage1: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
      overflow: 'hidden',
    },
    providerName: {
      fontSize: wp('4%'),
      fontWeight: 'bold',
      color: isDarkMode ? '#021114' : '#021114',
      marginBottom: wp('1%'),
    },
    providerDescription: {
      fontSize: wp('3%'),
      color: isDarkMode ? '#021114' : '#021114',
      textAlign: 'center',
    },

    providerName1: {
      fontSize: wp('4%'),
      fontWeight: '400',
      color: isDarkMode ? '#fff' : '#021114',
      marginBottom: wp('1%'),
      textAlign: 'center',
      textTransform: 'capitalize',
    },
    providerDescription1: {
      fontSize: wp('4%'),
      color: isDarkMode ? '#fff' : '#021114',
      textAlign: 'center',
      gap: 2,
      display: 'flex',
      flexDirection: 'row',
    },
    providerDescription2: {
      fontSize: wp('4%'),
      color: isDarkMode ? '#fff' : '#021114',
      textAlign: 'center',
      textDecorationLine: 'line-through',
    },
    likeButton: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#12CCB7', // Default color
    },
    liked: {
      backgroundColor: 'red', // Color when liked
    },
    text: {
      color: 'darkgreen', // Text color
      borderWidth: 1,
      borderColor: 'darkgreen',
      backgroundColor: 'lightgreen',
      padding: wp('1%'),
      marginTop: wp('6.%'),
      borderBottomLeftRadius: wp('5%'),
    },
    slideimage: {
      width: wp('40%'),
      height: hp('60%'),
      resizeMode: 'repeat',
    },

    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#021114' : '#FFF',
      paddingVertical: hp('1%'),
    },
    footerItem: {
      alignItems: 'center',
    },
    footerText: {
      fontSize: wp('3%'),
      color: isDarkMode ? '#FFF' : '#000',
    },

    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    modalContent: {
      marginHorizontal: wp('5%'),
      borderRadius: wp('2%'),
      padding: wp('5%'),
      marginBottom: wp('51%'),
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp('2%'),
    },
    modalSearchInput: {
      flex: 1,
      height: hp('6%'),
      borderColor: '#CCC',
      borderWidth: 1,
      borderRadius: wp('2%'),
      paddingHorizontal: wp('3%'),
    },
    optionsContainer: {
      flexDirection: 'column',
    },
    optionsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp('1%'),
    },
    recentText: {
      fontWeight: 'bold',
      fontSize: 25,
    },
    clearAllText: {
      color: '#12CCB7',
      fontWeight: '700',
    },
    optionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp('1%'),
      height: wp('12%'),
    },
    optionText: {
      fontSize: wp('5%'), // Increased font size
    },
    fab: {
      position: 'absolute',
      right: wp('5%'), // 5% from the right
      bottom: hp('8%'), // 5% from the bottom
      width: wp('14%'), // 14% width
      height: wp('14%'), // 14% height
      borderRadius: wp('7%'), // 50% of width/height for perfect circle
      backgroundColor: '#00C9A7',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },

    wrapper: {
      height: 200, // Adjust the height as needed
    },
    firstHalfSlide: {
      flexDirection: 'row', // Align cards in a row
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
      width: '100%', // Each card takes up 45% of the width
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    price: {
      fontSize: 18,
      color: 'green',
    },
    originalPrice: {
      fontSize: 16,
      textDecorationLine: 'line-through',
      color: 'grey',
    },
    rating: {
      fontSize: 16,
      color: 'orange',
    },
  });

export default HomeScreen;
