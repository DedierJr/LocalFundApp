import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerRoutes from './drawer.routes'; // Import DrawerRoutes
import UserProfile from "../screens/UserProfile";
import CurrentUser from "../screens/CurrentUser";
import AddPost from "../screens/AddPost";
import DetalhesPost from "../screens/DetalhesPost";
import Registro from "../screens/Registro";
import SearchUsers from "../screens/SearchUsers";
import ChatScreen from "../screens/ChatScreen";
import Messages from "../screens/Messages";
import FollowersListScreen from "../screens/FollowersListScreen";
import FollowingListScreen from "../screens/FollowingListScreen";
import Login from "../screens/Login";
import { auth } from "../firebase";

const Stack = createStackNavigator();

export default function Routes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  // Conditional rendering based on initializing and isLoggedIn
  if (initializing) {
    return null; 
  } else if (isLoggedIn) {
    return (
      <Stack.Navigator
        initialRouteName="DrawerRoutes" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} /> 
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="CurrentUser" component={CurrentUser} />
        <Stack.Screen name="AddPost" component={AddPost} />
        <Stack.Screen name="DetalhesPost" component={DetalhesPost} />
        <Stack.Screen name="SearchUsers" component={SearchUsers} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="FollowersList" component={FollowersListScreen} />
        <Stack.Screen name="FollowingList" component={FollowingListScreen} />
      </Stack.Navigator>
    );
  } else {
    return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
      </Stack.Navigator>
    );
  }
}