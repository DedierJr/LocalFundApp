import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Usuario } from '../model/Usuario';
import { firestore, auth } from '../firebase';
import { createChat } from '../services/chatService';
import { sendNotification } from '../services/notificationService';

const UserProfile = ({ route, navigation }: any) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
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

  const handleCreateChat = async () => {
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId || !userId) {
      console.error('IDs de usuário inválidos.');
      return;
    }

    try {
      const newChatId = await createChat([userId, currentUserId]);
      if (!newChatId) {
        console.error('Falha ao criar um novo chat.');
        return;
      }
      setChatId(newChatId);
      navigation.navigate('Chat', { chatId: newChatId, userId: currentUserId });
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  const checkFollowingStatus = async (usuario: Usuario) => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      return;
    }
    setIsFollowing(usuario.followers.includes(currentUserId));
  };

  const handleFollow = async () => {
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId || !userId || !user) {
      console.error('IDs de usuário inválidos.');
      return;
    }

    try {
      await firestore.collection('Usuario').doc(userId).update({
        followers: [...user.followers, currentUserId]
      });
      await firestore.collection('Usuario').doc(currentUserId).update({
        following: [...user.following, userId]
      });
      
      sendNotification(userId, `começou a te seguir!`, 'followed');
      setIsFollowing(true);
      Alert.alert('Successo', 'Você agora está seguindo este usuário.');
    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
    }
  };

  const handleUnfollow = async () => {
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId || !userId || !user) {
      console.error('IDs de usuário inválidos.');
      return;
    }

    try {
      await firestore.collection('Usuario').doc(userId).update({
        followers: user.followers.filter(followerId => followerId !== currentUserId)
      });
      await firestore.collection('Usuario').doc(currentUserId).update({
        following: user.following.filter(followingId => followingId !== userId)
      });
      setIsFollowing(false);
      Alert.alert('Successo', 'Você deixou de seguir este usuário.');
    } catch (error) {
      console.error('Erro ao deixar de seguir usuário:', error);
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

      {chatId ? (
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId })}>
          <Icon name="chat" size={30} color="#000" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleCreateChat}>
          <Icon name="chat" size={30} color="#000" />
        </TouchableOpacity>
      )}
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
