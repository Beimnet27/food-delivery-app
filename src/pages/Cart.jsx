import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Ensure navigation

const Cart = () => {
  const { cart, setCart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { user_id, userEmail, userName, moveCartToOrders } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

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

  // Calculate Total Price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle Checkout with Chapa
  const handleCheckout = async () => {
    const totalAmount = calculateTotal();

    if (totalAmount <= 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!userEmail || !userName) {
      alert("Please provide user details.");
      return;
    }

    setIsProcessingPayment(true); // Show loading during processing

    const txRef = `chapa_${Date.now()}`;
    const paymentData = {
      amount: totalAmount.toFixed(2),
      currency: "ETB",
      email: userEmail,
      first_name: userName.split(" ")[0] || "",
      last_name: userName.split(" ")[1] || "",
      callback_url: `https://bitegodelivery.netlify.app/payment-success?tx_ref=${txRef}`,
    };

    try {
      const response = await fetch(
        "https://fooddelivery-backend-api.onrender.com/api/initialize-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      const result = await response.json();
      if (response.ok && result.checkout_url) {
        localStorage.setItem("tx_ref", txRef); // Save transaction reference

        // ** Open Payment Window in New Tab **
        window.open(result.checkout_url, "_blank");

        // Start Checking Payment Verification
        await verifyPayment(txRef);
      } else {
        alert(result.error || "Failed to initialize payment.");
        setIsProcessingPayment(false);
      }
    } catch (error) {
      alert("Error initializing payment.");
      setIsProcessingPayment(false);
    }
  };

  // ** Verify Payment & Move Items to Orders **
  const verifyPayment = async (tx_ref) => {
    try {
      let attempts = 0;
      let maxAttempts = 10; // Retry checking 10 times
      let isVerified = false;

      while (attempts < maxAttempts) {
        const response = await fetch(
          "https://fooddelivery-backend-api.onrender.com/api/verify-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tx_ref, userId: user_id }),
          }
        );

        const data = await response.json();
        if (response.ok && data.success) {
          await moveCartToOrders(); // Move cart items to orders
          alert("Payment successful! Your order has been placed.");
          setIsProcessingPayment(false);
          navigate("/orders"); // Redirect to orders page
          return;
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }

      alert("Payment verification failed or took too long.");
      setIsProcessingPayment(false);
    } catch (error) {
      console.error("Error verifying payment:", error);
      setIsProcessingPayment(false);
    }
  };

  // ** Show Loading Until Payment is Verified **
  if (isLoading || isProcessingPayment) {
    return <p className="text-white text-center">Processing payment... Please wait.</p>;
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
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Processing..." : "Proceed to Checkout"}
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
