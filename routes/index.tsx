// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/index.tsx
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerRoutes from "./drawer.routes";
import TabRoutes from "./tab.routes";
import UserProfile from "../screens/UserProfile";
import CurrentUser from "../screens/CurrentUser";
import AddPosts from "../screens/AddPosts";
import DetalhesPost from "../screens/DetalhesPost";
import Registro from "../screens/Registro";
import SearchUsers from "../screens/SearchUsers";
import ChatScreen from "../screens/ChatScreen";
import FollowersListScreen from "../screens/FollowersListScreen";
import FollowingListScreen from "../screens/FollowingListScreen";
import Login from "../screens/Login";

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="DrawerRoutes" screenOptions={{headerShown: false}}>
            <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />
            <Stack.Screen name="TabRoutes" component={TabRoutes} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="CurrentUser" component={CurrentUser} />
            <Stack.Screen name="AddPosts" component={AddPosts} />
            <Stack.Screen name="DetalhesPost" component={DetalhesPost} />
            <Stack.Screen name="Registro" component={Registro} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Post" component={DetalhesPost} />
            <Stack.Screen name="SearchUsers" component={SearchUsers} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="FollowersList" component={FollowersListScreen} />
            <Stack.Screen name="FollowingList" component={FollowingListScreen} />
        </Stack.Navigator>
    );
}

// Adicione a exportação nomeada para o Login
export { Login };
