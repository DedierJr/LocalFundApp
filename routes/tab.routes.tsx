// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/tab.routes.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'; // Importe Ionicons do pacote @expo/vector-icons
import Mapa from "../screens/Mapa";
import ListarPosts from "../screens/ListarPosts";
import SearchUsers from "../screens/SearchUsers";

const Tab = createBottomTabNavigator();

export default function Tabroutes() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Mapa') {
                    iconName = focused ? 'map' : 'map-outline';
                } else if (route.name === 'Posts') { // Renomeie 'Home' para 'Posts'
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Search') {
                    iconName = focused ? 'search' : 'search-outline';
                }

                // Você pode retornar qualquer componente aqui para exibir o ícone desejado
                return <Ionicons name={iconName} size={size} color={color} />;
            },
        })}>
            <Tab.Screen
                name="Mapa"
                component={Mapa}
            />
            <Tab.Screen
                name="Posts" // Renomeie 'Home' para 'Posts'
                component={ListarPosts}
            />
            <Tab.Screen
                name="Search"
                component={SearchUsers}
            />
        </Tab.Navigator>
    );
}
