// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/Messages.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { firestore, auth } from '../firebase';
import { Chat } from '../model/Chat';
import { ChatItem } from '../components/ChatItem';
import { useNavigation } from '@react-navigation/native';

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const currentUserId = auth.currentUser?.uid;
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore.collection('Usuario')
      .doc(currentUserId) // Assuming you store chats in the user document
      .onSnapshot((snapshot) => {
        const chatsData = snapshot.data()?.chats || []; // Initialize as empty array if undefined
        if (chatsData) {
          // Fetch chat data for each chat ID
          const promises = chatsData.map(async (chatId: string) => {
            const chatDoc = await firestore.collection('chats').doc(chatId).get();
            if (chatDoc.exists) {
              return new Chat({ id: chatDoc.id, ...chatDoc.data() });
            }
          });

          Promise.all(promises).then(chats => setChats(chats.filter(chat => chat !== undefined)));
        }
      });
    return () => unsubscribe();
  }, [currentUserId]);

  const handleChatPress = (chatId: string) => {
    // Navigate to the individual chat screen
    navigation.navigate('ChatScreen', { chatId }); // Assuming you have a ChatDetails screen
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChatPress(item.id)}>
            <ChatItem chat={item} currentUserId={currentUserId} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default Messages;