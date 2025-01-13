import { useState, useEffect, useContext, createContext } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
//import firebase_app from "../firebase/config";
import logout from "../firebase/auth/logout";
import { db } from "../firebase/firestore";
//import { getAuth  } from "firebase/auth"; // Import Firebase auth

//const auth = getAuth(firebase_app);
//const db = getFirestore(firebase_app);

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null); // State to store the current user's ID
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ ...user, ...userData });
          setRole(userData.role || ''); // Set the role if it exists
        } else {
          setUser(user);
          setRole(''); // Set default role if user document does not exist
        }
      } else {
        setUser(null);
        setRole(''); // Reset role when no user is authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

    // Fetch user data from Firestore
    useEffect(() => {
      const fetchUserName = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log("No user is currently logged in");
          return;
        }
  
        setUserId(currentUser.uid); // Set the user ID
  
        try {
          const userRef = doc(db, "Users", currentUser.uid); // Use the user's UID
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.full_name); // Assuming 'name' is the field storing the user's name
            console.log(userName);
          } else {
            console.log("No such user document found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserName();
    }, []);

  return (
    <AuthContext.Provider value={{ user, userName, userId, setUserId, setUserName, loading, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
