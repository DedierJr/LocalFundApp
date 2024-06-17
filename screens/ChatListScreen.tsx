// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/ChatListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';
import { Notification } from '../model/Notification';

const ChatListScreen = ({ navigation, route }: any) => {
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { userId } = route.params;

    useEffect(() => {
        const unsubscribeChats = firestore.collection('chats')
            .where('participants', 'array-contains', userId)
            .onSnapshot(snapshot => {
                const chatList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setChats(chatList);
            });

        return () => unsubscribeChats();
    }, [userId]);

    useEffect(() => {
        const unsubscribeNotifications = firestore.collection('notifications')
            .where('userId', '==', userId)
            .where('read', '==', false)
            .onSnapshot(snapshot => {
                const notificationList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Notification));
                setNotifications(notificationList);
            });

        return () => unsubscribeNotifications();
    }, [userId]);

    const handleNotificationPress = async (notification: Notification) => {
        if (notification.type === 'friend_request') {
            navigation.navigate('FriendRequests', { userId });
        } else if (notification.type === 'chat_message') {
            navigation.navigate('Chat', { chatId: notification.chatId, userId });
        }

        // Marcar notificação como lida
        const notificationRef = firestore.collection('notifications').doc(notification.id);
        await notificationRef.update({ read: true });
    };

    return (
        <View>
            <Text>Notificações:</Text>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
                        <Text>{item.message}</Text>
                    </TouchableOpacity>
                )}
            />

            <Text>Chats:</Text>
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
