// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { Usuario } from '../model/Usuario';
import { firestore, auth } from '../firebase';
import { createChat, findChatByParticipants } from '../services/chatService';

const UserProfile = ({ route, navigation }: any) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const { userId } = route.params;

  useEffect(() => {
    const getUser = async () => {
      try {
        const userRef = firestore.collection('Usuario').doc(userId);
        const doc = await userRef.get();

        if (doc.exists) {
          const userData = doc.data();
          if (userData) {
            setUser(new Usuario(userData));
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
