// /home/aluno/Documentos/DedierJr/LocalFundApp/firebase.js

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import 'firebase/compat/storage'; 

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDLmAQPCkJMu7tBh3awT2A7BLM67hQtEH8",

  authDomain: "marcador5.firebaseapp.com",

  projectId: "marcador5",

  storageBucket: "marcador5.appspot.com",

  messagingSenderId: "582137120159",

  appId: "1:582137120159:web:bb10ea3c31f4c1910129aa",

  measurementId: "G-7FY01PSVV2"

};



let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, firestore, storage };
