// /home/aluno/Documentos/DedierJr/LocalFundApp/services/chatService.ts
import { firestore } from '../firebase';
import { Chat } from '../model/Chat';
import { Message } from '../model/Message';

export const createChat = async (participants: string[]) => {
  const existingChat = await findChatByParticipants(participants);
  if (existingChat) {
    return existingChat.id;
  }

  const chat = new Chat({ participants });
  const chatRef = await firestore.collection('chats').add(chat.toFirestore());
  const newChatId = chatRef.id;

  // Update each participant's "chats" array
  await Promise.all(participants.map(async (userId) => {
    const userRef = firestore.collection('Usuario').doc(userId);
    // Use arrayUnion to add the new chatId to the existing array
    await userRef.update({
      chats: firestore.FieldValue.arrayUnion(newChatId) 
    });
  }));

  return newChatId;
};

export const findChatByParticipants = async (participants: string[]): Promise<Chat | null> => {
  const chatsCollection = firestore.collection('chats');
  const chatsQuery = await chatsCollection
    .where('participants', 'array-contains-any', participants)
    .get();

  const matchingChats = chatsQuery.docs.map(doc => new Chat({ id: doc.id, ...doc.data() }));

  // Filtra os chats que contêm todos os participantes
  const exactMatchChats = matchingChats.filter(chat =>
    participants.every(participant => chat.participants.includes(participant)) &&
    chat.participants.length === participants.length
  );

  if (exactMatchChats.length > 0) {
    return exactMatchChats[0];
  } else {
    return null;
  }
};

export const sendMessage = async (chatId: string, senderId: string, content: string) => {
  const message = new Message({ chatId, senderId, content });
  await firestore.collection('chats').doc(chatId).collection('messages').add(message.toFirestore());
};

export const subscribeToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  return firestore.collection('chats').doc(chatId).collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot(snapshot => {
      const messages = snapshot.docs.map(doc => new Message({ id: doc.id, ...doc.data() }));
      callback(messages);
    });
};