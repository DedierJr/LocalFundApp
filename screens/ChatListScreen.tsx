// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/ChatListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';

const ChatListScreen = ({ navigation, route }: any) => {
    const [chats, setChats] = useState([]);
    const { userId } = route.params;

    useEffect(() => {
        const unsubscribe = firestore.collection('chats')
            .where('participants', 'array-contains', userId)
            .onSnapshot(snapshot => {
                const chatList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setChats(chatList);
            });

        return () => unsubscribe();
    }, [userId]);

    return (
        <View>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: item.id, userId })}>
                        <Text>Chat with: {item.participants.filter((p: string) => p !== userId).join(', ')}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ChatListScreen;
