import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import Routes, { Login } from './routes'; // Importação ajustada
import { auth } from './firebase';
import { NavigationContainer } from '@react-navigation/native';

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
      {isLoggedIn ? <Routes /> : <Login />} 
    </NavigationContainer>
  );
}
