import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import serviceSignin from "../firebase/Auth/serviceLogin"; // Import the sign-in function

const ServiceLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await serviceSignin(formData.email, formData.password);
      console.log("Login successful");
      navigate("/serviceHome"); // Redirect to home page after login
    } catch (err) {
      console.error("Login failed:", err.message);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-yellow-500 mb-4">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-400 mb-6">Log in to continue.</p>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", name: "password", type: "password", placeholder: "Enter your password" },
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
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-[#FF914D] transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-500 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ServiceLogin;
