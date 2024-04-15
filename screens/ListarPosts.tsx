import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { Post } from '../model/Post';
import { Usuario } from '../model/Usuario';
import AddPostBtn from '../components/AddPostBtn';

const ListarPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [key: string]: Usuario }>({});
  const navigation = useNavigation();

  useEffect(() => {
    // Buscar posts do Firestore
    const unsubscribePosts = firestore.collection('posts').onSnapshot((snapshot) => {
      const postsData: Post[] = [];
      snapshot.forEach((doc) => {
        //console.log(doc.data()) //! LOG
        postsData.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(postsData);
    });

    // Buscar usuários do Firestore
    const unsubscribeUsers = firestore.collection('users').onSnapshot((snapshot) => {
      const usersData: { [key: string]: Usuario } = {};
      snapshot.forEach((doc) => {
        usersData[doc.id] = doc.data() as Usuario;
      });
      setUsers(usersData);
    });


    return () => {
      unsubscribePosts();
      unsubscribeUsers();
    };
  }, []);

  const navigateToUserProfile = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
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
              <Text style={styles.postAuthor}>Por: {users[item.userId]?.nome}</Text>
            </TouchableOpacity>
          </View>
        )}
        />
      <AddPostBtn />
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
    color: 'black',
  },
});

export default ListarPosts;
