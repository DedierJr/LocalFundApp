import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import Routes from './routes';
import { auth } from './firebase'; 

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