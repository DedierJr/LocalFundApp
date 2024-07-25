// LocalFundApp/screens/Mapa.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import MapView from 'react-native-maps';
import MeuEstilo from '../estiloMapa';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../firebase';
import meuestilo from '../meuestilo';
import PostModel from '../model/Post';
import DetalhesPost from './DetalhesPost';
import { findPostsNearLocation, createPost } from '../services/postService';
import firebase from 'firebase/compat/app';
import AddPostBtn from '../components/AddPostBtn';
import PostBubble from '../components/PostBubble'; // Importando o novo componente
//import styles from '../styles/layout/Mapa'


const Mapa = () => {
  const [formPost, setFormPost] = useState<Partial<PostModel>>({});
  const [posts, setPosts] = useState<PostModel[]>([]);
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

  const postsListener = useRef<firebase.Unsubscribe | null>(null);

  useEffect(() => {
    const loadPostsNearLocation = async () => {
      const postsNearLocation = await findPostsNearLocation(
        position.latitude,
        position.longitude,
        5
      );
      setPosts(postsNearLocation);
    };

    const unsubscribe = firestore.collection('posts')
      .where('location', '<', new firebase.firestore.GeoPoint(position.latitude + 5 / 111, position.longitude + 5 / 111))
      .where('location', '>', new firebase.firestore.GeoPoint(position.latitude - 5 / 111, position.longitude - 5 / 111))
      .onSnapshot((snapshot) => {
        const newPosts: PostModel[] = [];
        snapshot.forEach((doc) => {
          newPosts.push({
            id: doc.id,
            createdAt: doc.data().createdAt.toDate(), // Convertendo o timestamp para Date
            ...doc.data() 
          } as PostModel);
        });
        setPosts(newPosts);
      });

    postsListener.current = unsubscribe;

    loadPostsNearLocation();

    return () => {
      if (postsListener.current) {
        postsListener.current();
      }
    };
  }, [position]);

  const limparFormulario = () => {
    setFormPost({
      content: '',
      location: undefined, 
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

      const post = new PostModel({
        id: '',
        userId,
        ...formPost,
        createdAt: new Date(),
        location: formPost.location 
      });

      await createPost(post); 
      Alert.alert('Sucesso', 'Post adicionado com sucesso');
      limparFormulario();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o post.');
      console.error('Erro ao salvar o post:', error);
    }
  };

  const resumirConteudo = (conteudo: string, maxLength: number) => {
    return conteudo.length > maxLength ? conteudo.substring(0, maxLength) + '...' : conteudo;
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
                location: new firebase.firestore.GeoPoint(
                  e.nativeEvent.coordinate.latitude,
                  e.nativeEvent.coordinate.longitude
                ),
              });
              setMostrarFormulario(true);
            }}
          >
            {posts.map((post, index) => (
              post.location ? (
                <PostBubble 
                  key={`${post.id}-${index}`} 
                  post={post} 
                  onPostPress={() => {
                    navigation.navigate('DetalhesPost', { 
                      post: { ...post, userId: post.userId || '' },
                      onVoltar: () => setMostrarDetalhes(false) 
                    }); 
                  }} 
                /> 
              ) : null
            ))}
          </MapView>
          <AddPostBtn onPress={() => setMostrarFormulario(true)} />
        </>
      )}
    </View>
  );
};

export default Mapa;
