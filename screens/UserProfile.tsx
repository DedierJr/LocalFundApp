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
          setUser(doc.data() as Usuario);
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
      if (existingChat) {
        setChatId(existingChat.id);
        console.log('Chat ID encontrado:', existingChat.id);
      } else {
        setChatId(null);
        console.log('Nenhum chat existente encontrado');
      }
    };

    checkChat();
  }, [userId]);

  const handleCreateChat = async () => {
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId || !userId) {
      console.error('IDs de usuário inválidos.');
      return;
    }

    if (chatId) {
      console.log('Chat já existente:', chatId);
      navigation.navigate('Chat', { chatId, userId: currentUserId });
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

  const handleEnterChat = () => {
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId || !userId || !chatId) {
      console.error('IDs de usuário ou chat inválidos.');
      return;
    }

    navigation.navigate('Chat', { chatId, userId: currentUserId });
  };

  if (!user) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.username}</Text>
      {user.fotoPerfil && <Image style={styles.photo} source={{ uri: user.fotoPerfil }} />}
      {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
      <Button title="Chat" onPress={chatId ? handleEnterChat : handleCreateChat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserProfile;
