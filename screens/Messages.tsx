import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { firestore, auth } from '../firebase';
import { Chat } from '../model/Chat';
import { Usuario } from '../model/Usuario';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/layout/Messages'

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [userDetails, setUserDetails] = useState<{ [key: string]: { nickname: string, fotoPerfil: string } }>({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChats = async () => {
      const currentUserId = auth.currentUser?.uid;

      if (!currentUserId) {
        console.error('ID de usuário inválido.');
        return;
      }

      try {
        const userRef = firestore.collection('Usuario').doc(currentUserId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData && userData.chats) {
            const chatsPromises = userData.chats.map(async (chatId: string) => {
              const chatRef = firestore.collection('chats').doc(chatId);
              const chatDoc = await chatRef.get();
              return new Chat({ id: chatDoc.id, ...chatDoc.data() });
            });
            const chatsData = await Promise.all(chatsPromises);
            setChats(chatsData);
          }
        } else {
          console.log('Usuário não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar chats:', error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const usersSnapshot = await firestore.collection('Usuario').get();
        const usersData: { [key: string]: { nickname: string, fotoPerfil: string } } = {};
        usersSnapshot.forEach(doc => {
          const user = new Usuario(doc.data());
          usersData[doc.id] = { nickname: user.nickname, fotoPerfil: user.fotoPerfil };
        });
        setUserDetails(usersData);
      } catch (error) {
        console.error('Erro ao buscar detalhes dos usuários:', error);
      }
    };

    fetchChats();
    fetchUserDetails();
  }, []);

  const renderItem = ({ item }: { item: Chat }) => {
    const currentUserId = auth.currentUser?.uid;
    const otherParticipantId = item.participants.find(participantId => participantId !== currentUserId);
    const otherParticipantDetails = otherParticipantId ? userDetails[otherParticipantId] : { nickname: 'Desconhecido', fotoPerfil: '' };

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('Chat', { chatId: item.id })}
      >
        <Image
          source={{ uri: otherParticipantDetails.fotoPerfil }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <Text style={styles.chatItemText}>{otherParticipantDetails.nickname}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Messages;
