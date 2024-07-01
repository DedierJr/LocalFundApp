// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/Mapa.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MeuEstilo from '../estiloMapa';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../firebase';
import meuestilo from '../meuestilo';
import Post from '../model/Post';
import DetalhesPost from './DetalhesPost';
import { findPostsNearLocation } from '../services/postService';
import firebase from 'firebase/compat/app'; // Importando firebase

const Mapa = () => {
  const [formPost, setFormPost] = useState<Partial<Post>>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [postSelecionado, setPostSelecionado] = useState<string | null>(null);
  const [position, setPosition] = useState({
    latitude: -31.308840,
    longitude: -54.113702,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Load posts near the current position with a radius of 5km (adjust as needed)
    const loadPostsNearLocation = async () => {
      const postsNearLocation = await findPostsNearLocation(
        position.latitude,
        position.longitude,
        5
      );
      setPosts(postsNearLocation);
    };

    loadPostsNearLocation();
  }, [position]); // Re-fetch posts when position changes

  const limparFormulario = () => {
    setFormPost({
      content: '',
      lat: undefined,
      long: undefined,
    });
    setMostrarFormulario(false);
  };

  const salvar = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Erro', 'Usuário não está logado.');
        return;
      }

      const userDoc = await firestore.collection('Usuario').doc(userId).get();
      const userData = userDoc.data();

      if (!userData) {
        Alert.alert('Erro', 'Usuário não encontrado.');
        return;
      }

      const post: Post = {
        id: '',
        userId,
        ...formPost,
        createdAt: new Date(),
        userProfilePicture: userData?.profilePictureURL || '', // Default to empty string if undefined
        username: userData?.username || '', // Default to empty string if undefined
        nickname: userData?.nickname || '', // Default to empty string if undefined
        location: new firebase.firestore.GeoPoint(formPost.lat || 0, formPost.long || 0), // Use GeoPoint for location
      };

      await firestore.collection('posts').add(post);
      Alert.alert('Sucesso', 'Post adicionado com sucesso');
      limparFormulario();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o post.');
      console.error('Erro ao salvar o post:', error);
    }
  };

  return (
    <View style={MeuEstilo.container}>
      {mostrarDetalhes ? (
        <DetalhesPost
          post={posts.find(p => p.id === postSelecionado)}
          onVoltar={() => setMostrarDetalhes(false)}
        />
      ) : mostrarFormulario ? (
        <>
          <Text>Latitude: {formPost.lat}</Text>
          <Text>Longitude: {formPost.long}</Text>
          <TextInput
            placeholder="Content"
            value={formPost.content || ''}
            onChangeText={content => setFormPost({ ...formPost, content })}
            style={MeuEstilo.input}
          />
          <TouchableOpacity
            onPress={salvar}
            style={[meuestilo.button, meuestilo.buttonOutline]}
          >
            <Text style={meuestilo.buttonOutlineText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={limparFormulario} style={meuestilo.button}>
            <Text style={meuestilo.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <MapView
            style={MeuEstilo.map}
            region={{
              latitude: position.latitude,
              longitude: position.longitude,
              latitudeDelta: position.latitudeDelta,
              longitudeDelta: position.longitudeDelta,
            }}
            onPress={(e) => {
              setPosition({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
                latitudeDelta: position.latitudeDelta,
                longitudeDelta: position.longitudeDelta,
              });
              setFormPost({
                ...formPost,
                lat: e.nativeEvent.coordinate.latitude,
                long: e.nativeEvent.coordinate.longitude,
              });
              setMostrarFormulario(true);
            }}
          >
            {posts.map((post, index) => (
              post.location ? ( // Check if post has location data
                <Marker
                  key={`${post.id}-${index}`}
                  coordinate={{ latitude: post.location.latitude, longitude: post.location.longitude }}
                  title={post.content}
                  onPress={() => {
                    setPostSelecionado(post.id);
                    setMostrarDetalhes(true);
                  }}
                />
              ) : null
            ))}
          </MapView>
        </>
      )}
    </View>
  );
};

export default Mapa;
