// ListarPosts.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';
import { useNavigation } from '@react-navigation/core';

const ListarPosts = () => {
    const [posts, setPosts] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = firestore.collection('posts').onSnapshot((snapshot) => {
            const postsData = [];
            snapshot.forEach((doc) => {
                postsData.push({ id: doc.id, ...doc.data() });
            });
            setPosts(postsData);
        });

        return () => unsubscribe();
    }, []);

    const navigateToUserProfile = (userId) => {
        navigation.navigate('UserProfile', { userId });
    };

    return (
        <View>
            <Text>Listagem de Posts:</Text>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity onPress={() => navigateToUserProfile(item.userId)}>
                            <Text>{item.title}</Text>
                        </TouchableOpacity>
                        <Text>{item.content}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default ListarPosts;
