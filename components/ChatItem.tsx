// /LocalFundApp/components/ChatItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chat } from '../model/Chat';

interface ChatItemProps {
  chat: Chat;
  currentUserId: string;
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat, currentUserId }) => {
  const otherUser = chat.participants.find(participant => participant !== currentUserId);

  // You'll likely need to fetch the other user's data here
  // (e.g., from the Usuario collection) to display their name or profile picture

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{/* Display other user's name here */}</Text>
      <Text style={styles.lastMessage}>{/* Display last message content here */}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontWeight: 'bold',
    flex: 1,
  },
  lastMessage: {
    fontSize: 14,
  },
});