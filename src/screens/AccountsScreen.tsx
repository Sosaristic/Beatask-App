import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import SafeAreaViewContainer from '../components/SafeAreaViewContainer';
import useCustomQuery from '../hooks/useCustomQuery';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Text, Card, Portal, Dialog} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  CustomButton,
  CustomErrorModal,
  CustomInput,
  CustomModal,
  Loader,
} from '../components';
import Refresh from '../components/Refresh';
import {ProviderAccountsType} from '../interfaces/apiResponses';
import Empty from '../components/Empty';
import {customTheme} from '../custom_theme/customTheme';
import {Modal} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useUserStore} from '../store/useUserStore';
import {makeApiRequest} from '../utils/helpers';

const validationSchema = Yup.object().shape({
  account_holder_name: Yup.string().required('Account holder name is required'),
  account_number: Yup.string().required('Account number is required'),
  bank_name: Yup.string().required('Bank name is required'),
  routing_number: Yup.string().required("Routing number is required")
});

export type AccountRes = {
  message: string;
  data: ProviderAccountsType[];
};

type ValuesType = {
  account_holder_name: string;
  account_number: string;
  bank_name: string;
  routing_number: string
};

const AccountsScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  console.log("color scheme", colorScheme);
  
  const {user} = useUserStore(state => state);
  const [showModal, setShowModal] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
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
    successMessage: 'Account added successfully',
    loadingMessage: 'Processing',
    requestLoading: false,
    showModal: false,
  });
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const handleFormSubmit = async (values: ValuesType) => {
    setShowModal(false);
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });

    const payload = {...values, provider_id: user?.id};

    const {data, error} = await makeApiRequest(
      '/add-bank-account',
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
      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          showModal: false,
        });
        setShowModal(false);
        refetch();
      }, 3000);
    }
  };

  const handleRemoveAccount = async (id: number) => {
    setShowDialog(false);
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      successMessage: 'Account deleted successfully',
      showModal: true,
    });
    const {data, error} = await makeApiRequest(`/delete-bank-account`, 'POST', {
      bank_account_id: id,
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
      setShowSuccessModal({
        ...showSuccessModal,
        requestLoading: false,
        successMessage: 'Account deleted successfully',
        showModal: true,
      });
      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          successMessage: 'Account deleted successfully',
          showModal: false,
        });
        setShowDialog(false);
        refetch();
      }, 3000);
    }
  };

  return (
    <SafeAreaViewContainer
      edges={['right', 'bottom', 'left']}
      style={{marginHorizontal: wp('5%'), paddingTop: hp('2%'), gap: 20}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 20, paddingBottom: hp('10%')}}>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Refresh onRefresh={() => refetch()} />
        ) : data?.data.length === 0 || !data ? (
          <Empty />
        ) : (
          data.data.map((item, index) => (
            <Card key={item.id}>
              <Card.Content
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  padding: 10,
                }}>
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
                  onPress={() => setShowDialog(true)}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </Card.Content>

              <Portal>
                <Dialog
                  visible={showDialog}
                  onDismiss={() => setShowDialog(false)}>
                  <Dialog.Title>
                    <Text variant="titleMedium">Remove Account</Text>
                  </Dialog.Title>
                  <Dialog.Content>
                    <Text>Are you sure you want to remove this Account?</Text>
                  </Dialog.Content>
                  <Dialog.Actions style={{justifyContent: 'space-around'}}>
                    <TouchableOpacity onPress={() => setShowDialog(false)}>
                      <Text>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRemoveAccount(item.id)}>
                      <Text>Yes</Text>
                    </TouchableOpacity>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </Card>
          ))
        )}

        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
          onDismiss={() => setShowModal(false)}
          onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: isDarkMode
                    ? customTheme.lightDarkColor
                    : '#fff',
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  variant="titleLarge"
                  style={{marginVertical: 10, fontWeight: 500}}>
                  Add Account
                </Text>
                <TouchableOpacity>
                  <AntDesign
                    name="close"
                    size={24}
                    color={isDarkMode ? '#fff' : '#000'}
                    onPress={() => setShowModal(false)}
                  />
                </TouchableOpacity>
              </View>
              <Formik
                initialValues={{
                  account_number: '',
                  account_holder_name: '',
                  bank_name: '',
                  routing_number: "",
                }}
                onSubmit={values => handleFormSubmit(values)}
                validationSchema={validationSchema}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => {
                  return (
                    <View style={{gap: 20}}>
                      <CustomInput
                        onChangeText={handleChange('account_holder_name')}
                        onBlur={handleBlur('account_holder_name')}
                        value={values.account_holder_name}
                        label="Account Holder Name"
                        placeholder="Enter account name"
                        errorText={
                          errors.account_holder_name &&
                          touched.account_holder_name
                            ? errors.account_holder_name
                            : ''
                        }
                      />
                      <CustomInput
                        onChangeText={handleChange('account_number')}
                        onBlur={handleBlur('account_number')}
                        type="number"
                        value={values.account_number}
                        label="Account Number"
                        placeholder="Enter account number"
                        errorText={
                          errors.account_number && touched.account_number
                            ? errors.account_number
                            : ''
                        }
                      />
                       <CustomInput
                        onChangeText={handleChange('routing_number')}
                        onBlur={handleBlur('routing_number')}
                        type="number"
                        value={values.routing_number}
                        label="Account Routing Number"
                        placeholder="Enter account routing number"
                        errorText={
                          errors.routing_number && touched.routing_number
                            ? errors.routing_number
                            : ''
                        }
                      />
                      <CustomInput
                        onChangeText={handleChange('bank_name')}
                        onBlur={handleBlur('bank_name')}
                        value={values.bank_name}
                        label="Bank Name"
                        placeholder="Enter bank name"
                        errorText={
                          errors.bank_name && touched.bank_name
                            ? errors.bank_name
                            : ''
                        }
                      />
                      <CustomButton buttonText="Save" onPress={handleSubmit} />
                    </View>
                  );
                }}
              </Formik>
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
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: hp('3%'),
          zIndex: 100,
          width: '100%',

          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={24}
            color={'black'}
          />
          <Text variant="titleMedium" style={{color: 'black'}}>
            Add New Account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaViewContainer>
  );
};

export default AccountsScreen;

const styles = StyleSheet.create({
  addButton: {
    width: '60%',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: customTheme.primaryColor,
    alignItems: 'center',
    borderRadius: 20,
    gap: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});
