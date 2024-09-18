import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {customTheme} from '../custom_theme/customTheme';
import {Text} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'success'>;
  route: RouteProp<RootStackParamList, 'success'>;
};

const SuccessScreen: React.FC<Props> = ({navigation, route}) => {
  const {redirectTo} = route.params || {};

  return (
    <View
      style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 3}}>
      <LottieView
        source={require('../assets/images/lottie/success.json')}
        autoPlay
        loop
        style={{height: 250, width: 250}}
      />
      <Text variant="titleLarge" style={{color: customTheme.primaryColor}}>
        Payment Successful
      </Text>
      <TouchableOpacity
        style={{marginTop: 10}}
        onPress={() => navigation.replace(redirectTo)}>
        <Text style={{backgroundColor: customTheme.primaryColor, padding: 10}}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({});
