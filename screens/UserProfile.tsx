import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Usuario } from '../model/Usuario';
import { firestore, auth } from '../firebase';
import { createChat, findChatByParticipants } from '../services/chatService';
import { sendFriendRequest } from '../services/notificationService';

const UserProfile = ({ route, navigation }: any) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [friendRequestSent, setFriendRequestSent] = useState<boolean>(false);
  const { userId } = route.params;

  useEffect(() => {
    const getUser = async () => {
      try {
        const userRef = firestore.collection('Usuario').doc(userId);
        const doc = await userRef.get();

        if (doc.exists) {
          const userData = doc.data();
          if (userData) {
            const usuario = new Usuario(userData);
            setUser(usuario);
          } else {
            console.error('Dados do usuário estão vazios.');
          }
        } else {
          console.log('Usuário não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    getUser();
  }, [userId]);

  useEffect(() => {
    const checkChat = async () => {
      const currentUserId = auth.currentUser?.uid;

      if (!currentUserId || !userId) {
        console.error('IDs de usuário inválidos.');
        return;
      }

      const existingChat = await findChatByParticipants([userId, currentUserId]);
      setChatId(existingChat ? existingChat.id : null);
    };

    checkChat();
  }, [userId]);

  useEffect(() => {
    const checkFriendRequest = async () => {
      const currentUserId = auth.currentUser?.uid;

      if (!currentUserId || !userId) {
        console.error('IDs de usuário inválidos.');
        return;
      }

      const userRef = firestore.collection('Usuario').doc(userId);
      const doc = await userRef.get();

      if (doc.exists) {
        const userData = doc.data() as Usuario;
        userData.friendRequests = userData.friendRequests || [];
        const requestExists = userData.friendRequests.some(req => req.senderId === currentUserId && req.status === 'pending');
        setFriendRequestSent(requestExists);
      } else {
        console.log('Usuário não encontrado');
      }
    };

    checkFriendRequest();
  }, [userId]);

  const handleCreateChat = async () => {
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId || !userId) {
      console.error('IDs de usuário inválidos.');
      return;
    }

    try {
      const newChatId = await createChat([userId, currentUserId]);
      if (!newChatId) {
        console.error('Falha ao criar um novo chat.');
        return;
      }
      setChatId(newChatId);
      navigation.navigate('Chat', { chatId: newChatId, userId: currentUserId });
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  const handleFriendRequest = async () => {
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId || !userId) {
      console.error('IDs de usuário inválidos.');
      return;
    }

    try {
      await sendFriendRequest(currentUserId, userId);
      setFriendRequestSent(true);
      console.log('Solicitação de amizade enviada');
    } catch (error) {
      console.error('Erro ao enviar solicitação de amizade:', error);
    }
  };

  if (!user) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>{user.username}</Text>
      {chatId ? (
        <Button title="Entrar no Chat" onPress={() => navigation.navigate('Chat', { chatId })} />
      ) : (
        <Button title="Criar Chat" onPress={handleCreateChat} />
      )}
      <Button
        title={friendRequestSent ? "Solicitação enviada" : "Enviar solicitação de amizade"}
        disabled={friendRequestSent}
        onPress={handleFriendRequest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfile;
