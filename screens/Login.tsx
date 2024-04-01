import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { auth } from "../firebase";

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [usuario, setUsuario] = useState(null); // Estado para armazenar o usuário logado

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
            {usuario && <Text>Você está logado como {usuario.email}</Text>}
        </View>
    );
};

export default Login;
