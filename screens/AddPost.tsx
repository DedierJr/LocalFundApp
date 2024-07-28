import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { auth, storage } from '../firebase';
import PostModel from '../model/Post';
import { createPost } from '../services/postService';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; 
import styles from '../styles/layout/AddPost'; 

const AddPost = () => {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null); 

  const handleAddPost = async () => {
    if (content.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira um conteúdo para o post.');
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        let imageUrl = null; 

        if (imageUri) {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const uploadTask = storage.ref(`post-images/${currentUser.uid}/${Date.now()}`).put(blob);
          await uploadTask;
          imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
        }

        const newPost = new PostModel({
          userId: currentUser.uid,
          content,
          createdAt: new Date(),
          imageUrl, 
        });

        await createPost(newPost);
        Alert.alert('Sucesso', 'Post criado com sucesso!');
        setContent('');
        setImageUri(null); 
      } else {
        Alert.alert('Erro', 'Você precisa estar logado para criar um post.');
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar o post.');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
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

      <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
        <Ionicons name="add-circle-outline" size={30} color="gray" style={styles.imagePreview} />
        <Text style={styles.imageButtonText}>Adicionar Imagem</Text>
      </TouchableOpacity>

      <Button title="Criar Post" onPress={handleAddPost} />
    </View>
  );
};

export default AddPost;