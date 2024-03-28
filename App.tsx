import React from 'react';
import { Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/Login'; // Importe a tela de login
import RegistroScreen from './screens/Registro'; // Importe a tela de registro
import ListarMarcadores from './screens/ListarMarcadores';
import ManterMarcador from './screens/ManterMarcador';
import Mapa from './screens/Mapa';

function ManterMarcadorScreen({ navigation }) {
  return (
   <ManterMarcador></ManterMarcador>
  );
}

function ListarMarcadoresScreen({ navigation }) {
  return (
   <ListarMarcadores></ListarMarcadores>
  );
}

function MapaScreen({ navigation }) {
  return (
   <Mapa></Mapa>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Registro">
        <Drawer.Screen name="Registro" component={RegistroScreen} />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Manter Marcador" component={ManterMarcadorScreen} />
        <Drawer.Screen name="Listar Marcadores" component={ListarMarcadoresScreen} />
        <Drawer.Screen name="Mapa" component={MapaScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
