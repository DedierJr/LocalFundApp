// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { Usuario } from '../model/Usuario'; // Importe o modelo de usuário
import { auth, firestore } from '../firebase'; // Importe o auth e o firestore do Firebase

const UserProfile = () => {
  const [usuario, setUsuario] = useState({} as Usuario);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userData = await firestore.collection('Usuario').doc(currentUser.uid).get();
        setUsuario(userData.data() as Usuario);
      }
    };
    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    // Implemente a navegação para a tela de edição de perfil aqui
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: usuario.fotoPerfil }}
        style={styles.fotoPerfil}
      />
      <Text style={styles.nome}>{usuario.nome}</Text>
      <Text style={styles.email}>{usuario.email}</Text>
      <Text style={styles.bio}>{usuario.bio}</Text>
      <Button
        title="Editar Perfil"
        onPress={handleEditProfile}
      />
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
  fotoPerfil: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default UserProfile;
