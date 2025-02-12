import { useEffect, useState } from "react";
import { doc, updateDoc, arrayRemove, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../firebase/firestore"; // Ensure this is your Firebase config
import { FaStar } from "react-icons/fa"; // Star icons for rating
import { useAuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Orders = () => {
  const { user_id } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "history"
  const [rating, setRating] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Prevent duplicate clicks

  // ✅ Fetch Active Orders (Live Update)
  useEffect(() => {
    if (!user_id) return;

    const userOrdersRef = doc(db, "orders", user_id);

    const unsubscribe = onSnapshot(userOrdersRef, (docSnap) => {
      console.log("🔥 Active Orders Snapshot:", docSnap.data()); // ✅ Debugging

      if (docSnap.exists() && docSnap.data().orders) {
        setOrders(docSnap.data().orders);
      } else {
        console.warn("⚠️ No active orders found!");
        setOrders([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [user_id]);

  // ✅ Fetch Completed Orders (History)
  useEffect(() => {
    if (!user_id) return;

    const userOrdersRef = doc(db, "completedOrders", user_id);

    const unsubscribe = onSnapshot(userOrdersRef, (docSnap) => {
      console.log("✅ Completed Orders Snapshot:", docSnap.data()); // ✅ Debugging

      if (docSnap.exists() && docSnap.data().orders) {
        setCompletedOrders(docSnap.data().orders);
      } else {
        console.warn("⚠️ No completed orders found!");
        setCompletedOrders([]);
      }
    });

    return () => unsubscribe();
  }, [user_id]);

  // ✅ Mark Order as Delivered (Opens Rating Modal)
  const markAsDelivered = (order) => {
    setSelectedOrder(order);
    setRating(null);
  };

  // ✅ Submit Rating & Move Order to Completed Orders
  const submitRating = async () => {
    if (!rating || !selectedOrder || isSubmitting) return alert("Please select a rating.");

    setIsSubmitting(true);

    try {
      const userOrdersRef = doc(db, "orders", user_id);
      const completedOrdersRef = doc(db, "completedOrders", user_id);

      // ✅ Move Order to Completed Orders
      await setDoc(
        completedOrdersRef,
        {
          orders: [...completedOrders, { ...selectedOrder, state: "completed", rating }],
        },
        { merge: true }
      );

      // ✅ Remove from Active Orders
      await updateDoc(userOrdersRef, {
        orders: arrayRemove(selectedOrder),
      });

      // ✅ Update Deliverer Rating
      if (selectedOrder.deliverer?.id) {
        const delivererRef = doc(db, "deliveryPerson", selectedOrder.deliverer.id);
        const delivererDoc = await getDoc(delivererRef);

        if (delivererDoc.exists()) {
          const delivererData = delivererDoc.data();
          const newRating = delivererData.rating
            ? (delivererData.rating * delivererData.ratingCount + rating) /
              (delivererData.ratingCount + 1)
            : rating; // Calculate new average rating

          await updateDoc(delivererRef, {
            rating: newRating,
            ratingCount: (delivererData.ratingCount || 0) + 1, // Increment rating count
          });
        } else {
          console.warn("⚠️ Deliverer not found in Firestore!");
        }
      }

      // ✅ UI Update
      setOrders((prev) => prev.filter((o) => o.tx_ref !== selectedOrder.tx_ref));
      setSelectedOrder(null);
      setIsSubmitting(false);
      alert("Order completed! Thank you for rating.");
    } catch (error) {
      console.error("❌ Error completing order:", error);
      setIsSubmitting(false);
    }
  };

  // ✅ Open Google Maps
  const openMap = (customerLat, customerLng, delivererLat, delivererLng) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${delivererLat},${delivererLng}&destination=${customerLat},${customerLng}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <>
  <Navbar />
    <div className="mt-12 p-6 text-black bg-gray-100 min-h-screen">
       
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
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={order.tx_ref || `order-${index}`} className="bg-white shadow-md p-6 rounded-lg">
                <img src={order.items[0]?.image || "/placeholder.png"} alt="Food" className="w-20 h-20 rounded-md shadow-sm" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{order.status}</h2>
                <p className="text-gray-600">Food: {order.items[0]?.name}</p>
                <p className="text-gray-700 mb-1">
                  State: <span className="font-semibold text-blue-500">{order.state}</span>
                </p>
                <p className="text-gray-600">Phone: {order.phoneNumber}</p>
                <p className="text-gray-600">Transaction ID: {order.tx_ref}</p>

                {order.state === "onDeliver" && order.deliverer && (
                  <p className="text-gray-700">
                    Deliverer: <span className="font-semibold">{order.deliverer.name}</span>
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-4">
                  {order.state === "onDeliver" && order.deliverer && (
                    <>
                      <button
                        onClick={() =>
                          openMap(
                            order.customerLat,
                            order.customerLng,
                            order.deliverer?.location.lat,
                            order.deliverer?.location.lng
                          )
                        }
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
        <div className="space-y-6">
          {completedOrders.length > 0 ? (
            completedOrders.map((order, index) => (
              <div key={order.tx_ref || `history-${index}`} className="bg-gray-200 shadow-md p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Completed Order</h2>
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
      
      {/* ⭐ Star Rating System */}
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar 
            key={star} 
            onClick={() => setRating(star)} 
            className={`cursor-pointer ${rating >= star ? "text-yellow-500" : "text-gray-400"}`} 
            size={30} 
          />
        ))}
      </div>

      {/* ✅ Submit Rating */}
      <button 
        onClick={submitRating} 
        className="bg-green-500 text-white px-4 py-2 mt-3 rounded-lg hover:bg-green-600"
      >
        Submit Rating
      </button>
    </div>
  </div>
)}

    </div>
    </>
  );
};

export default Orders;