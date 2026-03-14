// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzdB5QFArsS5GZPeOPvCdzwMzu_JBKECc",
  authDomain: "boatbouncer-e1014.firebaseapp.com",
  projectId: "boatbouncer-e1014",
  storageBucket: "boatbouncer-e1014.firebasestorage.app",
  messagingSenderId: "55283012582",
  appId: "1:55283012582:web:2229926baa27f3c7e1bc27",
  measurementId: "G-CFTRBB7EH1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
