// Import the functions you need from the SDKs you need
// app/firebaseconfig.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCaC4ddq96yvqVtuCTNvtj68t9oQNiqS_g",
  authDomain: "lostfinder-storage.firebaseapp.com",
  projectId: "lostfinder-storage",
  storageBucket: "lostfinder-storage.firebasestorage.app",
  messagingSenderId: "662203870721",
  appId: "1:662203870721:web:e6c6bc6ba02d16fb85da00",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

storageBucket: "lostfinder-storage-a3b6a.firebasestorage.app"