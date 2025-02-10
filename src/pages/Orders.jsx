import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayRemove, setDoc, collection, collectionGroup, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firestore"; // Ensure this is your Firebase config
import { FaStar } from "react-icons/fa"; // Star icons for rating

const Orders = ({ user_id }) => {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "history"
  const [rating, setRating] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ Fetch Active Orders
  useEffect(() => {
    if (!user_id) return;
  
    const userOrdersRef = doc(db, "orders", user_id);
  
    const unsubscribe = onSnapshot(userOrdersRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]); // Ensure it doesn't break if orders is missing
        }
      } else {
        setOrders([]);
      }
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, [user_id]);
  

  // ✅ Fetch Completed Orders (Order History)
  useEffect(() => {
    if (!user_id) return;
  
    const q = query(collectionGroup(db, "completedOrders"), where("user_id", "==", user_id));
  
    getDocs(q).then((snapshot) => {
      const history = snapshot.docs.map((doc) => doc.data());
      setCompletedOrders(history);
    });
  }, [user_id]);
  // ✅ Mark Order as Delivered & Ask for Rating
  const markAsDelivered = async (order) => {
    setSelectedOrder(order);
    setRating(null);
  };

  // ✅ Submit Rating & Move to History
  const submitRating = async () => {
    if (!rating || !selectedOrder) return alert("Please select a rating.");

    try {
      const userOrdersRef = doc(db, "orders", user_id);
      const completedOrderRef = doc(db, "completedOrders", `${user_id}_${selectedOrder.tx_ref}`);

      // Move order to completedOrders
      await setDoc(completedOrderRef, { ...selectedOrder, state: "completed", rating });

      // Remove from active orders
      await updateDoc(userOrdersRef, {
        orders: arrayRemove(selectedOrder),
      });

      // Update Deliverer Rating
      if (selectedOrder.deliverer?.id) {
        const delivererRef = doc(db, "deliveryPerson", selectedOrder.deliverer.id);
        const delivererDoc = await getDoc(delivererRef);

        if (delivererDoc.exists()) {
          const delivererData = delivererDoc.data();
          const newRating = ((delivererData.rating || 0) + rating) / 2; // Update average rating
          await updateDoc(delivererRef, { rating: newRating });
        }
      }

      setOrders((prev) => prev.filter((o) => o.tx_ref !== selectedOrder.tx_ref));
      setSelectedOrder(null);
      alert("Order completed! Thank you for rating.");
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  // ✅ Open Google Maps
  const openMap = (customerLat, customerLng, delivererLat, delivererLng) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${delivererLat},${delivererLng}&destination=${customerLat},${customerLng}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="p-6 text-black bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Your Orders</h1>

      {/* ✅ Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "active" ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Orders
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "history" ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Order History
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-600 text-center">Loading orders...</p>
      ) : activeTab === "active" ? (
        // ✅ Active Orders List
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.tx_ref || `order-${index}`} className="bg-white shadow-md p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{order.status}</h2>
                <p className="text-gray-700 mb-1">State: <span className="font-semibold text-blue-500">{order.state}</span></p>
                <p className="text-gray-600">Phone: {order.phoneNumber}</p>
                <p className="text-gray-600">Transaction ID: {order.tx_ref}</p>

                {order.state === "onDeliver" && order.deliverer && (
                  <p className="text-gray-700">Deliverer: <span className="font-semibold">{order.deliverer.name}</span></p>
                )}

                <div className="mt-4 flex flex-wrap gap-4">
                  {order.state === "onDeliver" && (
                    <>
                      <button
                        onClick={() => openMap(order.customerLat, order.customerLng, order.deliverer?.location.lat, order.deliverer?.location.lng)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                      >
                        Track Order on Map
                      </button>

                      <button
                        onClick={() => markAsDelivered(order)}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                      >
                        Mark as Delivered
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">You have no active orders.</p>
          )}
        </div>
      ) : (
        // ✅ Order History List
        <div className="space-y-6">
          {completedOrders.length > 0 ? (
            completedOrders.map((order) => (
              <div key={order.tx_ref} className="bg-gray-200 shadow-md p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Completed Order</h2>
                <p className="text-gray-700">State: <span className="font-semibold text-green-500">Completed</span></p>
                <p className="text-gray-600">Phone: {order.phoneNumber}</p>
                <p className="text-gray-600">Transaction ID: {order.tx_ref}</p>
                <p className="text-gray-600">Rating Given: ⭐ {order.rating}/5</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No completed orders yet.</p>
          )}
        </div>
      )}

      {/* ✅ Rating Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-3">Rate the Delivery</h2>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} onClick={() => setRating(star)} className={`cursor-pointer ${rating >= star ? "text-yellow-500" : "text-gray-400"}`} size={30} />
              ))}
            </div>
            <button onClick={submitRating} className="bg-green-500 text-white px-4 py-2 mt-3 rounded-lg">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
