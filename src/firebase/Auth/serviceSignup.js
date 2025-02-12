import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth, fetchSignInMethodsForEmail } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const serviceSignup = async (email, password, fullName, phoneNumber, address) => {
  let result = null, error = null;

  try {
    if (!email || !password || !fullName || !phoneNumber || !address) {
      throw new Error("All fields are required.");
    }

    console.log("🔍 Checking if email is already in use...");
    const existingMethods = await fetchSignInMethodsForEmail(auth, email);
    if (existingMethods.length > 0) {
      throw new Error("Email is already registered. Please use a different email.");
    }

    console.log("✅ Email is available. Proceeding with signup...");
    result = await createUserWithEmailAndPassword(auth, email, password);
    
    if (!result?.user) {
      throw new Error("User creation failed. No user object returned.");
    }
    
    const user = result.user;
    console.log("✅ User created successfully:", user.uid);

    // ✅ Store user details in Firestore
    const userData = {
      email: user.email,
      user_id: user.uid,
      full_name: fullName, 
      phone_number: phoneNumber,
      address: address,
      role: "RestuarantOwners",
      createdAt: new Date(),
    };

    console.log("📌 Saving user data:", userData);
    await setDoc(doc(db, "RestuarantOwners", user.uid), userData);
    
    console.log("✅ User details saved to Firestore.");
  } catch (e) {
    console.error("❌ Error during serviceSignup:", e.message);
    error = e.message;
  }

  return { result, error };
};

export default serviceSignup;
