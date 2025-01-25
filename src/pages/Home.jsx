import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context/AuthContext";

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const { userName } = useAuthContext();

  const quickEats = [
    { id: 1, name: "Pizza Margherita", price: 10, image: "/PizzaMargherita.jpg" },
    { id: 2, name: "Classic Burger", price: 8, image: "/ClassicBurger.jpg" },
    { id: 3, name: "Pasta Carbonara", price: 12, image: "/PastaCarbonara.jpg" },
    { id: 4, name: "Caesar Salad", price: 7, image: "/CaesarSalad.jpg" },
    { id: 5, name: "Grilled Sandwich", price: 6, image: "/GrilledSandwich.jpg" },
    { id: 6, name: "French Fries", price: 4, image: "/FrenchFries.jpg" },
  ];

  const dailyDelights = [
    { id: 7, name: "BBQ Ribs", price: 15, image: "/BBQRibs.jpg" },
    { id: 8, name: "Chicken Wings", price: 9, image: "/ChickenWings.jpg" },
    { id: 9, name: "Vegetable Soup", price: 5, image: "/VegetableSoup.jpg" },
    { id: 10, name: "Steak", price: 20, image: "/Steak.jpg" },
    { id: 11, name: "Seafood Platter", price: 25, image: "/SeafoodPlatter.jpg" },
    { id: 12, name: "Veggie Burger", price: 9, image: "/VeggieBurger.jpg" },
    { id: 13, name: "Fruit Smoothie", price: 5, image: "/FruitSmoothie.jpg" },
    { id: 14, name: "Tacos", price: 8, image: "/Tacos.jpg" },
    { id: 15, name: "Cheesecake", price: 6, image: "/Cheesecake.webp" },
  ];

  const renderFoodCards = (foods) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {foods.map((food) => (
        <div
          key={food.id}
          className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
        >
          <div
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${food.image})` }}
            aria-label={food.name}
          ></div>
          <div className="p-4 flex flex-col justify-between h-40">
            <h3 className="text-lg font-bold text-gray-800 truncate">{food.name}</h3>
            <p className="text-lg font-medium text-green-600">${food.price}</p>
            <div className="mt-4 flex justify-between items-center">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition duration-300"
                onClick={() => addToCart(food)}
              >
                Add to Cart
              </button>
              <button className="text-green-500 font-semibold hover:text-green-600 transition duration-300">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50">
      <Navbar />
      <header className="relative text-center py-20 bg-[url('/hero-bg.jpg')] bg-cover bg-center text-white">
        <div className="bg-black bg-opacity-50 p-10 rounded-xl inline-block">
          <h1 className="text-5xl font-extrabold">BlackMax Restaurant</h1>
          {userName && (
            <p className="text-lg italic mt-4">Welcome, {userName}!</p>
          )}
          <p className="text-lg mt-2">Bringing flavor to your table!</p>
          <button className="mt-6 px-6 py-3 bg-green-500 text-white font-bold text-lg rounded-lg hover:bg-green-400 transition duration-300">
            Order Now
          </button>
        </div>
      </header>

      <section className="px-6 py-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Quick Eats</h2>
        {renderFoodCards(quickEats)}
      </section>

      <section className="px-6 py-12 bg-green-50">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Daily Delights</h2>
        {renderFoodCards(dailyDelights)}
      </section>

      <footer className="mt-16 py-6 text-center bg-gray-800 text-white">
        <p className="text-sm">&copy; {new Date().getFullYear()} BlackMax Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
