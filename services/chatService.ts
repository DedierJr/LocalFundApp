import { firestore, auth } from '../firebase';
import firebase from 'firebase/compat/app';
import { Chat } from '../model/Chat';
import { Message } from '../model/Message';
import { Usuario } from '../model/Usuario';
import { sendNotification } from '../services/notificationService';

export const createChat = async (participants: string[]): Promise<string> => {
  const existingChat = await findChatByParticipants(participants);
  if (existingChat) {
    return existingChat.id;
  }

  const chat = new Chat({ participants });
  const chatRef = await firestore.collection('chats').add(chat.toFirestore());
  const newChatId = chatRef.id;

  // Atualizar o array "chats" de cada participante
  await Promise.all(participants.map(async (userId) => {
    const userRef = firestore.collection('Usuario').doc(userId);
    await userRef.update({
      chats: firebase.firestore.FieldValue.arrayUnion(newChatId)
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

  const exactMatchChats = matchingChats.filter(chat =>
    participants.every(participant => chat.participants.includes(participant)) &&
    chat.participants.length === participants.length
  );

  return exactMatchChats.length > 0 ? exactMatchChats[0] : null;
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

export const openChat = async (userId: string, navigation: any) => {
  const currentUserId = auth.currentUser?.uid;

  if (!currentUserId || !userId) {
    console.error('IDs de usuário inválidos.');
    return;
  }

  try {
    const existingChat = await findChatByParticipants([userId, currentUserId]);
    if (existingChat) {
      navigation.navigate('Chat', { chatId: existingChat.id, userId: currentUserId });
    } else {
      const newChatId = await createChat([userId, currentUserId]);
      if (newChatId) {
        navigation.navigate('Chat', { chatId: newChatId, userId: currentUserId });
      } else {
        console.error('Falha ao criar um novo chat.');
      }
    }
  } catch (error) {
    console.error('Erro ao abrir chat:', error);
  }
};

export const followUser = async (userId: string, user: Usuario, navigation: any) => {
  const currentUserId = auth.currentUser?.uid;

  if (!currentUserId || !userId || !user) {
    console.error('IDs de usuário inválidos.');
    return;
  }

  try {
    await firestore.collection('Usuario').doc(userId).update({
      followers: firestore.FieldValue.arrayUnion(currentUserId)
    });
    await firestore.collection('Usuario').doc(currentUserId).update({
      following: firestore.FieldValue.arrayUnion(userId)
    });

    sendNotification(userId, `começou a te seguir!`, 'followed');
    Alert.alert('Sucesso', 'Você agora está seguindo este usuário.');
  } catch (error) {
    console.error('Erro ao seguir usuário:', error);
  }
};

export const unfollowUser = async (userId: string, user: Usuario, navigation: any) => {
  const currentUserId = auth.currentUser?.uid;

  if (!currentUserId || !userId || !user) {
    console.error('IDs de usuário inválidos.');
    return;
  }

  try {
    await firestore.collection('Usuario').doc(userId).update({
      followers: firestore.FieldValue.arrayRemove(currentUserId)
    });
    await firestore.collection('Usuario').doc(currentUserId).update({
      following: firestore.FieldValue.arrayRemove(userId)
    });
    Alert.alert('Sucesso', 'Você deixou de seguir este usuário.');
  } catch (error) {
    console.error('Erro ao deixar de seguir usuário:', error);
  }
};
