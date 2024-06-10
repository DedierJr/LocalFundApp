// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/stack.routes.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login'; // Importe a tela de login
import RegistroScreen from '../screens/Registro'; // Importe a tela de registro
import UserProfile from '../screens/UserProfile'; // Importe a tela de registro
import ChatList from '../screens/ChatListScreen';

const Stack = createStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registro" component={RegistroScreen} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="ChatList" component={ChatList} />
    </Stack.Navigator>
  );
}