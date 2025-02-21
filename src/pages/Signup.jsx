import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signUp from "../firebase/Auth/signup";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firestore";
import firebase_app from "../firebase/config";

const auth = getAuth(firebase_app);

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Create user in Firebase Authentication
      const userCredential = await signUp(email, password, name, phone, address);
      const user = userCredential.user;

      // Add additional user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        address,
        email,
        createdAt: new Date(),
      });

      console.log("Signup successful");
      navigate("/login"); // Redirect to Login page
    } catch (err) {
      setError(err.message);
      console.error("Error during signup:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF914D] to-yellow-500 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transition-transform hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-[#FF914D] mb-6">
          Create Your Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Join us and start your journey today!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6F61]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="number"
              id="phone"
              placeholder="Enter your phone no."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6F61]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter your Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6F61]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6F61]"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6F61]"
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-[#FF914D] text-white font-semibold rounded-lg hover:bg-[#FF6F61] transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#FF914D]/50"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#FF914D] cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
