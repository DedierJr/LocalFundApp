// /LocalFundApp/screens/UserProfile.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Usuario } from "../model/Usuario";
import { firestore, auth } from "../firebase";
import { openChat, followUser, unfollowUser } from "../services/userService";
import styles from "../styles/layout/UserProfile";
import ListarPosts from "./ListarPosts";

const UserProfile = ({ route, navigation }: any) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const { userId } = route.params;

  useEffect(() => {
    const getUser = async () => {
      try {
        const userRef = firestore.collection("Usuario").doc(userId);
        const doc = await userRef.get();

        if (doc.exists) {
          const userData = doc.data();
          if (userData) {
            const usuario = new Usuario(userData);
            setUser(usuario);
            checkFollowingStatus(usuario);
            setFollowersCount(
              userData.followers ? userData.followers.length : 0
            );
            setFollowingCount(
              userData.following ? userData.following.length : 0
            );
          } else {
            console.error("Dados do usuário estão vazios.");
          }
        } else {
          console.log("Usuário não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    getUser();
  }, [userId]);

  const checkFollowingStatus = async (usuario: Usuario) => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      return;
    }
    setIsFollowing(usuario.followers.includes(currentUserId));
  };

  const handleFollow = async () => {
    if (!user) {
      return;
    }
    const result = await followUser(userId, user, navigation);
    if (result) {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  const handleUnfollow = async () => {
    if (!user) {
      return;
    }
    const result = await unfollowUser(userId, user, navigation);
    if (result) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    }
  };

  if (!user) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={{ uri: user.fotoPerfil }}
          style={styles.profilePicture}
          resizeMode="cover"
        />
        <Text style={styles.username}>{'@'+user.username}</Text>
        <Text style={styles.nickname}>{user.nickname}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>
      <View style={styles.buttons}>
        {isFollowing ? (
          <Button title="Deixar de seguir" onPress={handleUnfollow} />
        ) : (
          <Button title="Seguir" onPress={handleFollow} />
        )}
        <TouchableOpacity onPress={() => openChat(userId, navigation)}>
          <Icon style={styles.icon} name="chat" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttons}>
        <Button
          title={`Seguidores (${followersCount})`}
          onPress={() => navigation.navigate("FollowersList", { userId })}
          style={styles.button}
        />
        <Button
          title={`Seguindo (${followingCount})`}
          onPress={() => navigation.navigate("FollowingList", { userId })}
          style={styles.button}
        />
      </View>
      <ListarPosts userId={userId} showFollowingButton={false} />
    </View>
  );
};

export default UserProfile;
