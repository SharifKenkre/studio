// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// This is a public configuration and is safe to be exposed
const firebaseConfig = {
  apiKey: "AIzaSyB1vGZC0dyp9q7RNgfeeSWkw0qaA_5C9Js",
  authDomain: "tql-100.firebaseapp.com",
  databaseURL: "https://tql-100-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tql-100",
  storageBucket: "tql-100.firebasestorage.app",
  messagingSenderId: "881956282974",
  appId: "1:881956282974:web:14b556c039ce5c003e8acf",
  measurementId: "G-4XX8SKYX1S"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
