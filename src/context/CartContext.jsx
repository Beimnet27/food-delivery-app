import { createContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuthContext } from "../context/AuthContext";

export const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { userId } = useAuthContext();

  // Fetch cart from Firestore when the context initializes
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartRef = doc(db, "carts", userId);
        const cartDoc = await getDoc(cartRef);
        
        if (cartDoc.exists()) {
          setCart(cartDoc.data().items || []);
        }
      } catch (error) {
        console.error("Error fetching cart from Firestore:", error);
      }
    };

    fetchCart();
  }, [userId]);

  // Save cart to Firestore
  const saveCartToFirebase = async (updatedCart) => {
    try {
      const cartRef = doc(db, "carts", userId);
      await setDoc(cartRef, { items: updatedCart }, { merge: true });
    } catch (error) {
      console.error("Error saving cart to Firestore:", error);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      const updatedCart = existingItem
        ? prevCart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        : [...prevCart, { ...item, quantity: 1 }];

      saveCartToFirebase(updatedCart); // Save updated cart to Firestore
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      saveCartToFirebase(updatedCart); // Save updated cart to Firestore
      return updatedCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCartToFirebase(updatedCart); // Save updated cart to Firestore
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
