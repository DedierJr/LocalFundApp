// /home/aluno/Documentos/DedierJr/LocalFundApp/App.tsx
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import Routes from './routes'; 
import { auth } from './firebase'; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Wrap in a Promise
    new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsLoggedIn(!!user);
        resolve(); // Resolve the promise after the authentication state change
      });

      return unsubscribe; // Return the unsubscribe function for cleanup
    });
  }, []);

  return (
    <Routes isLoggedIn={isLoggedIn} /> 
  );
}