// LocalFundApp\screens\Mapa.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import MapView from 'react-native-maps';
import MeuEstilo from '../estiloMapa';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../firebase';
import meuestilo from '../meuestilo';
import PostModel from '../model/Post';
import { findPostsNearLocation, createPost } from '../services/postService';
import firebase from 'firebase/compat/app';
import AddPostBtn from '../components/AddPostBtn';
import PostBubble from '../components/PostBubble'; // Importando o novo componente

const Mapa = () => {
  const [position, setPosition] = useState({
    latitude: -31.308840,
    longitude: -54.113702,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formPost, setFormPost] = useState<Partial<PostModel>>({
    content: '',
    location: undefined, 
  });

  const postsListener = useRef<firebase.Unsubscribe | null>(null);
  const navigation = useNavigation();

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

  const handleMapPress = (e: any) => {
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
    setShowForm(true);
  };

  const handlePostPress = (post: PostModel) => {
    navigation.navigate('DetalhesPost', { 
      post: post, 
      onVoltar: () => {
        // Você pode adicionar lógica aqui, se necessário, para atualizar o estado do mapa ou outros componentes
      }
    });
  };

  const handleCreatePost = async () => {
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
      setShowForm(false);
      setFormPost({ content: '', location: undefined });
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o post.');
      console.error('Erro ao salvar o post:', error);
    }
  };

  return (
    <View style={MeuEstilo.container}>
      {showForm ? (
        <View>
          <TextInput
            placeholder="Content"
            value={formPost.content || ''}
            onChangeText={content => setFormPost({ ...formPost, content })}
            style={MeuEstilo.input}
          />
          <TouchableOpacity
            onPress={handleCreatePost}
            style={[meuestilo.button, meuestilo.buttonOutline]}
          >
            <Text style={meuestilo.buttonOutlineText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowForm(false)} style={meuestilo.button}>
            <Text style={meuestilo.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
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
            onPress={handleMapPress}
          >
            {posts.map((post, index) => (
              post.location ? (
                <PostBubble 
                  key={`${post.id}-${index}`} 
                  post={post} 
                  // Passando a função onVoltar para PostBubble
                  onPress={() => handlePostPress(post)} 
                /> 
              ) : null
            ))}
          </MapView>
          <AddPostBtn onPress={() => setShowForm(true)} />
        </>
      )}
    </View>
  );
};

export default Mapa;