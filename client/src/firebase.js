// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-490f6.firebaseapp.com",
  projectId: "mern-estate-490f6",
  storageBucket: "mern-estate-490f6.firebasestorage.app",
  messagingSenderId: "77529898660",
  appId: "1:77529898660:web:5dd8aaea5d899314265031",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
