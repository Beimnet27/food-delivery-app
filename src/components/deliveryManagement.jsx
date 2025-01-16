import { useEffect, useState } from 'react';

const deliveryManagement = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        const response = await fetch('/api/delivery-persons');
        setDeliveryPersons(await response.json());
      } catch (error) {
        console.error('Error fetching delivery persons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryPersons();
  }, []);

  const handleDeleteDeliveryPerson = async (id) => {
    try {
      await fetch(`/api/delivery-persons/${id}`, { method: 'DELETE' });
      setDeliveryPersons((prev) => prev.filter((person) => person.id !== id));
    } catch (error) {
      console.error('Error deleting delivery person:', error);
    }
  };

  const handleAddDeliveryPerson = async (email) => {
    try {
      await fetch('/api/delivery-persons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      alert('Delivery person added successfully!');
    } catch (error) {
      console.error('Error adding delivery person:', error);
    }
  };

  if (loading) return <div>Loading delivery persons...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Delivery Persons</h2>
      <ul>
        {deliveryPersons.map((person) => (
          <li key={person.id} className="flex justify-between items-center mb-2">
            <span>{person.name} ({person.email})</span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeleteDeliveryPerson(person.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default deliveryManagement;
