// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuIiAscyN3Pd2BqIElCGbt59SGFEZrWVA",
  authDomain: "edugenie-c6916.firebaseapp.com",
  projectId: "edugenie-c6916",
  storageBucket: "edugenie-c6916.firebasestorage.app",
  messagingSenderId: "414645666160",
  appId: "1:414645666160:web:1b686320787669d161cfb5",
  measurementId: "G-DVQ19Q280L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
