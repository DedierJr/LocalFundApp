      
// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/AddPost.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../firebase';
import PostModel from '../model/Post';

const AddPost = () => {
  const [content, setContent] = useState('');
  
  const handleAddPost = async () => {
    if (content.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira um conteúdo para o post.');
      return;
    }
  
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const newPost = new PostModel({
          userId: currentUser.uid,
          content,
          createdAt: new Date(),
          // Explicitly set lat, long, location, and nickname to null
          lat: null, 
          long: null,
          location: null, 
          nickname: null, 
          userProfilePicture: currentUser.photoURL, 
          username: currentUser.displayName,
        });
  
        // Convert to plain object before adding to Firestore
        const plainPostObject = { ...newPost }; 
  
        // Change the collection name to 'posts'
        await firestore.collection('posts').add(plainPostObject); 
        Alert.alert('Sucesso', 'Post criado com sucesso!');
        setContent(''); // Clear the input field
      } else {
        Alert.alert('Erro', 'Você precisa estar logado para criar um post.');
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar o post.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite seu post..."
        multiline={true}
        numberOfLines={4}
        value={content}
        onChangeText={setContent}
      />
      <Button title="Criar Post" onPress={handleAddPost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});

export default AddPost;