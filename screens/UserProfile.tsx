// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Usuario } from '../model/Usuario';
import { firestore } from '../firebase';

const UserProfile = ({route}: any) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    //console.log(route.params.userId)
    const {userId} = route.params;
    const getUser = async () =>{
      try {
        const userRef = firestore.collection('Usuario').doc(userId);
        const doc = await userRef.get();

        if (doc.exists) {
          setUser(doc.data() as Usuario);
        } else {
          console.log('Usuário não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    getUser();
  }, []);

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
