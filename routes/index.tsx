// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/index.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerRoutes from "./drawer.routes";

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="DrawerRoutes" screenOptions={{headerShown: false}}>
                <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />
                {/* Adicione outras telas Stack.Screen conforme necessário */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
