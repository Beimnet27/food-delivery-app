import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuthContext } from "../context/AuthContext";

const Cart = () => {
  const { cart, setCart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { user_id, userEmail, userName, moveCartToOrders } = useAuthContext(); // Fetching user details
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

  const loadChapaSDK = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("chapa-sdk")) {
        // SDK already loaded
        resolve();
        return;
      }
  
      const script = document.createElement("script");
      script.src = "https://cdn.chapa.co/checkout.js";
      script.id = "chapa-sdk";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Failed to load Chapa SDK"));
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    // Calculate the total payment amount
    const totalAmount = calculateTotal();
  
    if (totalAmount <= 0) {
      alert("Your cart is empty!");
      return;
    }
  
    // Ensure user email and name are available
    if (!userEmail || !userName) {
      alert("Please make sure your user details (name and email) are provided.");
      return;
    }
  
    // Prepare payment data
    const paymentData = {
      amount: totalAmount.toFixed(2), // Ensure amount has two decimal points
      currency: "ETB", // Currency for the transaction
      email: userEmail,
      first_name: userName?.split(" ")[0],
      last_name: userName?.split(" ")[1],
      callback_url: "https://bitegodelivery.netlify.app/", // Update for production
    };
  
    try {
      // Send request to backend for payment initialization
      const response = await fetch("https://fooddelivery-backend-api.onrender.com/initialize-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
  
      const result = await response.json();
  
      if (response.ok && result.checkout_url) {
        // Redirect user to Chapa payment page
        window.location.href = result.checkout_url;
        //verifyPayment(result.tx_ref);
      } else {
        console.error("Payment Initialization Error:", result);
        alert(result.error || "Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      // Log and display any unexpected errors
      console.error("Error initializing payment:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  // async function verifyPayment(tx_ref) {
  //   const response = await fetch("/api/verify-payment", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ tx_ref }),
  //   });
  
  //   const data = await response.json();
  //   if (response.ok) {
  //     // Move cart items to orders collection
  //  // await moveCartToOrders(user_id);

  //   // Redirect the user to an order confirmation page
  //   alert("Payment successful! Your order has been placed.");
  //   navigate("/order-confirmation"); 
  //     console.log("Payment Verified:", data);
  //   } else {
  //     console.error("Error verifying payment:", data.error);
  //   }
  // }  
  

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
