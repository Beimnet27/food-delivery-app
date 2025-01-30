import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { moveCartToOrders, user_id } = useAuthContext();

  useEffect(() => {
    const verifyPayment = async () => {
      const tx_ref = localStorage.getItem("tx_ref");
      if (!tx_ref) return;

      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tx_ref, userId: user_id }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Payment successful!");
        moveCartToOrders(); // Move cart items to orders
        navigate("/"); // Redirect home
      } else {
        alert("Payment verification failed.");
      }
    };

    verifyPayment();
  }, [navigate, moveCartToOrders, user_id]);

  return <p>Verifying payment...</p>;
};

export default PaymentSuccess;
