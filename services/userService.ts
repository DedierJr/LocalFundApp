// /LocalFundApp/services/userService.ts
import { firestore, auth } from '../firebase';
import { Usuario } from '../model/Usuario';
import { sendNotification } from './notificationService';

export const followUser = async (userId: string) => {
  const currentUserId = auth.currentUser?.uid;

  if (!currentUserId || !userId) {
    console.error('IDs de usuário inválidos.');
    return false;
  }

  try {
    const userRef = firestore.collection('Usuario').doc(userId);
    const currentUserRef = firestore.collection('Usuario').doc(currentUserId);

    const userDoc = await userRef.get();
    const currentUserDoc = await currentUserRef.get();

    if (!userDoc.exists || !currentUserDoc.exists) {
      console.error('Usuário não encontrado.');
      return false;
    }

    const user = new Usuario(userDoc.data());
    const currentUser = new Usuario(currentUserDoc.data());

    if (!user.followers.includes(currentUserId)) {
      await userRef.update({
        followers: [...user.followers, currentUserId],
      });
      await currentUserRef.update({
        following: [...currentUser.following, userId],
      });

      sendNotification(userId, `começou a te seguir!`, 'followed');

      return true;
    } else {
      console.error('O usuário já está sendo seguido.');
      return false;
    }
  } catch (error) {
    console.error('Erro ao seguir usuário:', error);
    return false;
  }
};

export const unfollowUser = async (userId: string) => {
  const currentUserId = auth.currentUser?.uid;

  if (!currentUserId || !userId) {
    console.error('IDs de usuário inválidos.');
    return false;
  }

  try {
    const userRef = firestore.collection('Usuario').doc(userId);
    const currentUserRef = firestore.collection('Usuario').doc(currentUserId);

    const userDoc = await userRef.get();
    const currentUserDoc = await currentUserRef.get();

    if (!userDoc.exists || !currentUserDoc.exists) {
      console.error('Usuário não encontrado.');
      return false;
    }

    const user = new Usuario(userDoc.data());
    const currentUser = new Usuario(currentUserDoc.data());

    if (user.followers.includes(currentUserId)) {
      await userRef.update({
        followers: user.followers.filter(followerId => followerId !== currentUserId),
      });
      await currentUserRef.update({
        following: currentUser.following.filter(followingId => followingId !== userId),
      });

      return true;
    } else {
      console.error('O usuário não está sendo seguido.');
      return false;
    }
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
