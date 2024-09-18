import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using MaterialIcons for stars

// Define the prop types for the Rating component
interface RatingProps {
  maxStars?: number; // Optional: number of stars (default is 5)
  onRatingChange: (rating: number) => void; // Callback function to get the rating value
}

const Rating: React.FC<RatingProps> = ({maxStars = 5, onRatingChange}) => {
  const [rating, setRating] = useState<number>(0); // Define state with type number

  // Function to handle star press
  const handleStarPress = (index: number) => {
    const newRating = index + 1;
    setRating(newRating); // Set the rating based on the star clicked
    onRatingChange(newRating); // Pass the rating value to the parent component
  };

  return (
    <View style={styles.container}>
      {/* Render the number of stars based on maxStars */}
      {[...Array(maxStars)].map((_, index) => (
        <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
          <Icon
            name={index < rating ? 'star' : 'star-border'} // Show filled star if index < rating, else empty star
            size={40}
            color={index < rating ? '#FFD700' : '#B0B0B0'} // Gold for filled, gray for empty
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align stars in a row
    justifyContent: 'center', // Center the stars
  },
});

export default Rating;
