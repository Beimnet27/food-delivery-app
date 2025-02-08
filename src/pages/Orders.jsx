import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Ensure navigation

const Orders = () => {
  const { cart, setCart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { user_id, userEmail, userName, phoneNumber } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  // Fetch cart from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderRef = doc(db, "orders", user_id);
        const orderDoc = await getDoc(orderRef);
        if (orderDoc.exists()) {
          setCart(orderDoc.data().items || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user_id, setCart]);

  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Your Cart</h1>
      {order.length > 0 ? (
        <div>
          <ul>
            {order.map((item) => (
              <li key={item.id} className="flex justify-between items-center mb-4">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md" />
                <div className="flex-1 ml-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-black">
                    ${item.price} x {item.quantity}
                  </p>
                  </div>
                  <div>
                    <p className="text-black">
                        {item.state}
                    </p>
                  </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-300">You Have NO Orders .</p>
      )}
    </div>
  );
};

export default Orders;
