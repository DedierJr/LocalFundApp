import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore, auth } from '../firebase';
import { Chat } from '../model/Chat';
import { useNavigation } from '@react-navigation/native';

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
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

    fetchChats();
  }, []);

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { chatId: item.id })}
    >
      <Text style={styles.chatItemText}>Chat com {item.participants.join(', ')}</Text>
    </TouchableOpacity>
  );

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatItemText: {
    fontSize: 18,
  },
});

export default Messages;
