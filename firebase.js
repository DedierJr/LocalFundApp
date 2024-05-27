// Import the functions you need from the SDKs you need
//import * as firebase from "firebase
//import * as firebase from "firebase/app";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// cada produto do firebase deve ser importad separadamente
//por exemplo auth de autenticação
import "firebase/compat/auth";

import "firebase/compat/firestore";

import 'firebase/compat/storage'; // Importe o Firebase Storage

  // Your web app's Firebase configuration

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = {

    apiKey: "AIzaSyCCxdgk3dwIVgMb2skMxp5P0dkyYYJW8M4",

    authDomain: "marcador4-d4152.firebaseapp.com",

    projectId: "marcador4-d4152",

    storageBucket: "marcador4-d4152.appspot.com",

    messagingSenderId: "1035252787797",

    appId: "1:1035252787797:web:68bcf819588acacd2a82dc",

    measurementId: "G-Y4ZZBX6ZMM"

  };


// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage(); // Inicialize o Firebase Storage
export { auth, firestore, storage };
