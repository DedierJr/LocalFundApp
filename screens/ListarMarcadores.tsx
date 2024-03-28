  import React, { useState, useEffect } from "react";
  import {ActivityIndicator,SafeAreaView,View,FlatList,Text,StatusBar,} from "react-native";
  import { auth, firestore } from "../firebase";
  import MeuEstilo from "../meuestilo";
  import { Marcador } from "../model/Marcador";
  const ListarMarcadores = () => {
  const [loading, setLoading] = useState(true); // Set loading to true
  const [marcadores, setMarcadores] = useState<Marcador[]>([]); // Initial empty array
  const marcadorRef = firestore.collection('Marcador');
  
  useEffect(() => {
      const subscriber = marcadorRef
          .onSnapshot((querySnapshot) => {
          const marcadores = [];
          querySnapshot.forEach((documentSnapshot) => {
            marcadores.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
          });
        });
          setMarcadores(marcadores);
          setLoading(false);
    });
  return () => subscriber();
  }, [marcadores]);


    if (loading) {
    return <ActivityIndicator />;
    }

  
  const Item = ({ item }) => (
    <View style={MeuEstilo.item}>
      <Text style={MeuEstilo.title}>Latidude : {item.lat}</Text>
      <Text style={MeuEstilo.title}>Descrição : {item.descricao}</Text>  
      <Text style={MeuEstilo.title}>Longitude : {item.long}</Text>  
      <Text style={MeuEstilo.title}>Título : {item.titulo}</Text>  
    </View>
  );

  const renderItem = ({ item }) => <Item item={item} />;
  
  return (
    <SafeAreaView style={MeuEstilo.containerlistar}>
      <FlatList
        data={marcadores}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
    );
  };
  export default ListarMarcadores;
