import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';
import LottieView from 'lottie-react-native';
import {customTheme} from '../custom_theme/customTheme';
import {Text} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';
import {User, useUserStore} from '../store/useUserStore';
import {makeApiRequest} from '../utils/helpers';
import {LoginSuccessResponse} from './Login/Login';
import {Provider} from '../interfaces/apiResponses';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'success'>;
  route: RouteProp<RootStackParamList, 'success'>;
};

type Response = {
  data: User[];
  msg: string;
};

const SuccessScreen: React.FC<Props> = ({navigation, route}) => {
  const {redirectTo} = route.params || {};
  const {width} = useWindowDimensions();
  const {user, actions} = useUserStore(state => state);

  useEffect(() => {
    (async () => {
      const {data, error} = await makeApiRequest<Response>(
        '/get-provider-updated-data',
        'post',
        {provider_id: user?.id},
      );

      if (data) {
        actions.login(data.data[0]);
      }
    })();
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: width * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
      }}>
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
        style={{marginTop: 10, width: '100%'}}
        onPress={() => navigation.replace(redirectTo)}>
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

export default SuccessScreen;

const styles = StyleSheet.create({});
