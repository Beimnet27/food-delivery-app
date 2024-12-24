import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DeliveryPersonHome = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders with "ready" or "ondeliver" state from the database
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/orders"); // Replace with your API
        const data = await response.json();
        setOrders(data.filter(order => order.state === "ready" || order.state === "ondeliver"));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    // Update the order state to "ondeliver" in the database
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: "ondeliver" }),
      });
      alert("Order accepted successfully!");
      setOrders(prev => prev.map(order => (order.id === orderId ? { ...order, state: "ondeliver" } : order)));
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    // Update the order state to "success" in the database
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: "success" }),
      });
      alert("Order marked as delivered!");
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error("Error marking order as delivered:", error);
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-btn4">
      <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>

      {orders.length === 0 ? (
        <p>No orders available for delivery.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h2 className="text-lg font-semibold">Order #{order.id}</h2>
              <p>Customer: {order.customerName}</p>
              <p>Address: {order.address}</p>
              <p>Status: <span className="font-bold">{order.state}</span></p>
              {order.state === "ready" ? (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={() => handleAcceptOrder(order.id)}
                >
                  Accept Order
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => handleMarkDelivered(order.id)}
                >
                  Mark as Delivered
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeliveryPersonHome;
