// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/tab.routes.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'; // Importe Ionicons do pacote @expo/vector-icons
import Mapa from "../screens/Mapa";
import ListarPosts from "../screens/ListarPosts";

const Tab = createBottomTabNavigator();

export default function Tabroutes({ route }) {
    return (
        <Tab.Navigator initialRouteName={route.params.tab} screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Mapa') {
                    iconName = focused ? 'map' : 'map-outline';
                } else if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
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
                name="Home"
                component={ListarPosts}
            />
        </Tab.Navigator>
    );
}
