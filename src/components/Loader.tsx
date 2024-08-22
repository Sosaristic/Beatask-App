import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type Props = {
  loadingMessage?: string;
};

const Loader = ({loadingMessage}: Props) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#12CCB7" />
      {loadingMessage && <Text style={styles.modalText}>{loadingMessage}</Text>}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginTop: hp('2%'),
    color: '#010A0C', // Default text color
  },
});
