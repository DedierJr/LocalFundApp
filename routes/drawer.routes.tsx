import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Login from '../screens/Login'; // Importe a tela de login
import RegistroScreen from '../screens/Registro'; // Importe a tela de registro
import AdicionarPost from '../screens/AddPosts'; // Importe a tela de adicionar post
import ListarPosts from '../screens/ListarPosts'; // Importe a tela de listar posts
import ManterMarcador from '../screens/ManterMarcador';
import Mapa from '../screens/Mapa';
import TabRoutes from './tab.routes';

function ManterMarcadorScreen({ navigation }) {
  return (
   <ManterMarcador></ManterMarcador>
  );
}

function MapaScreen({ navigation }) {
  return (
   <Mapa></Mapa>
  );
}

const Drawer = createDrawerNavigator();

export default function TabDrawer() {
  return (
      <Drawer.Navigator initialRouteName="Registro">
        <Drawer.Screen
            name='home'
            component={TabRoutes}
            initialParams={{tab: "Mapa"}}
        />
        <Drawer.Screen name="Registro" component={RegistroScreen} />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Adicionar Post" component={TabRoutes} initialParams={{tab: "Add Post"}}
/>
        <Drawer.Screen name="Listar Posts" component={ListarPosts} />
        <Drawer.Screen name="Manter Marcador" component={ManterMarcadorScreen} />
        <Drawer.Screen name="Mapa" component={MapaScreen} />
      </Drawer.Navigator>
  );
}
