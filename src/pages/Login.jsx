import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import signIn from "../firebase/Auth/signin"; // Import the signIn function

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Call the signIn function to authenticate the user
      await signIn(email, password);
      console.log("Login successful");
      navigate("/home"); // Redirect to Home page on successful login
    } catch (error) {
      console.error("Login failed:", error.message);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-[#00000042] backdrop-blur-[6px] rounded-lg shadow-lg p-8">
        <h2 className="text-3xl bg-black font-bold text-center text-accent mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-black mb-6">
          Login to access your account
        </p>
        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="mb-6">
            <label className="block text-black mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-accent text-gray-900 font-semibold rounded-lg hover:bg-[#45A29E] transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-black mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent bg-black cursor-pointer hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
