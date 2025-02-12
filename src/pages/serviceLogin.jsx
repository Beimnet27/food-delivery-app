import { Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🚀 Handle Login Logic Here
    console.log("User Logged In:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-yellow-500 text-center">Welcome Back</h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded focus:border-yellow-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded focus:border-yellow-500"
            />
          </div>

          <button type="submit" className="w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded hover:bg-yellow-600">
            Login
          </button>
        </form>

        {/* <p className="mt-4 text-center text-gray-400">
          Forgot your password?{" "}
          <Link to="/reset-password" className="text-yellow-500 hover:underline">
            Reset Here
          </Link>
        </p> */}

        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/serviceRegister" className="text-yellow-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
