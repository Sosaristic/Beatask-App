import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import SafeAreaViewContainer from '../components/SafeAreaViewContainer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Avatar, Dialog, Modal, Portal, Text} from 'react-native-paper';

import {useUserStore} from '../store/useUserStore';
import {FlatList} from 'react-native';
import {
  AcceptedQuote,
  Quotes,
  SingleServicePayload,
} from '../interfaces/apiResponses';

import {CustomErrorModal, CustomModal, Loader} from '../components';
import Empty from '../components/Empty';
import {customTheme} from '../custom_theme/customTheme';
import {makeApiRequest} from '../utils/helpers';
import {string} from 'yup';
import {Image} from 'react-native';
import useCustomQuery from '../hooks/useCustomQuery';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {useQueryClient} from '@tanstack/react-query';

type RootStackNavigationProp = NavigationProp<RootStackParamList, 'send_quote'>;

type RequestRes = {
  message: string;
  data: Quotes[];
};

type UpdatesRes = {
  msg: string;
  data: boolean;
  details: AcceptedQuote[];
};

const RenderItem = ({
  item,
  fetchData,
}: {
  item: AcceptedQuote;
  fetchData: () => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp>();
  const queryClient = useQueryClient();

  const [dialogMessage, setDialogMessage] = useState({
    header: 'Accept Quote',
    message: 'Are you sure you want to accept this quote?',
    type: 'accept',
  });

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Quote Accepted',
    loadingMessage: 'Processing..',
    requestLoading: false,
    showModal: false,
  });

  const approveRequest = async (item: Quotes) => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
      loadingMessage: 'Requesting..',
      successMessage:
        dialogMessage.type === 'accept' ? 'Quote Accepted' : 'Quote Rejected',
    });

    const url =
      dialogMessage.type === 'accept'
        ? '/update-confirm-quote'
        : '/update-reject-quote';

    const {data, error} = await makeApiRequest<UpdatesRes>(url, 'POST', {
      quote_id: item.id,
    });
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
      setModalVisible(false);
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: true,
        successMessage:
          dialogMessage.type === 'accept' ? 'Quote Accepted' : 'Quote Rejected',
      });
      if (dialogMessage.type !== 'accept') {
        setTimeout(() => {
          setShowSuccessModal({
            ...showSuccessModal,
            showModal: false,
          });

          queryClient.invalidateQueries({queryKey: ['list-quotes']});
          queryClient.invalidateQueries({queryKey: [' confirmed-quotes']});

          return;
        }, 3000);
      } else {
        const payload: SingleServicePayload = {
          category_name: data.details[0].service.category.category,
          sub_category_name: data.details[0].service.sub_category,
          category_id: data.details[0].service.category.id,
          service_name: data.details[0].service.service_name,
          service_id: data.details[0].service.id,
          provider_id: data.details[0].provider.id as number,
          real_price: data.details[0].service.real_price,
          service_description: data.details[0].service.service_description,
          provider_name: data.details[0].provider.name,
          service_image: data.details[0].service.service_image,
        };

        setTimeout(() => {
          setShowSuccessModal({
            ...showSuccessModal,
            showModal: false,
          });

          queryClient.invalidateQueries({queryKey: ['list-quotes']});
          queryClient.invalidateQueries({queryKey: [' confirmed-quotes']});

          navigation.navigate('singleservice', {data: payload});
        }, 3000);
      }
    }
  };

  const handleDialog = (type: 'reject' | 'accept') => {
    if (type === 'reject') {
      setDialogMessage({
        header: 'Reject Quote',
        message: 'Are you sure you want to reject this quote?',
        type: 'reject',
      });
    }
    if (type === 'accept') {
      setDialogMessage({
        header: 'Accept Quote',
        message: 'Are you sure you want to accept this quote?',
        type: 'accept',
      });
    }
    setModalVisible(true);
  };

  // navigate to single service screen
  const handleView = () => {
    const payload: SingleServicePayload = {
      category_name: item.service.category.category,
      sub_category_name: item.service.sub_category,
      category_id: item.service.category.id,
      service_name: item.service.service_name,
      service_id: item.service.id,
      provider_id: item.provider.id as number,
      real_price: item.service.real_price,
      service_description: item.service.service_description,
      provider_name: item.provider.name,
      service_image: item.service.service_image,
    };

    navigation.navigate('singleservice', {data: payload});
  };

  return (
    <View>
      <View style={{flexDirection: 'row', marginTop: hp('2%'), gap: wp('2%')}}>
        <Pressable onPress={() => handleView()}>
          <Avatar.Image source={{uri: item.provider.profile_image}} size={70} />
        </Pressable>

        <View style={{flex: 1, gap: 4}}>
          <Text
            variant="titleMedium"
            style={{fontWeight: 600, textTransform: 'capitalize'}}>
            {item.provider.name}
          </Text>
          <Text variant="bodySmall">{item.quote_message}</Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              marginTop: 10,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => handleDialog('reject')}
              style={[
                styles.button,
                {
                  borderColor: customTheme.greyColor,
                  flex: 1,
                },
              ]}>
              <Text>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDialog('accept')}
              style={[
                styles.button,
                {backgroundColor: customTheme.primaryColor, flex: 1},
              ]}>
              <Text style={{color: customTheme.darkColor}}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>
            <Text variant="titleMedium">{dialogMessage.header}</Text>
          </Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage.message}</Text>
          </Dialog.Content>
          <Dialog.Actions style={{justifyContent: 'space-around'}}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>No</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => approveRequest(item)}>
              <Text>Yes</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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

const AcceptedQuoteCard = ({item}: {item: AcceptedQuote}) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const isDarkMode = colorScheme === 'dark';

  const payload: SingleServicePayload = {
    category_name: item.service.category.category,
    sub_category_name: item.service.sub_category,
    category_id: item.service.category.id,
    service_name: item.service.service_name,
    service_id: item.service.id,
    provider_id: item.provider.id as number,
    real_price: item.service.real_price,
    service_description: item.service.service_description,
    provider_name: item.provider.name,
    service_image: item.service.service_image,
  };

  const handleView = () => {
    navigation.navigate('singleservice', {data: payload});
  };

  return (
    <View style={[styles.card, isDarkMode && styles.cardDark]}>
      <View style={{height: 150, width: 150, position: 'relative'}}>
        <Image
          source={{uri: item.service.service_image}}
          style={styles.imageAvatar}
        />
      </View>
      <Text
        style={[
          styles.name,
          isDarkMode && styles.textDark,
          {textTransform: 'capitalize'},
        ]}>
        {`${item.provider.name}`}
      </Text>
      <Text
        numberOfLines={3}
        ellipsizeMode="tail"
        style={[styles.description, isDarkMode && styles.textDark]}>
        {item?.service.service_description}
      </Text>
      <View style={styles.ratingContainer}>
        {/* <Text style={[styles.rating, isDarkMode && styles.textDark]}>
        <GetRating rating={item.review_rating} />
      </Text> */}

        {/* <Text style={[styles.reviews, isDarkMode && styles.textDark]}>
        ( {item?.})
      </Text> */}
      </View>
      {/* <Text style={[styles.price, isDarkMode && styles.textDark1]}>
      ${item?.real_price}
    </Text> */}
      <TouchableOpacity
        style={[
          styles.buttonStyle,
          isDarkMode && styles.buttonDark,
          {marginTop: 'auto'},
        ]}>
        <Text style={styles.buttonText} onPress={handleView}>
          VIEW
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const QuotesReceivedScreen = () => {
  const {user} = useUserStore(state => state);
  const [activeTab, setActiveTab] = useState(1);
  const {data, isLoading, isError, refetch} = useCustomQuery<{
    message: string;
    data: AcceptedQuote[];
  }>(['list-quotes'], '/list-qoutes', 'POST', {
    user_id: user?.id,
  });

  const {
    data: acceptedData,
    isLoading: acceptedLoading,
    error: acceptedError,
  } = useCustomQuery<{message: string; data: AcceptedQuote[]}>(
    ['confirmed-quotes'],
    '/get-confirmed-quotes',
    'POST',
    {
      user_id: user?.id,
    },
  );

  return (
    <SafeAreaViewContainer edges={['right', 'bottom', 'left']}>
      <View
        style={{
          flexDirection: 'row',
          gap: wp('2%'),
          marginTop: 8,
          paddingHorizontal: wp('5%'),
        }}>
        <Pressable
          onPress={() => setActiveTab(1)}
          style={[
            styles.topTab,
            {
              backgroundColor:
                activeTab === 1 ? customTheme.primaryColor : '#51514C',
            },
          ]}>
          <Text
            style={{
              color: activeTab === 1 ? customTheme.lightDarkColor : 'white',
            }}>
            Awaiting
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.topTab,
            {
              backgroundColor:
                activeTab === 2 ? customTheme.primaryColor : '#51514C',
            },
          ]}
          onPress={() => setActiveTab(2)}>
          <Text
            style={{
              color: activeTab === 2 ? customTheme.lightDarkColor : 'white',
            }}>
            Accepted
          </Text>
        </Pressable>
      </View>

      {activeTab === 1 && (
        <>
          {isLoading ? (
            <Loader />
          ) : isError || !data?.data || data?.data.length === 0 ? (
            <Empty />
          ) : (
            <FlatList
              data={data.data}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <RenderItem item={item} fetchData={refetch} />
              )}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              style={{paddingHorizontal: wp('5%')}}
            />
          )}
        </>
      )}

      {activeTab === 2 && (
        <>
          {acceptedLoading ? (
            <Loader />
          ) : acceptedError || acceptedData?.data.length === 0 ? (
            <Empty />
          ) : (
            <FlatList
              data={acceptedData?.data}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              renderItem={({item}) => <AcceptedQuoteCard item={item} />}
              style={{paddingHorizontal: wp('1%')}}
              contentContainerStyle={{gap: hp('2%')}}
            />
          )}
        </>
      )}
    </SafeAreaViewContainer>
  );
};

export default QuotesReceivedScreen;

const styles = StyleSheet.create({
  image: {
    height: hp('15%'),
    width: wp('40%'),
    objectFit: 'cover',
    borderRadius: 10,
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

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 4,
    borderWidth: 1,
  },
  topTab: {
    flexDirection: 'row',
    gap: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#51514C',
    padding: 8,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#010A0C',
  },
  list: {
    padding: 10,
  },
  card: {
    width: wp('45%'),
    margin: 5,
    padding: 10,
    backgroundColor: '#51514C',
    borderRadius: 10,
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: '#fff',
  },
  imageAvatar: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
    objectFit: 'cover',
  },
  name: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
  },
  textDark: {
    color: '#010A0C',
  },
  textDark1: {
    color: '#12CCB7',
  },
  description: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: wp('4%'),
    marginRight: 5,
    color: '#fff',
  },
  reviews: {
    fontSize: wp('4%'),
    color: '#fff',
  },
  price: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#12CCB7',
  },
  buttonStyle: {
    backgroundColor: '#00ced1',
    padding: 10,
    borderRadius: 5,
  },
  buttonDark: {
    backgroundColor: '#008b8b',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#51514C',
    marginVertical: wp('4%'),
  },
});
