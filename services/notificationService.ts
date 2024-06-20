// /home/aluno/Documentos/DedierJr/LocalFundApp/services/notificationService.ts
import { firestore } from '../firebase';
import { Notification } from '../model/Notification';
import { Usuario } from '../model/Usuario';

export const sendNotification = async (userId: string, message: string, type: 'friend_request' | 'chat_message') => {
    const notification = new Notification({ userId, message, type });
    await firestore.collection('notifications').add(notification.toFirestore());
};

export const sendFriendRequest = async (senderId: string, receiverId: string) => {
    const receiverRef = firestore.collection('Usuario').doc(receiverId);
    const receiverDoc = await receiverRef.get();
    if (!receiverDoc.exists) {
        throw new Error('Usuário destinatário não encontrado');
    }

    const receiver = receiverDoc.data() as Usuario;
    receiver.friendRequests = receiver.friendRequests || [];

    if (receiver.friendRequests.some(req => req.senderId === senderId && req.status === 'pending')) {
        throw new Error('Solicitação de amizade já enviada');
    }

    receiver.friendRequests.push({ senderId, status: 'pending' });
    await receiverRef.set(receiver);

    // Enviar notificação de solicitação de amizade
    await sendNotification(receiverId, 'Você recebeu uma solicitação de amizade', 'friend_request');
    console.log('Solicitação de amizade enviada');
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
