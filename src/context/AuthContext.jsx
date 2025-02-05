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
  const [phoneNumber, setPhoneNumber] = useState("");
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
            setPhoneNumber(userData.phone_number || ""); // Assuming 'phone' field exists
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

  async function moveCartToOrders(userId, cartItems) {
    if (!cartItems || cartItems.length === 0) {
        console.log("No items in cart to move");
        return;
    }
    
    try {
        const ordersRef = collection(db, "orders");
        const batch = writeBatch(db);
        
        cartItems.forEach((item) => {
            const newOrderRef = doc(ordersRef);
            batch.set(newOrderRef, {
                userId: userId,
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                createdAt: serverTimestamp()
            });
        });

        await batch.commit();
        console.log("Cart moved to orders successfully");

        // Clear the cart
        const cartRef = collection(db, "cart");
        const userCartQuery = query(cartRef, where("userId", "==", userId));
        const cartDocs = await getDocs(userCartQuery);

        cartDocs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log("Cart cleared successfully");
    } catch (error) {
        console.error("Error moving cart to orders:", error);
    }
}

  return (
    <AuthContext.Provider
      value={{ user, userName, userEmail, user_id, phoneNumber, moveCartToOrders, setuser_id, setUserName, loading, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};
