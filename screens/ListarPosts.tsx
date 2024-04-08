// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/ListarPosts.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import { useNavigation } from '@react-navigation/core';

const ListarPosts = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribePosts = firestore.collection('posts').onSnapshot((snapshot) => {
            const postsData = [];
            snapshot.forEach((doc) => {
                postsData.push({ id: doc.id, ...doc.data() });
            });
            setPosts(postsData);
        });

        const unsubscribeUsers = firestore.collection('users').onSnapshot((snapshot) => {
            const usersData = {};
            snapshot.forEach((doc) => {
                usersData[doc.id] = doc.data();
            });
            setUsers(usersData);
        });

        return () => {
            unsubscribePosts();
            unsubscribeUsers();
        };
    }, []);

    const navigateToUserProfile = (userId) => {
        const userData = users[userId];
        navigation.navigate('UserProfile', { userData });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Listagem de Posts:</Text>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        <TouchableOpacity onPress={() => navigateToUserProfile(item.userId)}>
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <Text style={styles.postContent}>{item.content}</Text>
                            <Text style={styles.postAuthor}>Por: {users[item.userId]?.name}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    postContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    postContent: {
        marginBottom: 5,
    },
    postAuthor: {
        fontStyle: 'italic',
        color: '#666',
    },
});

export default ListarPosts;
