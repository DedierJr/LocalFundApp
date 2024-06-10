// /home/aluno/Documentos/DedierJr/LocalFundApp/services/chatService.ts
import { firestore } from '../firebase';
import { Chat } from '../model/Chat';
import { Message } from '../model/Message';

export const createChat = async (participants: string[]) => {
    // Verifica se já existe um chat com os participantes fornecidos
    const existingChat = await findChatByParticipants(participants);
    if (existingChat) {
        console.log('Chat already exists:', existingChat.id);
        return existingChat.id;
    }

    // Se não existir, cria um novo chat
    const chat = new Chat({ participants });
    const chatRef = await firestore.collection('chats').add(chat.toFirestore());
    console.log('New chat created with ID:', chatRef.id);
    return chatRef.id;
};

// Função auxiliar para encontrar um chat pelos participantes
const findChatByParticipants = async (participants: string[]): Promise<Chat | null> => {
    const chatsCollection = firestore.collection('chats');
    const chatsQuery = await chatsCollection.where('participants', '==', participants).get();
    if (chatsQuery.empty) {
        return null;
    } else {
        const chatDoc = chatsQuery.docs[0];
        const chatData = chatDoc.data();
        return new Chat({ id: chatDoc.id, ...chatData });
    }
};

export const sendMessage = async (chatId: string, senderId: string, content: string) => {
    const message = new Message({ chatId, senderId, content });
    await firestore.collection('chats').doc(chatId).collection('messages').add(message.toFirestore());
};

export const subscribeToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
    return firestore.collection('chats').doc(chatId).collection('messages')
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
            const messages = snapshot.docs.map(doc => new Message(doc.data()));
            callback(messages);
        });
};
