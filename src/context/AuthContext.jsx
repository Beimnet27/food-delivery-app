import { useState, useEffect, useContext, createContext } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import firebase_app from "../firebase/config";
//import logout from "../firebase/auth/logout";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [user_id, setuser_id] = useState(null);
  const [userEmail, setUserEmail] = useState("");
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
            setuser_id(currentUser.uid); // Use Firebase user ID
            setUserName(userData.full_name || ""); // Assuming 'full_name' field exists
            setUserEmail(currentUser.email);
            setRole(userData.role || "");
          } else {
            console.log("No such user document found!");
            setUser(currentUser); // Just set basic auth info if no Firestore doc
            setuser_id(currentUser.uid);
            setRole("");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Reset state when no user is logged in
        setUser(null);
        setuser_id(null);
        setUserName("");
        setRole("");
      }
      setLoading(false); // Stop loading after fetching
    });

    return () => unsubscribe();
  }, []);

  const moveCartToOrders = async (userId) => {
    if (!userId) {
      console.error("Error: userId is undefined");
      return;
    }
  
    try {
      const cartRef = collection(db, "cart");
      const q = query(cartRef, where("userId", "==", userId));
      const cartSnapshot = await getDocs(q);
  
      if (cartSnapshot.empty) {
        console.log("No cart items found for user:", userId);
        return;
      }
  
      const ordersRef = collection(db, "orders");
      const batchPromises = cartSnapshot.docs.map(async (cartDoc) => {
        const cartData = cartDoc.data();
        await addDoc(ordersRef, {
          ...cartData,
          userId,
          paymentStatus: "Paid",
          orderDate: new Date().toISOString(),
        });
  
        // Delete item from cart
        await deleteDoc(doc(db, "cart", cartDoc.id));
      });
  
      await Promise.all(batchPromises);
      console.log("Cart moved to orders successfully for user:", userId);
    } catch (error) {
      console.error("Error moving items to orders:", error);
    }
  };
  

  return (
    <AuthContext.Provider
      value={{ user, userName, userEmail, user_id, moveCartToOrders, setuser_id, setUserName, loading, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};
