import { NavigationContainer } from "@react-navigation/native";

import DrawerRoutes from "./drawer.routes";
import TabRoutes from './tab.routes';
import StackRoutes from "./stack.routes";


export default function Routes(){
    return (
        <NavigationContainer>
            <StackRoutes/>
            <DrawerRoutes />
        </NavigationContainer>
    )
}