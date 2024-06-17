import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { auth } from "../firebase";
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [usuario, setUsuario] = useState(null); // Estado para armazenar o usuário logado
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // Usuário está logado
                setUsuario(user);
            } else {
                // Usuário não está logado
                setUsuario(null);
            }
        });

        return unsubscribe; // Função de limpeza para remover o observador ao desmontar o componente
    }, []);

    const handleLogin = async () => {
        try {
            const response = await auth.signInWithEmailAndPassword(email, senha);
            if (response.user) {
                // Login bem-sucedido
                console.log('Login bem-sucedido:', response.user.email);
            } else {
                Alert.alert('Erro', 'Usuário não encontrado');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
        }
    };

    const handlePress = () => {
        navigation.navigate('Registro');
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
                <Button
                    title="Login"
                    onPress={handleLogin}
                    color="blue"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Registrar"
                    onPress={handlePress}
                    color="blue"
                />
            </View>
            {usuario && <Text>Você está logado como {usuario.email}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'white', // Optional light background color
    },
    label: {
      fontSize: 18,
      fontWeight: 'bold', // Add emphasis to labels
      marginBottom: 5,
      color: '#333', // Adjust text color for better contrast
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#fff', // Optional white background for better input visibility
    },
    buttonContainer: {
      width: '100%',
      marginVertical: 2,
      flexDirection: 'row', // Allow for horizontal button arrangements if needed
      justifyContent: 'center', // Center buttons horizontally within the container
    },
  });
  

export default Login;
