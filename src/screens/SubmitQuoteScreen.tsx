import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Card, Checkbox, Text} from 'react-native-paper';
import useCustomQuery from '../hooks/useCustomQuery';
import {User, useUserStore} from '../store/useUserStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Panel from '../components/Panel';
import {ScrollView} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {CustomButton, CustomErrorModal, CustomModal} from '../components';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {makeApiRequest} from '../utils/helpers';
import {QuoteSentRes} from '../interfaces/apiResponses';

interface Service {
  id: number;
  category_id: string;
  sub_category: string;
  service_name: string;
  provider_id: string;
  years_of_experience: string;
  experience_document: string;
  service_image: string;
  real_price: string;
  discounted_price: string;
  service_description: string;
  availability_dates_times: string | null;
  review_rating: number | null;
  is_completed: number;
  created_at: string; // If it's an ISO string timestamp
  updated_at: string; // If it's an ISO string timestamp
}

type ServiceRes = {
  message: string;
  data: Service[];
};
type ScreenProps = {
  route: RouteProp<RootStackParamList, 'send_quote'>;
  navigation: StackNavigationProp<RootStackParamList, 'send_quote'>;
};

type UpdatedRes = {
  data: User[];
  msg: string;
};

const SubmitQuoteScreen = ({route, navigation}: ScreenProps) => {
  const colorScheme = useColorScheme();
  const {params} = route;
  const {user, actions} = useUserStore();
  const [selectedAccount, setSelectedAccount] = useState<Service | null>(null);
  const [openPanel, setOpenPanel] = useState(false);
  const [notes, setNotes] = useState('');
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

  const {data, isError, isLoading, refetch} = useCustomQuery<ServiceRes>(
    ['provider-services'],
    '/get-provider-service',
    'POST',
    {
      provider_id: user?.id,
    },
  );

  const isDarkMode = colorScheme === 'dark';

  const handleRequest = async () => {
    if (!selectedAccount || !notes) {
      return;
    }
    setOpenPanel(false);
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const payload = {
      ...params,
      quote_message: notes,
      service_id: selectedAccount?.id,
    };

    const {data: saveResponse, error} = await makeApiRequest<QuoteSentRes>(
      '/send-quotes',
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
    if (saveResponse) {
      const {data, error} = await makeApiRequest<UpdatedRes>(
        '/get-provider-updated-data',
        'post',
        {provider_id: user?.id},
      );

      if (data) {
        actions.login(data.data[0]);
      }

      actions.login(saveResponse.user);
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

        navigation.goBack();
      }, 3000);
    }
  };
  return (
    <View style={{padding: wp('5%')}}>
      <View>
        <Text variant="labelLarge">Enter Note</Text>
        <TextInput
          style={[
            {
              borderRadius: 5,
              height: hp('15%'),
              borderWidth: 1,
              borderStyle: 'dotted',
              color: isDarkMode ? '#FFFFFF' : '#000000',
              backgroundColor: isDarkMode ? '#51514C' : '#FFFFFF',
              textAlignVertical: 'top', // Align text and placeholder to the top
              // Ensure no top margin
              paddingVertical: 6, // Ensure no top padding
              paddingHorizontal: 8,
            },
          ]}
          placeholder="Enter Notes"
          onChangeText={text => setNotes(text)}
          value={notes}
          placeholderTextColor={isDarkMode ? '#CCCCCC' : '#707070'}
          multiline
          numberOfLines={4}
        />
      </View>

      <Text style={{marginTop: 10}}>Select Service</Text>

      <TouchableOpacity
        style={[
          styles.dropdown,
          {
            borderColor: isDarkMode ? 'transparent' : '#ccc',
            backgroundColor: isDarkMode ? '#51514c' : 'white',
          },
        ]}
        onPress={() => setOpenPanel(true)}>
        <Text style={styles.dropdownText}>
          {selectedAccount?.service_name || 'Select Service'}
        </Text>
      </TouchableOpacity>

      <CustomButton
        style={{marginVertical: 10}}
        buttonText="Submit"
        onPress={handleRequest}
        disabled={!selectedAccount || !notes}
      />

      <Panel
        showModal={openPanel}
        setShowModal={setOpenPanel}
        title="Select Service">
        <ScrollView
          style={{gap: 10, maxHeight: '90%'}}
          contentContainerStyle={{padding: 10}}
          showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#12CCB7" />
          ) : isError || !data ? (
            <Text>Something went wrong</Text>
          ) : data?.data?.length === 0 ? (
            <Text>No service found</Text>
          ) : (
            data.data.map(item => (
              <Card elevation={0} key={item.id}>
                <Card.Content
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <View style={{gap: 3}}>
                    <Text
                      variant="titleMedium"
                      style={{textTransform: 'capitalize'}}>
                      {item.service_name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{marginLeft: 'auto'}}
                    onPress={() => {
                      setSelectedAccount(item);
                      setOpenPanel(false);
                    }}>
                    <Checkbox.Item
                      mode="android"
                      status={
                        selectedAccount === item ? 'checked' : 'unchecked'
                      }
                      label=""
                    />
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>
      </Panel>
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

export default SubmitQuoteScreen;

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    height: hp('7.5%'),
    padding: wp('2%'),
    paddingHorizontal: 10, // Padding inside the container
    paddingVertical: 4, // Vertical padding
    borderWidth: 1, // Border width
    borderRadius: 8,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: wp('4%'),
    color: '#666',
  },
});
