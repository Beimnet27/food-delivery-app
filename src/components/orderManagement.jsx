import { useState, useEffect } from "react";
import { collection, doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firestore";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = () => {
      const ordersRef = collection(db, "orders");
      return onSnapshot(
        ordersRef,
        (snapshot) => {
          let allOrders = [];
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (Array.isArray(data.orders)) {
              const filteredOrders = data.orders.map((order, index) => ({
                ...order,
                parentDocId: doc.id, // ✅ Attach parent document ID
                uniqueKey: `${doc.id}-${order.tx_ref}-${index}`, // ✅ Unique key fix
              }));
              allOrders.push(...filteredOrders);
            }
          });
          setOrders(allOrders);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
        }
      );
    };
    const unsubscribe = fetchOrders();
    return () => unsubscribe();
  }, []);

  // ✅ Function to change order state to "ready"
  const markAsReady = async (parentDocId, tx_ref) => {
    try {
      const orderRef = doc(db, "orders", parentDocId);
      const orderDoc = await getDoc(orderRef);
  
      if (!orderDoc.exists()) return;
  
      let updatedOrders = orderDoc.data().orders.map((order) =>
        order.tx_ref === tx_ref ? { ...order, state: "ready" } : order
      );
  
      await updateDoc(orderRef, { orders: updatedOrders });
  
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.tx_ref === tx_ref ? { ...order, state: "ready" } : order
        )
      );
  
      alert("Order marked as Ready to Deliver!");
  
      // ✅ Send Delivery Email
      try {
        const response = await fetch(
          "https://fooddelivery-backend-api.onrender.com/api/send-delivery-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tx_ref }), // 🔹 Fixed JSON format
          }
        );
  
        const result = await response.json();
        console.log("✅ Delivery Email response:", result);
      } catch (error) {
        console.error("❌ Error Sending Delivery Email:", error);
      }
    } catch (error) {
      console.error("Error updating order state:", error);
    }
  };
  

  const deleteOrder = async (parentDocId, tx_ref) => {
    try {
      const orderRef = doc(db, "orders", parentDocId);
      const orderDoc = await getDoc(orderRef); // ✅ FIXED getDoc()

      if (!orderDoc.exists()) return;

      const updatedOrders = orderDoc.data().orders.filter(
        (order) => order.tx_ref !== tx_ref
      );

      await updateDoc(orderRef, { orders: updatedOrders });

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.tx_ref !== tx_ref)
      );

      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading orders...</div>;

  return (
    <div className="p-6 text-black bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Admin Order Management
      </h1>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.uniqueKey} className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Order #{order.tx_ref}
              </h2>
              <p className="text-gray-700 mb-1">
                State: <span className="font-semibold text-blue-500">{order.state}</span>
              </p>
              <p className="text-gray-600">Phone: {order.phoneNumber}</p>
              {order.state === "onDeliver" && order.deliverer && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700">Deliverer Details:</h3>
                  <p><strong>Name:</strong> {order.deliverer.name}</p>
                  <p><strong>Phone:</strong> {order.deliverer.phoneNumber}</p>
                </div>
              )}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">Ordered Items:</h3>
                {order.items?.map((item, index) => (
                  <div key={`${order.uniqueKey}-item-${index}`} className="flex items-center bg-gray-50 p-3 rounded-md shadow-sm">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md" />
                    <div className="ml-4">
                      <h4 className="text-md font-medium">{item.name}</h4>
                      <p className="text-gray-700">${item.price} x {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                {order.state === "pending" && (
                  <button
                    onClick={() => markAsReady(order.parentDocId, order.tx_ref)}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  >
                    Ready to Deliver
                  </button>
                )}
                <button
                  onClick={() => deleteOrder(order.parentDocId, order.tx_ref)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Delete Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No orders found.</p>
      )}
    </div>
  );
};

export default OrderManagement;
