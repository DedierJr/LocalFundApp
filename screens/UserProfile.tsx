// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Usuario } from '../model/Usuario'; // Importe o modelo de usuário
import { firestore } from '../firebase'; // Importe o firestore do Firebase

const UserProfile: React.FC<{ userId: string }> = ({ route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    // Buscar usuário do Firestore
    const userRef = firestore.collection('Usuario').doc(userId);
    userRef.get().then((doc) => {
      if (doc.exists) {
        setUser(doc.data() as Usuario);
      }
    });
  }, [userId]);

  if (!user) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.nome}</Text>
      {user.fotoPerfil && <Image style={styles.photo} source={{ uri: user.fotoPerfil }} />}
      {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default UserProfile;