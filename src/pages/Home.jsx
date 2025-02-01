import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context/AuthContext";
import { quickEats, dailyDelights } from "../data/Menu";

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const { userName } = useAuthContext();

  const renderFoodCards = (foods) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {foods.map((food) => (
        <div
          key={food.id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
        >
          <div
            className="h-56 bg-cover bg-center"
            style={{ backgroundImage: `url(${food.image})` }}
          ></div>
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800">{food.name}</h3>
            <p className="text-sm text-gray-600 mt-2">{food.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-semibold text-green-600">{food.price} ETB</span>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition duration-300"
                onClick={() => addToCart(food)}
              >
                Add to Cart
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
      <header className="relative text-center py-24 bg-[url('/hero-bg.jpg')] bg-cover bg-center text-white">
        <div className="bg-black bg-opacity-50 p-10 rounded-xl inline-block">
          <h1 className="text-6xl font-extrabold">BlackMax Restaurant</h1>
          {userName && <p className="text-lg italic mt-4">Welcome, {userName}!</p>}
          <p className="text-xl mt-2">Savor the Best Tastes, Right at Your Doorstep!</p>
          <button className="mt-6 px-8 py-3 bg-green-500 text-white font-bold text-lg rounded-lg hover:bg-green-400 transition duration-300">
            Order Now
          </button>
        </div>
      </header>

      <section className="px-6 py-12">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">Quick Eats</h2>
        {renderFoodCards(quickEats)}
      </section>

      <section className="px-6 py-12 bg-green-50">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">Daily Delights</h2>
        {renderFoodCards(dailyDelights)}
      </section>

      <footer className="mt-16 py-6 text-center bg-gray-800 text-white">
        <p className="text-sm">&copy; {new Date().getFullYear()} BlackMax Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
