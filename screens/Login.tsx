// /LocalFundApp/screens/Login.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/layout/Login';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, senha);
      // Após o login bem-sucedido, navegar para a tela desejada
      navigation.dispatch(StackActions.replace('DrawerRoutes')); // Navegar para DrawerRoutes
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Email ou senha inválidos.');
    }
  };

  const handleRegister = () => {
    // Lógica de registro
    navigation.navigate('Registro'); // Supondo que 'Registro' seja a tela de registro
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>SpotLink</Text>
      <Text style={styles.h2}>Conectando ideias, transformando o mundo.</Text>
      <View style={styles.main}>
        <View style={styles.form}>
          <View style={styles.formField}>
            <Ionicons name="mail" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
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
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite sua senha"
              placeholderTextColor="#ccc"
              secureTextEntry
            />
          </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;