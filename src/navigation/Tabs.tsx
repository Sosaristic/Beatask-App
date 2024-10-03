import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ServiceCompleteRequestScreen from '../screens/ServiceCompleteRequestScreen';
import {Platform, TouchableOpacity, View, useColorScheme} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {customTheme} from '../custom_theme/customTheme';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import QuotesReceivedScreen from '../screens/QuotesRequestsScreen';

const Tab = createBottomTabNavigator();
const PendingTab = createBottomTabNavigator();
const ProviderHomeTabs = createBottomTabNavigator();
const CustomerHomeTabs = createBottomTabNavigator();

export const PendingTabs = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  return (
    <PendingTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: customTheme.primaryColor,
        tabBarInactiveTintColor: isDarkMode ? '#fff' : '#000',
      }}>
      <PendingTab.Screen
        name="Requests"
        component={ServiceCompleteRequestScreen}
        options={{
          headerShown: true,
          title: 'Completion Requests',
          header: ({navigation, route}) => {
            return (
              <View
                style={{
                  paddingTop: insets.top,
                  paddingLeft: insets.left + 5,
                  paddingRight: insets.right,
                  alignItems: 'center',
                  flexDirection: 'row',
                  backgroundColor: isDarkMode ? '#010A0C' : '#FFFFFF',
                  paddingVertical: 12,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingLeft: 8,
                  }}>
                  {Platform.OS === 'ios' ? (
                    <Feather
                      name="chevron-left"
                      color={isDarkMode ? '#fff' : '#000'}
                      size={24}
                    />
                  ) : (
                    <FontAwesome6
                      name="arrow-left-long"
                      color={isDarkMode ? '#fff' : '#000'}
                      size={24}
                    />
                  )}
                </TouchableOpacity>
                <Text
                  variant="titleMedium"
                  style={{
                    alignSelf: 'center',
                    flex: 1,

                    textAlign: 'center',
                  }}>
                  Completion Requests
                </Text>
              </View>
            );
          },
          tabBarIcon: ({color}) => (
            <FontAwesome6 name="list-check" size={24} color={color} />
          ),
        }}
      />
      <PendingTab.Screen
        name="Quotes"
        component={QuotesReceivedScreen}
        options={{
          headerShown: true,
          title: 'Quotes Received',
          header: ({navigation, route}) => {
            return (
              <View
                style={{
                  paddingTop: insets.top,
                  paddingLeft: insets.left + 5,
                  paddingRight: insets.right,
                  alignItems: 'center',
                  flexDirection: 'row',
                  backgroundColor: isDarkMode ? '#010A0C' : '#FFFFFF',
                  paddingVertical: 12,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingLeft: 8,
                  }}>
                  {Platform.OS === 'ios' ? (
                    <Feather
                      name="chevron-left"
                      color={isDarkMode ? '#fff' : '#000'}
                      size={24}
                    />
                  ) : (
                    <FontAwesome6
                      name="arrow-left-long"
                      color={isDarkMode ? '#fff' : '#000'}
                      size={24}
                    />
                  )}
                </TouchableOpacity>
                <Text
                  variant="titleMedium"
                  style={{
                    alignSelf: 'center',
                    flex: 1,

                    textAlign: 'center',
                  }}>
                  Quotes Received
                </Text>
              </View>
            );
          },
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="file-sign" size={24} color={color} />
          ),
        }}
      />
    </PendingTab.Navigator>
  );
};

const ProviderTabs = () => {
  return (
    <ProviderHomeTabs.Navigator>
      <ProviderHomeTabs.Screen
        name="dashboard"
        component={QuotesReceivedScreen}
      />
    </ProviderHomeTabs.Navigator>
  );
};
