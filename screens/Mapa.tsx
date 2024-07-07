// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/Mapa.tsx
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MeuEstilo from "../estiloMapa";
import { useNavigation } from "@react-navigation/native";
import { firestore, auth } from "../firebase";
import meuestilo from "../meuestilo";
import PostModel from "../model/Post";
import DetalhesPost from "./DetalhesPost";
import { findPostsNearLocation, createPost } from "../services/postService";
import firebase from "firebase/compat/app";
import { getUserById } from "../services/userService";

const Mapa = () => {
  const [formPost, setFormPost] = useState<Partial<PostModel>>({});
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [postSelecionado, setPostSelecionado] = useState<string | null>(null);
  const [position, setPosition] = useState({
    latitude: -31.30884,
    longitude: -54.113702,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigation = useNavigation();

  // Use useRef to keep track of the listener
  const postsListener = useRef<firebase.Unsubscribe | null>(null);

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

    // Set up the real-time listener for posts
    const unsubscribe = firestore
      .collection("posts")
      .where(
        "location",
        "<",
        new firebase.firestore.GeoPoint(
          position.latitude + 5 / 111,
          position.longitude + 5 / 111
        )
      )
      .where(
        "location",
        ">",
        new firebase.firestore.GeoPoint(
          position.latitude - 5 / 111,
          position.longitude - 5 / 111
        )
      )
      .onSnapshot((snapshot) => {
        const newPosts: PostModel[] = [];
        snapshot.forEach((doc) => {
          newPosts.push(new PostModel({ id: doc.id, ...doc.data() })); // Ensure type safety
        });
        setPosts(newPosts);
      });

    // Store the listener in useRef
    postsListener.current = unsubscribe;

    loadPostsNearLocation();

    // Cleanup the listener on unmount
    return () => {
      if (postsListener.current) {
        postsListener.current();
      }
    };
  }, [position]); // Re-fetch posts when position changes

  const limparFormulario = () => {
    setFormPost({
      content: "",
      lat: undefined,
      long: undefined,
    });
    setMostrarFormulario(false);
  };

  const salvar = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Erro", "Usuário não está logado.");
        return;
      }

      const userDoc = await getUserById(userId);

      if (!userDoc) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      const userData = userDoc.toFirestore(); // Access data after checking existence

      // Create a new PostModel instance
      const newPost = new PostModel({
        id: "",
        userId,
        ...formPost,
        createdAt: new Date(),
        userProfilePicture: userData?.fotoPerfil || "",
        username: userData?.username || "",
        nickname: userData?.nickname || "",
        location: new firebase.firestore.GeoPoint(
          formPost.lat || 0,
          formPost.long || 0
        ),
        likes: [], // Add likes array
        comments: [], // Add comments array
      });

      const createdPost = await createPost(newPost);
      if (createdPost) {
        setPosts([...posts, createdPost]);
        Alert.alert("Sucesso", "Post adicionado com sucesso");
        limparFormulario();
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao salvar o post.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar o post.");
      console.error("Erro ao salvar o post:", error);
    }
  };

  return (
    <View style={MeuEstilo.container}>
      {mostrarDetalhes ? (
        <DetalhesPost
          post={posts.find((p) => p.id === postSelecionado)}
          onVoltar={() => setMostrarDetalhes(false)}
        />
      ) : mostrarFormulario ? (
        <>
          <Text>Latitude: {formPost.lat}</Text>
          <Text>Longitude: {formPost.long}</Text>
          <TextInput
            placeholder="Content"
            value={formPost.content || ""}
            onChangeText={(content) => setFormPost({ ...formPost, content })}
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
            {posts.map((post, index) =>
              post.location ? ( // Check if post has location data
                <Marker
                  key={`${post.id}-${index}`}
                  coordinate={{
                    latitude: post.location.latitude,
                    longitude: post.location.longitude,
                  }}
                  title={post.content}
                  onPress={() => {
                    setPostSelecionado(post.id);
                    setMostrarDetalhes(true);
                  }}
                />
              ) : null
            )}
          </MapView>
        </>
      )}
    </View>
  );
};

export default Mapa;