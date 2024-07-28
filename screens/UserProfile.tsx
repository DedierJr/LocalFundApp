import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Usuario } from '../model/Usuario';
import { firestore, auth } from '../firebase';
import { openChat, followUser, unfollowUser } from '../services/userService';
import styles from '../styles/layout/UserProfile';
import ListarPosts from './ListarPosts';

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
    const result = await followUser(userId);
    if (result) {
      setIsFollowing(true);
    }
  };

  const handleUnfollow = async () => {
    if (!user) {
      return;
    }
    const result = await unfollowUser(userId);
    if (result) {
      setIsFollowing(false);
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

      <Button
        title="Followers"
        onPress={() => navigation.navigate('FollowersList', { userId })}
      />

      <Button
        title="Following"
        onPress={() => navigation.navigate('FollowingList', { userId })}
      />

      <ListarPosts userId={userId} showFollowingButton={false} />
    </View>
  );
};

export default UserProfile;
