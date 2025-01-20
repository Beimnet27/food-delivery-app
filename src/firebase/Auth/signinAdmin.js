import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseApp from "../config";

const db = getFirestore(firebaseApp);

const signIn = async (email, password) => {
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch the user's role from Firestore
    const userDocRef = doc(db, "Users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User document not found in Firestore.");
    }

    const userData = userDoc.data();
    if (userData.role !== "admin") {
      throw new Error("Access Denied: You are not authorized to access the admin panel.");
    }

    return user; // Login successful, user is an admin
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error;
  }
};

export default signIn;
