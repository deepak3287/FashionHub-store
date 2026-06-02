import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwdkO9rXJJTr-04OzqALgJbjHKRYTN9_I",
  authDomain: "eorstore-5c409.firebaseapp.com",
  projectId: "eorstore-5c409",
  storageBucket: "eorstore-5c409.appspot.com",
  messagingSenderId: "1034124488012",
  appId: "1:1034124488012:web:762fc0542730b2299073e9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);