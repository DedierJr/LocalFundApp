// /home/aluno/Documentos/DedierJr/LocalFundApp/services/chatService.ts
import { firestore } from '../firebase';
import { Chat } from '../model/Chat';
import { Message } from '../model/Message';

export const createChat = async (participants: string[]) => {
    const existingChat = await findChatByParticipants(participants);
    if (existingChat) {
        console.log('Chat already exists:', existingChat.id);
        return existingChat.id;
    }

    const chat = new Chat({ participants });
    const chatRef = await firestore.collection('chats').add(chat.toFirestore());
    console.log('New chat created with ID:', chatRef.id);
    return chatRef.id;
};

export const findChatByParticipants = async (participants: string[]): Promise<Chat | null> => {
    const chatsCollection = firestore.collection('chats');
    const chatsQuery = await chatsCollection
        .where('participants', 'array-contains', participants[0])
        .get();

    console.log(`Checking for existing chats with participant ${participants[0]}`);

    for (const chatDoc of chatsQuery.docs) {
        const chatData = chatDoc.data();
        const chatParticipants: string[] = chatData.participants;

        console.log(`Chat found with participants: ${chatParticipants.join(', ')}`);

        if (participants.length === chatParticipants.length &&
            participants.every(participant => chatParticipants.includes(participant))) {
            console.log(`Existing chat found with ID: ${chatDoc.id}`);
            return new Chat({ id: chatDoc.id, ...chatData });
        }
    }

    console.log('No existing chat found');
    return null;
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
