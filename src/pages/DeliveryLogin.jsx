import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firestore"; // Ensure you have your Firebase configuration here
import { collection, query, where, getDocs } from "firebase/firestore";

const DeliveryLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Query the deliveryPerson collection for matching email and password
      const deliveryPersonRef = collection(db, "deliveryPerson");
      const q = query(
        deliveryPersonRef,
        where("email", "==", email),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);

      // Check if there is exactly one match
      if (querySnapshot.size === 1) {
        const user = querySnapshot.docs[0].data();
        console.log("Login successful:", user);

        // Redirect to the delivery dashboard or appropriate page
        navigate("/deliveryHome"); // Replace with your dashboard route
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF914D] to-yellow-500">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h2 className="text-4xl font-extrabold text-center text-yellow-500 mb-4">
          Welcome Back! 🍔
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Foods might be waiting for you to deliver. Check it out!
        </p>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-[#FF914D] transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryLogin;
