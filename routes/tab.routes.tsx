import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Mapa from "../screens/Mapa"
import AdicionarPost from "../screens/AddPosts"

const Tab = createBottomTabNavigator();

export default function Tabroutes({route}){
    return(
        <Tab.Navigator initialRouteName={route.params.tab} screenOptions={{headerShown: false}}>
            <Tab.Screen
                name="Mapa"
                component={Mapa}
            />
            <Tab.Screen
                name="Add Post"
                component={AdicionarPost}
            />
        </Tab.Navigator>
    )
}