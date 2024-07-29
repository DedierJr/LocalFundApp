import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, storage } from '../firebase';
import PostModel from '../model/Post';
import { createPost } from '../services/postService';
import firebase from 'firebase/compat/app';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/layout/AddPost';

const CriarPost = () => {
  const [formPost, setFormPost] = useState<Partial<PostModel>>({
    content: '',
    location: undefined,
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation();
  const route = useRoute();

  const initialLocation = route.params.initialLocation;
  const onPostCreated = route.params.onPostCreated;

  const limparFormulario = () => {
    setFormPost({
      content: '',
      location: undefined,
    });
    setImageUri(null);
    navigation.goBack(); // Voltar para a tela anterior
  };

  const salvar = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Erro', 'Usuário não está logado.');
        return;
      }

      let imageUrl = null;

      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const uploadTask = storage.ref(`post-images/${userId}/${Date.now()}`).put(blob);
        await uploadTask;
        imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
      }

      const post = new PostModel({
        id: '',
        userId,
        ...formPost,
        createdAt: new Date(),
        imageUrl,
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
      <View style={styles.main}>
        <TextInput
          placeholder="Content"
          value={formPost.content || ''}
          onChangeText={content => setFormPost({ ...formPost, content })}
          style={styles.postContentInput}
        />
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Ionicons name="add-circle-outline" size={30} color="#C05E3D" />
        </TouchableOpacity>
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          </View>
        )}
      </View>
        <TouchableOpacity onPress={salvar} style={styles.submitButton}>
          <Text style={styles.criarPost}>Salvar</Text>
        </TouchableOpacity>
    </View>
  );
};

export default CriarPost;

