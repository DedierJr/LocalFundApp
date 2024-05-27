import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../firebase';
import { Marcador } from '../model/Marcador';

const AdicionarPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [marcadores, setMarcadores] = useState<Marcador[]>([]);
    const [selectedMarcador, setSelectedMarcador] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchMarcadores = async () => {
            try {
                const snapshot = await firestore.collection('Marcador').get();
                const marcadoresData: Marcador[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Marcador));
                setMarcadores(marcadoresData);
            } catch (error) {
                console.error('Erro ao buscar marcadores:', error);
            }
        };

        fetchMarcadores();
    }, []);

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
                createdAt: new Date(),
                marcadorId: selectedMarcador || null
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
            <Text style={styles.label}>Marcador:</Text>
            <Picker
                selectedValue={selectedMarcador}
                onValueChange={(itemValue) => setSelectedMarcador(itemValue)}
            >
                <Picker.Item label="Nenhum" value={undefined} />
                {marcadores.map((marcador) => (
                    <Picker.Item key={marcador.id} label={marcador.titulo} value={marcador.id} />
                ))}
            </Picker>
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
