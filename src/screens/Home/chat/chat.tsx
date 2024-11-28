import React, {
  useEffect,
  useState,
  useId,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {v4 as uuidv4} from 'uuid';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  Alert,
} from 'react-native';
import {
  Bubble,
  GiftedChat,
  IMessage,
  MessageText,
  MessageTextProps,
  InputToolbar,
  Composer,
  Send,
} from 'react-native-gifted-chat';
import Icons from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {useUserStore} from '../../../store/useUserStore';
import firestore from '@react-native-firebase/firestore';

import {
  blockConversation,
  generateConversationId,
  sendMessage,
  unblockConversation,
  updateMessageCount,
} from '../../../firebase/helpers';

import {Message} from './masglist';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../../App';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeApiRequest} from '../../../utils/helpers';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Avatar,
  Dialog,
  Menu,
  Text as PaperText,
  Portal,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CustomButton, CustomErrorModal, CustomModal} from '../../../components';
import {ReportModal} from '../../../components/chats';
import {
  blockedKeywordsSet,
  capitalizeFirstLetter,
  checkForBlockedKeywords,
  warnUser,
} from './helpers';
type Props = {
  route: RouteProp<RootStackParamList, 'Chat'>;
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>;
};

const ChatScreen: React.FC<Props> = ({route, navigation}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversations, setConversations] = useState<IMessage[]>([]);
  const [showTopPopup, setShowTopPopup] = useState(false);
  const colorScheme = useColorScheme();
  const {user, messagesList} = useUserStore(state => state);
  const insets = useSafeAreaInsets();
  const [optionsVisible, setOptionsVisible] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState({
    errorTitle: '',
    errorMessage: '',
    isModalOpen: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState({
    successTitle: 'Success',
    successMessage: 'Reported Successfully',
    loadingMessage: 'Processing..',
    requestLoading: false,
    showModal: false,
  });

  const {
    chatId,
    providerId,
    providerName,
    customerId,
    customerName,
    providerAvatar,
    customerAvatar,
  } = route.params || {};
  const [chatIsBlocked, setChatIsBlocked] = useState(false);
  const [chatIsBlockedBy, setChatIsBlockedBy] = useState('');

  const id = useId();
  const chatRef = useRef<FlatList<IMessage> | null>(null);

  useEffect(() => {
    const convoId = generateConversationId(providerId, customerId);

    const convo = messagesList.find(item => {
      const id = generateConversationId(item.usersIds[0], item.usersIds[1]);
      return id === convoId;
    });

    setChatIsBlocked(convo?.isBlocked as boolean);
    setChatIsBlockedBy(convo?.isBlockedBy as string);
  }, [messagesList]);

  const userBlocked = useMemo(() => {
    const blockedByYou = chatIsBlockedBy === user?.email;
    const blockedUser =
      chatIsBlocked && blockedByYou
        ? 1
        : chatIsBlocked && !blockedByYou
        ? 2
        : 0;

    return blockedUser;
  }, [chatIsBlocked, chatIsBlockedBy]);

  useEffect(() => {
    navigation.setOptions({
      title:
        user?.name === providerName
          ? capitalizeFirstLetter(customerName)
          : capitalizeFirstLetter(providerName),
      header: () => {
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: insets.top,
              paddingHorizontal: wp('3%'),
              gap: 8,
              paddingVertical: 4,
              backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#fff',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icons name="arrow-left" size={24} />
            </TouchableOpacity>
            <Avatar.Image
              size={50}
              source={
                customerId === user?.email
                  ? {uri: providerAvatar}
                  : {uri: customerAvatar}
              }
            />
            <PaperText>
              {user?.email === customerId
                ? capitalizeFirstLetter(providerName)
                : capitalizeFirstLetter(customerName)}
            </PaperText>
            <View style={{marginLeft: 'auto'}}>
              <Menu
                visible={optionsVisible}
                onDismiss={() => setOptionsVisible(false)}
                anchorPosition="bottom"
                anchor={
                  <TouchableOpacity
                    style={{padding: 8}}
                    onPress={() => setOptionsVisible(true)}>
                    <Icons name="more-vertical" size={24} />
                  </TouchableOpacity>
                }>
                <Menu.Item
                  disabled={userBlocked === 2}
                  leadingIcon={'block-helper'}
                  title={userBlocked === 1 ? 'Unblock User' : 'Block User'}
                  onPress={async () => {
                    if (!chatIsBlocked) {
                      await blockConversation(
                        providerId,
                        customerId,
                        user?.email as string,
                      );
                    } else {
                      await unblockConversation(providerId, customerId);
                    }

                    setOptionsVisible(false);
                  }}
                />

                <Menu.Item
                  leadingIcon={'thumb-down'}
                  title="Report Account"
                  onPress={() => {
                    setOptionsVisible(false);
                    setReportModalOpen(true);
                  }}
                />
              </Menu>
            </View>
          </View>
        );
      },
    });
  }, [optionsVisible, chatIsBlocked, chatIsBlockedBy]);

  useEffect(() => {
    // Reference to the conversations collection

    // Reference to the messages sub-collection

    const generatedId = generateConversationId(
      providerId,
      customerId as string,
    );

    const messagesRef = firestore()
      .collection('conversations')
      .doc(generatedId as string)
      .collection('messages');

    // Set up a real-time listener with ordering by 'timestamp'
    const unsubscribe = messagesRef
      .orderBy('timestamp') // Ensure messages are ordered by timestamp
      .onSnapshot(
        snapshot => {
          // Extract messages from snapshot
          const newMessages = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('doc id', doc.id);

            return {
              _id: uuidv4(),
              text: data.message, // Ensure the field matches your Firestore schema
              createdAt: new Date(), // Convert timestamp to Date objects
              user: {
                _id: data.sentBy === user?.email ? 1 : 2, // Adjust user ID logic if needed
                name: '', // Customize names based on user IDs
                avatar:
                  data.sentBy === providerId
                    ? data.providerAvatar
                    : data.customerAvatar, // Customize avatar URLs
              },
            } as IMessage;
          });

          setConversations(newMessages);
          updateMessageCount(
            providerId,
            customerId as string,
            user?.is_service_provider as number,
          );

          // Scroll to the bottom of the list
        },
        error => {
          console.error('Error fetching conversations:', error);
        },
      );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [providerId, customerId]);

  useEffect(() => {
    chatRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, [messages]);

  // Handle sending new messages
  const onSend = async (messagesArray: IMessage[]) => {
    const payload: Message = {
      lastMessageTimestamp: messagesArray[0].createdAt,
      lastMessageContent: messagesArray[0].text,
      customerId: customerId as string,
      usersIds: [providerId, customerId],
      providerId: providerId as string,
      providerAvatar:
        providerAvatar || 'https://avatar.iran.liara.run/public/44',
      customerAvatar:
        customerAvatar || 'https://avatar.iran.liara.run/public/44',
      sentBy: user?.email as string,
      providerName: providerName as string,
      customerName: customerName as string,
      is_provider: user?.is_service_provider,
      id: uuidv4(),
    };

    await sendMessage(payload);

    checkForBlockedKeywords(payload.lastMessageContent)
      .then(async containsBlockedKeyword => {
        let words = '';
        blockedKeywordsSet.forEach(word => {
          words += word + ', ';
        });
        if (containsBlockedKeyword) {
          const isWarned = await warnUser();
          if (isWarned) {
            const {data, error} = await makeApiRequest('/block-user', 'POST', {
              user_id: user?.id,
            });
            if (data) {
              Alert.alert(
                'Account Blocked',
                'Your account has been blocked. Please contact us if you think this is an error.',
                [
                  {
                    text: 'OK',
                    onPress: () =>
                      navigation.reset({routes: [{name: 'AuthScreen'}]}),
                  },
                ],
              );
            }

            return;
          }
          Alert.alert(
            'Warning',
            'Your message contains restricted words such as "Facebook," "WhatsApp," or phrases that suggest external communication. For your safety and privacy, external contact or meeting outside the platform is not allowed Please avoid using these terms, or your account may be subject to temporary or permanent suspension.Thank you for understanding and complying with our guidelines.',
          );
        }
      })
      .catch(error => {
        console.log('error', error);
      });

    const formattedMessages = messagesArray.map(message => ({
      ...message,
      _id: uuidv4(),
      createdAt: new Date(),
      user: {
        _id: 1,
        name: user?.email,
        avatar: '',
      },
    }));
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, formattedMessages),
    );
  };

  // Close top popup
  const closeTopPopup = () => {
    setShowTopPopup(false);
  };

  const handleReport = async (reason: string) => {
    setShowSuccessModal({
      ...showSuccessModal,
      requestLoading: true,
      showModal: true,
    });

    const {data, error} = await makeApiRequest('/report-user', 'POST', {
      user_id: user?.id,
      reason,
    });
    if (error) {
      setShowErrorModal({
        errorTitle: 'Error',
        errorMessage: error.msg,
        isModalOpen: true,
      });
    }
    if (data) {
      setShowSuccessModal({
        successTitle: 'Success',
        successMessage: 'Reported Successfully',
        loadingMessage: 'Processing..',
        requestLoading: false,
        showModal: true,
      });

      setTimeout(() => {
        setShowSuccessModal({
          ...showSuccessModal,
          showModal: false,
        });
      }, 3000);
    }
  };

  return (
    <SafeAreaViewContainer edges={['right', 'left', 'bottom']}>
      <View
        style={[
          styles.container,
          {backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#fff'},
        ]}>
        {showTopPopup && (
          <View style={styles.topPopup}>
            <Text style={styles.popupTitle}>
              <Icons
                name="info"
                size={20}
                color="#EEB0B0"
                style={styles.infoIcon}
              />{' '}
              BEATASK REMINDER
            </Text>
            <Text style={styles.popupText}>
              Do not share personal information or make payments outside the
              BEATASK app. All transactions and communications must be conducted
              within the app to ensure your safety. BEATASK will not be
              responsible for any losses or issues arising from off-app
              dealings. Our official team will never contact you through
              unofficial channels. Please be cautious!
            </Text>
            <TouchableOpacity
              onPress={closeTopPopup}
              style={styles.popupCloseButton}>
              <Icons name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        <GiftedChat
          messageContainerRef={chatRef}
          messages={conversations.slice().reverse()}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
            name: user?.email,
            avatar: 'https://avatar.iran.liara.run/public/27',
          }}
          alwaysShowSend
          scrollToBottom
          scrollToBottomStyle={{marginBottom: 10}}
          scrollToBottomComponent={() => (
            <Icons name="arrow-down-circle" size={24} color="#1E90FF" />
          )}
          renderInputToolbar={props =>
            renderInputToolbar(
              props,
              colorScheme as string,
              chatIsBlocked,
              userBlocked,
            )
          }
          renderSend={renderSend}
          renderComposer={props => renderComposer(props, colorScheme)}
          textInputProps={{
            style: styles.textInput,
            placeholderTextColor: colorScheme === 'dark' ? '#aaa' : '#888',
          }}
          renderBubble={renderBubble}
          inverted={true}
        />
      </View>

      <ReportModal
        visible={reportModalOpen}
        hideDialog={() => setReportModalOpen(false)}
        handleSubmit={reason => handleReport(reason)}
      />

      <CustomModal {...showSuccessModal} />
      <CustomErrorModal
        {...showErrorModal}
        closeModal={() =>
          setShowErrorModal({...showErrorModal, isModalOpen: false})
        }
      />
    </SafeAreaViewContainer>
  );
};

const renderBubble = (props: any) => (
  <Bubble
    {...props}
    wrapperStyle={{
      left: {
        backgroundColor: props.colorScheme === 'dark' ? '#fff' : '#D3D3D3',
      },
      right: {
        backgroundColor: props.colorScheme === 'dark' ? '#1E90FF' : '#1E90FF',
      },
    }}
    renderMessageText={(messageProps: MessageTextProps<IMessage>) => (
      <View style={styles.messageContainer}>
        <Text style={styles.username}>
          {messageProps.currentMessage?.user.name}
        </Text>
        <MessageText
          {...messageProps}
          textStyle={{left: {textAlign: 'left'}, right: {textAlign: 'right'}}}
        />
      </View>
    )}
  />
);

const renderInputToolbar = (
  props: any,
  colorScheme: string,
  isConvoBlocked: boolean,
  isConvoBlockedBy: number,
) => {
  if (isConvoBlocked) {
    return (
      <View style={{alignItems: 'center', paddingVertical: 4}}>
        <PaperText>
          {isConvoBlockedBy === 1
            ? 'You have blocked this conversation'
            : 'Other user has blocked this conversation'}
        </PaperText>
      </View>
    );
  }

  return (
    <InputToolbar
      {...props}
      containerStyle={[
        styles.inputToolbarContainer,
        {backgroundColor: colorScheme === 'dark' ? '#404040' : '#fff'},
      ]}
      primaryStyle={{alignItems: 'center'}}
    />
  );
};

const renderSend = (props: any) => (
  <Send {...props}>
    <View style={styles.sendingContainer}>
      <Icons name="send" size={24} color="#000" />
    </View>
  </Send>
);

const renderComposer = (props: any, colorScheme: any) => {
  return (
    <Composer
      {...props}
      multiline
      textInputStyle={[
        styles.textInput,
        colorScheme === 'dark' ? styles.darkTextInput : styles.lightTextInput,
      ]}
      placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'column',
  },
  username: {
    fontSize: wp('3%'),
    color: 'gray',
    marginBottom: hp('1%'),
    paddingHorizontal: wp('3%'),
  },
  topPopup: {
    backgroundColor: '#021114',
    padding: wp('2.5%'),
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  infoIcon: {
    marginRight: wp('2%'),
  },
  popupTitle: {
    color: '#EEB0B0',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    paddingLeft: wp('2%'),
  },
  popupText: {
    color: '#EEB0B0',
    fontSize: wp('3%'),
    textAlign: 'left',
    paddingLeft: wp('2%'),
  },
  popupCloseButton: {
    position: 'absolute',
    top: wp('1%'),
    right: wp('1%'),
  },
  inputToolbarContainer: {
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    marginLeft: wp('2%'),
    marginRight: wp('2%'),
    padding: wp('2%'),

    borderRadius: wp('2%'),
  },
  darkTextInput: {
    color: '#fff',
  },
  lightTextInput: {
    color: '#1e293b',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: wp('2%'),
  },
});

export default ChatScreen;
