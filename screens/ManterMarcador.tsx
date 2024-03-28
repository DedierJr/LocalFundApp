import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {  KeyboardAvoidingView, Alert, Text,  Pressable, Modal, TextInput,  TouchableOpacity,  View,} from "react-native";
import { auth, firestore } from "../firebase";
import meuestilo from "../meuestilo";
import { Marcador } from "../model/Marcador";

const ManterMarcador = () => {
  const [formMarcador, setFormMarcador] = useState<Partial<Marcador>>({})
  const marcadorRef = firestore.collection('Marcador');
  const navigation = useNavigation();

  useEffect(() => {

  }, []);

  

  const limparFormulario=()=>{
    setFormMarcador({})
  }

  const cancelar = async() => {
    limparFormulario()
  }
  const salvar = async() => {
    const marcadorRefComId = marcadorRef.doc();
    const marcador= new Marcador(formMarcador);
    marcador.id=marcadorRefComId.id

    console.log(marcador)
    marcadorRefComId.set(marcador.toFirestore()).then(() => {
         alert("Marcador" + marcador.lat + " Adicionado com Sucesso");
         console.log("Marcador" + marcador);
         console.log("Marcador ToString: "+marcador.toString())
         limparFormulario()
         });
    };
    
  
  return (
    <KeyboardAvoidingView 
    style={meuestilo.container}
    behavior="padding">
      <View style={meuestilo.inputContainer}>
        <TextInput
          placeholder="Latitude"
          value={formMarcador.lat?.toString()}
          onChangeText={val => setFormMarcador({ ...formMarcador, lat: val })}
          style={meuestilo.input}
        />
        <TextInput
          placeholder="Longitude"
          value={formMarcador.long?.toString()}
          onChangeText={val => setFormMarcador({ ...formMarcador, long: val })}
          style={meuestilo.input}
        />
        <TextInput
          placeholder="Descrição"
          value={formMarcador.descricao}
          onChangeText={val => setFormMarcador({ ...formMarcador, descricao: val })}
          style={meuestilo.input}
        />

        <TextInput
          placeholder="Título"
          value={formMarcador.titulo}
          onChangeText={val => setFormMarcador({ ...formMarcador, titulo: val })}
          style={meuestilo.input}
        />
      </View>

      <View style={meuestilo.buttonContainer}>
        <TouchableOpacity onPress={cancelar} style={meuestilo.button}>
          <Text style={meuestilo.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={salvar}
          style={[meuestilo.button, meuestilo.buttonOutline]}
        >
          <Text style={meuestilo.buttonOutlineText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ManterMarcador;

