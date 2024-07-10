import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, useColorScheme } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const InquiryScreen: React.FC = () => {
  const [activeButtons, setActiveButtons] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleButtonPress = (buttonName: string) => {
    if (activeButtons.includes(buttonName)) {
      // If button is already active, deactivate it
      setActiveButtons((prev) => prev.filter((name) => name !== buttonName));
    } else {
      // If button is not active, activate it
      setActiveButtons((prev) => [...prev, buttonName]);
    }
  };

  const handleSend = () => {
    // Show the modal
    setModalVisible(true);

    // Automatically hide the modal after 5 seconds
    setTimeout(() => {
      setModalVisible(false);

      // Navigate to 'Homeimp' screen
      navigation.navigate('Homeimp' as never);
    }, 5000); // 5000 milliseconds = 5 seconds

    // You can also perform other actions upon sending here
  };

  // Define styles for light and dark mode
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, activeButtons.includes('Price reduction') && styles.activeButton]}
            onPress={() => handleButtonPress('Price reduction')}
          >
            <Text style={styles.buttonText}>Price reduction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, activeButtons.includes('Different schedule') && styles.activeButton]}
            onPress={() => handleButtonPress('Different schedule')}
          >
            <Text style={styles.buttonText}>Different schedule</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.row, styles.leftButtonContainer]}>
          <TouchableOpacity
            style={[
              styles.button,
              activeButtons.includes('Quote for extra service') && styles.activeButton,
              styles.leftButton, // Style for left-aligned button
            ]}
            onPress={() => handleButtonPress('Quote for extra service')}
          >
            <Text style={styles.buttonText}>Quote for extra service</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.messagehead}>Auto-fill message</Text>
        <View style={styles.messageContainer1}>
          <TextInput
            style={styles.input}
            multiline
            editable={false}
            value="I’m interested in your [service sub category] for [specific need]. My preferences are:
[Preferred date/time]
[Price]
[Additional details]"
          />
        </View>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={require('D:/beatask/src/assets/images/verified.png')} style={styles.modalIcon} />
            <Text style={styles.modalText}>Message sent</Text>
            <Text style={styles.modalSubText}>
              Your message has been sent to the service provider. You can continue the conversation on the message section.
            </Text>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>SEND</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define styles for light mode
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp('4%'),
  },
  buttonsContainer: {
    marginBottom: hp('2%'),
  },
  messagehead: {
    fontSize: 20,
    color: '#000',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Align buttons evenly across the row
    marginBottom: hp('2%'),
  },
  leftButtonContainer: {
    flexDirection: 'column-reverse',
    marginLeft: hp('2%'), // Make the left button row align properly
  },
  button: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('5%'),
    borderColor: '#000',
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: '#12CCB7',
    borderColor: '#12CCB7',
  },
  leftButton: {
    alignSelf: 'flex-start', // Align button content to the start (left side)
  },
  buttonText: {
    color: '#000',
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  messageContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: wp('2.5%'),
    padding: wp('3%'),
    marginBottom: hp('2%'),
  },
  messageContainer1: {
    backgroundColor: '#e0e0e0',
    borderRadius: wp('2.5%'),
    padding: wp('3%'),
    marginBottom: hp('2%'),
    marginTop: hp('2%'),
  },
  input: {
    color: '#000',
    fontSize: wp('4%'),
  },
  sendButton: {
    backgroundColor: '#12CCB7',
    paddingVertical: hp('2%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    marginTop: hp('4%'),
    marginHorizontal: wp('30%'),
  },
  sendButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: wp('2.5%'),
    marginHorizontal: wp('18%'),
    padding: wp('5%'),
    alignItems: 'center',
  },
  modalIcon: {
    width: 70,
    height: 70,
    marginBottom: hp('2%'),
  },
  modalText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('1%'),
    color: '#000', // Text color set to black
  },
  modalSubText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
    color: '#000', // Text color set to black
  },
});

// Define styles for dark mode
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: wp('4%'),
  },
  buttonsContainer: {
    marginBottom: hp('2%'),
  },
  messagehead: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Align buttons evenly across the row
    marginBottom: hp('2%'),
  },
  leftButtonContainer: {
    flexDirection: 'column-reverse',
    marginLeft: hp('2%'), // Make the left button row align properly
  },
  button: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('5%'),
    borderColor: '#fff',
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: '#12CCB7',
    borderColor: '#12CCB7',
  },
  leftButton: {
    alignSelf: 'flex-start', // Align button content to the start (left side)
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  messageContainer: {
    backgroundColor: '#021114',
    borderRadius: wp('2.5%'),
    padding: wp('3%'),
    marginBottom: hp('2%'),
  },
  messageContainer1: {
    backgroundColor: '#333',
    borderRadius: wp('2.5%'),
    padding: wp('3%'),
    marginBottom: hp('2%'),
    marginTop: hp('2%'),
  },
  input: {
    color: '#fff',
    fontSize: wp('4%'),
  },
  sendButton: {
    backgroundColor: '#12CCB7',
    paddingVertical: hp('2%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    marginTop: hp('4%'),
    marginHorizontal: wp('30%'),
  },
  sendButtonText: {
    color: '#000',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: wp('2.5%'),
    marginHorizontal: wp('18%'),
    padding: wp('5%'),
    alignItems: 'center',
  },
  modalIcon: {
    width: 70,
    height: 70,
    marginBottom: hp('2%'),
  },
  modalText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('1%'),
    color: '#000', // Text color set to black
  },
  modalSubText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
    color: '#000', // Text color set to black
  },
});

export default InquiryScreen;
