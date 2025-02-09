import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { doc, getDoc, setDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { user_id } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user_id) return;

        const orderRef = doc(db, "orders", user_id);
        const orderDoc = await getDoc(orderRef);

        if (orderDoc.exists()) {
          setOrders(orderDoc.data().orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user_id]);

  // ✅ Mark as Delivered + Rate Delivery Person
  const markAsDelivered = async (order) => {
    try {
      if (!user_id) return;

      const userOrdersRef = doc(db, "orders", user_id);
      const completedOrderRef = doc(db, "completedOrders", `${user_id}_${order.tx_ref}`);

      // ✅ Move order to completedOrders collection
      await setDoc(completedOrderRef, { ...order, state: "completed" });

      // ✅ Remove from orders collection
      await updateDoc(userOrdersRef, {
        orders: arrayRemove(order),
      });

      // ✅ Update Deliverer Rating
      if (order.deliverer?.id) {
        const delivererRef = doc(db, "deliveryPerson", order.deliverer.id);
        const delivererDoc = await getDoc(delivererRef);

        if (delivererDoc.exists()) {
          const delivererData = delivererDoc.data();
          const newRating = (delivererData.rating || 0) + 5; // Add 5 stars

          await updateDoc(delivererRef, { rating: newRating });
        }
      }

      // ✅ Remove order from UI
      setOrders((prevOrders) => prevOrders.filter((o) => o.tx_ref !== order.tx_ref));

      alert("Order marked as completed! Deliverer rated.");
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  // ✅ Open Google Maps with customer & deliverer location
  const openMap = (customerLat, customerLng, delivererLat, delivererLng) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${delivererLat},${delivererLng}&destination=${customerLat},${customerLng}`;
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
            <div key={order.tx_ref} className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{order.status}</h2>
              <p className="text-gray-700 mb-1">State: <span className="font-semibold text-blue-500">{order.state}</span></p>
              <p className="text-gray-600">Phone: {order.phoneNumber}</p>
              <p className="text-gray-600">Transaction ID: {order.tx_ref}</p>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">Ordered Items:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center bg-gray-50 p-3 rounded-md shadow-sm">
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md" />
                      <div className="ml-4">
                        <h4 className="text-md font-medium">{item.name}</h4>
                        <p className="text-gray-700">${item.price} x {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.state === "onDeliver" && order.deliverer && (
                <div className="mt-4">
                  <p className="text-gray-700">Deliverer: <span className="font-semibold">{order.deliverer.name}</span></p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-4">
                {order.state === "onDeliver" && (
                  <button
                    onClick={() => openMap(order.customerLat, order.customerLng, order.deliverer?.location.lat, order.deliverer?.location.lng)}
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
