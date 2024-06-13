// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/CurrentUser.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { Usuario } from '../model/Usuario';
import { auth } from '../firebase';

const CurrentUser = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      setUser({
        id: currentUser.uid,
        username: currentUser.displayName || '',
        nickname: '',
        email: currentUser.email || '',
        senhaHash: '',
        datanascimento: '',
        fotoPerfil: currentUser.photoURL || '',
        bio: '',
        friends: [],
      });
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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
