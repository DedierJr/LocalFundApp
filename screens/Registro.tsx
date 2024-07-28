// /LocalFundApp/screens/Registro.tsx
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Alert, TouchableOpacity, Image, Text, Platform } from 'react-native';
import { auth, firestore, storage } from '../firebase';
import { Usuario } from '../model/Usuario';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';
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

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleRegister = async () => {
    const { username, nickname, email, senha, bio, datanascimento } = formUsuario;

    if (!username || !nickname || !email || !senha) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    try {
      const { user } = await auth.createUserWithEmailAndPassword(email!, senha!);
      const userId = user.uid;

      let fotoPerfilUrl = formUsuario.fotoPerfil;
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const uploadTask = storage.ref(`profile-pics/${userId}`).put(blob);
        await uploadTask;
        fotoPerfilUrl = await uploadTask.snapshot.ref.getDownloadURL();
      }

      const newUser = new Usuario({
        id: userId,
        username,
        nickname,
        email,
        senha,
        datanascimento,
        fotoPerfil: fotoPerfilUrl,
        bio,
        followers: [],
        following: [],
        chats: []
      });

      await refUsuario.doc(userId).set(newUser.toFirestore());

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
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

    if (!result.canceled) {
      const uri = result.assets && result.assets[0] ? result.assets[0].uri : null;
      if (uri) {
        setImageUri(uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.form}>
          <View style={styles.formField}>
            <Ionicons name="person" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={formUsuario.username}
              onChangeText={text => setFormUsuario({ ...formUsuario, username: text })}
              placeholder="Digite seu username"
              placeholderTextColor="#ccc"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formField}>
            <Ionicons name="person-circle" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={formUsuario.nickname}
              onChangeText={text => setFormUsuario({ ...formUsuario, nickname: text })}
              placeholder="Digite seu nickname"
              placeholderTextColor="#ccc"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formField}>
            <Ionicons name="mail" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={formUsuario.email}
              onChangeText={text => setFormUsuario({ ...formUsuario, email: text })}
              placeholder="Digite seu email"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formField}>
            <Ionicons name="lock-closed" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={formUsuario.senha}
              onChangeText={text => setFormUsuario({ ...formUsuario, senha: text })}
              placeholder="Digite sua senha"
              placeholderTextColor="#ccc"
              secureTextEntry
            />
          </View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
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
          <View style={styles.formField}>
            <Ionicons name="document-text" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={formUsuario.bio}
              onChangeText={text => setFormUsuario({ ...formUsuario, bio: text })}
              placeholder="Digite sua bio"
              placeholderTextColor="#ccc"
            />
          </View>
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
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Registro;
