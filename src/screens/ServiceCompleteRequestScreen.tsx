import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useRef, useState} from 'react';
import SafeAreaViewContainer from '../components/SafeAreaViewContainer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dialog, Modal, Portal, Text} from 'react-native-paper';
import useFetch from '../hooks/useFetch';
import {useUserStore} from '../store/useUserStore';
import {FlatList} from 'react-native';
import {ServiceCompletion} from '../interfaces/apiResponses';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {CustomErrorModal, CustomModal, Loader} from '../components';
import Empty from '../components/Empty';
import {customTheme} from '../custom_theme/customTheme';
import {makeApiRequest} from '../utils/helpers';
import Rating from '../components/Rating';

type RequestRes = {
  message: string;
  data: ServiceCompletion[];
};

const RenderItem = ({
  item,
  fetchData,
}: {
  item: ServiceCompletion;
  fetchData: () => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [rateModal, setRateModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Request Approved',
    loadingMessage: 'Requesting..',
    requestLoading: false,
    showModal: false,
  });

  const [message, setMessage] = useState('');
  const reviewMessage = useRef<TextInput>(null);

  const approveRequest = async () => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });

    const {data, error} = await makeApiRequest(`/confirm-completion`, 'POST', {
      booking_id: item.booking_id,
      user_id: item.user_id,
      provider_id: item.provider_id,
      request_completion_id: item.id,
    });
    if (error) {
      console.log(error);
      console.log(error);
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
      });

      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          showModal: false,
        });
        setShowRating(true);
        setRateModal(true);
      }, 3000);
    }
  };

  const handleReview = async () => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
      successMessage: 'Review Submitted',
      loadingMessage: 'Processing',
    });
    const url = showRating ? `/add-reviews` : `/reject-completion`;
    const payload = showRating
      ? {
          booking_id: item.booking_id,
          user_id: item.user_id,
          provider_id: item.provider_id,
          rating_stars: rating,
          review_message: message,
        }
      : {
          booking_id: item.booking_id,
          user_id: item.user_id,
          provider_id: item.provider_id,
          request_completion_id: item.id,
          reason: message,
        };
    const {data, error} = await makeApiRequest(url, 'POST', payload);
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
        successMessage: showRating ? 'Review Submitted' : 'Request Rejected',
        loadingMessage: 'Processing',
      });

      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          showModal: false,
          successMessage: showRating ? 'Review Submitted' : 'Request Rejected',
          loadingMessage: 'Processing',
        });
        fetchData();
      }, 3000);
    }
  };

  const handleRatingChange = (rating: number) => {
    setRating(rating); // Capture the rating value in the parent state
  };

  return (
    <View>
      <View style={{flexDirection: 'row', marginTop: hp('2%'), gap: wp('2%')}}>
        <Image
          source={{
            uri: item.booked_service.service.service_image,
          }}
          style={styles.image}
        />
        <View style={{flex: 1}}>
          <Text variant="titleMedium">{item.provider.name}</Text>
          <Text variant="bodyMedium">
            {item.booked_service.service.sub_category}
          </Text>
          <Text variant="bodySmall">{item.notes}</Text>
          <View
            style={{
              flexDirection: 'row',
              gap: wp('2%'),
              alignItems: 'center',
              marginTop: 10,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => setRateModal(true)}>
              <SimpleLineIcons name="close" size={30} color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <SimpleLineIcons name="check" size={30} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>
            <Text variant="titleMedium">Approve Request</Text>
          </Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to approve this complete request?</Text>
          </Dialog.Content>
          <Dialog.Actions style={{justifyContent: 'space-around'}}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>No</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={approveRequest}>
              <Text>Yes</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={rateModal}
          onDismiss={() => setRateModal(false)}
          dismissable={showRating ? false : true}>
          <Dialog.Title>
            <Text variant="titleMedium">
              {showRating ? 'Rate This Service' : 'Reject Request'}
            </Text>
          </Dialog.Title>
          <Dialog.Content>
            {showRating && <Rating onRatingChange={handleRatingChange} />}

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
              value={message}
              onChangeText={text => setMessage(text)}
              placeholder={
                showRating ? 'Review Message' : 'Reasons for Rejection'
              }
              placeholderTextColor={isDarkMode ? '#CCCCCC' : '#707070'}
              multiline
              numberOfLines={2}
            />
          </Dialog.Content>
          <Dialog.Actions style={{justifyContent: 'space-around'}}>
            <TouchableOpacity
              onPress={handleReview}
              disabled={showRating ? !rating || !message : !message}
              style={{
                backgroundColor: customTheme.primaryColor,
                borderRadius: 10,
              }}>
              <Text variant="titleMedium" style={{padding: 10}}>
                Submit
              </Text>
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

const ServiceCompleteRequestScreen = () => {
  const {user} = useUserStore(state => state);
  console.log(user?.id);
  const {data, loading, error, fetchData} = useFetch<RequestRes>(
    '/list-completed-serices-requests',
    'POST',
    {
      user_id: user?.id,
    },
  );

  return (
    <SafeAreaViewContainer edges={['right', 'bottom', 'left']}>
      {loading ? (
        <Loader />
      ) : error || data?.data.length === 0 ? (
        <Empty />
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <RenderItem item={item} fetchData={fetchData} />
          )}
          style={{paddingHorizontal: wp('5%')}}
        />
      )}
    </SafeAreaViewContainer>
  );
};

export default ServiceCompleteRequestScreen;

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
});
