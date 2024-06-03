// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// Import each Firebase product that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";
import 'firebase/compat/storage'; // Import Firebase Storage

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

// Initialize Firebase services
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage(); // Initialize Firebase Storage

// Export Firebase services
export { auth, firestore, storage };
