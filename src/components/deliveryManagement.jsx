import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firestore";

const DeliveryManagement = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    password: "",
  });

  // Fetch Delivery Persons
  const fetchDeliveryPersons = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "deliveryPerson"));
      const deliveryData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeliveryPersons(deliveryData);
    } catch (error) {
      console.error("Error fetching delivery persons:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Delivery Person
const handleAddDeliveryPerson = async () => {
  const { email, name, phone, address, password } = formData;

  if (!email || !name || !phone || !address || !password) {
    alert("Please fill out all fields!");
    return;
  }

  try {
    // Step 1: Add document without an ID
    const docRef = await addDoc(collection(db, "deliveryPerson"), {
      email,
      name,
      phone,
      address,
      password,
      createdAt: serverTimestamp(),
    });

    // Step 2: Update the same document to include the auto-generated ID
    await updateDoc(doc(db, "deliveryPerson", docRef.id), {
      id: docRef.id,
    });

    alert("Delivery person added successfully!");
    setFormData({ email: "", name: "", phone: "", address: "", password: "" });
    fetchDeliveryPersons(); // Refresh the list
  } catch (error) {
    console.error("Error adding delivery person:", error);
  }
};

  // Edit Delivery Person Password
  const handleEditPassword = async (id, newPassword) => {
    try {
      const docRef = doc(db, "deliveryPerson", id);
      await updateDoc(docRef, { password: newPassword });
      alert("Password updated successfully!");
      fetchDeliveryPersons();
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  // Delete Delivery Person
  const handleDeleteDeliveryPerson = async (id) => {
    try {
      await deleteDoc(doc(db, "deliveryPerson", id));
      setDeliveryPersons((prev) => prev.filter((person) => person.id !== id));
      alert("Delivery person deleted successfully!");
    } catch (error) {
      console.error("Error deleting delivery person:", error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchDeliveryPersons();
  }, []);

  if (loading) return <div>Loading delivery persons...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Delivery Management</h1>

      {/* Add Delivery Person Form */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Delivery Person</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleAddDeliveryPerson}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Delivery Person
          </button>
        </div>
      </div>

      {/* Delivery Persons List */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Delivery Persons List</h2>
        <ul className="space-y-4">
          {deliveryPersons.map((person) => (
            <li
              key={person.id}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <p className="font-semibold">{person.name}</p>
                <p className="text-sm text-gray-600">{person.email}</p>
                <p className="text-sm text-gray-600">{person.phone}</p>
                <p className="text-sm text-gray-600">{person.address}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    handleEditPassword(
                      person.id,
                      prompt("Enter new password:")
                    )
                  }
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => handleDeleteDeliveryPerson(person.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DeliveryManagement;
