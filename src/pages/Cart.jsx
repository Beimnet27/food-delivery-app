import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuthContext } from "../context/AuthContext";

const Cart = () => {
  const { cart, setCart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { user_id, userEmail, userName } = useAuthContext(); // Fetching user details
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart from Firestore
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartRef = doc(db, "carts", user_id);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          setCart(cartDoc.data().items || []);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user_id, setCart]);

  // Save cart to Firestore
  const saveCartToFirebase = async (updatedCart) => {
    try {
      const cartRef = doc(db, "carts", user_id);
      await setDoc(cartRef, { items: updatedCart }, { merge: true });
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  // Update quantity in cart and Firestore
  const handleUpdateQuantity = (id, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    saveCartToFirebase(updatedCart);
  };

  // Remove item from cart and Firestore
  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    saveCartToFirebase(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Chapa Payment Integration
  const handleCheckout = async () => {
    const totalAmount = calculateTotal();

    if (totalAmount <= 0) {
      alert("Your cart is empty!");
      return;
    }

    // Simulated Chapa Payment Data
    const paymentData = {
      public_key: "CHAPA_PUBLIC_KEY", // Replace with your Chapa public key
      tx_ref: `tx-${Date.now()}`,
      amount: totalAmount,
      currency: "ETB",
      email: userEmail,
      first_name: userName?.split(" ")[0] || "John",
      last_name: userName?.split(" ")[1] || "Doe",
      title: "Food Delivery Payment",
      description: "Payment for food items",
      callback_url: "http://localhost:3000/order-success", // Update this
      return_url: "http://localhost:3000/cart",
      customization: {
        title: "Food Delivery Checkout",
        description: "Thank you for shopping with us",
        logo: "https://yourlogo.com/logo.png", // Replace with your logo
      },
    };

    window.Chapa.checkout(paymentData);

    // Listen for success
    window.addEventListener("chapaSuccess", async () => {
      try {
        // Save order to Firestore
        const ordersRef = collection(db, "orders");
        await addDoc(ordersRef, {
          user_id,
          cart,
          totalAmount,
          timestamp: new Date(),
          status: "Paid",
        });

        // Clear cart and update Firestore
        setCart([]);
        const cartRef = doc(db, "carts", user_id);
        await setDoc(cartRef, { items: [] });

        alert("Payment successful! Your order has been placed.");
        window.location.href = "/order-success";
      } catch (error) {
        console.error("Error during payment success handling:", error);
      }
    });
  };

  if (isLoading) {
    return <p className="text-white text-center">Loading your cart...</p>;
  }

  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Your Cart</h1>
      {cart.length > 0 ? (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center mb-4">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md" />
                <div className="flex-1 ml-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-black">
                    ${item.price} x {item.quantity}
                  </p>
                  <div>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-700 text-white py-1 px-2 rounded-md mr-2"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-700 text-white py-1 px-2 rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="text-right mt-6">
            <h3 className="text-xl font-bold">Total: ${calculateTotal()}</h3>
            <button
              onClick={handleCheckout}
              className="bg-green-500 text-white py-2 px-6 mt-4 rounded-lg hover:bg-green-400"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-300">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
