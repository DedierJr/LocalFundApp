// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/tab.routes.tsx
import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'; 
import Mapa from "../screens/Mapa";
import ListarPosts from "../screens/ListarPosts";
import SearchUsers from "../screens/SearchUsers";
import ChatListScreen from '../screens/ChatListScreen'; // Adicionar importação da tela de chats

const Tab = createBottomTabNavigator();

export default function Tabroutes() {
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
                } else if (route.name === 'Chats') { // Adicionar ícone para a tela de chats
                    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
        })}>
            <Tab.Screen
                name="Mapa"
                component={Mapa}
            />
            <Tab.Screen
                name="Posts"
                component={ListarPosts}
            />
            <Tab.Screen
                name="Search"
                component={SearchUsers}
            />
            <Tab.Screen
                name="Chats"
                component={ChatListScreen}
                initialParams={{ userId: 'user_id_placeholder' }} // Adicionar userId como parâmetro
            />
        </Tab.Navigator>
    );
}
