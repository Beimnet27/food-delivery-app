import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const tx_ref = searchParams.get("tx_ref");
  const { user_id } = useAuthContext();
  
  useEffect(() => {
    if (tx_ref) {
      verifyPayment(tx_ref);
    }
  }, [tx_ref]);

  const verifyPayment = async (tx_ref) => {
    try {
      const response = await fetch(
        "https://fooddelivery-backend-api.onrender.com/api/verify-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tx_ref, user_id }), // Send tx_ref & user ID
        }
      );

      const verificationData = await response.json();
      console.log("✅ Payment Verification Response:", verificationData);

      if (verificationData.success) {
        alert("🎉 Payment successful! Your order has been placed.");
        localStorage.removeItem("tx_ref"); // ✅ Clear saved tx_ref
      } else {
        alert("⚠️ Payment verification failed: " + verificationData.error);
      }
    } catch (error) {
      console.error("❌ Payment verification error:", error);
      alert("⚠️ Payment verification error.");
    }
  };

  return (
    <div>
      <h2>Verifying Payment...</h2>
    </div>
  );
};

export default PaymentSuccess;
