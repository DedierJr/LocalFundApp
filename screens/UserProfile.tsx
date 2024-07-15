import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Usuario } from '../model/Usuario';
import { firestore, auth } from '../firebase';
import { openChat, followUser, unfollowUser } from '../services/chatService';

const UserProfile = ({ route, navigation }: any) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const { userId } = route.params;

  useEffect(() => {
    const getUser = async () => {
      try {
        const userRef = firestore.collection('Usuario').doc(userId);
        const doc = await userRef.get();

        if (doc.exists) {
          const userData = doc.data();
          if (userData) {
            const usuario = new Usuario(userData);
            setUser(usuario);
            checkFollowingStatus(usuario);
          } else {
            console.error('Dados do usuário estão vazios.');
          }
        } else {
          console.log('Usuário não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
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
    followUser(userId, user, navigation);
    setIsFollowing(true);
  };

  const handleUnfollow = async () => {
    if (!user) {
      return;
    }
    unfollowUser(userId, user, navigation);
    setIsFollowing(false);
  };

  if (!user) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={{ uri: user.fotoPerfil }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.nickname}>{user.nickname}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>

      {isFollowing ? (
        <Button title="Unfollow" onPress={handleUnfollow} />
      ) : (
        <Button title="Follow" onPress={handleFollow} />
      )}

      <TouchableOpacity onPress={() => openChat(userId, navigation)}>
        <Icon name="chat" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nickname: {
    fontSize: 16,
    color: 'grey',
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default UserProfile;
