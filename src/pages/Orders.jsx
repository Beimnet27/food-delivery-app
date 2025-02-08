import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { doc, getDoc, setDoc, collection, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { cart, setCart } = useContext(CartContext);
  const { user_id } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderRef = doc(db, "orders", user_id);
        const orderDoc = await getDoc(orderRef);
        if (orderDoc.exists()) {
          setOrders(orderDoc.data().items || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user_id]);

  // Function to mark order as delivered
  const markAsDelivered = async (order) => {
    try {
      const completedOrderRef = doc(db, "completedOrders", order.id);
      await setDoc(completedOrderRef, { ...order, state: "completed" });

      // Remove order from "orders" collection
      await deleteDoc(doc(db, "orders", order.id));

      // Update rating for the delivery person
      if (order.deliverer?.id) {
        const delivererRef = doc(db, "deliveryPerson", order.deliverer.id);
        const delivererDoc = await getDoc(delivererRef);

        if (delivererDoc.exists()) {
          const delivererData = delivererDoc.data();
          const newRating = (delivererData.rating || 0) + 5; // Adding 5 stars

          await setDoc(delivererRef, { ...delivererData, rating: newRating });
        }
      }

      // Remove order from UI
      setOrders(orders.filter((o) => o.id !== order.id));

      alert("Order marked as completed and delivery person rated!");
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  // Open map with order location
  const openMap = (lat, lng) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="p-6 text-black bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Your Orders</h1>

      {isLoading ? (
        <p className="text-gray-600 text-center">Loading orders...</p>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow-md p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <img src={order.image} alt={order.name} className="h-16 w-16 rounded-md" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{order.name}</h2>
                  <p className="text-gray-700">${order.price} x {order.quantity}</p>
                  <p className="text-sm text-gray-500">Status: <span className="font-semibold text-blue-500">{order.state}</span></p>
                  {order.deliverer && (
                    <p className="text-sm text-gray-500">Deliverer: <span className="font-semibold">{order.deliverer.name}</span></p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                {order.state === "onDeliver" && (
                  <button
                    onClick={() => openMap(order.customerLat, order.customerLng)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Track Order on Map
                  </button>
                )}

                {order.state === "onDeliver" && (
                  <button
                    onClick={() => markAsDelivered(order)}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">You have no orders.</p>
      )}
    </div>
  );
};

export default Orders;
