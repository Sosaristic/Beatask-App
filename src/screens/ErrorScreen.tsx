import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {customTheme} from '../custom_theme/customTheme';
import {useUserStore} from '../store/useUserStore';

type ScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'error'>;
};

const ErrorScreen = ({navigation}: ScreenProps) => {
  const {width} = useWindowDimensions();
  const {user} = useUserStore(state => state);

  const redirectUrl = user?.is_service_provider === 0 ? 'Home' : 'Bid';
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: width * 0.05,
      }}>
      <MaterialIcons name="error" size={70} color={'red'} />
      <Text variant="titleLarge">Payment Failed</Text>
      <Text style={{textAlign: 'center'}}>
        Your payment could not be processed at this moment
      </Text>
      <TouchableOpacity
        style={{marginTop: 10, width: '100%'}}
        onPress={() => navigation.replace(redirectUrl)}>
        <Text
          style={{
            backgroundColor: customTheme.primaryColor,
            padding: 10,
            textAlign: 'center',
            borderRadius: 50,
          }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({});
