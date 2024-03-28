// DetalhesMarcador.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const DetalhesMarcador = ({ marcador, onVoltar }) => {
    return (
        <View>
            <Text>{marcador.titulo}</Text>
            <Text>{marcador.descricao}</Text>
            {/* Outros detalhes do marcador */}
            <TouchableOpacity onPress={onVoltar}>
                <Text>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DetalhesMarcador;
