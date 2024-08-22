import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  useColorScheme,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ErrorModalProps = {
  errorTitle: string;
  errorMessage: string;
  closeModal: () => void;
  isModalOpen: boolean;
};

const CustomErrorModal = ({
  errorTitle,
  errorMessage,
  closeModal,
  isModalOpen,
}: ErrorModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalOpen}
      onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon
              name="close-circle-outline"
              size={wp('10%')}
              color="red"
              style={styles.modalIcon}
            />
            <Text style={styles.modalText1}>{errorTitle}</Text>
            <Text style={styles.modalText2}>{errorMessage}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomErrorModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: wp('5%'), // Responsive padding
    borderRadius: wp('5%'), // Responsive border radius
    elevation: 5,
    alignItems: 'center',
  },
  modalText1: {
    textAlign: 'center',
    fontSize: wp('4%'), // Responsive font size
    marginBottom: hp('1%'), // Responsive margin bottom
    color: 'red',
    fontWeight: 'bold',
  },
  modalText2: {
    textAlign: 'center',
    fontSize: wp('4.5%'), // Responsive font size
    marginBottom: hp('1%'), // Responsive margin bottom
    color: 'red',
  },
  modalIcon: {
    marginBottom: hp('1%'), // Responsive margin bottom
  },
});
