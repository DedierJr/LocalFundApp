// LocalFundApp/screens/CriarPost.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { firestore, auth } from '../firebase';
import meuestilo from '../meuestilo';
import PostModel from '../model/Post';
import { createPost } from '../services/postService';
import firebase from 'firebase/compat/app';
import styles from '../styles/layout/Registro';

const CriarPost = () => {
  const [formPost, setFormPost] = useState<Partial<PostModel>>({
    content: '',
    location: undefined,
  });
  const navigation = useNavigation();
  const route = useRoute();

  const initialLocation = route.params.initialLocation;
  const onPostCreated = route.params.onPostCreated; 

  const limparFormulario = () => {
    setFormPost({
      content: '',
      location: undefined,
    });
    navigation.goBack(); // Voltar para a tela anterior
  };

  const salvar = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Erro', 'Usuário não está logado.');
        return;
      }

      const post = new PostModel({
        id: '',
        userId,
        ...formPost,
        createdAt: new Date(),
        location: new firebase.firestore.GeoPoint(
          initialLocation.latitude,
          initialLocation.longitude
        )
      });

      await createPost(post);
      Alert.alert('Sucesso', 'Post adicionado com sucesso');
      limparFormulario();
      onPostCreated(); 
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o post.');
      console.error('Erro ao salvar o post:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Novo Post</Text>
        <TextInput
          placeholder="Content"
          value={formPost.content || ''}
          onChangeText={content => setFormPost({ ...formPost, content })}
          style={styles.postContentInput} 
        />
        <TouchableOpacity
          onPress={salvar}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={limparFormulario} style={styles.button}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CriarPost;