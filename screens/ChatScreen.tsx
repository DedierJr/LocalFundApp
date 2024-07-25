// /LocalFundApp/screens/ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { firestore, auth } from '../firebase';
import { Message } from '../model/Message';
import { createChat } from '../services/chatService';
import styles from '../styles/layout/ChatScreen'


const ChatScreen = ({ route, navigation }: any) => {
  const { chatId, otherUserId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (!chatId) {
      createChat([currentUserId, otherUserId]).then((newChatId) => {
        navigation.setParams({ chatId: newChatId });
      });
    }
  }, [chatId, otherUserId, currentUserId, navigation]);

  useEffect(() => {
    const unsubscribe = firestore.collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        setMessages(messages);
      });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (newMessage.trim() === '') {
      return;
    }

    try {
      await firestore.collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
          text: newMessage,
          senderId: currentUserId,
          createdAt: new Date().toISOString()
        });
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.senderId === currentUserId ? styles.myMessage : styles.theirMessage]}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem"
        />
        <Button title="Enviar" onPress={handleSend} />
      </View>
    </View>
  );
};

export default ChatScreen;
