import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Alert, Button } from 'react-native';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native'; 
import styles from '../styles/layout/Login'

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, senha);
      // After successful login, navigate to the desired screen
      navigation.dispatch(StackActions.replace('DrawerRoutes'));  // Navigate to DrawerRoutes
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Email ou senha inválidos.');
    }
  };

  const handleRegister = () => {
    // Handle registration logic here
    // For example, navigate to the registration screen
    navigation.navigate('Registro'); // Assuming 'Register' is your registration screen
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="blue" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Registrar" onPress={handleRegister} color="blue" />
      </View>
    </View>
  );
};

export default Login;
