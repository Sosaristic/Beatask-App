import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Empty = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={require('../assets/images/Empty-bro.png')}
        height={50}
        width={50}
        style={{resizeMode: 'contain', width: 300, height: 300}}
      />
      <Text>No Data</Text>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({});
