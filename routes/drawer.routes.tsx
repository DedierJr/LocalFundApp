// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/drawer.routes.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Login from '../screens/Login'; // Importe a tela de login
import RegistroScreen from '../screens/Registro'; // Importe a tela de registro
import AdicionarPost from '../screens/AddPosts'; // Importe a tela de adicionar post
import ListarPosts from '../screens/ListarPosts'; // Importe a tela de listar posts
import CurrentUser from "../screens/CurrentUser";
import Mapa from '../screens/Mapa';
import TabRoutes from './tab.routes';

function MapaScreen() {
  return (
   <Mapa />
  );
}

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
      <Drawer.Navigator initialRouteName="Login">
        <Drawer.Screen
            name='Home'
            component={TabRoutes}
        />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Perfil" component={CurrentUser}/>
        <Drawer.Screen name="Listar Posts" component={ListarPosts} />
      </Drawer.Navigator>
  );
}
