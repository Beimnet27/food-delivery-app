//* Import firebase_app from config.js, signInWithEmailAndPassword, and getAuth from firebase/auth
import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

//* Initialize Firebase
const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

//* Sign up (create user)
const signUp = async (email, password, fullName, phoneNumber, address) => {
  let result = null,
    error = null;

  try {
    console.log("Attempting to create user...");
    result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", result);

    //* Get user details
    const user = result?.user;

    if (!user) {
      throw new Error("User object is undefined after signup.");
    }

    //* Store user details in Firestore
    console.log("Storing user details in Firestore...");
    await setDoc(doc(db, "Users", user.uid), {
      email: user.email,
      user_id: user.uid,
      full_name: fullName,
      phone_number: phoneNumber,
      address: address,
      role: "customer",
      createdAt: new Date(),
    });

    console.log("User details stored successfully.");
  } catch (e) {
    //! Handle errors here
    console.error("Error during signup:", e);
    error = e;
  }

  return { result, error };
};

export default signUp;