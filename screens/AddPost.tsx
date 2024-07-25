// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/AddPost.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../firebase';
import PostModel from '../model/Post';
import { createPost } from '../services/postService';
import styles from '../styles/layout/AddPost'

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
        });

        const createdPost = await createPost(newPost);
        Alert.alert('Sucesso', 'Post criado com sucesso!');
        setContent('');
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

export default AddPost;