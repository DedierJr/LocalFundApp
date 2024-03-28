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

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCV0H-z_twHnQF6MgXuf30KdelEiIhrhI4",
  authDomain: "marcador3-f6afa.firebaseapp.com",
  projectId: "marcador3-f6afa",
  storageBucket: "marcador3-f6afa.appspot.com",
  messagingSenderId: "1095364981728",
  appId: "1:1095364981728:web:69bbcd4ff94d282e2cf185",
  measurementId: "G-WG65G37T9V"
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
export { auth, firestore };
