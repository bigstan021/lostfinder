// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrc-e5kjy_zHRxzOrf7aSLNGFRdNkRiBE",
  authDomain: "lostfinder-a3b6a.firebaseapp.com",
  projectId: "lostfinder-a3b6a",
  storageBucket: "lostfinder-a3b6a.appspot.com",
  messagingSenderId: "871282481980",
  appId: "1:871282481980:web:921db4ae2f99d9b180dc39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);

// storageBucket: "lostfinder-a3b6a.firebasestorage.app"