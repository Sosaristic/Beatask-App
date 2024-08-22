import {ActivityIndicator, Modal} from 'react-native';
import {Text} from 'react-native';
import {Image} from 'react-native';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type ModalProps = {
  successTitle: string;
  successMessage: string;
  loadingMessage: string;
  showModal: boolean;
  requestLoading: boolean;
};

const CustomModal = ({
  showModal,
  successTitle,
  successMessage,
  loadingMessage,
  requestLoading,
}: ModalProps) => {
  return (
    <Modal visible={showModal} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {!requestLoading ? (
            <>
              <Image
                source={require('../assets/images/verified.png')}
                style={styles.modalIcon}
              />
              <Text style={styles.modalTextSuccess}>{successTitle}</Text>
              <Text style={styles.modalText}>{successMessage}</Text>
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color="#12CCB7" />
              <Text style={styles.modalText}>{loadingMessage}</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: wp('10%'),
    paddingHorizontal: wp('6%'),
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: hp('2%'),
    color: '#010A0C', // Default text color
  },
  modalTextSuccess: {
    fontSize: wp('6%'),
    fontWeight: '700',
    marginBottom: hp('2%'),
    color: '#12CCB7', // Success text color
  },
  modalIcon: {
    width: wp('12%'),
    height: hp('6%'),
    marginBottom: hp('2%'),
  },
});
