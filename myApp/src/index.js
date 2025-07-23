// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmBqC1ejsdzM0CCWHiuoX3wsqPuHET3GE",
  authDomain: "mealbowl-70cde.firebaseapp.com",
  projectId: "mealbowl-70cde",
  storageBucket: "mealbowl-70cde.firebasestorage.app",
  messagingSenderId: "774717728365",
  appId: "1:774717728365:web:fc14ee6ed94340350d4164",
  measurementId: "G-TC46S7VZDV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
connectAuthEmulator(app, "http://localhost:9099");
