// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { firestore, auth } from '../firebase';
import { Message } from '../model/Message'; // Make sure you have a Message model

const ChatScreen = ({ route }: any) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]); // Use Message[] type
  const [newMessage, setNewMessage] = useState('');
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = firestore.collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc') // Or orderBy('timestamp', 'asc') if you use timestamp
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Message[]; // Cast to Message[]
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
          createdAt: new Date().toISOString() // Or use timestamp
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingTop: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginRight: 10,
  },
});

export default ChatScreen;