// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzOom-813nBUkE_lafjGOP13APL-fUGI8",
  authDomain: "bustudy-922bb.firebaseapp.com",
  projectId: "bustudy-922bb",
  storageBucket: "bustudy-922bb.firebasestorage.app",
  messagingSenderId: "677364566856",
  appId: "1:677364566856:web:ec52ffa0b2d74c88e1817d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);