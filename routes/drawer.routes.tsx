// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/drawer.routes.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Login from '../screens/Login'; // Importe a tela de login
import RegistroScreen from '../screens/Registro'; // Importe a tela de registro
import AdicionarPost from '../screens/AddPosts'; // Importe a tela de adicionar post
import ListarPosts from '../screens/ListarPosts'; // Importe a tela de listar posts
import ManterMarcador from '../screens/ManterMarcador';
import Mapa from '../screens/Mapa';
import TabRoutes from './tab.routes';

function ManterMarcadorScreen() {
  return (
   <ManterMarcador />
  );
}

function MapaScreen() {
  return (
   <Mapa />
  );
}

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
      <Drawer.Navigator initialRouteName="Registro">
        <Drawer.Screen
            name='home'
            component={TabRoutes}
            initialParams={{tab: "Mapa"}}
        />
        <Drawer.Screen name="Registro" component={RegistroScreen} />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Perfil" component={TabRoutes} initialParams={{tab: "Perfil"}}
/>
        <Drawer.Screen name="Listar Posts" component={ListarPosts} />
        <Drawer.Screen name="Adicionar Post" component={AdicionarPost} />
        <Drawer.Screen name="Manter Marcador" component={ManterMarcadorScreen} />
        <Drawer.Screen name="Mapa" component={MapaScreen} />
      </Drawer.Navigator>
  );
}