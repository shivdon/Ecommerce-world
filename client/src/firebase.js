import firebase from "firebase/app";
import "firebase/auth";


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB4qiz5CVU0KqXr-QRTYtzMYDGIxXjdhNA",
    authDomain: "ecommerce-54c66.firebaseapp.com",
    projectId: "ecommerce-54c66",
    storageBucket: "ecommerce-54c66.appspot.com",
    messagingSenderId: "309661206593",
    appId: "1:309661206593:web:b8b8d86e66e9a36f079ec0"
  };
  // Initialize Firebase

    firebase.initializeApp(firebaseConfig);

  

  // exporting firebase
  export const auth = firebase.auth();
  export const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); 
