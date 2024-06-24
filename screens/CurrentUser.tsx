// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/CurrentUser.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Usuario } from '../model/Usuario';
import { firestore, auth } from '../firebase';

const CurrentUser = ({ navigation }: any) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        firestore.collection('Usuario').doc(user.uid).get().then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            const usuario = new Usuario(userData);
            setCurrentUser(usuario);
          } else {
            console.error("No such user document!");
          }
        }).catch(error => console.error("Error getting user document:", error));
      } else {
        console.error("User not logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!currentUser) {
    return <Text>Carregando...</Text>;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer logout');
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Bem-vindo, {currentUser.username}!</Text>

      <Button
        title="Followers"
        onPress={() => navigation.navigate('FollowersList', { userId: currentUser.id })}
      />

      <Button
        title="Following"
        onPress={() => navigation.navigate('FollowingList', { userId: currentUser.id })}
      />

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CurrentUser;