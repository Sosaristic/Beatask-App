import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {customTheme} from '../custom_theme/customTheme';

interface Props extends TouchableOpacityProps {
  onPress: () => void;
  disabled?: boolean;
  buttonText: string;
  style?: ViewStyle;
}

const CustomButton = ({
  onPress,
  disabled = false,
  buttonText,
  style,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.nextButton,
        {backgroundColor: disabled ? 'grey' : customTheme.primaryColor},
        style,
      ]}
      onPress={onPress}>
      <Text style={styles.nexttext}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  nextButton: {
    backgroundColor: '#AEADA4',
    paddingTop: hp('2.5%'),

    paddingBottom: hp('2.5%'),
    marginHorizontal: wp('26.25%'),
    borderRadius: wp('25%'),
  },
  nexttext: {
    color: '#010A0C',
    alignSelf: 'center',
    fontSize: wp('5%'),
    fontWeight: '700',
  },
});
