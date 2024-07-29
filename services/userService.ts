// /LocalFundApp/services/userService.ts
import { firestore, auth, firebase } from '../firebase';
import { Usuario } from '../model/Usuario';
import { sendNotification } from './notificationService';
import { Alert } from 'react-native';
import { findChatByParticipants, createChat } from '../services/chatService'; 

export const followUser = async (userId: string, user: Usuario, navigation: any) => {
  const currentUserId = auth.currentUser?.uid;

  if (!currentUserId || !userId || !user) {
    console.error('IDs de usuário inválidos.');
    return false;
  }

  try {
    await firestore.collection('Usuario').doc(userId).update({ 
      followers: firebase.firestore.FieldValue.arrayUnion(currentUserId) 
    });
    await firestore.collection('Usuario').doc(currentUserId).update({
      following: firebase.firestore.FieldValue.arrayUnion(userId)
    });

    sendNotification(userId, `começou a te seguir!`, 'followed');
    Alert.alert('Sucesso', 'Você agora está seguindo este usuário.');
    return true;
  } catch (error) {
    console.error('Erro ao seguir usuário:', error);
    return false;
  }
};

export const unfollowUser = async (userId: string, user: Usuario, navigation: any) => {
  const currentUserId = auth.currentUser?.uid;

  if (!currentUserId || !userId || !user) {
    console.error('IDs de usuário inválidos.');
    return false;
  }

  try {
    await firestore.collection('Usuario').doc(userId).update({ 
      followers: firebase.firestore.FieldValue.arrayRemove(currentUserId) 
    });
    await firestore.collection('Usuario').doc(currentUserId).update({
      following: firebase.firestore.FieldValue.arrayRemove(userId)
    });
    Alert.alert('Sucesso', 'Você deixou de seguir este usuário.');
    return true;
  } catch (error) {
    console.error('Erro ao deixar de seguir usuário:', error);
    return false;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const userRef = firestore.collection('Usuario').doc(userId);
    const doc = await userRef.get();

    if (doc.exists) {
      const userData = doc.data();
      if (userData) {
        return new Usuario(userData);
      } else {
        console.error('Dados do usuário estão vazios.');
        return null;
      }
    } else {
      console.log('Usuário não encontrado');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};

export const isFollowing = async (userId: string) => {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId || !userId) {
    console.error('IDs de usuário inválidos.');
    return false;
  }

  try {
    const userRef = firestore.collection('Usuario').doc(userId);
    const doc = await userRef.get();

    if (doc.exists) {
      const userData = doc.data();
      if (userData) {
        const user = new Usuario(userData);
        return user.followers.includes(currentUserId);
      } else {
        console.error('Dados do usuário estão vazios.');
        return false;
      }
    } else {
      console.log('Usuário não encontrado');
      return false;
    }
  } catch (error) {
    console.error('Erro ao verificar se está seguindo:', error);
    return false;
  }
};

export const searchUsers = async (searchTerm: string) => {
  const currentUserId = auth.currentUser?.uid;

  try {
    const usersRef = firestore.collection('Usuario');
    const snapshot = await usersRef
      .where('username', '>=', searchTerm)
      .where('username', '<=', searchTerm + '\uf8ff')
      .get();

    const users = snapshot.docs
      .filter(doc => doc.id !== currentUserId)
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

export const getFollowingUsers = async () => {
  const currentUserId = auth.currentUser?.uid;

  if (!currentUserId) {
    console.error('ID do usuário atual é inválido.');
    return [];
  }

  try {
    const currentUserRef = firestore.collection('Usuario').doc(currentUserId);
    const currentUserDoc = await currentUserRef.get();

    if (!currentUserDoc.exists) {
      console.error('Usuário atual não encontrado.');
      return [];
    }

    const currentUser = new Usuario(currentUserDoc.data());
    const followingIds = currentUser.following;

    const followingUsers = await Promise.all(
      followingIds.map(async (userId) => {
        const userRef = firestore.collection('Usuario').doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          return new Usuario(userDoc.data());
        } else {
          console.error(`Usuário com ID ${userId} não encontrado.`);
          return null;
        }
      })
    );

    return followingUsers.filter(user => user !== null);
  } catch (error) {
    console.error('Erro ao obter usuários seguidos:', error);
    return [];
  }
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
