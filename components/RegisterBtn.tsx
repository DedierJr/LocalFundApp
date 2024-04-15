import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importe o Ionicons do pacote @expo/vector-icons
import { useNavigation } from '@react-navigation/native';

const RegisterBtn = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Registro');
  };

  return (
    <TouchableOpacity style={styles.botao} onPress={handlePress}>
      <Ionicons name="person-add" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botao: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});

export default RegisterBtn;
