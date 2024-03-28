import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { auth } from "../firebase"; // Importe apenas 'auth' do Firebase, não 'firestore'

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
        try {
            const response = await auth.signInWithEmailAndPassword(email, senha); // Use 'auth' aqui
            if (response.user) {
                // Login bem-sucedido
                console.log('Login bem-sucedido:', response.user.email);
                // Redirecionar para a próxima tela
            } else {
                Alert.alert('Erro', 'Usuário não encontrado');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
        }
    };

    return (
        <View>
            <Text>Email:</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu email"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text>Senha:</Text>
            <TextInput
                value={senha}
                onChangeText={setSenha}
                placeholder="Digite sua senha"
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

export default Login;
