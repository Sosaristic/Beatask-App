import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, useColorScheme, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface Availability {
  date: string;
  startTime: string;
  endTime: string;
}

interface DateObject {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

const BookingScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const navigation = useNavigation();
  const [serviceCategory, setServiceCategory] = useState('');
  const [skills, setSkills] = useState(['Planning']);
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [certification, setCertification] = useState<DocumentPicker.DocumentPickerResponse[] | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility

  const dropdownHeight = useRef(new Animated.Value(0)).current; // Initial height of dropdown

  const handleOptionPress = (option: string) => {
    console.log(`Pressed option: ${option}`);
  };

  const handleProfileSetup = () => {
    navigation.navigate('ProfileSetup' as never);
  };

  const handleServiceListing = () => {
    navigation.navigate('servicelisting' as never);
  };

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setCertification(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };

  const handleDayPress = (day: DateObject) => {
    if (!availability.some(slot => slot.date === day.dateString)) {
      setAvailability([...availability, { date: day.dateString, startTime: '08:00 AM', endTime: '07:00 PM' }]);
    }
  };

  const handleTimeChange = (date: string, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(availability.map(slot =>
      slot.date === date ? { ...slot, [field]: value } : slot
    ));
  };

  const handleRemoveDate = (date: string) => {
    setAvailability(availability.filter(slot => slot.date !== date));
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    Animated.timing(dropdownHeight, {
      toValue: showDropdown ? 0 : 700, // Set the height to 500 when dropdown is open
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();
  };

  const toggleDropdownhome = () => {
    setShowDropdown(!showDropdown);
    Animated.timing(dropdownHeight, {
      toValue: showDropdown ? 0 : 500, // Set the height to 500 when dropdown is open
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();
  };


  const closeDropdown = () => {
    if (showDropdown) {
      setShowDropdown(false);
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false
      }).start();
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Service categories</Text>
        
        <TouchableOpacity onPress={toggleDropdown}>
          <Text style={styles.input}>Select Service Category</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.dropdownContent, { height: dropdownHeight }]}>
        <Text style={styles.headingtext}>Service Category</Text>
        <TouchableOpacity onPress={closeDropdown}>
            </TouchableOpacity>
            <Icon
            onPress={closeDropdown}
              name="x"
              size={24}
              style={[styles.closeicon, styles.rightx]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          <TouchableOpacity style={styles.option} onPress={handleProfileSetup}>
            <Text style={styles.text}>Home Improvement</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleServiceListing}>
            <Text style={styles.text}>Wellness</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Review and Ratings')}>
            <Text style={styles.text}>Pets</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Business</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Log out')}>
            <Text style={styles.text}>IT and Graphic Design</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}

            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Events</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Troubleshooting and Repair</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Lessons</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Personal</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Payment setting')}>
            <Text style={styles.text}>Legal</Text>
            <Icon
              name="chevron-right"
              size={24}
              style={[styles.chevron, styles.rightChevron]}
              color={isDarkMode ? '#000000' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.label}>Skills relevant to the service you offer</Text>
        <TextInput
          style={styles.input}
          placeholder="Planning"
          placeholderTextColor={isDarkMode ? '#888888' : '#AAAAAA'}
          value={skills[0]}
          onChangeText={(text) => setSkills([text])}
        />
        
        <Text style={styles.label}>Years of experience</Text>
        <TextInput
          style={styles.input}
          placeholder="At least 5 years of experience"
          placeholderTextColor={isDarkMode ? '#888888' : '#AAAAAA'}
          value={yearsOfExperience}
          onChangeText={setYearsOfExperience}
        />
        <Text style={styles.label}>Upload certification for this service</Text>
        <TouchableOpacity onPress={handleFileUpload} style={styles.uploadButton}>
          <Icon name="upload" size={30} color="#6e6e6e" />
          <Text style={styles.uploadButtonText}>
            <Text style={styles.chooseText}>Choose </Text>
            file to upload
          </Text>
        </TouchableOpacity>
        {certification && certification.map((file, index) => (
          <Text key={index} style={styles.selectedFileText}>{file.name}</Text>
        ))}
        <Text style={styles.label}>Set availability</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={availability.reduce((acc, slot) => {
              acc[slot.date] = { selected: true, selectedColor: '#1E90FF' };
              return acc;
            }, {} as Record<string, any>)}
            theme={{
              calendarBackground: isDarkMode ? '#000000' : '#FFFFFF',
              dayTextColor: isDarkMode ? '#FFFFFF' : '#000000',
              textSectionTitleColor: isDarkMode ? '#FFFFFF' : '#000000',
              selectedDayBackgroundColor: '#1E90FF',
              selectedDayTextColor: '#FFFFFF',
            }}
          />
        </View>
        {availability.map((slot, index) => (
          <View key={index} style={styles.timeSlot}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>{slot.date}</Text>
              <TouchableOpacity onPress={() => handleRemoveDate(slot.date)}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeInputs}>
              <TextInput
                style={styles.timeInput}
                value={slot.startTime}
                onChangeText={(text) => handleTimeChange(slot.date, 'startTime', text)}
              />
              <Text style={styles.timeSeparator}>-</Text>
              <TextInput
                style={styles.timeInput}
                value={slot.endTime}
                onChangeText={(text) => handleTimeChange(slot.date, 'endTime', text)}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  },
  label: {
    color: isDarkMode ? '#FFFFFF' : '#000000',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: isDarkMode ? '#333333' : '#DDDDDD',
    color: isDarkMode ? '#FFFFFF' : '#000000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  skillContainer: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#FFFFFF' : '#000000',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  skill: {
    color: isDarkMode ? '#FFFFFF' : '#000000',
  },
  uploadButton: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#51514C',
    borderStyle: 'dotted',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  uploadButtonText: {
    fontSize: wp('4%'),
    color: '#51514C',
    marginTop: hp('2%'),
  },
  chooseText: {
    color: '#12CCB7',
  },
  selectedFileText: {
    color: '#12CCB7',
    marginTop: hp('2%'),
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#FFFFFF' : '#000000',
    borderRadius: 5,
    marginBottom: 20,
  },
  timeSlot: {
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: isDarkMode ? '#FFFFFF' : '#000000',
  },
  removeText: {
    color: isDarkMode ? '#FFFFFF' : '#000000',
    fontSize: 18,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    backgroundColor: isDarkMode ? '#333333' : '#DDDDDD',
    color: isDarkMode ? '#FFFFFF' : '#000000',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    textAlign: 'center',
  },
  timeSeparator: {
    color: isDarkMode ? '#FFFFFF' : '#000000',
    marginHorizontal: 5,
  },
  dropdownTrigger: {
    color: isDarkMode ? '#FFFFFF' : '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: isDarkMode ? '#FFFFFF' : '#000000',
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#000000',
  },
  dropdownContent: {
    position: 'absolute',
    bottom: 0,
    borderTopStartRadius:35,
    borderTopEndRadius:35,
    left: 0,
    right: 0,
    backgroundColor: isDarkMode ? '#DDDDDD' : '#333333', // Light in dark mode, dark in light mode
    borderRadius: 5,
    borderWidth: 1,
    borderColor: isDarkMode ? '#FFFFFF' : '#000000',
    padding: 10,
    zIndex: 1000,
    overflow: 'hidden',
  },
  headingtext:{
    fontWeight:'bold',
    fontSize:25,
    color: isDarkMode ? '#000000' : '#FFFFFF',
    marginBottom: 25,
    top:10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    
  },
  text: {
    color: isDarkMode ? '#000000' : '#FFFFFF',
    fontSize: 16,
    lineHeight:30,
  },
  logout: {
    color: 'red',
  },
  chevron: {
    marginLeft: 10,
  },
  closeicon: {
    right: 10,
    bottom:40,
    fontWeight:'bold',
  },
  rightChevron: {
    alignSelf: 'flex-end',
  },
  rightx: {
    alignSelf: 'flex-end',
  },
});

export default BookingScreen;
