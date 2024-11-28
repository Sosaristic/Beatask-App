import React, {useState} from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps,
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {customTheme} from '../custom_theme/customTheme';

interface CustomInputProps extends TextInputProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'phone'; // Accepts any type of input
  errorText?: string;
  label: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  type = 'text',
  errorText,
  label,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(
    type === 'password',
  );
  const colorScheme = useColorScheme(); // Detects dark or light mode
  const isDarkMode = colorScheme === 'dark';

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={{gap: 4}}>
      <Text variant="titleMedium">{label}</Text>
      <View
        style={[
          styles.container,
          {
            borderColor: isDarkMode ? 'transparent' : '#ccc',
            backgroundColor: isDarkMode ? '#51514c' : 'transparent',
          }, // Border color adapts to mode
        ]}>
        <RNTextInput
          autoCapitalize="none"
          secureTextEntry={type === 'password' ? !isPasswordVisible : false} // Only apply secureTextEntry for password type
          style={[styles.input, {color: isDarkMode ? 'white' : 'dark'}]}
          placeholderTextColor={isDarkMode ? '#ccc' : '#555'} // Placeholder color adapts to mode
          keyboardType={type === 'number' ? 'numeric' : 'default'} // Example: use numeric keyboard for number type
          {...props}
        />
        {type === 'password' && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}>
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color={customTheme.primaryColor} // Icon color adapts to mode
            />
          </TouchableOpacity>
        )}
      </View>
      {errorText ? (
        <Text variant="bodyMedium" style={{color: 'red'}}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('7.5%'),
    paddingHorizontal: 10, // Padding inside the container
    paddingVertical: 4, // Vertical padding
    borderWidth: 1, // Border width
    borderRadius: 8,
  },
  lightContainer: {
    backgroundColor: '#blue', // Light mode background color
  },
  darkContainer: {
    backgroundColor: '#333', // Dark mode background color
  },
  input: {
    flex: 1,
    fontSize: 16, // Font size for the text input
  },
  lightInput: {
    color: '#333', // Text color for light mode
  },
  darkInput: {
    color: '#fff', // Text color for dark mode
  },
  iconContainer: {
    marginLeft: 10, // Space between input and icon
  },
});

export default CustomInput;
