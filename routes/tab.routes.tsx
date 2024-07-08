import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'; 
import Mapa from "../screens/Mapa";
import ListarPosts from "../screens/ListarPosts";
import SearchUsers from "../screens/SearchUsers";
import NotificationList from '../screens/NotificationList';
import Messages from '../screens/Messages'; 

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Mapa') {
          iconName = focused ? 'map' : 'map-outline';
        } else if (route.name === 'Posts') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Notificações') {
          iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        } else if (route.name === 'Mensagens') {
          iconName = focused ? 'chatbox' : 'chatbox-outline'; 
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Mapa" component={Mapa} />
      <Tab.Screen name="Posts" component={ListarPosts} />
      <Tab.Screen name="Search" component={SearchUsers} />
      <Tab.Screen name="Notificações" component={NotificationList} initialParams={{ userId: 'user_id_placeholder' }} />
      <Tab.Screen name="Mensagens" component={Messages} />
    </Tab.Navigator>
  );
}