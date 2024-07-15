// /DedierJr/LocalFundApp/firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { GeoFirestore } from "geofirestore"; 

// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyCHG2xwzr_JaXgIQ0uWGJaMfXD3kcSFSBA",

  authDomain: "marcador7-6be96.firebaseapp.com",

  projectId: "marcador7-6be96",

  storageBucket: "marcador7-6be96.appspot.com",

  messagingSenderId: "440041304080",

  appId: "1:440041304080:web:d809c7125407f199a49a95"

};


let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig); // Initialize only once
} else {
    app = firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.app().firestore(); // Access firestore through the initialized app
const storage = firebase.storage();
const geoFirestore = new GeoFirestore(firestore); 

export { auth, firestore, storage, geoFirestore };