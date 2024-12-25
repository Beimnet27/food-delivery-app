// Import the Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5OCbPJ8tmuGBwC2se6pLLWJnnJtTFkos",
  authDomain: "bitegofooddelivery.firebaseapp.com",
  projectId: "bitegofooddelivery",
  storageBucket: "bitegofooddelivery.firebasestorage.app",
  messagingSenderId: "480697145223",
  appId: "1:480697145223:web:ed047944e4a90e60e1a522"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//* Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

//* Initialize Firebase Auth and set persistence
const auth = getAuth(firebase_app);
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Session persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Failed to set session persistence:", error);
  });
// Initialize services
const db = getFirestore(firebase_app);
export { auth, db };
export default firebase_app;
