import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/AntDesign';

type ModalProps = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  children: React.ReactNode;
  title: string;
};

const Panel = ({showModal, setShowModal, children, title}: ModalProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onDismiss={() => setShowModal(false)}
      onRequestClose={() => setShowModal(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              variant="titleMedium"
              style={{marginVertical: 10, fontWeight: 500}}>
              {title}
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
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default Panel;

const styles = StyleSheet.create({
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
