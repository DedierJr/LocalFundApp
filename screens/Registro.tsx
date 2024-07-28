// /LocalFundApp/screens/Registro.tsx
import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Alert, Image } from 'react-native';
import { auth, firestore, storage } from '../firebase';
import { Usuario } from '../model/Usuario';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/layout/Registro';

const Registro = () => {
  const [formUsuario, setFormUsuario] = useState<Partial<Usuario>>({
    username: '',
    nickname: '',
    email: '',
    senha: '',
    datanascimento: new Date(), 
    fotoPerfil: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', // Default PFP
    bio: '',
    followers: [],
    following: [],
    chats: []
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [imageUri, setImageUri] = useState<string | null>(null); 
  const refUsuario = firestore.collection("Usuario");
  const navigation = useNavigation();

  const handleRegister = async () => {
    const { username, nickname, email, senha, bio, datanascimento } = formUsuario;

    if (!username || !nickname || !email || !senha) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    try {
      console.log('Tentando criar usuário com email e senha...');
      const { user } = await auth.createUserWithEmailAndPassword(email!, senha!);
      const userId = user.uid;
      console.log('Usuário criado com sucesso, UID:', userId);

      // Upload da foto de perfil para o Storage
      let fotoPerfilUrl = formUsuario.fotoPerfil; // Use a foto de perfil padrão inicialmente
      if (imageUri) {
        console.log('Iniciando upload da imagem selecionada:', imageUri);
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const uploadTask = storage.ref(`profile-pics/${userId}`).put(blob);
        await uploadTask;
        fotoPerfilUrl = await uploadTask.snapshot.ref.getDownloadURL();
        console.log('Upload concluído, URL da imagem:', fotoPerfilUrl);
      }

      const newUser = new Usuario({
        id: userId,
        username,
        nickname,
        email,
        senha,
        datanascimento,
        fotoPerfil: fotoPerfilUrl, // Use a URL do Storage se disponível, senão o padrão
        bio,
        followers: [],
        following: [],
        chats: []
      });

      console.log('Tentando salvar o usuário no Firestore...');
      await refUsuario.doc(userId).set(newUser.toFirestore());
      console.log('Usuário salvo no Firestore com sucesso');

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      Alert.alert('Erro', 'Erro ao registrar usuário. Tente novamente.');
    }
  };

  const onDateChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    setFormUsuario({ ...formUsuario, datanascimento: currentDate });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Resultado do ImagePicker:', result); // Adicionando log para verificar o resultado do ImagePicker

    if (!result.canceled) {
      const uri = result.assets && result.assets[0] ? result.assets[0].uri : null;
      if (uri) {
        console.log('Imagem selecionada:', uri);
        setImageUri(uri);
      } else {
        console.error('Erro: URI da imagem está indefinida');
      }
    } else {
      console.log('Seleção de imagem cancelada');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          value={formUsuario.username}
          onChangeText={text => setFormUsuario({ ...formUsuario, username: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Nickname"
          value={formUsuario.nickname}
          onChangeText={text => setFormUsuario({ ...formUsuario, nickname: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={formUsuario.email}
          onChangeText={text => setFormUsuario({ ...formUsuario, email: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          value={formUsuario.senha}
          onChangeText={text => setFormUsuario({ ...formUsuario, senha: text })}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>
            Data de nascimento: {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <TextInput
          placeholder="Bio"
          value={formUsuario.bio}
          onChangeText={text => setFormUsuario({ ...formUsuario, bio: text })}
          style={styles.input}
        />

        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.profileImage} />
          ) : (
            <Image source={{ uri: formUsuario.fotoPerfil }} style={styles.profileImage} />
          )}
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Foto</Text>
          </TouchableOpacity>
        </View>

      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Registro;
