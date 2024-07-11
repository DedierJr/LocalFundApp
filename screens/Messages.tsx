// /LocalFundApp/screens/Messages.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { firestore, auth } from '../firebase';
import { Chat } from '../model/Chat';
import { ChatItem } from '../components/ChatItem';
import { useNavigation } from '@react-navigation/native';
import { createChat, getChatById, subscribeToMessages } from '../services/chatService';

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const currentUserId = auth.currentUser?.uid;
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore.collection('chats')
      .where('participants', 'array-contains', currentUserId)
      .onSnapshot((snapshot) => {
        const chatsData = snapshot.docs.map(doc => new Chat({ id: doc.id, ...doc.data() }));
        setChats(chatsData);
      });
    return () => unsubscribe();
  }, [currentUserId]);

  const handleChatPress = (chatId: string) => {
    navigation.navigate('ChatScreen', { chatId });
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