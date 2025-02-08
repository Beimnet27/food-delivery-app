import { useState, useEffect, useContext, createContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { 
    getFirestore, doc, getDoc, collection, getDocs, 
    query, where, deleteDoc, writeBatch, serverTimestamp 
} from "firebase/firestore";
import firebase_app from "../firebase/config";

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
          const userRef = doc(db, "Users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              ...userData,
            });
            setuser_id(currentUser.uid);
            setUserName(userData.full_name || "");
            setUserEmail(currentUser.email);
            setPhoneNumber(userData.phone_number || "");
            setRole(userData.role || "");
          } else {
            console.log("No such user document found!");
            setUser(currentUser);
            setuser_id(currentUser.uid);
            setRole("");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setuser_id(null);
        setUserName("");
        setRole("");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fix: Only commit batch ONCE after moving cart to orders
  async function moveCartToOrders(userId, cartItems) {
    if (!cartItems || cartItems.length === 0) {
        console.log("No items in cart to move");
        return;
    }

    try {
        const ordersRef = collection(db, "orders");
        const cartRef = collection(db, "cart");

        const batch = writeBatch(db);

        // Move items to orders
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

        // Get user's cart items
        const userCartQuery = query(cartRef, where("userId", "==", userId));
        const cartDocs = await getDocs(userCartQuery);

        // Delete cart items
        cartDocs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // ✅ Only commit once after all operations
        await batch.commit();
        console.log("Cart moved to orders and cleared successfully");
    } catch (error) {
        console.error("Error moving cart to orders:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ 
        user, userName, userEmail, user_id, phoneNumber, 
        moveCartToOrders, setuser_id, setUserName, loading, role 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
