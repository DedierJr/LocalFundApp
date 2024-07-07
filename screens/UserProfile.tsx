// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Usuario } from '../model/Usuario';
import { firestore, auth } from '../firebase';
import { findChatByParticipants, createChat } from '../services/chatService';
import { sendNotification } from '../services/notificationService';
import { getUserById, isFollowing, followUser, unfollowUser } from '../services/userService';

const UserProfile = ({ route, navigation }: any) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const { userId } = route.params;

  useEffect(() => {
    const getUser = async () => {
      try {
        const fetchedUser = await getUserById(userId);
        if (fetchedUser) {
          setUser(fetchedUser);
          const followingStatus = await isFollowing(userId);
          setIsFollowing(followingStatus);
        } else {
          console.error('Usuário não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    getUser();
  }, [userId]);

  const handleOpenChat = async () => {
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId || !userId) {
      console.error('IDs de usuário inválidos.');
      return;
    }

    try {
      const existingChat = await findChatByParticipants([userId, currentUserId]);
      if (existingChat) {
        setChatId(existingChat.id);
        navigation.navigate('Chat', { chatId: existingChat.id, userId: currentUserId });
      } else {
        // Create a new chat if one doesn't exist
        const newChatId = await createChat([userId, currentUserId]);
        if (newChatId) {
          setChatId(newChatId);
          navigation.navigate('Chat', { chatId: newChatId, userId: currentUserId });
        } else {
          console.error('Falha ao criar um novo chat.');
        }
      }
    } catch (error) {
      console.error('Erro ao abrir chat:', error);
    }
  };

  const handleFollow = async () => {
    const success = await followUser(userId);
    if (success) {
      setIsFollowing(true);
      Alert.alert('Successo', 'Você agora está seguindo este usuário.');
    } else {
      console.error('Erro ao seguir usuário.');
    }
  };

  const handleUnfollow = async () => {
    const success = await unfollowUser(userId);
    if (success) {
      setIsFollowing(false);
      Alert.alert('Successo', 'Você deixou de seguir este usuário.');
    } else {
      console.error('Erro ao deixar de seguir usuário.');
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

      <TouchableOpacity onPress={handleOpenChat}>
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