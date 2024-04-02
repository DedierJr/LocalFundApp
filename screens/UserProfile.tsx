///home/aluno/Documentos/DedierJr/LocalFundApp/screens/UserProfile.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { Usuario } from '../model/Usuario'; // Importe o modelo de usuário

const UserProfile = ({ usuario }: { usuario: Usuario }) => {
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
        onPress={() => {
          // Navegue para a tela de edição de perfil
        }}
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