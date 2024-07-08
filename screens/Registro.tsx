// /LocalFundApp/screens/Registro.tsx
import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Alert } from 'react-native';
import { auth, firestore, storage } from '../firebase';
import { Usuario } from '../model/Usuario';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

const Registro = () => {
  const [formUsuario, setFormUsuario] = useState<Partial<Usuario>>({
    username: '',
    nickname: '',
    email: '',
    senha: '',
    datanascimento: new Date(), 
    fotoPerfil: '',
    bio: '',
    followers: [],
    following: [],
    chats: []
  });
  const [fotoPerfil, setFotoPerfil] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initial date
  const refUsuario = firestore.collection("Usuario");
  const navigation = useNavigation();

  const defaultPfp = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const pickedUri = result.assets[0].uri;
      setFotoPerfil(pickedUri);
      setFormUsuario({ ...formUsuario, fotoPerfil: pickedUri }); // Update formUsuario
    }
  };

  const handleSaveImage = async (userId: string): Promise<string> => {
    if (!fotoPerfil) return defaultPfp;

    const response = await FileSystem.readAsStringAsync(fotoPerfil, { encoding: FileSystem.EncodingType.Base64 });
    const blob = await fetch(`data:image/jpeg;base64,${response}`).then(res => res.blob());

    const storageRef = storage.ref().child(`perfil/${userId}`);
    await storageRef.put(blob);

    const downloadURL = await storageRef.getDownloadURL();
    return downloadURL;
  };

  const handleRegistro = async () => {
    try {
      const credenciais = await auth.createUserWithEmailAndPassword(formUsuario.email!, formUsuario.senha!);

      const fotoUrl = await handleSaveImage(credenciais.user?.uid!);

      const usuarioCompleto: Usuario = {
        ...formUsuario,
        id: credenciais.user?.uid!,
        fotoPerfil: fotoUrl,
        senhaHash: formUsuario.senha! // Set senhaHash in the database
      } as Usuario;

      await refUsuario.doc(credenciais.user?.uid!).set(usuarioCompleto);

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao registrar o usuário.');
    }
  };

  const handleDateChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || formUsuario.datanascimento; // Use current date if no selection
    setShowDatePicker(Platform.OS === 'ios'); // Close the picker on iOS
    setFormUsuario({ ...formUsuario, datanascimento: currentDate }); 
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nome de Usuário"
          value={formUsuario.username}
          onChangeText={(text) => setFormUsuario({ ...formUsuario, username: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Apelido"
          value={formUsuario.nickname}
          onChangeText={(text) => setFormUsuario({ ...formUsuario, nickname: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={formUsuario.email}
          onChangeText={(text) => setFormUsuario({ ...formUsuario, email: text })}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Senha"
          value={formUsuario.senha}
          onChangeText={(text) => setFormUsuario({ ...formUsuario, senha: text })}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity onPress={showDatePickerHandler} style={styles.input}>
          <Text style={styles.input}>{formUsuario.datanascimento ? formUsuario.datanascimento.toLocaleDateString() : 'Data de Nascimento'}</Text> 
        </TouchableOpacity> 
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}
        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          <Text style={styles.imagePickerText}>Escolher Foto de Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRegistro} style={styles.button}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
          <Text style={styles.buttonText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  imagePicker: {
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  imagePickerText: {
    color: '#000',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Registro;