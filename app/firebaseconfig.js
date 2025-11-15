// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBit6a12BxpgxG8jplwgcEJ-H_kT2whrA0",
  authDomain: "lostfinder-94f8b.firebaseapp.com",
  projectId: "lostfinder-94f8b",
  storageBucket: "lostfinder-94f8b.firebasestorage.app",
  messagingSenderId: "1038694243117",
  appId: "1:1038694243117:web:2ef54dcf39722c8b5351a4",
  measurementId: "G-YQWNTPWS7B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); 
export const storage = getStorage(app);