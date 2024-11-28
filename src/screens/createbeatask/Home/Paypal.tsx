import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../../App';
import {customTheme} from '../../../custom_theme/customTheme';
import {Portal} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {useUserStore} from '../../../store/useUserStore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ScreenProps = {
  route: RouteProp<RootStackParamList, 'paypal_screen'>;
  navigation: StackNavigationProp<RootStackParamList, 'paypal_screen'>;
};

const Paypal = ({route, navigation}: ScreenProps) => {
  const {url} = route.params;
  const {user} = useUserStore(state => state);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<'idle' | 'success' | 'cancelled'>(
    'idle',
  );
  const successUrl = 'https://beatask.cloud/paypal/success';
  const failureUrl = 'https://beatask.cloud/paypal/cancel';

  const handleNavigationChange = (navState: WebViewNavigation) => {
    const {url} = navState;
    console.log(url);
    if (url.includes(successUrl)) {
      setStatus('success');
      return;
    }
    if (url.includes(failureUrl)) {
      setStatus('cancelled');
    }
  };

  useEffect(() => {
    if (status === 'success') {
      navigation.replace('success', {
        redirectTo: user?.is_service_provider === 0 ? 'Home' : 'dashboard',
      });
    }
    if (status === 'cancelled') {
      navigation.replace('error');
    }
  }, [status]);

  return (
    <View
      style={{flex: 1, paddingBottom: insets.bottom, paddingTop: insets.top}}>
      {status === 'idle' && (
        <WebView
          javaScriptEnabled={true}
          source={{uri: url}}
          style={{flex: 1}}
          onNavigationStateChange={handleNavigationChange}
          onLoadStart={() => setLoading(false)}
        />
      )}
      {loading && (
        <Portal>
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <ActivityIndicator
              size={'large'}
              color={customTheme.primaryColor}
            />
          </View>
        </Portal>
      )}
    </View>
  );
};

export default Paypal;

const styles = StyleSheet.create({});
