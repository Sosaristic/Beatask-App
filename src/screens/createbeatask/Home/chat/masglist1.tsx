import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Text as PaperText} from 'react-native-paper';
import {Avatar} from 'react-native-elements';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useColorScheme, ColorSchemeName} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Message, TextCount} from '../../../Home/chat/masglist';
import {useUserStore} from '../../../../store/useUserStore';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../../App';
import {formatDate} from '../../../../utils/helperFunc';

type Prop = {
  navigation: StackNavigationProp<RootStackParamList, 'masglist1'>;
};

const ChatScreen: React.FC<Prop> = ({navigation}) => {
  const {user, actions} = useUserStore(state => state);
  const colorScheme: ColorSchemeName = useColorScheme();
  const isDarkMode: boolean = colorScheme === 'dark';
  const [showTopPopup, setShowTopPopup] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const topPopupRef = useRef(null); // Ref for the top popup
  const [totalUnread, setTotalUnread] = useState<number | null>(null);

  console.log('provider', totalUnread);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'black',
            paddingVertical: 4,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <PaperText
              variant="titleLarge"
              style={{color: 'white', alignItems: 'center', gap: 4}}>
              Messages
            </PaperText>
            <TextCount />
          </View>
        </View>
      ),
    });
  }, [messages]);

  useEffect(() => {
    // Construct queries

    const conversationsRef = firestore()
      .collection('conversations')
      .where('usersIds', 'array-contains', user?.email);

    // Set up a real-time listener
    const unsubscribe = conversationsRef.onSnapshot(snapshot => {
      const newMessages = snapshot.docs.map(doc => {
        const data = doc?.data();
        return {
          id: doc.id,
          lastMessageContent: data.lastMessageContent,
          lastMessageTimestamp: data.lastMessageTimestamp.toDate(),
          providerId: data.providerId,
          customerId: data.customerId,
          usersIds: data.usersIds,
          providerAvatar: data.providerAvatar,
          customerAvatar: data.customerAvatar,
          providerCount: data.providerCount,
          customerCount: data.customerCount,
          sentBy: data.sentBy,
          providerName: data.providerName,
          customerName: data.customerName,
        } as Message;
      });
      const sortedMessages = newMessages.slice().sort((a, b) => {
        const timeA =
          a.lastMessageTimestamp instanceof Date
            ? a.lastMessageTimestamp.getTime()
            : a.lastMessageTimestamp;
        const timeB =
          b.lastMessageTimestamp instanceof Date
            ? b.lastMessageTimestamp.getTime()
            : b.lastMessageTimestamp;
        return timeB - timeA;
      });
      let count = 0;
      sortedMessages.forEach(message => {
        count += message.providerCount ?? 0;
      });

      setTotalUnread(count);
      actions.setUnreadMessages(count);
      setMessages(sortedMessages);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [user?.email]);

  const handlePress = (
    chatId: string,
    providerId: string,
    providerName: string,
  ) => {
    navigation.navigate('Chat', {chatId, providerId, providerName});
  };

  const closeTopPopup = () => {
    if (topPopupRef.current) {
      setShowTopPopup(false);
    }
  };

  const handleMessage = () => {
    navigation.navigate('masglist1' as never);
  };

  const handleProfile = () => {
    navigation.navigate('ProfileSetup' as never);
  };

  const handleHome = () => {
    navigation.navigate('dashboard' as never);
  };
  const handleBooked = () => {
    navigation.navigate('booked1' as never);
  };

  const handlebid = () => {
    navigation.navigate('Bid' as never);
  };
  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}>
      {/* Chat Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          <View style={styles.innerContainer}>
            {messages?.length === 0 && (
              <View>
                <Text style={{textAlign: 'center', padding: 10}}>
                  All Conversations will be shown here
                </Text>
              </View>
            )}

            {messages.map((message, index) => {
              console.log('test message time', message.lastMessageTimestamp);
              const date = new Date(message.lastMessageTimestamp);

              return (
                <TouchableOpacity
                  onPress={() =>
                    handlePress(
                      message.id,
                      message.customerId,
                      message.customerName,
                    )
                  }
                  style={styles.touchable}
                  key={index}>
                  <View
                    style={[styles.card, isDarkMode ? styles.darkCard : null]}>
                    <View style={styles.messageContainer}>
                      <Avatar
                        rounded
                        size="medium"
                        // source={require('../../../assets/images/category/user.png')} // Local image path
                        source={
                          message.customerAvatar
                            ? {uri: message.customerAvatar}
                            : require('../../../../assets/images/category/user.png')
                        }
                        containerStyle={styles.avatar}
                      />
                      <View style={styles.textContainer}>
                        <Text
                          style={[
                            styles.name,
                            isDarkMode ? styles.darkText : null,
                          ]}>
                          {message.customerName}
                        </Text>
                        <Text
                          style={[
                            styles.message,
                            isDarkMode ? styles.darkText : null,
                          ]}>
                          {message.lastMessageContent}
                        </Text>
                      </View>
                      <View style={{gap: 6}}>
                        {(message.providerCount as number) > 0 && (
                          <Text style={styles.count}>
                            {message.providerCount}
                          </Text>
                        )}

                        <Text
                          style={[
                            styles.time,
                            isDarkMode ? styles.darkText : null,
                          ]}>
                          {formatDate(date)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* <TouchableOpacity
            onPress={() => handlePress('test_1Test_2', 'dummy', 'dummy')}
            style={styles.touchable}>
            <View style={[styles.card, isDarkMode ? styles.darkCard : null]}>
              <View style={styles.messageContainer}>
                <Avatar
                  rounded
                  size="medium"
                  source={require('../../../../assets/images/category/user.png')}
                  containerStyle={styles.avatar}
                />
                <View style={styles.textContainer}>
                  <Text
                    style={[styles.name, isDarkMode ? styles.darkText : null]}>
                    Maryland Winkles
                  </Text>
                  <Text
                    style={[
                      styles.message,
                      isDarkMode ? styles.darkText : null,
                    ]}>
                    Hi Beatask
                  </Text>
                </View>
                <Text
                  style={[styles.time, isDarkMode ? styles.darkText : null]}>
                  10:30 AM
                </Text>
              </View>
            </View>
          </TouchableOpacity> */}
        </View>
      </ScrollView>

      {/* Top Popup */}
      {showTopPopup && (
        <View
          ref={topPopupRef}
          style={[styles.topPopup, isDarkMode ? styles.darkTopPopup : null]}>
          <Icons
            name="info"
            size={52}
            color={isDarkMode ? '#EEB0B0' : '#ff0000'}
            style={styles.infoIcon}
          />
          <Text
            style={[
              styles.popupTitle,
              isDarkMode ? styles.darkPopupTitle : styles.lightPopupTitle,
            ]}>
            Warning: Stay Safe and Secure with BEATASK
          </Text>
          <Text
            style={[
              styles.popupText,
              isDarkMode ? styles.darkPopupText : styles.lightPopupText,
            ]}>
            Before proceeding with the chat, please be aware of the following
            guidelines to ensure your safety and protect your interests:{' '}
            {'\n\n'}
            1. No External Transactions: All transactions and payments should be
            made within the BEATASK app. BEATASK will not be responsible for any
            issues arising from payments or deals made outside the app. {'\n\n'}
            2. Protect Your Information: Do not share personal information such
            as phone numbers, email addresses, or social media profiles with
            service providers. {'\n\n'}
            3. Report Suspicious Behavior: If a service provider asks you to
            conduct transactions or share personal information outside the
            BEATASK app, please report them immediately. {'\n\n'}
            By following these guidelines, you help us maintain a safe and
            trustworthy community. Close this message by clicking the ‘X’ at the
            top right corner.
          </Text>
          <TouchableOpacity
            onPress={closeTopPopup}
            style={styles.popupCloseButton}>
            <Icons
              name="x"
              size={24}
              color={isDarkMode ? '#ffffff' : '#000000'}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      <View
        style={[
          styles.footer,
          isDarkMode ? styles.darkFooter : styles.lightFooter,
        ]}>
        <TouchableOpacity style={styles.footerItem} onPress={handleHome}>
          <Icon
            name="home-outline"
            size={wp('7%')}
            color={isDarkMode ? '#FFF' : '#000'}
          />
          <Text
            style={[
              styles.footerText,
              isDarkMode ? styles.darkFooterText : styles.lightFooterText,
            ]}>
            HOME
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleBooked}>
          <Icon
            name="calendar-check-outline"
            size={wp('7%')}
            color={isDarkMode ? '#FFF' : '#000'}
          />
          <Text
            style={[
              styles.footerText,
              isDarkMode ? styles.darkFooterText : styles.lightFooterText,
            ]}>
            BOOKED
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleMessage}>
          <Icon
            name="chat-processing-outline"
            size={wp('7%')}
            color={isDarkMode ? '#FFF' : '#000'}
          />
          <View style={{position: 'absolute', top: 0, right: -4}}>
            <TextCount />
          </View>
          <Text
            style={[
              styles.footerText,
              isDarkMode ? styles.darkFooterText : styles.lightFooterText,
            ]}>
            MESSAGE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handlebid}>
          <Icon
            name="briefcase-variant-outline"
            size={wp('7%')}
            color={isDarkMode ? '#FFF' : '#000'}
          />
          <Text
            style={[styles.footerText, {color: isDarkMode ? '#FFF' : '#000'}]}>
            BID
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleProfile}>
          <Icons
            name="user"
            size={wp('7%')}
            color={isDarkMode ? '#FFF' : '#000'}
          />
          <Text
            style={[
              styles.footerText,
              isDarkMode ? styles.darkFooterText : styles.lightFooterText,
            ]}>
            PROFILE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  topSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lightTopSection: {
    backgroundColor: '#f0f0f0', // Light mode background color
    borderBottomColor: '#ccc', // Light mode border color
  },
  darkTopSection: {
    backgroundColor: '#121212', // Dark mode background color
    borderBottomColor: '#555', // Dark mode border color
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  innerContainer: {
    flex: 1,
  },
  touchable: {
    marginVertical: 8,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#ffffff',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    backgroundColor: '#cccccc',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1, // Allows textContainer to take up available space
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  message: {
    fontSize: 14,
    color: '#666666',
  },
  time: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
  },
  darkText: {
    color: '#ffffff',
  },
  topPopup: {
    backgroundColor: '#fff',
    padding: wp('2.5%'),
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#12ccb7',
    borderRadius: wp('8.5%'),
    marginHorizontal: wp('8.5%'),
    justifyContent: 'center',
    position: 'absolute',
    alignSelf: 'center',
    top: hp('10%'), // Adjust this value as needed
    zIndex: 5,
  },
  darkTopPopup: {
    backgroundColor: '',
  },
  infoIcon: {
    marginRight: wp('2%'),
  },
  popupTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    paddingLeft: wp('2%'),
    textAlign: 'center',
  },
  lightPopupTitle: {
    color: 'red', // Red color for light mode
  },
  darkPopupTitle: {
    color: '#EEB0B0',
  },
  popupText: {
    fontSize: wp('3.5%'),
    textAlign: 'left',
  },
  lightPopupText: {
    color: 'red', // Black color for light mode
  },
  darkPopupText: {
    color: '#EEB0B0', // Light color for dark mode
  },
  popupCloseButton: {
    position: 'absolute',
    top: wp('2%'),
    right: wp('3%'),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // borderTopWidth: 1,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  darkFooter: {
    backgroundColor: '#010A0C',
    borderTopColor: '#555',
  },
  lightFooter: {
    // backgroundColor: '#121212',
    // borderTopColor: '#555',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
  },
  lightFooterText: {
    color: '#000', // Black color for light mode
  },
  darkFooterText: {
    color: '#FFF', // White color for dark mode
  },
  count: {
    backgroundColor: '#12ccb7',
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
    alignSelf: 'flex-end',
  },
});

export default ChatScreen;
