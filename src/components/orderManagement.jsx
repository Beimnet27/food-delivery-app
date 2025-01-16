import { useEffect, useState } from 'react';

const orderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        setOrders(await response.json());
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-2">
            Order #{order.id} - {order.state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default orderManagement;
