import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Alert } from 'react-native';
import { auth, firestore, storage } from '../firebase'; // Adicione o storage do Firebase
import { Usuario } from '../model/Usuario';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // Importe o ImagePicker do Expo

const Registro = () => {
  const [formUsuario, setFormUsuario] = useState<Partial<Usuario>>({});
  const [fotoPerfil, setFotoPerfil] = useState<string>(''); // Altere para string
  const refUsuario = firestore.collection("Usuario");
  const navigation = useNavigation();

  const criarRegistro = async () => {
    try {
      const userCredentials = await auth.createUserWithEmailAndPassword(formUsuario.email || '', formUsuario.senha || '');
      
      const urlFotoPerfil = await uploadFotoPerfil(userCredentials.user?.uid); // Passar o userId aqui

      if (userCredentials.user) {
        const refComIdUsuario = refUsuario.doc(userCredentials.user.uid);

        await refComIdUsuario.set({
          id: userCredentials.user.uid,
          nome: formUsuario.nome,
          email: formUsuario.email,
          datanascimento: formUsuario.datanascimento,
          fotoPerfil: urlFotoPerfil,
          bio: formUsuario.bio
        });

        console.log('Registered with:', userCredentials.user.email);
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error('Erro ao criar registro:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer o registro');
    }
  };

  const cancelar = () => {
    navigation.navigate("Login");
  };

  const escolherFotoPerfil = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria para selecionar uma foto.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) { // Substitua "cancelled" por "canceled"
        setFotoPerfil(result.assets[0].uri); // Acesse o array "assets" para obter a URI da imagem
      }
    } catch (error) {
      console.error('Erro ao escolher foto de perfil:', error);
    }
  };  

  const uploadFotoPerfil = async (userId: string | undefined) => {
    if (!fotoPerfil || !userId) {
      return '';
    }

    try {
      const response = await fetch(fotoPerfil);
      const blob = await response.blob();
      const ref = storage.ref().child(`fotosPerfil/${userId}`);
      await ref.put(blob);
      const url = await ref.getDownloadURL();
      return url;
    } catch (error) {
      console.error('Erro ao fazer upload da foto de perfil:', error);
      return '';
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nome"
          value={formUsuario.nome}
          onChangeText={nome => setFormUsuario({ ...formUsuario, nome: nome })}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={formUsuario.email}
          onChangeText={email => setFormUsuario({ ...formUsuario, email: email })}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          value={formUsuario.senha}
          onChangeText={senha => setFormUsuario({ ...formUsuario, senha: senha })}
          style={styles.input}
        />
        <TextInput
          placeholder="Data Nascimento"
          value={formUsuario.datanascimento}
          onChangeText={datanascimento => setFormUsuario({ ...formUsuario, datanascimento: datanascimento })}
          style={styles.input}
        />
        <TouchableOpacity onPress={escolherFotoPerfil} style={styles.button}>
          <Text style={styles.buttonText}>Escolher Foto de Perfil</Text>
        </TouchableOpacity>
        {fotoPerfil ? <Text>{fotoPerfil}</Text> : null}
        <TextInput
          placeholder="Bio"
          value={formUsuario.bio}
          onChangeText={bio => setFormUsuario({ ...formUsuario, bio: bio })}
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={criarRegistro} style={styles.button}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancelar} style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Registro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10, // Adicionei um espaçamento para separar o botão da foto
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});
