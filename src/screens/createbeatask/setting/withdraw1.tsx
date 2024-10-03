import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  CustomButton,
  CustomErrorModal,
  CustomInput,
  CustomModal,
} from '../../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useCustomQuery from '../../../hooks/useCustomQuery';
import {useUserStore} from '../../../store/useUserStore';
import {AccountRes} from '../../AccountsScreen';
import Panel from '../../../components/Panel';
import {Card, Checkbox, Text} from 'react-native-paper';
import {ProviderAccountsType} from '../../../interfaces/apiResponses';
import {makeApiRequest} from '../../../utils/helpers';
import {useQueryClient} from '@tanstack/react-query';

const WithdrawalScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const {user} = useUserStore(state => state);
  const isDarkMode = colorScheme === 'dark';
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [selectedAccount, setSelectedAccount] =
    useState<ProviderAccountsType | null>(null);

  const queryClient = useQueryClient();

  const {data, isError, isLoading, refetch} = useCustomQuery<AccountRes>(
    ['provider_accounts'],
    '/show-bank-account',
    'POST',
    {
      provider_id: user?.id,
    },
  );

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Withdrawal Request Submitted',
    loadingMessage: 'Processing',
    requestLoading: false,
    showModal: false,
  });
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });
    const payload = {
      amount,
      provider_id: user?.id,
      bank_id: selectedAccount?.id,
    };
    const {data, error} = await makeApiRequest(
      '/withdraw-request',
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
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        showModal: true,
      });
      queryClient.invalidateQueries({queryKey: ['list-transactions-history']});
      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          requestLoading: false,
          showModal: false,
        });
        setAmount('');
        setSelectedAccount(null);
        setOpenPanel(false);
        setSubmitting(false);
      }, 3000);
    }
  };

  return (
    <View style={isDarkMode ? styles.containerDark : styles.containerLight}>
      <CustomInput
        label="Enter amount"
        type="number"
        onChangeText={text => setAmount(text)}
        errorText={submitting && !amount ? 'Amount is required' : ''}
        placeholder="$50"
        value={amount}
      />

      <Text style={{marginVertical: 10}}>Select Account</Text>

      <TouchableOpacity
        style={[
          styles.dropdown,
          {borderColor: isDarkMode ? 'transparent' : '#ccc'},
        ]}
        onPress={() => setOpenPanel(true)}>
        <Text style={styles.dropdownText}>
          {selectedAccount?.account_number || 'Select Account'}
        </Text>
      </TouchableOpacity>
      {selectedAccount && (
        <Text variant="bodySmall" style={{textTransform: 'capitalize'}}>
          {selectedAccount?.bank_name +
            '-' +
            selectedAccount?.account_holder_name || ''}
        </Text>
      )}

      <CustomButton
        style={{marginTop: 20}}
        onPress={handleSubmit}
        buttonText="Continue"
        disabled={!amount || !selectedAccount}
      />

      <Panel
        showModal={openPanel}
        setShowModal={setOpenPanel}
        title="Select Account">
        <ScrollView
          style={{gap: 10, maxHeight: '90%'}}
          contentContainerStyle={{padding: 10}}
          showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#12CCB7" />
          ) : isError || !data ? (
            <Text>Something went wrong</Text>
          ) : data?.data?.length === 0 ? (
            <Text>No account found</Text>
          ) : (
            data.data.map(item => (
              <Card elevation={0} key={item.id}>
                <Card.Content
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <MaterialCommunityIcons
                    name="bank"
                    size={50}
                    color={isDarkMode ? '#fff' : '#000'}
                  />
                  <View style={{gap: 3}}>
                    <Text
                      variant="titleMedium"
                      style={{textTransform: 'capitalize'}}>
                      {item.bank_name}
                    </Text>
                    <Text>{item.account_number}</Text>
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

const styles = StyleSheet.create({
  containerLight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: wp('5%'),
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#000000',
    padding: wp('5%'),
  },
  label: {
    fontSize: wp('4%'),
    marginBottom: wp('2%'),
  },
  input: {
    width: '100%',
    padding: wp('2%'),
    borderRadius: 5,
    marginBottom: wp('5%'),
  },
  inputLight: {
    backgroundColor: '#ddd',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#333',
    color: '#fff',
  },
  textLight: {
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
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

export default WithdrawalScreen;
