// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "lmblog-6bfed.firebaseapp.com",
  projectId: "lmblog-6bfed",
  storageBucket: "lmblog-6bfed.firebasestorage.app",
  messagingSenderId: "617150901325",
  appId: "1:617150901325:web:4526794cbf533eb5960004"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
