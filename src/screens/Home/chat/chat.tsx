import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Bubble, GiftedChat, IMessage, MessageText, MessageTextProps, InputToolbar, Composer, Send } from 'react-native-gifted-chat';
import Icons from 'react-native-vector-icons/Feather';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface User {
    _id: string | number;
    name: string;
    avatar: string;
}

const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [showTopPopup, setShowTopPopup] = useState(true);
    const colorScheme = useColorScheme();

    useEffect(() => {
        // Initial messages
        setMessages([
            {
                _id: 2,
                text: 'Hi',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Maryland Winkles',
                    avatar: '',
                },
            },
            {
                _id: 1,
                text: 'Hello, hope you’re okay. I need your services.',
                createdAt: new Date(),
                user: {
                    _id: 1,
                    name: 'Me',
                    avatar: '',
                },
            },
        ]);
    }, []);

    // Handle sending new messages
    const onSend = (messagesArray: IMessage[]) => {
        const formattedMessages = messagesArray.map(message => ({
            ...message,
            _id: Math.round(Math.random() * 1000000),
            createdAt: new Date(),
            user: {
                _id: 1,
                name: 'Me',
                avatar: '',
            },
        }));
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, formattedMessages)
        );
    };

    // Close top popup
    const closeTopPopup = () => {
        setShowTopPopup(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#010A0C' : '#fff' }]}>
            {showTopPopup && (
                <View style={styles.topPopup}>
                    
                    <Text style={styles.popupTitle}><Icons name="info" size={20} color="#EEB0B0" style={styles.infoIcon} /> BEATASK REMINDER</Text>
                    <Text style={styles.popupText}>
                        Do not share personal information or make payments outside the BEATASK app. All transactions and communications must be conducted within the app to ensure your safety. BEATASK will not be responsible for any losses or issues arising from off-app dealings. Our official team will never contact you through unofficial channels. Please be cautious!
                    </Text>
                    <TouchableOpacity onPress={closeTopPopup} style={styles.popupCloseButton}>
                        <Icons name="x" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )}
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id: 1 }}
                alwaysShowSend
                scrollToBottom
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
                inverted={true} // Keeps the new messages at the bottom
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
                <Text style={styles.username}>{messageProps.currentMessage?.user.name}</Text>
                <MessageText {...messageProps} textStyle={{ left: { textAlign: 'left' }, right: { textAlign: 'right' } }} />
            </View>
        )}
    />
);

const renderInputToolbar = (props: any) => (
    <InputToolbar
        {...props}
        containerStyle={styles.inputToolbarContainer}
        primaryStyle={{ alignItems: 'center' }}
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
