import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import firebase_app from "../config";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

export const signUp = async (email, password, additionalData) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullname: additionalData.fullname,
      address: additionalData.address,
      phone: additionalData.phone,
      email: user.email,
      createdAt: new Date(),
    });

    console.log("Signup successful:", user.uid);
    return user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error; // Pass the error to the caller
  }
};

export default signUp;