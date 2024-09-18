import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import {Calendar} from 'react-native-calendars';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import {FilterPayload} from '../screens/Home/provider/Homeimp';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Text as RText} from 'react-native-paper';

type Props = {
  open: boolean;
  onClose: () => void;
  category_name: string;
  handleFilterChange: (payload: FilterPayload) => void;
};

const FilterModal = ({
  open,
  onClose,
  category_name,
  handleFilterChange,
}: Props) => {
  const [price, setPrice] = useState<[number, number]>([0, 5000]);
  const [rating, setRating] = useState<number>(5);

  const [distance, setDistance] = useState<[number, number]>([10, 25]);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    new Date().toISOString().split('T')[0],
  ); // State to store selected date
  const colorScheme = useColorScheme();

  const onPriceChange = (values: [number, number]) => setPrice(values);
  const onRatingChange = (selectedRating: number) => setRating(selectedRating);

  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  const handleClearAll = () => {
    setPrice([22, 56]);
    setRating(5);

    setSelectedDate(null); // Clear selected date
  };

  const handleSave = () => {
    const params = {
      price_min: price[0].toString(),

      rating_min: rating.toString(),
      date: selectedDate as string,
      category_name: category_name,
    };
    handleFilterChange(params);

    onClose();
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onDismiss={onClose}
      onRequestClose={onClose}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {marginTop: Platform.OS === 'ios' ? 22 : 0},
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={onClose}>
            <RText>Close</RText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAll}>Clear all</Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity style={styles.subCategoryContainer} onPress={handleSub}>
        <Text style={styles.subCategory}>Sub-category</Text>
        <FontAwesome
          name="angle-right"
          size={24}
          color={styles.subCategory.color}
        />
      </TouchableOpacity> */}
        <Text style={styles.heading}>Set availability</Text>
        <Calendar
          style={styles.calendar}
          markingType={'custom'}
          current={new Date().toISOString().split('T')[0]} // Set the current date in ISO format
          onDayPress={day => setSelectedDate(day.dateString)} // Update selected date
          theme={{
            calendarBackground: styles.container.backgroundColor,
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#fff',
          }}
          markedDates={{
            [selectedDate || '']: {selected: true, selectedColor: '#00adf5'}, // Mark selected date
          }}
        />
        <View style={styles.sliderContainer}>
          <Text style={styles.label}>Price</Text>
          <Slider
            value={price[0]}
            onValueChange={(value: number) => onPriceChange([value, price[1]])}
            minimumValue={0}
            maximumValue={5000}
            step={1}
            thumbTintColor={colorScheme === 'dark' ? '#fff' : '#12CCB7'}
            minimumTrackTintColor="#12CCB7"
          />
          <Text style={styles.valueText}>
            ${price[0]} - ${price[1]}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.label}>Rating</Text>
          <View style={styles.rating}>
            {[1, 2, 3, 4, 5].map(star => (
              <FontAwesome
                key={star}
                name="star"
                size={24}
                color={rating >= star ? '#00adf5' : '#ccc'}
                onPress={() => onRatingChange(star)}
              />
            ))}
          </View>
        </View>
        {/* <View style={styles.sliderContainer}>
        <Text style={styles.label}>Job completion rate</Text>
        <Slider
          value={jobCompletionRate[0]}
          onValueChange={(value: number) =>
            onJobCompletionRateChange([value, jobCompletionRate[1]])
          }
          minimumValue={5}
          maximumValue={25}
          step={1}
          thumbTintColor={colorScheme === 'dark' ? '#fff' : '#12CCB7'}
          minimumTrackTintColor="#12CCB7"
        />
        <Text style={styles.valueText}>
          {jobCompletionRate[0]}% - {jobCompletionRate[1]}%
        </Text>
      </View> */}
        {/* <View style={styles.sliderContainer}>
        <Text style={styles.label}>Distance</Text>
        <Slider
          value={distance[0]}
          onValueChange={(value: number) =>
            onDistanceChange([value, distance[1]])
          }
          minimumValue={5}
          maximumValue={25}
          step={1}
          thumbTintColor={colorScheme === 'dark' ? '#fff' : '#12CCB7'}
          minimumTrackTintColor="#12CCB7"
        />
        <Text style={styles.valueText}>
          {distance[0]}km - {distance[1]}km
        </Text>
      </View> */}
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

export default FilterModal;

const lightStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  clearAll: {
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 10,
    color: '#12CCB7',
  },
  subCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 10,
  },
  subCategory: {
    fontSize: 18,
    color: '#000',
  },
  heading: {
    fontSize: 22,
    marginBottom: 10,
    color: '#000',
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#00adf5', // Blue border color
    borderWidth: 2, // Border width
  },
  sliderContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
  valueText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#000',
  },
  ratingContainer: {
    marginBottom: 20,
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#12CCB7',
    paddingVertical: hp('2%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    marginTop: hp('4%'),
    marginHorizontal: wp('30%'),
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  clearAll: {
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 10,
    color: '#12CCB7',
  },
  subCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 10,
  },
  subCategory: {
    fontSize: 18,
    color: '#fff',
  },
  heading: {
    fontSize: 22,
    marginBottom: 10,
    color: '#fff',
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#00adf5', // Blue border color
    borderWidth: 2, // Border width
  },
  sliderContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
  },
  valueText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
  },
  ratingContainer: {
    marginBottom: 30,
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#12CCB7',
    paddingVertical: hp('2%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    marginTop: hp('4%'),
    marginHorizontal: wp('30%'),
  },
});
