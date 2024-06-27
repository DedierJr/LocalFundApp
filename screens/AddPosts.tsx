// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/AddPosts.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../firebase';
import { Marcador } from '../model/Marcador';

const AdicionarPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleAdicionarPost = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) {
                throw new Error('Usuário não autenticado');
            }

            await firestore.collection('posts').add({
                userId,
                content,
                createdAt: new Date(),
            });
            Alert.alert('Sucesso', 'Post adicionado com sucesso');
        } catch (error) {
            console.error('Erro ao adicionar post:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao adicionar o post');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, styles.multilineInput]}
                value={content}
                onChangeText={setContent}
                placeholder="O que está acontecendo?"
                multiline
            />
            <Button title="Adicionar Post" onPress={handleAdicionarPost} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    multilineInput: {
        height: 100,
    },
});

export default AdicionarPost;
