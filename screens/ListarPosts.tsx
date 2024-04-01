import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { firestore } from '../firebase';

const ListarPosts = () => {
    const [posts, setPosts] = useState([]);

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

    return (
        <View>
            <Text>Listagem de Posts:</Text>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.title}</Text>
                        <Text>{item.content}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default ListarPosts;
