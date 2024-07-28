// LocalFundApp/routes/drawer.routes.tsx

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CurrentUser from "../screens/CurrentUser";
import ListarPosts from '../screens/ListarPosts';
import TabRoutes from './tab.routes';

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#EFEDE3',
        },
        drawerActiveTintColor: '#C05E3D',
      }}
    >
      <Drawer.Screen name='Home' component={TabRoutes} /> 
      <Drawer.Screen name="Perfil" component={CurrentUser} />
      <Drawer.Screen name="Listar Posts" component={ListarPosts} />
    </Drawer.Navigator>
  );
}
