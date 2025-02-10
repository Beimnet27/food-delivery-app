import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import successGif from "/success.gif"; 
import loadingGif from "/loading.gif";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user_id, phone_number } = useAuthContext();
    const [status, setStatus] = useState("verifying"); // ["verifying", "success", "failed"]

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
                    body: JSON.stringify({ tx_ref, user_id, phone_number, customerLat, customerLng }),
                }
            );

            const verificationData = await response.json();
            console.log("✅ Payment Verification Response:", verificationData);

            if (verificationData.success) {
                setStatus("success");
                localStorage.removeItem("tx_ref"); // ✅ Clear tx_ref after successful verification

                // ✅ Redirect to order tracking after a short delay
                setTimeout(() => navigate("/orders"), 3000);
            } else {
                setStatus("failed");
            }
        } catch (error) {
            console.error("❌ Payment verification error:", error);
            setStatus("failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
                {status === "verifying" && (
                    <>
                        <img src={loadingGif} alt="Verifying Payment..." className="w-24 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold">Verifying Payment...</h2>
                        <p className="text-gray-600">Please wait while we process your transaction.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <img src={successGif} alt="Payment Successful!" className="w-24 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-green-500">Payment Successful!</h2>
                        <p className="text-gray-600">Your order has been placed successfully.</p>
                        <p className="text-gray-500 mt-2">Redirecting to order tracking...</p>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <h2 className="text-xl font-semibold text-red-500">Payment Verification Failed</h2>
                        <p className="text-gray-600">We couldn't verify your payment. Please try again.</p>
                        <button
                            onClick={() => navigate("/checkout")}
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                        >
                            Retry Payment
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
