// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/CurrentUser.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, FlatList, TouchableOpacity } from 'react-native';
import { Usuario } from '../model/Usuario';
import { firestore, auth } from '../firebase';

const CurrentUser = ({ navigation }: any) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = firestore.collection('Usuario').doc(currentUser.uid);
        const doc = await userRef.get();
        if (doc.exists) {
          const userData = doc.data();
          if (userData) {
            const usuario = new Usuario(userData);
            setUser(usuario);
          }
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleFriendsButtonPress = () => {
    if (user) {
      navigation.navigate('FriendsList', { friends: user.friends });
    }
  };

  if (!user) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.fotoPerfil }} style={styles.photo} />
      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Amigos" onPress={handleFriendsButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default CurrentUser;
