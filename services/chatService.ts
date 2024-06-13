// /home/aluno/Documentos/DedierJr/LocalFundApp/services/chatService.ts
import { firestore } from '../firebase';
import { Chat } from '../model/Chat';
import { Usuario } from '../model/Usuario';

export const createChat = async (participants: string[]) => {
    const existingChat = await findChatByParticipants(participants);
    if (existingChat) {
        return existingChat.id;
    }

    const chat = new Chat({ participants });
    const chatRef = await firestore.collection('chats').add(chat.toFirestore());
    const newChatId = chatRef.id;

    // Atualizar cada usuário com o ID do chat
    await Promise.all(participants.map(async (userId) => {
        const userRef = firestore.collection('Usuario').doc(userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            const user = userDoc.data() as Usuario;
            const friendId = participants.find(participant => participant !== userId);
            if (friendId) {
                const friendIndex = user.friends.findIndex(friend => friend.friendId === friendId);
                if (friendIndex >= 0) {
                    user.friends[friendIndex].chatId = newChatId;
                } else {
                    user.friends.push({ friendId, chatId: newChatId });
                }
                await userRef.set(user.toFirestore());
            }
        }
    }));

    return newChatId;
};

export const findChatByParticipants = async (participants: string[]): Promise<Chat | null> => {
    const chatsCollection = firestore.collection('chats');
    const chatsQuery = await chatsCollection
        .where('participants', 'array-contains', participants[0])
        .get();


    for (const chatDoc of chatsQuery.docs) {
        const chatData = chatDoc.data();
        const chatParticipants: string[] = chatData.participants;


        if (participants.length === chatParticipants.length &&
            participants.every(participant => chatParticipants.includes(participant))) {
            return new Chat({ id: chatDoc.id, ...chatData });
        }
    }

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
