import { firestore, auth } from '../firebase';
import { Notification } from '../model/Notification';

export const sendNotification = async (recipientId: string, message: string, type: 'followed' | 'chat_message', chatId?: string) => {
  const sender = auth.currentUser;
  if (!sender) {
    throw new Error("User not logged in");
  }

  const senderData = await firestore.collection('Usuario').doc(sender.uid).get();
  if (!senderData.exists) {
    throw new Error("Sender data not found");
  }

  // Use the correct field 'nickname' to get the sender's nickname
  const senderNickname = senderData.data()?.nickname || ''; 

  if (!senderNickname) {
    throw new Error("Sender nickname not found");
  }

  const notification: Partial<Notification> = {
    userId: recipientId,
    message: `${senderNickname} ${message}`, // Include sender nickname in the message
    type,
    read: false,
    timestamp: new Date()
  };

  if (type === 'chat_message' && chatId) {
    notification.chatId = chatId;
  }

  await firestore.collection('notifications').add(notification);
};

export const fetchNotifications = async (userId: string) => {
  const snapshot = await firestore.collection('notifications').where('userId', '==', userId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
