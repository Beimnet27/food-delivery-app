import { useEffect, useState } from 'react';

const customerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        setCustomers(await response.json());
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId) => {
    try {
      await fetch(`/api/customers/${customerId}`, { method: 'DELETE' });
      setCustomers((prev) => prev.filter((customer) => customer.id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  if (loading) return <div>Loading customers...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customers List</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id} className="flex justify-between items-center mb-2">
            <span>{customer.name} ({customer.email})</span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeleteCustomer(customer.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default customerList;
