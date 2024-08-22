import React, {useEffect, useState, useId, useRef} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  FlatList,
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
  generateConversationId,
  sendMessage,
  updateMessageCount,
} from '../../../firebase/helpers';
import {useNavigation} from '@react-navigation/native';

import {Message} from './masglist';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../../App';

type Props = {
  route: RouteProp<RootStackParamList, 'Chat'>;
};

const ChatScreen: React.FC<Props> = ({route}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversations, setConversations] = useState<IMessage[]>([]);
  const [showTopPopup, setShowTopPopup] = useState(true);
  const colorScheme = useColorScheme();
  const {user} = useUserStore(state => state);
  const navigation = useNavigation();
  const {chatId, providerId, providerName} = route.params || {};
  const customerId = user?.email;
  const id = useId();
  const chatRef = useRef<FlatList<IMessage> | null>(null);

  useEffect(() => {
    navigation.setOptions({
      title: providerName,
    });
  }, []);

  useEffect(() => {
    // Reference to the conversations collection

    // Reference to the messages sub-collection

    const generatedId = generateConversationId(
      providerId,
      customerId as string,
    );

    const conversationId = chatId ? chatId : generatedId;

    console.log(conversationId, 'conversation id');

    (async () => {})();

    const messagesRef = firestore()
      .collection('conversations')
      .doc(conversationId as string)
      .collection('messages');

    // Set up a real-time listener with ordering by 'timestamp'
    const unsubscribe = messagesRef
      .orderBy('timestamp') // Ensure messages are ordered by timestamp
      .onSnapshot(
        snapshot => {
          // Extract messages from snapshot
          const newMessages = snapshot.docs.map(doc => {
            const data = doc.data();

            return {
              _id: doc.id,
              text: data.message, // Ensure the field matches your Firestore schema
              createdAt: new Date(), // Convert timestamp to Date objects
              user: {
                _id: data.sentBy === customerId ? 1 : 2, // Adjust user ID logic if needed
                name: '', // Customize names based on user IDs
                avatar:
                  data.sentBy === providerId
                    ? 'https://avatar.iran.liara.run/public/44'
                    : 'https://avatar.iran.liara.run/public/27', // Customize avatar URLs
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
    console.log('onSend');

    const payload: Message = {
      lastMessageTimestamp: messagesArray[0].createdAt,
      lastMessageContent: messagesArray[0].text,
      customerId: user?.email as string,
      usersIds: [providerId, user?.email as string],
      providerId: providerId as string,
      providerAvatar: 'https://avatar.iran.liara.run/public/44',
      customerAvatar: 'https://avatar.iran.liara.run/public/44',
      sentBy: user?.email as string,
      providerName: providerName as string,
      customerName: `${user?.last_legal_name} ${user?.first_legal_name}`,
      is_provider: user?.is_service_provider,
      id,
    };
    console.log('sending payload', payload);
    await sendMessage(payload);
    const formattedMessages = messagesArray.map(message => ({
      ...message,
      _id: Math.round(Math.random() * 1000000),
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

  return (
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
            responsible for any losses or issues arising from off-app dealings.
            Our official team will never contact you through unofficial
            channels. Please be cautious!
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
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        renderComposer={renderComposer}
        textInputProps={{
          style: styles.textInput,
          placeholderTextColor: colorScheme === 'dark' ? '#aaa' : '#888',
        }}
        renderBubble={renderBubble}
        inverted={true}
      />
    </View>
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

const renderInputToolbar = (props: any) => (
  <InputToolbar
    {...props}
    containerStyle={styles.inputToolbarContainer}
    primaryStyle={{alignItems: 'center'}}
  />
);

const renderSend = (props: any) => (
  <Send {...props}>
    <View style={styles.sendingContainer}>
      <Icons name="send" size={24} color="#000" />
    </View>
  </Send>
);

const renderComposer = (props: any) => (
  <Composer
    {...props}
    textInputStyle={styles.textInput}
    placeholderTextColor={props.colorScheme === 'dark' ? '#aaa' : '#888'}
  />
);

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
    backgroundColor: '#fff',
    borderTopColor: '#e8e8e8',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    color: '#000',
    flex: 1,
    marginLeft: wp('2%'),
    marginRight: wp('2%'),
    padding: wp('2%'),
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: wp('2%'),
  },
});

export default ChatScreen;
