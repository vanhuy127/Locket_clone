import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "locket-clone-a25bc.firebaseapp.com",
  projectId: "locket-clone-a25bc",
  storageBucket: "locket-clone-a25bc.appspot.com",
  messagingSenderId: "895806578879",
  appId: "1:895806578879:web:e22694dd06ca97c86de60a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
