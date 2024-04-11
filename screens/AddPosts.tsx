import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
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
        <View style={styles.container}>
            <Text style={styles.label}>Título:</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título do post"
            />
            <Text style={styles.label}>Conteúdo:</Text>
            <TextInput
                style={[styles.input, styles.multilineInput]}
                value={content}
                onChangeText={setContent}
                placeholder="Digite o conteúdo do post"
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
