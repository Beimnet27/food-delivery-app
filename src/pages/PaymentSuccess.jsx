import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const { user_id } = useAuthContext();

    // ✅ Get Chapa's `tx_ref` from URL or localStorage
    const tx_ref = searchParams.get("tx_ref") || localStorage.getItem("tx_ref");
    const customerLat = localStorage.getItem("customerLat");
    const customerLng = localStorage.getItem("customerLng");

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
                    body: JSON.stringify({ tx_ref, user_id, customerLat, customerLng }),
                }
            );

            const verificationData = await response.json();
            console.log("✅ Payment Verification Response:", verificationData);

            if (verificationData.success) {
                alert("🎉 Payment successful! Your order has been placed.");
                localStorage.removeItem("tx_ref"); // ✅ Clear tx_ref after successful verification
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
