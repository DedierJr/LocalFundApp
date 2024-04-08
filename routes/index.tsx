// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/index.tsx
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerRoutes from "./drawer.routes";
import UserProfile from "../screens/UserProfile";

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={DrawerRoutes} screenOptions={{headerShown: false}}>
                <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
