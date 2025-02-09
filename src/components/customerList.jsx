import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firestore"; // Import your Firebase configuration

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const customerData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to ban this customer? This action is irreversible.")) {
      try {
        await deleteDoc(doc(db, "Users", customerId));
        setCustomers((prev) => prev.filter((customer) => customer.id !== customerId));
        alert("Customer has been banned and removed successfully!");
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <div className="text-center text-gray-600">Loading customers...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Customer List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Phone</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
          {customers
            .filter((customer) => customer.id !== "admin")
            .map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{customer.full_name}</td>
                <td className="py-2 px-4 border-b">{customer.email}</td>
                <td className="py-2 px-4 border-b">{customer.phone_number || "N/A"}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Ban
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
