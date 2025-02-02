import { useEffect } from "react";

const PaymentSuccess = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tx_ref = urlParams.get("tx_ref");

    if (tx_ref) {
      verifyPayment(tx_ref);
    }
  }, []);

  const verifyPayment = async (tx_ref) => {
    try {
      const response = await fetch("https://fooddelivery-backend-api.onrender.com/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tx_ref, userId }), // ✅ Include userId
      });

      const verificationData = await response.json();
      console.log("✅ Chapa Verification Response:", verificationData);

      if (verificationData.success) {
        alert("🎉 Payment verified successfully!");
        localStorage.removeItem("tx_ref"); // ✅ Clear stored tx_ref
      } else {
        console.error("❌ Payment verification failed:", verificationData.error);
        alert("⚠️ Payment verification failed: " + verificationData.error);
      }
    } catch (error) {
      console.error("❌ Verification error:", error);
      alert("⚠️ Payment verification error.");
    }
  };

  return (
    <div>
      <h2>Payment Success</h2>
      <p>Your payment is being verified...</p>
    </div>
  );
};

export default PaymentSuccess;
