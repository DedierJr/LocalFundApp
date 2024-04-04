// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/tab.routes.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Mapa from "../screens/Mapa"
import CurrentUser from "../screens/CurrentUser"

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
                component={CurrentUser}
            />
        </Tab.Navigator>
    )
}