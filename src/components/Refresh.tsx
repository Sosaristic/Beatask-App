import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {customTheme} from '../custom_theme/customTheme';

const Refresh = ({onRefresh}: {onRefresh: () => void}) => {
  return (
    <TouchableOpacity onPress={onRefresh}>
      <Ionicons
        name="refresh-outline"
        size={26}
        color={customTheme.primaryColor}
      />
    </TouchableOpacity>
  );
};

export default Refresh;

const styles = StyleSheet.create({});
