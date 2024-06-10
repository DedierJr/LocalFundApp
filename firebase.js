// /home/aluno/Documentos/DedierJr/LocalFundApp/firebase.js

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import 'firebase/compat/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyCCxdgk3dwIVgMb2skMxp5P0dkyYYJW8M4",
  authDomain: "marcador4-d4152.firebaseapp.com",
  projectId: "marcador4-d4152",
  storageBucket: "marcador4-d4152.appspot.com",
  messagingSenderId: "1035252787797",
  appId: "1:1035252787797:web:68bcf819588acacd2a82dc",
  measurementId: "G-Y4ZZBX6ZMM"
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
