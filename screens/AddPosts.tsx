// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/AddPosts.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { auth, firestore } from '../firebase';

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
                title,
                content,
                createdAt: new Date()
            });
            Alert.alert('Sucesso', 'Post adicionado com sucesso');
        } catch (error) {
            console.error('Erro ao adicionar post:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao adicionar o post');
        }
    };

    return (
        <View>
            <Text>Título:</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título do post"
            />
            <Text>Conteúdo:</Text>
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Digite o conteúdo do post"
                multiline
            />
            <Button title="Adicionar Post" onPress={handleAdicionarPost} />
        </View>
    );
};

export default AdicionarPost;
