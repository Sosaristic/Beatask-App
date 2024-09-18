import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
};

const SafeAreaViewContainer = ({children, edges, ...props}: Props) => {
  return (
    <SafeAreaView edges={edges} {...props} style={{flex: 1}}>
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaViewContainer;

const styles = StyleSheet.create({});
