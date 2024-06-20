// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTHXrTdSeW2ZKymTcSVqm9xmN-5FL9mfA",
  authDomain: "base-c4528.firebaseapp.com",
  projectId: "base-c4528",
  storageBucket: "base-c4528.appspot.com",
  messagingSenderId: "487509805224",
  appId: "1:487509805224:web:0456df6af301e7f6d39a9d",
  measurementId: "G-L3WXNL60E9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;