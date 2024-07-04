// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/Login.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { auth } from "../firebase";
// import { useNavigation } from '@react-navigation/native'; // No longer needed

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // const navigation = useNavigation(); // No longer needed

  // useEffect(() => { // Remove this useEffect hook
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if (user) {
  //       navigation.reset({
  //         index: 0,
  //         routes: [{ name: 'DrawerRoutes' }],
  //       });
  //     }
  //   });

  //   return unsubscribe;
  // }, [navigation]); // Remove this useEffect hook

  const handleLogin = async () => {
    try {
      const response = await auth.signInWithEmailAndPassword(email, senha);
      if (response.user) {
        console.log('Login bem-sucedido:', response.user.email);
        // The navigation reset now happens in the Routes component
      } else {
        Alert.alert('Erro', 'Usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
    }
  };

  const handlePress = () => {
    // navigation.navigate('Registro'); // No longer needed as the navigation happens in the Routes component
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
        <Button title="Registrar" onPress={handlePress} color="blue" />
      </View>
    </View>
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
  buttonContainer: {
    width: '100%',
    marginVertical: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default Login;
