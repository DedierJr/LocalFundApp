// Mapa.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MeuEstilo from '../estiloMapa.js';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../firebase.js';
import { Marcador } from '../model/Marcador';
import meuestilo from '../meuestilo.js';
import DetalhesMarcador from './DetalhesMarcador'; // Importe o componente DetalhesMarcador

const Mapa = () => {
    const [formMarcador, setFormMarcador] = useState<Partial<Marcador>>({});
    const [marcadores, setMarcadores] = useState<Marcador[]>([]);
    const [marcadorSelecionado, setMarcadorSelecionado] = useState<string | null>(null);
    const [position, setPosition] = useState({
        latitude: -31.308840,
        longitude: -54.113702,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });
    const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = firestore.collection('Marcador').onSnapshot((snapshot) => {
            const novosMarcadores: Marcador[] = [];
            snapshot.forEach((doc) => {
                novosMarcadores.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setMarcadores(novosMarcadores);
        });

        return () => unsubscribe();
    }, []);

    const limparFormulario = () => {
        setFormMarcador({
            lat: 0,
            long: 0,
            titulo: '',
            descricao: ''
        });
    };

    const cancelar = () => {
        limparFormulario();
    };

    const salvar = async () => {
        const marcador = new Marcador({
            lat: formMarcador.lat,
            long: formMarcador.long,
            titulo: formMarcador.titulo,
            descricao: formMarcador.descricao
        });
        await marcador.salvar();
        alert("Marcador adicionado com sucesso");
        limparFormulario();
    };

    return (
        <View style={MeuEstilo.container}>
            {mostrarDetalhes ? (
                <DetalhesMarcador
                    marcador={marcadores.find(m => m.id === marcadorSelecionado)}
                    onVoltar={() => setMostrarDetalhes(false)}
                />
            ) : (
                <>
                    <MapView
                        style={MeuEstilo.map}
                        region={{
                            latitude: position.latitude,
                            longitude: position.longitude,
                            latitudeDelta: position.latitudeDelta,
                            longitudeDelta: position.longitudeDelta
                        }}
                        onPress={(e) => {
                            setPosition({
                                latitude: e.nativeEvent.coordinate.latitude,
                                longitude: e.nativeEvent.coordinate.longitude,
                                latitudeDelta: position.latitudeDelta,
                                longitudeDelta: position.longitudeDelta
                            });
                            setFormMarcador({
                                ...formMarcador,
                                lat: e.nativeEvent.coordinate.latitude,
                                long: e.nativeEvent.coordinate.longitude
                            });
                        }}
                    >
                        {marcadores.map((marcador) => (
                            <Marker
                                key={marcador.id}
                                coordinate={{ latitude: marcador.lat, longitude: marcador.long }}
                                title={marcador.titulo}
                                description={marcador.descricao}
                                onPress={() => {
                                    setMarcadorSelecionado(marcador.id);
                                    setMostrarDetalhes(true);
                                }}
                            />
                        ))}
                    </MapView>

                    <Text>Latitude : {position.latitude}</Text>
                    <Text>Longitude : {position.longitude}</Text>
                    <TextInput
                        placeholder="Title"
                        value={formMarcador.titulo || ''}
                        onChangeText={titulo => setFormMarcador({ ...formMarcador, titulo })}
                        style={MeuEstilo.input}
                    />
                    <TextInput
                        placeholder="Descricao"
                        value={formMarcador.descricao || ''}
                        onChangeText={descricao => setFormMarcador({ ...formMarcador, descricao })}
                        style={MeuEstilo.input}
                    />
                    <TouchableOpacity
                        onPress={salvar}
                        style={[meuestilo.button, meuestilo.buttonOutline]}
                    >
                        <Text style={meuestilo.buttonOutlineText}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelar} style={meuestilo.button}>
                        <Text style={meuestilo.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default Mapa;
