import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ReviewScreen = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const sections = ['Maryland Winkles'];

  const toggleSection = (section: string) => {
    setExpandedSections((prevState) =>
      prevState.includes(section)
        ? prevState.filter((item) => item !== section)
        : [...prevState, section]
    );
  };

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({ rating, review, name });
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {sections.map((section) => (
        <View key={section}>
          <TouchableOpacity
            onPress={() => toggleSection(section)}
            style={styles.section}
          >
            <Text style={[styles.sectionText, isDarkMode ? styles.darkText : styles.lightText]}>
              {section}
            </Text>
            <Icon
              name={expandedSections.includes(section) ? 'chevron-down' : 'chevron-up'}
              size={wp('4%')}
              style={[styles.chevron, isDarkMode ? styles.darkChevron : styles.lightChevron]}
            />
          </TouchableOpacity>
          {expandedSections.includes(section) && section === 'Maryland Winkles' && (
            <View style={[styles.detailsContainer, isDarkMode ? styles.darkDetailsContainer : styles.lightDetailsContainer]}>
              <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Rate</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name={star <= rating ? 'star' : 'star-o'}
                    size={24}
                    color="gold"
                    onPress={() => handleRating(star)}
                    style={styles.star}
                  />
                ))}
              </View>
              <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Review</Text>
              <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholder="What was your experience with this service provider?"
                placeholderTextColor={isDarkMode ? "#888" : "#555"}
                value={review}
                onChangeText={setReview}
                multiline
              />
              <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Your name</Text>
              <TextInput
                style={[styles.input2, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholder="Full name"
                placeholderTextColor={isDarkMode ? "#888" : "#555"}
                value={name}
                onChangeText={setName}
              />
              {/* <Button title="Submit" onPress={handleSubmit} /> */}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#f0f0f0',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sectionText: {
    fontSize: 18,
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  detailsContainer: {
    marginTop: 10,
    borderRadius: wp('5%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('3%'),
  },
  darkDetailsContainer: {
    backgroundColor: '#021114',
  },
  lightDetailsContainer: {
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 10,
  },
  input: {
    padding: 10,
    paddingBottom: 50,
    borderRadius: 5,
    marginBottom: 20,
  },
  input2: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  darkInput: {
    backgroundColor: '#333',
    color: 'white',
  },
  lightInput: {
    backgroundColor: '#ddd',
    color: 'black',
  },
  chevron: {
    alignSelf: 'flex-end',
  },
  darkChevron: {
    color: 'white',
  },
  lightChevron: {
    color: 'black',
  },
});

export default ReviewScreen;
