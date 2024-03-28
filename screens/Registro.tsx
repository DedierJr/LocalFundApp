import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { auth, firestore } from '../firebase';
import { Usuario } from '../model/Usuario';
import { useNavigation } from '@react-navigation/native';

const Registro = () => {
  const [formUsuario, setFormUsuario] = useState<Partial<Usuario>>({});
  const refUsuario = firestore.collection("Usuario");
  const navigation = useNavigation();

  const criarRegistro = () => {
    auth.createUserWithEmailAndPassword(formUsuario.email || '', formUsuario.senha || '')
      .then(userCredentials => {
        const refComIdUsuario = refUsuario.doc(userCredentials.user?.uid);

        refComIdUsuario.set({
          id: userCredentials.user?.uid,
          nome: formUsuario.nome,
          email: formUsuario.email,
          datanascimento: formUsuario.datanascimento
        });

        console.log('Registered with:', userCredentials.user?.email);
        navigation.navigate("Login");
      })
      .catch(error => alert(error.message));
  };

  const cancelar = () => {
    navigation.navigate("Login");
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
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});
