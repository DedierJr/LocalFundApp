// /services/chatService.ts
import { firestore } from '../firebase';
import { Chat } from '../model/Chat';
import { Message } from '../model/Message';

export const createChat = async (participants: string[]) => {
    const chat = new Chat({ participants });
    if (!chat.id) {
        console.error('Chat ID is empty.');
        return null;
    }
    await firestore.collection('chats').doc(chat.id).set(chat.toFirestore());
    return chat.id;
};

export const sendMessage = async (chatId: string, senderId: string, content: string) => {
    const message = new Message({ chatId, senderId, content });
    await firestore.collection('chats').doc(chatId).collection('messages').doc(message.id).set(message.toFirestore());
};

export const subscribeToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
    return firestore.collection('chats').doc(chatId).collection('messages')
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
            const messages = snapshot.docs.map(doc => new Message(doc.data()));
            callback(messages);
        });
};
