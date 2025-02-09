import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Ensure navigation
import Navbar from "../components/Navbar";

const Cart = () => {
  const { cart, setCart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { user_id, userEmail, userName, phoneNumber } = useAuthContext();
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

    // Request user location
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    setIsProcessingPayment(true);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("✅ User Location:", latitude, longitude);

            // Debugging Step
            alert(`Location fetched: Latitude: ${latitude}, Longitude: ${longitude}`);
            localStorage.setItem("customerLat", latitude);
            localStorage.setItem("customerLng", longitude);
            // ✅ Now proceed with payment after getting the location
            await proceedWithPayment(latitude, longitude, totalAmount);
        },
        (error) => {
            console.error("❌ Error getting location:", error);
            alert("Failed to get your location. Please enable location services and try again.");
            setIsProcessingPayment(false);
        }
    );
};

const proceedWithPayment = async (latitude, longitude, totalAmount) => {
    const paymentData = {
        amount: totalAmount.toFixed(2),
        currency: "ETB",
        email: userEmail,
        first_name: userName.split(" ")[0] || "",
        last_name: userName.split(" ")[1] || "",
        customerLat: latitude,  
        customerLng: longitude,
        callback_url: "https://bitegodelivery.netlify.app/PaymentSuccess",
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
        console.log("✅ Payment API Response:", result);

        if (response.ok && result.checkout_url && result.tx_ref) {
            localStorage.setItem("tx_ref", result.tx_ref); 

            const chapaWindow = window.open(result.checkout_url, "_blank");

            if (!chapaWindow) {
                alert("Pop-up blocked! Please allow pop-ups in your browser.");
            }

            checkPaymentStatus(result.tx_ref, user_id, latitude, longitude);

        } else {
            alert(result.error || "Failed to initialize payment.");
            setIsProcessingPayment(false);
        }
    } catch (error) {
        console.error("❌ Error initializing payment:", error);
        setIsProcessingPayment(false);
    }
};


  
  // ✅ Function to check payment status every 5 seconds
  const checkPaymentStatus = async (tx_ref, user_id, customerLat, customerLng) => {
    if (!tx_ref || !user_id) {
      console.error("❌ Error: Missing tx_ref or user_id!", { tx_ref, user_id });
      return;
    }
  
    console.log("✅ Checking payment for:", { tx_ref, user_id, customerLat, customerLng });
  
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          "https://fooddelivery-backend-api.onrender.com/api/verify-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tx_ref, user_id, customerLat, customerLng }), // ✅ Ensure user_id is included
          }
        );
  
        const result = await response.json();
        console.log("🔍 Payment Verification Response:", result);
  
        if (response.ok && result.success) {
          clearInterval(interval);
          localStorage.removeItem("tx_ref");
          window.location.href = `/PaymentSuccess?tx_ref=${tx_ref}`;
        }
      } catch (error) {
        console.error("❌ Error verifying payment:", error);
      }
    }, 5000);
  };
  

  // const verifyPayment = async () => {
  //   const tx_ref = localStorage.getItem("tx_ref"); // ✅ Retrieve saved tx_ref
  //   if (!tx_ref) {
  //     console.error("❌ No tx_ref found. Payment verification skipped.");
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch("https://fooddelivery-backend-api.onrender.com/api/verify-payment", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ tx_ref, user_id }),
  //     });
  
  //     const verificationData = await response.json();
  //     console.log("✅ Chapa Verification Response:", verificationData);
  
  //     if (verificationData.success) {
  //       alert("🎉 Payment verified successfully!");
  //       localStorage.removeItem("tx_ref"); // ✅ Clear stored tx_ref after success
  //     } else {
  //       console.error("❌ Payment verification failed:", verificationData.error);
  //       alert("⚠️ Payment verification failed: " + verificationData.error);
  //     }
  //   } catch (error) {
  //     console.error("❌ Verification error:", error);
  //     alert("⚠️ Payment verification error.");
  //   }
  // };
  
  
  // Call verification with the correct `tx_ref`
  // const storedTxRef = localStorage.getItem("tx_ref"); // ✅ Retrieve saved tx_ref
  // if (storedTxRef) {
  //   verifyPayment(storedTxRef);
  // }

  // ** Show Loading Until Payment is Verified **
  if (isLoading || isProcessingPayment) {
    return <p className="text-black text-center">Processing payment... Please wait.</p>;
  }

  return (
    <>
    <Navbar />
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
    </>
  );
};

export default Cart;
