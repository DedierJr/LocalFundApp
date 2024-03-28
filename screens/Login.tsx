import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { Usuario } from '../model/Usuario';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
        try {
            const response = await firebase.auth().signInWithEmailAndPassword(email, senha);
            if (response.user) {
                // Login bem-sucedido
                const user = new Usuario({ id: response.user.uid, email });
                console.log(user.toString());
                // Redirecionar para a próxima tela
            } else {
                Alert.alert('Erro', 'Usuário não encontrado');
            }
        } catch (error) {
            console.error(error);
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

export default LoginScreen;
