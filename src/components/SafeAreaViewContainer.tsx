import React from 'react';
import {StyleSheet, Text, View, StyleProp, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  style?: StyleProp<ViewStyle>;
};

const SafeAreaViewContainer = ({children, edges, style, ...props}: Props) => {
  return (
    <SafeAreaView edges={edges} {...props} style={[{flex: 1}, style]}>
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaViewContainer;

const styles = StyleSheet.create({});
