// LocalFundApp/screens/CurrentUser.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { Usuario } from '../model/Usuario';
import { firestore, auth, storage } from '../firebase';
import ListarPosts from './ListarPosts';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/layout/CurrentUser';

const CurrentUser = ({ navigation }: any) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        firestore.collection('Usuario').doc(user.uid).get()
          .then(doc => {
            if (doc.exists) {
              const userData = doc.data();
              const usuario = new Usuario({ ...userData, id: doc.id }); 
              setCurrentUser(usuario);
              setNickname(usuario.nickname || '');
              setBio(usuario.bio || '');
            } else {
              console.error("No such user document!");
            }
          })
          .catch(error => console.error("Error getting user document:", error));
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

  const handleSave = async () => {
    try {
      const userId = currentUser.id;
      let fotoPerfilUrl = currentUser.fotoPerfil;

      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const uploadTask = storage.ref(`profile-pics/${userId}`).put(blob);
        await uploadTask;
        fotoPerfilUrl = await uploadTask.snapshot.ref.getDownloadURL();
      }

      await firestore.collection('Usuario').doc(userId).update({
        nickname,
        bio,
        fotoPerfil: fotoPerfilUrl
      });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setCurrentUser({
        ...currentUser,
        nickname,
        bio,
        fotoPerfil: fotoPerfilUrl
      });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o perfil');
      console.error('Erro ao atualizar o perfil:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets && result.assets[0] ? result.assets[0].uri : null;
      if (uri) {
        setImageUri(uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.nickname}>{currentUser.nickname}</Text>
      {currentUser.fotoPerfil && (
        <Image 
          style={styles.profilePicture}
          source={{ uri: currentUser.fotoPerfil }}
        />
      )}
      {isEditing ? (
        <>
          <TextInput
            placeholder="Nickname"
            value={nickname}
            onChangeText={setNickname}
            style={styles.input}
          />
          <TextInput
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            style={styles.input}
          />
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Trocar Foto de Perfil</Text>
          </TouchableOpacity>
          {imageUri && (
            <Image 
              source={{ uri: imageUri }}
              style={styles.profilePicture}
            />
          )}
          <Button title="Salvar" onPress={handleSave} />
          <Button title="Cancelar" onPress={() => setIsEditing(false)} />
        </>
      ) : (
        <>
          <View style={styles.info}>
            <Text style={styles.username}>{'@'+currentUser.username+': '}</Text>
            <Text style={styles.bio}>{bio}</Text>
          </View>
          <Button title="Editar Perfil" onPress={() => setIsEditing(true)} />
        </>
      )}
      <View style={styles.buttons}>
        <Button
          title="Seguidores"
          onPress={() => navigation.navigate('FollowersList', { userId: currentUser.id })}
        />
        <Button
          title="Seguindo"
          onPress={() => navigation.navigate('FollowingList', { userId: currentUser.id })}
        />
      </View>
      <ListarPosts userId={currentUser.id} showFollowingButton={false} />
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};

export default CurrentUser;
