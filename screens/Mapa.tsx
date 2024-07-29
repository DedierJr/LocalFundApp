import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import MeuEstilo from '../estiloMapa';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { firestore, auth } from '../firebase';
import PostModel from '../model/Post';
import { findPostsNearLocation } from '../services/postService';
import { getFollowingUsers } from '../services/userService';
import firebase from 'firebase/compat/app';
import AddPostBtn from '../components/AddPostBtn';
import PostBubble from '../components/PostBubble';
import styles from '../styles/layout/Mapa';
import darkMapStyle from '../styles/mapStyle.json';

const Mapa = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [postSelecionado, setPostSelecionado] = useState<string | null>(null);
  const [position, setPosition] = useState({
    latitude: -31.308840,
    longitude: -54.113702,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [showFollowingPosts, setShowFollowingPosts] = useState(false);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const navigation = useNavigation();

  const postsListener = useRef<firebase.Unsubscribe | null>(null);

  const refreshPosts = async () => {
    const postsNearLocation = await findPostsNearLocation(
      position.latitude,
      position.longitude,
      5
    );
    setPosts(postsNearLocation);
  };

  useEffect(() => {
    refreshPosts();

    const unsubscribe = firestore.collection('posts')
      .where('location', '<', new firebase.firestore.GeoPoint(position.latitude + 5 / 111, position.longitude + 5 / 111))
      .where('location', '>', new firebase.firestore.GeoPoint(position.latitude - 5 / 111, position.longitude - 5 / 111))
      .onSnapshot((snapshot) => {
        const newPosts: PostModel[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          newPosts.push({
            id: doc.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            ...data,
          } as PostModel);
        });
        setPosts(newPosts);
      });

    postsListener.current = unsubscribe;

    return () => {
      if (postsListener.current) {
        postsListener.current();
      }
    };
  }, [position]);

  useEffect(() => {
    const fetchFollowingIds = async () => {
      const followingUsers = await getFollowingUsers();
      setFollowingIds(followingUsers.map(user => user.id));
    };

    if (auth.currentUser) {
      fetchFollowingIds();
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setMostrarDetalhes(false); // Certifique-se de que o estado de detalhes esteja definido corretamente
      };
    }, [])
  );

  const filteredPosts = showFollowingPosts
    ? posts.filter(post => followingIds.includes(post.userId))
    : posts;

  return (
    <View style={MeuEstilo.container}>
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.topButton,
            !showFollowingPosts && styles.activeButton
          ]}
          onPress={() => setShowFollowingPosts(false)}
        >
          <Text style={styles.topButtonText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.topButton,
            showFollowingPosts && styles.activeButton
          ]}
          onPress={() => setShowFollowingPosts(true)}
        >
          <Text style={styles.topButtonText}>Seguindo</Text>
        </TouchableOpacity>
      </View>
      {mostrarDetalhes ? (
        <DetalhesPost
          post={posts.find(p => p.id === postSelecionado)}
          onVoltar={() => setMostrarDetalhes(false)}
        />
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
            customMapStyle={darkMapStyle}
            onPress={(e) => {
              const touchPosition = e.nativeEvent.coordinate;
              const post = posts.find(post =>
                post.location &&
                Math.abs(post.location.latitude - touchPosition.latitude) < 0.001 &&
                Math.abs(post.location.longitude - touchPosition.longitude) < 0.001
              );
              if (!post) {
                navigation.navigate('CriarPost', {
                  initialLocation: {
                    latitude: touchPosition.latitude,
                    longitude: touchPosition.longitude
                  },
                  onPostCreated: refreshPosts
                });
              }
            }}
          >
            {filteredPosts.map((post, index) => (
              post.location ? (
                <PostBubble
                  key={`${post.id}-${index}`}
                  post={post}
                  onVoltar={() => setMostrarDetalhes(false)}
                />
              ) : null
            ))}
          </MapView>
          <AddPostBtn onPress={() => navigation.navigate('CriarPost')} />
        </>
      )}
    </View>
  );
};

export default Mapa;
