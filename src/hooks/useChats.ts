import {useEffect} from 'react';
import {useUserStore} from '../store/useUserStore';
import firestore from '@react-native-firebase/firestore';
import {Message} from '../screens/Home/chat/masglist';

const useChats = () => {
  const {user, actions} = useUserStore(state => state);

  useEffect(() => {
    // Construct queries
    if (user) {
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
          count +=
            user.is_service_provider === 1
              ? message.providerCount ?? 0
              : message.customerCount ?? 0;
        });

        actions.setUnreadMessages(count);
      });

      // Clean up the listener on component unmount
      return () => unsubscribe();
    }
  }, [user?.email]);
};

export default useChats;
