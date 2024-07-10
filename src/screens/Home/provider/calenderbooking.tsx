import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, useColorScheme, TouchableOpacity, Modal, Image, } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const CleaningServiceRequest: React.FC = () => {
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; marked: boolean; selectedColor: string, times: string[] } }>({});
    const [instructions, setInstructions] = useState('');
    const [instructionsLength, setInstructionsLength] = useState(0);
    const [category] = useState('Home management');
    const [subCategory] = useState('Residential cleaning services');
    const [bookingFee] = useState(2);
    const [serviceFee] = useState(20);
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility


    const handleSend = () => {
        // Show the modal
        setModalVisible(true);

        // Automatically hide the modal after 5 seconds
        setTimeout(() => {
            setModalVisible(false);

            // Navigate to 'Homeimp' screen
            navigation.navigate('Home' as never);
        }, 5000); // 5000 milliseconds = 5 seconds

        // You can also perform other actions upon sending here
    };
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const handleDateChange = (day: { dateString: string }) => {
        setSelectedDates(prevSelectedDates => {
            const newSelectedDates = { ...prevSelectedDates };
            if (newSelectedDates[day.dateString]) {
                delete newSelectedDates[day.dateString];
            } else {
                newSelectedDates[day.dateString] = { selected: true, marked: true, selectedColor: '#12CCB7', times: [] };
            }
            return newSelectedDates;
        });
    };

    const handleTimeChange = (date: string, time: string) => {
        setSelectedDates(prevSelectedDates => {
            const newSelectedDates = { ...prevSelectedDates };
            if (!newSelectedDates[date].times) {
                newSelectedDates[date].times = [];
            }
            if (newSelectedDates[date].times.includes(time)) {
                newSelectedDates[date].times = newSelectedDates[date].times.filter(t => t !== time);
            } else {
                newSelectedDates[date].times.push(time);
            }
            return newSelectedDates;
        });
    };

    const handleInstructionsChange = (text: string) => {
        if (text.length <= 100) {
            setInstructions(text);
            setInstructionsLength(text.length);
        }
    };

    const totalCost = bookingFee + serviceFee;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
        const dayOfMonth = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        const getOrdinalSuffix = (day: number) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };

        const ordinalSuffix = getOrdinalSuffix(dayOfMonth);

        return `${dayOfWeek} ${dayOfMonth}${ordinalSuffix} ${month} ${year}`;
    };

    const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

    const styles = getStyles(isDarkMode);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.header}>Select date</Text>
                <Calendar
                    onDayPress={handleDateChange}
                    markedDates={selectedDates}
                />
                <View style={styles.selectedDatesContainer}>
                    {Object.keys(selectedDates).map(date => (
                        <View key={date} style={styles.selectedDateContainer}>
                            <Text style={styles.selectedDate}>
                                {formatDate(date)}
                            </Text>
                            <ScrollView horizontal contentContainerStyle={styles.timeButtonsContainer}>
                                {timeSlots.map(time => (
                                    <Button
                                        key={time}
                                        onPress={() => handleTimeChange(date, time)}
                                        style={[
                                            styles.timeButton,
                                            selectedDates[date].times.includes(time) ? styles.selectedButton : styles.unselectedButton
                                        ]}
                                        labelStyle={
                                            selectedDates[date].times.includes(time) ? styles.selectedText : styles.unselectedText
                                        }
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </ScrollView>
                        </View>
                    ))}
                </View>
            </Card>
            <Card style={styles.card}>
                <Text style={[styles.header, { textAlign: 'left' }]}>Service details</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.total}>Category:</Text>
                        <Text style={styles.total}>Sub-category:</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.total}>{category}</Text>
                        <Text style={styles.total}>{subCategory}</Text>
                    </View>
                </View>
            </Card>
            <Card style={styles.card1}>
                <Text style={styles.header}>Any specific instructions?</Text>
                <TextInput
          style={[
            styles.input,
            {
              borderColor: '#12ccb7',
              color: isDarkMode ? '#FFFFFF' : '#000000',
              backgroundColor: isDarkMode ? '#51514C' : '#FFFFFF',
              textAlignVertical: 'top', // Align text and placeholder to the top
              marginTop: hp('2%'),  // Ensure no top margin
              paddingTop: hp('2%'),// Ensure no top padding
            },
          ]}
          value={instructions}
          onChangeText={handleInstructionsChange}
          placeholder="Enter instructions"
          placeholderTextColor={isDarkMode ? '#CCCCCC' : '#707070'}
          multiline
          numberOfLines={4}
        />
                <Text style={styles.charCount}>{instructionsLength}/100</Text>
            </Card>
            <Card style={styles.card}>
                <Text style={[styles.header, { textAlign: 'left' }]}>Total cost</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.total}>Booking fee:</Text>
                        <Text style={styles.total}>Service:</Text>
                        <Text style={styles.total}>Total:</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.total}>${bookingFee}</Text>
                        <Text style={styles.total}>${serviceFee}</Text>
                        <Text style={styles.total}>${totalCost}</Text>
                    </View>
                </View>
            </Card>
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
                        <Text style={styles.modalText}>Sent request</Text>
                        <Text style={styles.modalSubText}>
                        Your service request has been sent to the service provider. Await accept/reject notification soon.
                        </Text>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendButtonText}>SEND REQUEST</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp('4%'),
        backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    card: {
        width: '100%',
        padding: wp('4%'),
        marginBottom: hp('2%'),
        backgroundColor: isDarkMode ? '#021114' : '#fff',
    },
    card1: {
        width: '100%',
        padding: wp('4%'),
        marginBottom: hp('2%'),
        backgroundColor: isDarkMode ? '#333' : '#fff',
    },
    total: {
        color: isDarkMode ? "#fff" : "#000",
        textAlign: 'left',
        marginVertical: hp('0.5%'),
        fontSize: wp('4%')
    },
    header: {
        fontSize: wp('4.5%'),
        marginVertical: hp('1%'),
        color: isDarkMode ? "#fff" : "#000",
    },
    selectedDatesContainer: {
        marginVertical: hp('1%'),
    },
    selectedDateContainer: {
        marginBottom: hp('2%'),
    },
    selectedDate: {
        fontSize: wp('4%'),
        color: '#12CCB7',
    },
    timeButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginVertical: hp('1%'),
    },
    timeButton: {
        margin: wp('1%'),

    },
    input: {
        borderColor: '#12ccb7',
        borderWidth: 1,
        borderRadius: wp('2%'),
        paddingBottom: hp('5%'),
        paddingTop: hp('0%'),
        marginTop: hp('0%'),
        marginBottom: hp('1%'),
        color: isDarkMode ? '#FFF' : '#000',
        backgroundColor: isDarkMode ? '#51514C' : '#fff',
        paddingVertical: hp('5%'),
        paddingHorizontal: wp('4%'),



    },
    charCount: {
        alignSelf: 'flex-end',
        color: isDarkMode ? '#fff' : '#000',
    },
    sendButton: {
        backgroundColor: '#12CCB7',
        paddingVertical: hp('2%'),
        paddingHorizontal: hp('8%'),
        borderRadius: wp('10%'),
        alignItems: 'center',
        marginTop: hp('4%'),
        marginHorizontal: wp('1%'),
    },
    sendButtonText: {
        color: '#000',
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
    modalIcon: {
        width: 45,
        height: 45,
        marginBottom: ('2%'),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '80%',
        paddingHorizontal: '5%',
        paddingVertical: '3%',
        alignItems: 'center',
        borderRadius: wp('5%'),

    },
    modalText: {
        fontSize: wp('4%'), // Adjust font size based on window width
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: hp('2%'), // Adjust margin as a percentage of the screen height
        color: '#000',
    },
    modalSubText: {
        fontSize: wp('4%'),
        textAlign: 'center',
        marginBottom: hp('1%'),
        color: '#000',
    },

    selectedButton: {
        backgroundColor: '#12CCB7',
        borderWidth: 1,
        borderColor: '#12CCB7'
    },
    unselectedButton: {
        backgroundColor: 'transparent',
        borderColor: '#12CCB7',
        borderWidth: 1,
    },
    selectedText: {
        color: isDarkMode ? '#FFF' : '#000', // Text color for selected state
    },
    unselectedText: {
        color: isDarkMode ? '#FFF' : '#000', // Text color for unselected state
    },
});

export default CleaningServiceRequest;
