import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import serviceSignup from "../firebase/Auth/serviceSignup";

const ServiceSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Signup Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { email, password, name, phone, address } = formData;

    // ✅ Ensure no field is empty
    if (!email || !password || !name || !phone || !address) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const { result, error } = await serviceSignup(email, password, name, phone, address);

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      console.log("Signup successful", result);
      navigate("/serviceLogin"); // Redirect to login page
    } catch (err) {
      setError(err.message);
      console.error("❌ Error during signup:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-[#FF914D] mb-4">Create Account</h2>
        <p className="text-center text-gray-400 mb-6">Join us and start your journey today!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "Enter your full name" },
            { label: "Phone Number", name: "phone", type: "number", placeholder: "Enter your phone number" },
            { label: "Address", name: "address", type: "text", placeholder: "Enter your address" },
            { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
            { label: "Password", name: "password", type: "password", placeholder: "Create a password" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-gray-300 font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6F61]"
              />
            </div>
          ))}

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-[#FF914D] text-white font-semibold rounded-lg hover:bg-[#FF6F61] transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#FF914D]/50"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/serviceLogin")}
            className="text-[#FF914D] cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ServiceSignup;
