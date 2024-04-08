// /home/aluno/Documentos/DedierJr/LocalFundApp/routes/index.tsx
import { NavigationContainer } from "@react-navigation/native";

import DrawerRoutes from "./drawer.routes";


export default function Routes(){
    return (
        <NavigationContainer>
            <DrawerRoutes />
        </NavigationContainer>
    )
}