// /home/aluno/Documentos/DedierJr/LocalFundApp/services/notificationService.ts
import { firestore } from '../firebase';
import { Notification } from '../model/Notification';
import { Usuario } from '../model/Usuario';

export const sendNotification = async (userId: string, message: string, type: 'followed' | 'chat_message') => { // Update type
    const notification = new Notification({ userId, message, type });
    await firestore.collection('notifications').add(notification.toFirestore());
};

export const sendMessage = async (chatId: string, senderId: string, content: string) => {
    const message = new Message({ chatId, senderId, content });
    await firestore.collection('chats').doc(chatId).collection('messages').add(message.toFirestore());

    // Obter os participantes do chat
    const chatRef = firestore.collection('chats').doc(chatId);
    const chatDoc = await chatRef.get();
    if (chatDoc.exists) {
        const chatData = chatDoc.data() as Chat;
        const receiverId = chatData.participants.find((id: string) => id !== senderId);
        if (receiverId) {
            // Enviar notificação de mensagem de chat
            await sendNotification(receiverId, 'Você recebeu uma nova mensagem', 'chat_message');
        }
    }
};

export const fetchNotifications = async (userId: string) => {
    const notificationsSnapshot = await firestore.collection('notifications').where('userId', '==', userId).get();
    return notificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
