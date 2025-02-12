import { useState } from "react";

const HomeDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Restaurant Submitted:", formData);

    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setFormData({ name: "", address: "", phone: "", description: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 p-6 fixed md:relative md:h-screen">
        <h2 className="text-2xl font-bold text-yellow-500 text-center md:text-left">Dashboard</h2>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li className="py-2 px-4 bg-yellow-500 text-gray-900 rounded-md font-bold text-center md:text-left">Home</li>
            <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer text-center md:text-left">Orders</li>
            <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer text-center md:text-left">Profile</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 mt-16 md:mt-0 md:p-8">
        <h1 className="text-3xl font-bold text-yellow-500 text-center md:text-left">Welcome to Your Dashboard</h1>
        <p className="text-gray-400 text-center md:text-left mt-2">Manage your restaurants and add new ones easily.</p>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-6">
          {/* Sample Restaurant Box */}
          <div
            className="bg-gray-700 border border-yellow-500 flex flex-col items-center justify-center text-center p-4 rounded-lg cursor-pointer hover:scale-105 transition"
            onClick={() => window.open("https://bitegodelivery.netlify.app/", "_blank")}
          >
            <h2 className="text-lg font-bold text-yellow-500">BlackFood</h2>
            <p className="text-gray-300 text-sm">Delivery Restaurant</p>
          </div>

          {/* Empty Boxes for Adding Restaurants */}
          {[...Array(15)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-600 flex flex-col items-center justify-center text-center p-4 rounded-lg cursor-pointer hover:border-yellow-500 hover:scale-105 transition"
              onClick={() => setShowForm(true)}
            >
              <span className="text-4xl text-gray-400">+</span>
              <p className="text-gray-400 mt-2 text-sm">Add Your Restaurant</p>
            </div>
          ))}
        </div>
      </main>

      {/* Modal for Adding Restaurant */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold text-yellow-500 text-center">Add Your Restaurant</h2>

            {submitted ? (
              <p className="text-green-500 text-center mt-4">We will reach you as soon as possible.</p>
            ) : (
              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                {[
                  { label: "Your Name", name: "name", type: "text", placeholder: "Enter your full name" },
                  { label: "Address", name: "address", type: "text", placeholder: "Enter your address" },
                  { label: "Phone Number", name: "phone", type: "tel", placeholder: "Enter your phone number" },
                  { label: "Description", name: "description", type: "textarea", placeholder: "Describe your restaurant" },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-gray-300">{label}</label>
                    {type === "textarea" ? (
                      <textarea
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required
                        placeholder={placeholder}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-yellow-500"
                      />
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required
                        placeholder={placeholder}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-yellow-500"
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded hover:bg-yellow-600 transition"
                >
                  Submit
                </button>
              </form>
            )}

            <button
              className="mt-4 w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;
