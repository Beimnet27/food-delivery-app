import { useEffect, useState } from "react";
import { db } from "../firebase/firestore"; // Import Firestore
import { collection, updateDoc, doc, getDoc, query, where, onSnapshot } from "firebase/firestore";
import { useLocation } from "react-router-dom";

const DeliveryPersonHome = () => {
  const location = useLocation();
  const userId = location.state?.userId || ""; // Retrieve userId from navigation state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryPerson, setDeliveryPerson] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.warn("User ID not found. Redirecting to login...");
      return;
    }

    const fetchDeliveryPerson = async () => {
      try {
        const deliveryRef = doc(db, "deliveryPerson", userId);
        const deliverySnap = await getDoc(deliveryRef);

        if (deliverySnap.exists()) {
          setDeliveryPerson(deliverySnap.data());
        } else {
          console.warn("Delivery person not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching delivery person:", error);
      }
    };

    fetchDeliveryPerson();
  }, [userId]);

  useEffect(() => {
    const fetchOrders = () => {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("state", "in", ["ready", "onDeliver"]));

      return onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }, (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
    };

    const unsubscribe = fetchOrders();
    return () => unsubscribe();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    if (!deliveryPerson) return alert("Delivery person data is missing.");

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        state: "onDeliver",
        deliverer: {
          id: deliveryPerson.id,
          name: deliveryPerson.name,
        },
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, state: "onDeliver", deliverer: deliveryPerson }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (loading) return <div className="text-center text-lg mt-8">Loading orders...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Delivery Dashboard</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders available for delivery.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border rounded-lg shadow-md bg-white flex items-center">
              <img
                src={order.image || "/placeholder.png"}
                alt={order.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{order.name}</h2>
                <p className="text-gray-500">Customer: {order.customerName}</p>
                <p className="text-gray-500">Address: {order.address}</p>
                <p className="text-sm">
                  Status:{" "}
                  <span className={`font-bold ${order.state === "ready" ? "text-green-600" : "text-red-500"}`}>
                    {order.state}
                  </span>
                </p>
              </div>

              {order.state === "ready" ? (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={() => handleAcceptOrder(order.id)}
                >
                  Take The Order
                </button>
              ) : (
                <span className="text-sm font-medium text-red-500">In Delivery</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryPersonHome;
