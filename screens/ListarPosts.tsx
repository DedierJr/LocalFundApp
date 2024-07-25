// LocalFundApp/screens/ListarPosts.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firestore, auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import PostModel from '../model/Post';
import Usuario from '../model/Usuario';
import AddPostBtn from '../components/AddPostBtn';
import { getPosts, getUsers } from '../services/userService';
import { deletePost } from '../services/postService';

interface ListarPostsProps {
  userId?: string;
}

const ListarPosts: React.FC<ListarPostsProps> = ({ userId }) => {
  const [posts, setPosts] = useState<PostModel[]>([]); 
  const [users, setUsers] = useState<{ [key: string]: Usuario }>({});
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      const fetchedPosts = await getPosts();
      const fetchedUsers = await getUsers();
      setPosts(userId ? fetchedPosts.filter(post => post.userId === userId) : fetchedPosts);
      setUsers(fetchedUsers);
    };

    fetchPostsAndUsers();

    const unsubscribePosts = firestore.collection('posts').onSnapshot((snapshot) => {
      const postsData: PostModel[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PostModel));
      setPosts(userId ? postsData.filter(post => post.userId === userId) : postsData);
    });

    const unsubscribeUsers = firestore.collection('Usuario').onSnapshot((snapshot) => {
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
  }, [userId]);

  const navigateToUserProfile = (userId: string) => {
    if (userId === currentUser?.uid) {
      navigation.navigate('CurrentUser');
    } else {
      console.log('Navigating to user profile with ID:', userId);
      navigation.navigate('UserProfile', { userId });
    }
  };

  const navigateToPostDetails = (postId: string) => {
    const post = posts.find(item => item.id === postId);
    if (post) {
      navigation.navigate('DetalhesPost', { postId, post });
    } else {
      console.warn('Post not found:', postId);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const success = await deletePost(postId);
    if (success) {
      Alert.alert('Sucesso', 'Post deletado com sucesso!');
    } else {
      Alert.alert('Erro', 'Erro ao deletar post.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <TouchableOpacity onPress={() => navigateToPostDetails(item.id)}>
              <Text style={styles.postContent}>{item.content}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateToUserProfile(item.userId)}>
              <Text style={styles.postAuthorNickname}>{users[item.userId]?.nickname || users[item.userId]?.username}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {!userId && <AddPostBtn />}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 5,
    flex: 1,
  },
  postAuthorNickname: {
    fontWeight: 'bold',
    color: 'black',
  },
  deleteButton: {
    color: 'red',
  },
});

export default ListarPosts;
