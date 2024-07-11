// /LocalFundApp/App.tsx
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import Routes from './routes';
import { auth, firestore, storage } from './firebase'; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user); 
    });

    return unsubscribe; 
  }, []);

  return (
    <NavigationContainer>
      <Routes isLoggedIn={isLoggedIn} /> 
    </NavigationContainer>
  );
}

auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Usuário logado:", user);
  } else {
    console.log("Nenhum usuário logado");
  }
});

firestore.collection("Usuario").get()
  .then(snapshot => {
    console.log("Conectado ao Firestore:", snapshot.size, "documentos encontrados");
  })
  .catch(error => {
    console.error("Erro ao conectar ao Firestore:", error);
  });

storage.ref().listAll()
  .then(result => {
    console.log("Conectado ao Storage:", result.items.length, "itens encontrados");
  })
  .catch(error => {
    console.error("Erro ao conectar ao Storage:", error);
  });
