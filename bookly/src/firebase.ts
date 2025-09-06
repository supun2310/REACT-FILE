// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA1kIoDB30mmREO6dxT6Cf7dsy_TKDEBAQ",
  authDomain: "bookly-f672b.firebaseapp.com",
  projectId: "bookly-f672b",
  storageBucket: "bookly-f672b.appspot.com",
  messagingSenderId: "989294171015",
  appId: "1:989294171015:web:8a95297073c8e1d4a37922"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
