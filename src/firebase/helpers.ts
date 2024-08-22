import firestore from '@react-native-firebase/firestore';
import {Message} from '../screens/Home/chat/masglist';

type Payload = {
  time: number | Date;
  message: string;
};

export const generateConversationId = (
  user1: string,
  user2: string,
): string => {
  // Sort user IDs to create a consistent unique ID
  const [providerId, customerId] = [user1, user2].sort();
  return `${providerId}_${customerId}`;
};

export const sendMessage = async ({
  providerId,
  customerId,
  lastMessageContent,
  lastMessageTimestamp,
  usersIds,
  sentBy,
  providerAvatar,
  providerName,
  customerName,
  id,
  is_provider,
}: Message) => {
  const conversationId = generateConversationId(providerId, customerId);

  // Create a message object
  const message = {
    providerId,
    customerId,
    message: lastMessageContent,
    time: lastMessageTimestamp,
    usersIds,
    sentBy,
    status: 'sent',

    providerName,
    customerName,
    providerAvatar,
    timestamp: firestore.FieldValue.serverTimestamp(),
    id,
  };

  // Write to current user's sub-collection
  try {
    // Reference to the conversation document
    const conversationRef = firestore()
      .collection('conversations')
      .doc(conversationId);

    const conversationDoc = await conversationRef.get();
    let recipientField = sentBy === 'providerId' ? 'customerId' : 'providerId';

    if (conversationDoc.exists) {
      // Update the conversation document

      await conversationRef.update({
        lastMessageTimestamp: firestore.Timestamp.fromDate(
          new Date(lastMessageTimestamp),
        ),
        lastMessageContent,
        providerCount:
          is_provider === 0
            ? firestore.FieldValue.increment(1)
            : conversationDoc.data()?.providerCount,
        customerCount:
          is_provider === 1
            ? firestore.FieldValue.increment(1)
            : conversationDoc.data()?.customerCount,
        sentBy,
        usersIds,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Create the conversation document
      await conversationRef.set({
        providerId,
        customerId,
        lastMessageTimestamp: firestore.Timestamp.fromDate(
          new Date(lastMessageTimestamp),
        ),
        lastMessageContent,
        providerCount: firestore.FieldValue.increment(1),
        customerCount: firestore.FieldValue.increment(1),
        customerName,
        providerName,
        sentBy,
        usersIds,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    // Create or update the conversation metadata

    // Reference to the messages sub-collection
    const messagesRef = conversationRef.collection('messages');

    // Add the message to the messages sub-collection
    await messagesRef.add(message);

    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message: ', error);
  }
};

export const getAllUserFriends = async (customerId: string) => {
  try {
    // Reference to the conversations collection
    const conversationsRef = firestore().collection('conversations');

    // Query to get all conversations involving the user
    const snapshot = await conversationsRef
      .where('customerId', '==', customerId)

      .get();

    console.log('snapshot', snapshot.docs);

    // Extract friend IDs
    let userFriends = [];
    const friendIds = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('data', data);

      return {
        name: data.user2Id,
        message: data.lastMessageContent,
        time: data.lastMessageTimestamp,
        id: doc.id,
      };
    });

    return friendIds;
  } catch (error) {
    console.error('Error retrieving friends: ', error);
  }
};

export const updateMessageCount = async (
  providerId: string,
  customerId: string,
  is_provider: number,
) => {
  const conversationId = generateConversationId(providerId, customerId);
  try {
    const conversationRef = firestore()
      .collection('conversations')
      .doc(conversationId);

    const conversationDoc = await conversationRef.get();
    if (conversationDoc.exists) {
      await conversationRef.update({
        providerCount:
          is_provider === 1 ? 0 : conversationDoc.data()?.providerCount,
        customerCount:
          is_provider === 0 ? 0 : conversationDoc.data()?.customerCount,
      });
    }
  } catch (error) {}
};
