// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/index.tsx
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerRoutes from "./drawer.routes";
import TabRoutes from "./tab.routes";
import UserProfile from "../screens/UserProfile";
import AddPosts from "../screens/AddPosts";
import Registro from "../screens/Registro";
import DetalhesPost from "../screens/DetalhesPost";

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={DrawerRoutes} screenOptions={{headerShown: false}}>
                <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />
                <Stack.Screen name="TabRoutes" component={TabRoutes} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
                <Stack.Screen name="AddPosts" component={AddPosts} />
                <Stack.Screen name="Registro" component={Registro} />
                <Stack.Screen name="Post" component={DetalhesPost} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}