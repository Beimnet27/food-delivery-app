import { useState, useEffect, useContext, createContext } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebase_app from "../firebase/config";
import logout from "../firebase/auth/logout";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); // Start loading when auth state changes
      if (currentUser) {
        try {
          const userRef = doc(db, "Users", currentUser.uid); // Consistent collection name
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              ...userData,
            });
            setUserId(currentUser.uid); // Use Firebase user ID
            setUserName(userData.full_name || ""); // Assuming 'full_name' field exists
            setRole(userData.role || "");
          } else {
            console.log("No such user document found!");
            setUser(currentUser); // Just set basic auth info if no Firestore doc
            setUserId(currentUser.uid);
            setRole("");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Reset state when no user is logged in
        setUser(null);
        setUserId(null);
        setUserName("");
        setRole("");
      }
      setLoading(false); // Stop loading after fetching
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userName, userId, setUserId, setUserName, loading, role, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
