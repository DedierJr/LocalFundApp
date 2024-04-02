import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Mapa from "../screens/Mapa"
import AdicionarPost from "../screens/AddPosts"

const Tab = createBottomTabNavigator();

export default function Tabroutes(){
    return(
        <Tab.Navigator screenOptions={{headerShown: false}}>
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